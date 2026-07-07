<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Checkout;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Vendor\Boutique\Ecommerce\Cart\CartController;
use App\Models\Commande;
use App\Models\Paiement;
use App\Models\Panier;
use App\Models\VisitorEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur gérant le processus de passage en caisse (Checkout).
 *
 * S'occupe de la validation du panier, des adresses, du calcul des frais
 * de livraison, et du choix du mode de paiement avant validation finale.
 */
class CheckoutController extends Controller
{
    protected CartController $cartController;

    public function __construct(CartController $cartController)
    {
        $this->cartController = $cartController;
    }

    /**
     * Affiche la page de checkout (caisse).
     *
     * Rendu de la vue Inertia contenant les étapes finales de la commande
     * pour l'utilisateur, après vérification du panier courant.
     *
     * @return Response
     */
    public function checkoutIndex(Request $request)
    {
        if (! Auth::check()) {
            return redirect()->route('tenant.login')
                ->with('error', 'Veuillez vous connecter pour continuer.');
        }

        $cart = $this->cartController->getCart($request);

        if ($cart->est_vide) {
            return redirect()->route('tenant.cart.index')
                ->with('error', 'Votre panier est vide.');
        }

        $addresses = Auth::user()?->adresses()->get() ?? collect();

        // Méthodes de livraison (peuvent être dynamiques depuis la base / config)
        $shippingMethods = [
            [
                'id' => 'standard',
                'name' => 'Standard',
                'description' => 'Livraison à domicile sous 5-7 jours ouvrés',
                'price' => 0,
                'estimatedDays' => '5-7 jours',
            ],
            [
                'id' => 'express',
                'name' => 'Express',
                'description' => 'Livraison prioritaire sous 24-48h',
                'price' => 15000,
                'estimatedDays' => '1-2 jours',
            ],
        ];

        // Méthodes de paiement
        $paymentMethods = [
            [
                'id' => 'mobile_money',
                'name' => 'Mobile Money',
                'description' => 'M-Pesa, Airtel Money, Orange Money',
            ],
            [
                'id' => 'card',
                'name' => 'Carte bancaire',
                'description' => 'Visa, Mastercard',
            ],
            [
                'id' => 'cash',
                'name' => 'Paiement à la livraison',
            ],
        ];

        // Enregistrement de l'événement début du checkout
        VisitorEvent::create([
            'session_id' => Session::getId(),
            'visitor_id' => request()->cookie('y_visitor'),
            'event_type' => 'begin_checkout',
            'occurred_at' => now(),
        ]);

        return Inertia::render('Vendor/boutique/Checkout/Index', [
            'cart' => $this->cartController->formatCart($cart),
            'addresses' => $addresses,
            'shippingMethods' => $shippingMethods,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    /**
     * Traitement final de la commande.
     */
    // public function checkoutProcess(Request $request)
    // {
    //     if (! Auth::check()) {
    //         return redirect()->route('tenant.login')
    //             ->with('error', 'Veuillez vous connecter pour continuer.');
    //     }

    //     $validated = $request->validate([
    //         'adresse_facturation_id' => 'required|exists:adresses,id',
    //         'adresse_livraison_id' => 'required|exists:adresses,id',
    //         'payment_method_id' => 'required|string|in:mobile_money,card,cash',
    //         'shipping_method_id' => 'required|string|in:standard,express',
    //         'notes' => 'nullable|string|max:1000',
    //     ], [
    //         'adresse_facturation_id.required' => 'Veuillez sélectionner une adresse de facturation.',
    //         'adresse_livraison_id.required' => 'Veuillez sélectionner une adresse de livraison.',
    //         'payment_method_id.required' => 'Veuillez sélectionner un mode de paiement.',
    //         'shipping_method_id.required' => 'Veuillez sélectionner une méthode de livraison.',
    //     ]);

    //     $cart = $this->cartController->getCart($request);

    //     if ($cart->est_vide) {
    //         return back()->withErrors([
    //             'cart' => 'Votre panier est vide.',
    //         ]);
    //     }

    //     // Vérification que les adresses appartiennent à l'utilisateur
    //     $billingAddress = Auth::user()->adresses()->find($validated['adresse_facturation_id']);
    //     $shippingAddress = Auth::user()->adresses()->find($validated['adresse_livraison_id']);

    //     if (! $billingAddress || ! $shippingAddress) {
    //         return back()->withErrors([
    //             'addresses' => 'Une ou plusieurs adresses n\'appartiennent pas à votre compte.',
    //         ]);
    //     }

    //     // Vérification des stocks
    //     foreach ($cart->items as $item) {
    //         if (! $item->produit->hasSufficientStock($item->quantite)) {
    //             return back()->withErrors([
    //                 'stock' => "Stock insuffisant pour {$item->produit->nom}. ".
    //                     "Disponible: {$item->produit->stock_disponible}, Demandé: {$item->quantite}",
    //             ]);
    //         }
    //         if ($item->variante && ! $item->variante->hasSufficientStock($item->quantite)) {
    //             return back()->withErrors([
    //                 'stock' => "Stock insuffisant pour la variante {$item->variante->valeur} de {$item->produit->nom}.",
    //             ]);
    //         }
    //     }

    //     try {
    //         $commande = DB::transaction(function () use ($cart, $validated) {
    //             // Création de la commande avec les adresses et tous les champs
    //             $commande = Commande::create([
    //                 'client_id' => $cart->client_id,
    //                 'panier_id' => $cart->id,
    //                 'adresse_facturation_id' => $validated['adresse_facturation_id'],
    //                 'adresse_livraison_id' => $validated['adresse_livraison_id'],
    //                 'numero_commande' => $this->genererNumeroCommande(),
    //                 'statut' => Commande::STATUT_EN_ATTENTE,
    //                 'sous_total' => $cart->sous_total,
    //                 'taxe' => $cart->total_taxes,
    //                 'frais_livraison' => $cart->total_livraison,
    //                 'total' => $cart->total_general,
    //                 'mode_paiement' => $validated['payment_method_id'],
    //                 'shipping_method_id' => $validated['shipping_method_id'],
    //                 'notes' => $validated['notes'] ?? null,
    //                 'date_commande' => now(),
    //             ]);

    //             // Copier les lignes du panier
    //             foreach ($cart->items as $item) {
    //                 $commande->lignes()->create([
    //                     'produit_id' => $item->produit_id,
    //                     'variante_produit_id' => $item->variante_produit_id,
    //                     'quantite' => $item->quantite,
    //                     'prix_unitaire' => $item->prix_unitaire,
    //                     'prix_total' => $item->prix_total,
    //                     'taxe' => $item->taxe_unitaire * $item->quantite,
    //                     'options' => $item->options_selectionnees,
    //                 ]);

    //                 // Décrémenter les stocks immédiatement
    //                 $item->produit->decrementerStock($item->quantite);
    //                 if ($item->variante) {
    //                     $item->variante->decrementerStock($item->quantite);
    //                 }
    //             }

    //             // Marquer le panier comme converti
    //             $cart->statut = Panier::STATUT_CONVERTI;
    //             $cart->date_conversion = now();
    //             $cart->save();

    //             // Gestion du paiement
    //             if ($validated['payment_method_id'] === 'cash') {
    //                 // Paiement à la livraison : en attente
    //                 Paiement::create([
    //                     'commande_id' => $commande->id,
    //                     'reference' => 'P-' . strtoupper(Str::random(8)),
    //                     'mode' => 'cash',
    //                     'montant' => $commande->total,
    //                     'devise' => 'CDF',
    //                     'statut' => Paiement::STATUT_EN_ATTENTE,
    //                     'date_paiement' => null,
    //                 ]);
    //                 // La commande reste en statut "en_attente"
    //             } else {
    //                 // Paiement immédiat (mobile_money, carte) – on simule un succès
    //                 $paiement = Paiement::create([
    //                     'commande_id' => $commande->id,
    //                     'reference' => 'P-' . strtoupper(Str::random(8)),
    //                     'mode' => $validated['payment_method_id'],
    //                     'montant' => $commande->total,
    //                     'devise' => 'CDF',
    //                     'statut' => Paiement::STATUT_VALIDE,
    //                     'date_paiement' => now(),
    //                 ]);
    //                 $commande->marquerPayee(); // passe en "en_cours"
    //             }

    //             return $commande;
    //         });

    //         Log::info('Order created successfully', [
    //             'order_id' => $commande->id,
    //             'user_id' => Auth::id(),
    //             'total' => $commande->total,
    //             'payment_method' => $validated['payment_method_id'],
    //         ]);

    //         // Redirection après succès
    //         if ($validated['payment_method_id'] === 'cash') {
    //             return redirect()->route('tenant.checkout.success', $commande)
    //                 ->with('info', 'Votre commande est enregistrée. Vous paierez à la livraison.');
    //         }

    //         return redirect()->route('tenant.payment.pay', $commande);

    //     } catch (\Exception $e) {
    //         Log::error('Checkout error', [
    //             'message' => $e->getMessage(),
    //             'user' => Auth::id(),
    //             'cart' => $cart->id,
    //             'trace' => $e->getTraceAsString(),
    //         ]);

    //         return back()->withErrors([
    //             'checkout' => 'Une erreur inattendue est survenue lors de la création de la commande. Veuillez réessayer ou contacter notre support.',
    //         ]);
    //     }
    // }
    public function checkoutProcess(Request $request)
    {
        if (! Auth::check()) {
            return redirect()->route('tenant.login')
                ->with('error', 'Veuillez vous connecter pour continuer.');
        }

        $validated = $request->validate([
            'adresse_facturation_id' => 'required|exists:adresses,id',
            'adresse_livraison_id' => 'required|exists:adresses,id',
            'payment_method_id' => 'required|string|in:mobile_money,card,cash',
            'shipping_method_id' => 'required|string|in:standard,express',
            'notes' => 'nullable|string|max:1000',
        ], [
            'adresse_facturation_id.required' => 'Veuillez sélectionner une adresse de facturation.',
            'adresse_livraison_id.required' => 'Veuillez sélectionner une adresse de livraison.',
            'payment_method_id.required' => 'Veuillez sélectionner un mode de paiement.',
            'shipping_method_id.required' => 'Veuillez sélectionner une méthode de livraison.',
        ]);

        $cart = $this->cartController->getCart($request);

        // Charger les relations nécessaires
        $cart->load('items.produit', 'items.variante');

        if ($cart->est_vide) {
            return back()->withErrors(['cart' => 'Votre panier est vide.']);
        }

        // Vérification des adresses
        $billingAddress = Auth::user()->adresses()->find($validated['adresse_facturation_id']);
        $shippingAddress = Auth::user()->adresses()->find($validated['adresse_livraison_id']);

        if (! $billingAddress || ! $shippingAddress) {
            return back()->withErrors([
                'addresses' => 'Une ou plusieurs adresses n\'appartiennent pas à votre compte.',
            ]);
        }

        // Vérification des stocks
        foreach ($cart->items as $item) {
            if (! $item->produit->hasSufficientStock($item->quantite)) {
                return back()->withErrors([
                    'stock' => "Stock insuffisant pour {$item->produit->nom}. ".
                        "Disponible: {$item->produit->stock_disponible}, Demandé: {$item->quantite}",
                ]);
            }
            if ($item->variante && ! $item->variante->hasSufficientStock($item->quantite)) {
                return back()->withErrors([
                    'stock' => "Stock insuffisant pour la variante {$item->variante->valeur} de {$item->produit->nom}.",
                ]);
            }
        }

        try {
            $commande = null;

            DB::transaction(function () use ($cart, $validated, &$commande) {
                // Créer la commande avec toutes les données
                $commande = $cart->convertirEnCommande([
                    'adresse_facturation_id' => $validated['adresse_facturation_id'],
                    'adresse_livraison_id' => $validated['adresse_livraison_id'],
                    'mode_paiement' => $validated['payment_method_id'],
                    'shipping_method_id' => $validated['shipping_method_id'],
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Charger les relations pour éviter le lazy loading
                $commande->load('lignes.produit', 'lignes.variante');

                // Gérer le paiement
                if ($validated['payment_method_id'] === 'cash') {
                    // Paiement à la livraison : en attente
                    Paiement::create([
                        'commande_id' => $commande->id,
                        'reference' => 'P-'.strtoupper(Str::random(8)),
                        'mode' => Paiement::MODE_CASH,
                        'montant' => $commande->total,
                        'devise' => 'CDF',
                        'statut' => Paiement::STATUT_EN_ATTENTE,
                        'date_paiement' => null,
                    ]);

                    // La commande reste en "en_attente"
                } else {
                    // Paiement immédiat (mobile_money, card) – simuler un succès
                    Paiement::create([
                        'commande_id' => $commande->id,
                        'reference' => 'P-'.strtoupper(Str::random(8)),
                        'mode' => $validated['payment_method_id'],
                        'montant' => $commande->total,
                        'devise' => 'CDF',
                        'statut' => 'valide',
                        'date_paiement' => now(),
                    ]);
                    $commande->marquerPayee(); // passe le statut à "en_cours"
                }

                // Décrémenter les stocks
                foreach ($commande->lignes as $ligne) {
                    $ligne->produit->decrementerStock($ligne->quantite);
                    if ($ligne->variante) {
                        $ligne->variante->decrementerStock($ligne->quantite);
                    }
                }
            });

            Log::info('Order created successfully', [
                'order_id' => $commande->id,
                'user_id' => Auth::id(),
                'total' => $commande->total,
                'payment_method' => $validated['payment_method_id'],
            ]);

            // Redirection selon mode de paiement
            if ($validated['payment_method_id'] === 'cash') {
                return redirect()->route('tenant.checkout.success', $commande)
                    ->with('info', 'Votre commande est enregistrée. Vous paierez à la livraison.');
            }

            return redirect()->route('tenant.payment.pay', $commande);

        } catch (\Exception $e) {
            Log::error('Checkout error', [
                'message' => $e->getMessage(),
                'user' => Auth::id(),
                'cart' => $cart->id,
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors([
                'checkout' => 'Une erreur inattendue est survenue lors de la création de la commande. Veuillez réessayer ou contacter notre support.',
            ]);
        }
    }

    /**
     * Génère un numéro de commande unique.
     */
    private function genererNumeroCommande(): string
    {
        $prefix = 'CMD';
        $year = now()->format('Y');
        $month = now()->format('m');
        $random = strtoupper(substr(uniqid(), -6));

        return "{$prefix}-{$year}{$month}-{$random}";
    }

    /**
     * Page de succès après paiement.
     */
    public function checkoutSuccess(Commande $commande)
    {
        if (! Auth::check()) {
            return redirect()->route('tenant.login');
        }

        if ($commande->client_id !== optional(Auth::user()->client)->id) {
            abort(403);
        }

        // Enregistrement de l'événement d'achat réussi (purchase)
        VisitorEvent::create([
            'session_id' => Session::getId(),
            'visitor_id' => request()->cookie('y_visitor'),
            'event_type' => 'purchase',
            'order_id' => $commande->id,
            'value' => $commande->total,
            'occurred_at' => now(),
        ]);

        return Inertia::render('Vendor/boutique/Checkout/Success', [
            'commande' => $commande->load('lignes.produit'),
        ]);
    }

    /**
     * Page d'annulation du paiement.
     */
    public function checkoutCancel()
    {
        return redirect()->route('tenant.cart.index')
            ->with('info', 'Le paiement a été annulé. Vous pouvez réessayer quand vous le souhaitez.');
    }
}
