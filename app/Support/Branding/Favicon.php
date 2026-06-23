<?php

namespace App\Support\Branding;

use App\Models\Tenant;
use App\Settings\SettingApp;
use Throwable;

/**
 * Classe utilitaire pour la gestion des favicons dynamiques.
 * Gère la résolution des favicons en fonction du contexte (Central ou Vendeur/Tenant).
 */
final class Favicon
{
    /**
     * Récupère l'URL absolue du favicon pour le contexte actuel.
     * Si un tenant est actif (ex: boutique vendeur), retourne le favicon du tenant.
     * Sinon (ex: marketplace centrale), retourne le favicon de l'application centrale.
     *
     * @return string L'URL absolue du favicon.
     */
    public static function currentUrl(): string
    {
        $tenant = self::currentTenant();

        if ($tenant instanceof Tenant) {
            return self::tenantUrl($tenant);
        }

        return self::centralUrl();
    }

    /**
     * Récupère l'URL absolue du favicon pour l'application centrale.
     * Utilise les paramètres Spatie (SettingApp) pour trouver le logo global.
     * En cas d'absence, retourne le favicon.ico par défaut.
     *
     * @return string L'URL absolue du favicon central.
     */
    public static function centralUrl(): string
    {
        try {
            $logoUrl = app(SettingApp::class)->logoUrl();
        } catch (Throwable) {
            $logoUrl = null;
        }

        return $logoUrl ? asset($logoUrl) : asset('favicon.ico');
    }

    /**
     * Récupère l'URL absolue du favicon pour un tenant spécifique (vendeur).
     * Cherche d'abord l'attribut logo_url, puis l'avatar via Spatie Media Library.
     * Utilise la fonction asset() pour garantir une URL complète et absolue,
     * évitant ainsi les problèmes de CORS ou de redirections côté frontend.
     *
     * @param  Tenant  $tenant  L'instance du tenant (vendeur).
     * @return string L'URL absolue du favicon du tenant.
     */
    public static function tenantUrl(Tenant $tenant): string
    {
        try {
            $logoUrl = $tenant->logo_url ?: $tenant->getFirstMedia('tenant_avatar')?->getUrl();

            return $logoUrl ? asset($logoUrl) : asset('favicon.ico');
        } catch (Throwable) {
            return asset('favicon.ico');
        }
    }

    /**
     * Résout le tenant actuel depuis le conteneur d'injection de dépendances.
     * Protège contre les erreurs si le package tenancy n'est pas initialisé.
     *
     * @return Tenant|null L'instance du tenant actuel ou null.
     */
    private static function currentTenant(): ?Tenant
    {
        if (! function_exists('tenant')) {
            return null;
        }

        $tenant = tenant();

        return $tenant instanceof Tenant ? $tenant : null;
    }
}
