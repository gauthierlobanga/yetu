<?php

namespace App\Http\Controllers\Vendor\Boutique\Ecommerce\Payment;

use App\Http\Controllers\Controller;
use App\Models\Commande;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
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
