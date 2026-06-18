<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\VendorRequest;
use App\Services\VendorRegistrationService;
use Illuminate\Http\JsonResponse;

/**
 * Contrôleur API permettant de vérifier le statut d'une demande vendeur.
 *
 * Permet au client de scruter ou vérifier l'avancement de son inscription
 * en tant que vendeur (en attente, approuvée, rejetée) et de récupérer l'URL SSO.
 */
class VendorRequestStatusController extends Controller
{
    /**
     * Traite la requête entrante (Single Action Controller).
     *
     * Vérifie le statut de la requête, assure la sécurité (appartenance)
     * et si approuvé, génère l'URL d'authentification unique (SSO) vers le tenant.
     *
     * @param  string  $id  L'identifiant de la demande vendeur (VendorRequest).
     * @return JsonResponse Les informations de statut et potentiellement le lien SSO.
     */
    public function __invoke(string $id): JsonResponse
    {
        $vendorRequest = VendorRequest::find($id);

        if (! $vendorRequest) {
            return response()->json(['error' => 'Not found'], 404);
        }

        // Vérifier que la demande appartient à l'utilisateur authentifié
        if ($vendorRequest->user_id !== request()->user()->id) {
            return response()->json(['error' => 'Forbidden'], 403);
        }

        $response = [
            'id' => $vendorRequest->id,
            'status' => $vendorRequest->status,
            'shop_name' => $vendorRequest->shop_name,
            'tenant_id' => $vendorRequest->tenant_id,
        ];

        if ($vendorRequest->status === VendorRequest::STATUS_APPROVED && $vendorRequest->tenant_id) {
            $tenant = Tenant::find($vendorRequest->tenant_id);
            if ($tenant && $tenant->subscription) {
                $service = app(VendorRegistrationService::class);
                $response['sso_url'] = $service->getTenantSsoLoginUrl($tenant, request()->user());
            } else {
                $response['status'] = VendorRequest::STATUS_PENDING;
            }
        }

        return response()->json($response);
    }
}
