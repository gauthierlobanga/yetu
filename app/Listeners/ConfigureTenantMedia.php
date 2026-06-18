<?php

namespace App\Listeners;

use App\Support\Tenancy\TenantStorage;
use Illuminate\Support\Facades\Config;
use Stancl\Tenancy\Events\TenancyInitialized;

/**
 * Configure le disque de stockage public pour les médias du locataire.
 *
 * Ce listener est déclenché lors de l'initialisation de l'environnement
 * d'un locataire (tenant). Il met à jour la configuration du système de
 * fichiers pour que le disque 'tenant' pointe vers les répertoires corrects.
 */
class ConfigureTenantMedia
{
    /**
     * Crée une nouvelle instance du listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Gère l'événement d'initialisation du locataire.
     *
     * @param  TenancyInitialized  $event  L'événement contenant les informations du locataire.
     */
    public function handle(TenancyInitialized $event): void
    {
        $tenant = $event->tenancy->tenant;

        Config::set('filesystems.disks.tenant.root', TenantStorage::publicDiskRoot($tenant));
        Config::set('filesystems.disks.tenant.url', TenantStorage::tenantPublicUrl($tenant));
    }
}
