<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Commande;

use App\Events\OrderStatusChanged;
use App\Http\Controllers\Controller;
use App\Models\Commande;
use App\Models\Paiement;
use App\Models\Produit;
use App\Models\Tenant;
use App\Models\User;
use App\Models\VarianteProduit;
use App\Notifications\CustomerNotification;
use App\Notifications\OrderNotification;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Contrôleur côté vendeur/tenant pour la gestion des commandes.
 */
class CommandeController extends Controller
{
    /**
     * Créer une nouvelle commande à partir d'un panier (checkout minimal).
     */
    public function store(Request $request, NotificationService $notificationService)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.produit_id' => 'required|string|exists:produits,id',
            'items.*.variante_produit_id' => 'nullable|string|exists:variante_produits,id',
            'items.*.quantite' => 'required|integer|min:1',
            'adresse_livraison_id' => 'required|exists:adresses,id',
            'adresse_facturation_id' => 'nullable|exists:adresses,id',
        ]);

        try {
            $order = DB::transaction(function () use ($validated, $request) {
                $client = $request->user()?->client;

                $commande = Commande::create([
                    'client_id' => $client?->id,
                    'adresse_livraison_id' => $validated['adresse_livraison_id'],
                    'adresse_facturation_id' => $validated['adresse_facturation_id'] ?? null,
                    'statut' => Commande::STATUT_EN_ATTENTE,
                    'sous_total' => 0,
                    'taxe' => 0,
                    'frais_livraison' => 0,
                    'total' => 0,
                    'date_commande' => now(),
                    'numero_commande' => strtoupper('C'.Str::random(8)),
                ]);

                $sousTotal = 0;

                foreach ($validated['items'] as $item) {
                    $produit = Produit::find($item['produit_id']);
                    $variante = isset($item['variante_produit_id']) ? VarianteProduit::find($item['variante_produit_id']) : null;

                    $prixUnitaire = $variante?->prix_actuel ?? $produit?->prix_actuel ?? 0;
                    $quantite = (int) $item['quantite'];
                    $prixTotal = round($prixUnitaire * $quantite, 2);

                    $ligne = $commande->lignes()->create([
                        'produit_id' => $produit->id,
                        'variante_produit_id' => $variante?->id,
                        'quantite' => $quantite,
                        'prix_unitaire' => $prixUnitaire,
                        'prix_total' => $prixTotal,
                        'taxe' => 0,
                        'remise' => 0,
                        'options' => $item['options'] ?? null,
                    ]);

                    // Décrémenter le stock si possible
                    if ($variante) {
                        $variante->decrementerStock($quantite);
                    } else {
                        $produit->decrementerStock($quantite);
                    }

                    $sousTotal += $prixTotal;
                }

                $commande->sous_total = $sousTotal;
                $commande->taxe = 0; // calculer taxes si nécessaire
                $commande->frais_livraison = 0;
                $commande->total = $commande->sous_total + $commande->taxe + $commande->frais_livraison;

                $commande->save();

                return $commande;
            });

            // Notifications: prévenir le vendeur et le client
            $tenant = tenant();
            if ($tenant) {
                $notificationService->notifyTenantUsers(
                    tenant: $tenant,
                    notificationType: OrderNotification::class,
                    data: ['order' => $order, 'action' => 'created', 'message' => "Nouvelle commande #{$order->numero_commande}"]
                );
            }

            if ($request->user()) {
                $notificationService->notifyCustomer(
                    customer: $request->user(),
                    notificationType: CustomerNotification::class,
                    data: ['order' => $order, 'action' => 'created', 'message' => "Votre commande #{$order->numero_commande} a été reçue"]
                );
            }

            return redirect()->route('tenant.orders.show', $order)->with('success', 'Commande créée avec succès!');

        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création de la commande', [
                'user_id' => $request->user()?->id,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Erreur lors de la création de la commande');
        }
    }

    /**
     * Mettre à jour le statut de la commande
     */
    public function updateStatus(Request $request, Commande $order, NotificationService $notificationService)
    {
        $allowed = array_keys(Commande::getStatuts());

        $request->validate([
            'status' => ['required', 'in:'.implode(',', $allowed)],
        ]);

        $oldStatus = $order->statut;
        $newStatus = $request->input('status');

        $order->update(['statut' => $newStatus]);

        // Notifier via service
        $tenant = tenant();
        if ($tenant) {
            $notificationService->notifyTenantUsers(
                tenant: $tenant,
                notificationType: OrderNotification::class,
                data: ['order' => $order, 'action' => 'status_changed', 'message' => "Statut: {$newStatus}"]
            );
        }

        if ($request->user()) {
            $notificationService->notifyCustomer(
                customer: $request->user(),
                notificationType: CustomerNotification::class,
                data: ['order' => $order, 'action' => 'status_changed', 'message' => "Votre commande a pour statut: {$newStatus}"]
            );
        }

        // Fire legacy event if desired (OrderStatusChanged expects Commande)
        event(new OrderStatusChanged($order, $oldStatus, $newStatus));

        return redirect()->back()->with('success', "Statut mis à jour: {$newStatus}");
    }

    /**
     * Traiter le paiement
     */
    public function processPayment(Request $request, Commande $order, NotificationService $notificationService)
    {
        $request->validate(['amount' => 'required|numeric|min:0']);

        $amount = $request->input('amount');

        try {
            $paiement = DB::transaction(function () use ($order, $amount) {
                $paiement = Paiement::create([
                    'commande_id' => $order->id,
                    'reference' => strtoupper('P'.Str::random(10)),
                    'mode' => $request->input('mode', Paiement::MODE_CARTE),
                    'montant' => $amount,
                    'devise' => config('app.currency', 'EUR'),
                    'statut' => Paiement::STATUT_VALIDE,
                    'date_paiement' => now(),
                ]);

                $paiement->valider();

                $order->marquerPayee();

                return $paiement;
            });

            // Notifications
            $tenant = tenant();
            if ($tenant) {
                $notificationService->notifyTenantUsers(
                    tenant: $tenant,
                    notificationType: OrderNotification::class,
                    data: ['order' => $order, 'amount' => $amount, 'action' => 'payment_received']
                );
            }

            if ($request->user()) {
                $notificationService->notifyCustomer(
                    customer: $request->user(),
                    notificationType: CustomerNotification::class,
                    data: ['order' => $order, 'amount' => $amount, 'action' => 'payment_received']
                );
            }

            // Fire a PaymentReceived event if present and compatible
            try {
                event(new PaymentReceived(order: $order, amount: $amount, status: 'completed'));
            } catch (\TypeError $e) {
                // Ignore if event expects a different model type
                Log::warning('Skipping PaymentReceived event due to type mismatch');
            }

            return redirect()->back()->with('success', "Paiement de {$amount}€ traité avec succès!");

        } catch (\Exception $e) {
            Log::error('Erreur lors du traitement du paiement', ['order_id' => $order->id, 'error' => $e->getMessage()]);

            return back()->with('error', 'Erreur lors du traitement du paiement');
        }
    }

    /**
     * Envoyer une notification personnalisée au client
     */
    public function sendCustomerNotification(Request $request, NotificationService $notificationService)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string',
            'message' => 'required|string',
        ]);

        $user = User::findOrFail($request->input('user_id'));

        $notificationService->notifyCustomer(
            customer: $user,
            notificationType: CustomerNotification::class,
            data: [
                'title' => $request->input('title'),
                'message' => $request->input('message'),
                'category' => 'general',
                'subject' => $request->input('title'),
            ]
        );

        return back()->with('success', 'Notification envoyée!');
    }

    /**
     * Envoyer une notification à tous les vendeurs
     */
    public function notifyAllVendors(Request $request, NotificationService $notificationService)
    {
        $request->validate(['title' => 'required|string', 'message' => 'required|string']);

        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            $notificationService->notifyTenantUsers(
                tenant: $tenant,
                notificationType: OrderNotification::class,
                data: [
                    'title' => $request->input('title'),
                    'message' => $request->input('message'),
                    'action' => 'system_message',
                ]
            );
        }

        return back()->with('success', 'Notifications envoyées à tous les vendeurs!');
    }

    /**
     * Envoyer une notification aux administrateurs
     */
    public function notifyAdmins(Request $request, NotificationService $notificationService)
    {
        $notificationService->notifyAdmins(
            notificationType: OrderNotification::class,
            data: [
                'title' => 'Alerte système',
                'message' => $request->input('message'),
                'action' => 'admin_alert',
            ]
        );

        return back()->with('success', 'Notification envoyée aux administrateurs!');
    }
}
