<?php

namespace App\Listeners;

use App\Support\Tenancy\TenantStorage;
use Illuminate\Support\Facades\Config;
use Stancl\Tenancy\Events\TenancyInitialized;

/**
 * Configure le système de fichiers pour le stockage spécifique au locataire.
 *
 * Déclenché lors de l'initialisation de l'environnement d'un locataire,
 * ce listener ajuste dynamiquement les chemins et URLs du disque 'tenant'
 * dans la configuration de Laravel.
 */
class ConfigureTenantStorage
{
    /**
     * Gère l'événement d'initialisation du locataire.
     *
     * @param  TenancyInitialized  $event  L'événement contenant les informations du locataire.
     * @return void
     */
    public function handle(TenancyInitialized $event)
    {
        $tenant = $event->tenancy->tenant;

        Config::set('filesystems.disks.tenant.root', TenantStorage::publicDiskRoot($tenant));
        Config::set('filesystems.disks.tenant.url', TenantStorage::tenantPublicUrl($tenant));
    }
}
