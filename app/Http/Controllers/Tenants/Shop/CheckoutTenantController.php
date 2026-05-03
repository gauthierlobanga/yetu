<?php

namespace App\Http\Controllers\Tenants\Shop;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CheckoutTenantController extends Controller
{
    protected CartTenantController $cartController;

    public function __construct(CartTenantController $cartController)
    {
        $this->cartController = $cartController;
    }

    /**
     * Affiche la page de checkout avec le récapitulatif du panier.
     */
    public function index(Request $request)
    {
        $cart = $this->cartController->getCart($request);

        if ($cart->est_vide) {
            return redirect()->route('tenant.cart.index')
                ->with('error', 'Votre panier est vide.');
        }

        $client = FacadesAuth::user()->client ?? null;
        $addresses = $client ? $client->adresses()->get() : collect();

        return Inertia::render('tenants/Shop/Checkout/Index', [
            'cart' => $this->cartController->formatCart($cart),
            'addresses' => $addresses,
        ]);
    }

    /**
     * Traite la commande : vérifie le stock, convertit le panier en commande et décrémente les stocks.
     */
    public function process(Request $request)
    {
        $validated = $request->validate([
            'adresse_facturation_id' => 'required|exists:adresses,id',
            'adresse_livraison_id' => 'required|exists:adresses,id',
            'mode_paiement' => 'required|string',
            'notes' => 'nullable|string|max:1000',
        ]);

        $cart = $this->cartController->getCart($request);

        // Vérification des stocks
        foreach ($cart->items as $item) {
            if (! $item->produit->hasSufficientStock($item->quantite)) {
                return back()->withErrors([
                    'stock' => "Stock insuffisant pour {$item->produit->nom}",
                ]);
            }
            if ($item->variante && ! $item->variante->hasSufficientStock($item->quantite)) {
                return back()->withErrors([
                    'stock' => "Stock insuffisant pour la variante {$item->variante->valeur} de {$item->produit->nom}",
                ]);
            }
        }

        try {
            $commande = $cart->convertirEnCommande();
            $commande->update([
                'adresse_facturation_id' => $validated['adresse_facturation_id'],
                'adresse_livraison_id' => $validated['adresse_livraison_id'],
                'mode_paiement' => $validated['mode_paiement'],
                'notes' => $validated['notes'] ?? null,
            ]);

            // Décrémenter les stocks
            foreach ($commande->lignes as $ligne) {
                $ligne->produit->decrementerStock($ligne->quantite);
                if ($ligne->variante) {
                    $ligne->variante->decrementerStock($ligne->quantite);
                }
            }

            return redirect()->route('tenant.payment.pay', $commande);
        } catch (\Exception $e) {
            Log::error('Erreur lors de la création de la commande : '.$e->getMessage());

            return back()->withErrors([
                'checkout' => 'Une erreur est survenue lors du traitement de votre commande. Veuillez réessayer.',
            ]);
        }
    }

    /**
     * Page de succès après paiement.
     */
    public function success(Commande $commande)
    {
        // Vérifier que l'utilisateur est bien le propriétaire de la commande
        if ($commande->client_id !== optional(Auth::user()->client)->id) {
            abort(403);
        }

        return Inertia::render('tenants/Shop/Checkout/Success', [
            'commande' => $commande->load('lignes.produit'),
        ]);
    }

    /**
     * Page d'annulation du paiement.
     */
    public function cancel()
    {
        return redirect()->route('tenant.cart.index')
            ->with('info', 'Le paiement a été annulé. Vous pouvez réessayer quand vous le souhaitez.');
    }
}
