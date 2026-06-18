<?php

namespace App\Jobs;

use App\Models\Tenant;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Artisan;

/**
 * Job responsable de l'amorçage de la base de données d'un tenant.
 *
 * Similaire à SeederTenantData, ce job configure également l'environnement
 * (désactivation de la géolocalisation) avant de lancer le seeding.
 */
class SeedTenantDatabase implements ShouldQueue
{
    use Queueable;

    /**
     * Crée une nouvelle instance du job.
     *
     * @param  Tenant  $tenant  Le tenant dont la base de données doit être amorcée.
     */
    public function __construct(protected Tenant $tenant) {}

    /**
     * Exécute le job.
     *
     * Prépare la configuration et lance la commande Artisan 'tenants:seed'.
     */
    public function handle(): void
    {
        config()->set('world.modules.geolocate', false);

        Artisan::call('tenants:seed', [
            '--tenants' => [$this->tenant->getTenantKey()],
            '--class' => 'TenantDatabaseSeeder',
            '--force' => true,
            '--no-interaction' => true,
        ]);
    }
}
