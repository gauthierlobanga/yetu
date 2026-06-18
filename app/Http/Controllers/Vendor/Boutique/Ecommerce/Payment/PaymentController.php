<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Payment;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur gérant les processus de paiement d'une commande.
 *
 * Permet l'affichage de l'interface de paiement (ex: Stripe)
 * et la réception des webhooks/callbacks post-paiement.
 */
class PaymentController extends Controller
{
    /**
     * Affiche la vue de paiement pour une commande donnée.
     *
     * Initialise la session de paiement avec le fournisseur (Stripe, etc.)
     * et transmet le 'clientSecret' requis par le frontend.
     *
     * @param  Commande  $commande  La commande à régler.
     * @return Response
     *
     * @throws AuthorizationException
     */
    public function paymentPay(Commande $commande)
    {
        /** @var AuthorizesRequests $this */
        $this->authorize('pay', $commande);

        // Simuler une intégration Stripe
        return Inertia::render('Vendor/boutique/Payment/Pay', [
            'commande' => $commande,
            'clientSecret' => 'pi_dummy_secret',
        ]);
    }

    /**
     * Point de retour (Callback) après une tentative de paiement.
     *
     * Traite le résultat du paiement : si réussi, marque la commande
     * comme payée et redirige vers la confirmation. Sinon, retourne au panier.
     *
     * @param  Request  $request  La requête HTTP avec les paramètres de retour.
     * @return RedirectResponse
     */
    public function PaymentCallback(Request $request)
    {
        /** @var Commande $commande */
        $commande = Commande::find($request->input('commande_id'));
        if ($commande) {
            $commande->marquerPayee();

            return redirect()->route('tenant.checkout.success', $commande);
        }

        return redirect()->route('tenant.cart.index')->with('error', 'Paiement échoué');
    }
}
