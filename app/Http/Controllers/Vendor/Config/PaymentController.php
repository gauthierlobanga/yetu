<?php

namespace App\Http\Controllers\Vendor\Config;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\VendorRequest;
use App\Services\PaymentService;
use App\Services\VendorRegistrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Contrôleur gérant les processus de paiement pour l'inscription des vendeurs.
 *
 * Gère les redirections vers Stripe, le traitement après le paiement,
 * l'annulation et la réception des webhooks de paiement.
 */
class PaymentController extends Controller
{
    /**
     * Constructeur du contrôleur.
     *
     * @param  PaymentService  $paymentService  Service gérant la logique de paiement avec Stripe.
     * @param  VendorRegistrationService  $vendorService  Service gérant l'enregistrement des vendeurs.
     */
    public function __construct(
        private readonly PaymentService $paymentService,
        private readonly VendorRegistrationService $vendorService
    ) {}

    /**
     * Redirige l'utilisateur vers Stripe Checkout pour payer son plan.
     *
     * Vérifie les droits de l'utilisateur sur la demande en cours
     * et s'assure que le plan nécessite un paiement.
     *
     * @param  Request  $request  La requête HTTP entrante.
     * @return Response|RedirectResponse Redirection vers la session Stripe ou retour en cas d'erreur.
     */
    public function checkout(Request $request)
    {
        $user = Auth::user();

        $vendorRequest = VendorRequest::findOrFail(session('vendor_request_id'));
        $plan = Plan::findOrFail($vendorRequest->plan_id);

        // Vérifier que l'utilisateur est le propriétaire
        if ($vendorRequest->user_id !== $user->id) {
            abort(403);
        }

        // Vérifier que le plan est payant
        if ($plan->is_free) {
            return redirect()->route('vendor.register')
                ->with('error', 'Ce plan est gratuit.');
        }

        try {
            $session = $this->paymentService->createCheckoutSession($user, $plan, $vendorRequest);

            $vendorRequest->update(['payment_session_id' => $session->id]);

            return Inertia::location($session->url);
        } catch (\Exception $e) {
            Log::error('Erreur création session Stripe', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return back()->with('error', 'Une erreur est survenue lors de la création du paiement.');
        }
    }

    /**
     * Affiche la page intermédiaire de résumé avant de procéder au paiement.
     *
     * Valide que la requête de vendeur appartient à l'utilisateur connecté.
     *
     * @return Response Vue Inertia du résumé du paiement.
     */
    public function index()
    {
        $vendorRequest = VendorRequest::findOrFail(session('vendor_request_id'));

        // Vérifier que l'utilisateur est le propriétaire de la demande
        if ($vendorRequest->user_id !== Auth::id()) {
            abort(403);
        }

        $plan = Plan::findOrFail($vendorRequest->plan_id);

        return Inertia::render('Vendor/Payment', [
            'plan' => $plan,
            'vendorRequest' => [
                'shop_name' => $vendorRequest->shop_name,
                'shop_slug' => $vendorRequest->shop_slug,
            ],
        ]);
    }

    /**
     * Traite le retour réussi après un paiement sur Stripe.
     *
     * Vérifie le statut de la session de paiement. En cas de succès, met à jour
     * la demande d'enregistrement, configure la souscription du tenant, et redirige
     * vers le tableau de bord du vendeur via SSO.
     *
     * @param  Request  $request  La requête contenant l'identifiant de la session Stripe.
     * @return RedirectResponse Redirection vers le tableau de bord SSO ou retour en arrière avec erreur.
     *
     * @throws HttpException Exceptions HTTP potentielles.
     */
    public function success(Request $request)
    {
        $sessionId = $request->input('session_id');

        if (! $sessionId) {
            return redirect()->route('vendor.register')
                ->with('error', 'Session de paiement invalide.');
        }

        try {
            $result = $this->paymentService->verifyCheckoutSession($sessionId);

            if ($result['status'] === 'paid') {
                $vendorRequest = VendorRequest::findOrFail($result['metadata']['vendor_request_id']);
                if ((string) $vendorRequest->user_id !== (string) Auth::id()) {
                    abort(403);
                }

                // Fallback idempotent si le webhook n'a pas encore créé le tenant/subscription.
                $tenant = $this->vendorService->approve($vendorRequest);
                $tenant->load('subscription');

                if ($tenant->subscription) {
                    $tenant->subscription->update([
                        'stripe_id' => $result['subscription_id'] ?? $tenant->subscription->stripe_id,
                        'stripe_customer_id' => $result['customer_id'] ?? $tenant->subscription->stripe_customer_id,
                        'stripe_subscription_id' => $result['subscription_id'] ?? $tenant->subscription->stripe_subscription_id,
                    ]);
                }

                // Nettoyer la session
                session()->forget('vendor_request_id');

                // Rediriger via SSO pour créer la session dans le contexte tenant.
                $dashboardUrl = $this->vendorService->getTenantSsoLoginUrl($tenant, Auth::user());

                return redirect($dashboardUrl);
            }

            return redirect()->route('vendor.register')
                ->with('error', 'Le paiement n\'a pas abouti. Veuillez réessayer.');
        } catch (HttpException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Erreur vérification paiement', [
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
            ]);

            return redirect()->route('vendor.register')
                ->with('error', 'Une erreur est survenue lors de la vérification du paiement.');
        }
    }

    /**
     * Traite l'annulation d'un paiement en cours par l'utilisateur.
     *
     * @return RedirectResponse Redirection vers la configuration avec un message d'erreur.
     */
    public function cancel()
    {
        return redirect()->route('vendor.configure')
            ->with('error', 'Le paiement a été annulé. Vous pouvez réessayer.');
    }

    /**
     * Gère les requêtes webhook asynchrones envoyées par Stripe.
     *
     * Analyse la charge utile et valide la signature. Si le paiement est réussi,
     * approuve la demande d'enregistrement de boutique si elle existe.
     *
     * @param  Request  $request  La requête HTTP entrante contenant la charge utile du webhook.
     * @return JsonResponse Statut de la réception du webhook.
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature');

        $result = $this->paymentService->handleWebhook($payload, $signature);

        if ($result['status'] === 'success') {
            // Approuver le vendeur si ce n'est pas déjà fait
            if (isset($result['vendor_request_id'])) {
                $vendorRequest = VendorRequest::find($result['vendor_request_id']);
                if ($vendorRequest) {
                    $this->vendorService->approve($vendorRequest);
                }
            }

            return response()->json(['status' => 'ok'], 200);
        }

        return response()->json(['status' => 'error'], 400);
    }
}
