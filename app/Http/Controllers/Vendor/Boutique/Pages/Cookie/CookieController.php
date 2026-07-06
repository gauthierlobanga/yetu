<?php

namespace App\Http\Controllers\Vendor\Boutique\Pages\Cookie;

use App\Http\Controllers\Controller;
use App\Models\CookieConsent;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur d'informations sur les Cookies.
 */
class CookieController extends Controller
{
    /**
     * Affiche la politique d'utilisation des cookies et la gestion
     * des consentements de l'utilisateur.
     *
     * @return Response
     */
    public function cookie()
    {
        return Inertia::render('Vendor/pages/cookies/Cookies');
    }

    /**
     * Enregistre les préférences de cookies de l'utilisateur.
     *
     * @return JsonResponse
     */
    public function storeConsent(Request $request)
    {
        $validated = $request->validate([
            'preferences' => 'required|array',
        ]);

        $tenant = tenant();

        CookieConsent::create([
            'tenant_id' => $tenant->id,
            'ip_address' => $request->ip(),
            'session_id' => $request->session()->getId(),
            'user_id' => auth()->id(),
            'preferences' => $validated['preferences'],
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json(['message' => 'Préférences enregistrées avec succès.']);
    }
}
