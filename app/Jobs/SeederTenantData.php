<?php

namespace App\Jobs;

use App\Models\Tenant;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Artisan;

/**
 * Job responsable de l'amorçage (seeding) des données d'un tenant.
 *
 * Ce job exécute la commande Artisan pour insérer les données par défaut
 * dans la base de données du tenant spécifié.
 */
class SeederTenantData implements ShouldQueue
{
    use Queueable;

    /**
     * Crée une nouvelle instance du job.
     *
     * @param  Tenant  $tenant  Le tenant pour lequel les données doivent être amorcées.
     */
    public function __construct(protected Tenant $tenant) {}

    /**
     * Exécute le job.
     *
     * Lance la commande Artisan 'tenants:seed' pour le tenant.
     */
    public function handle(): void
    {
        Artisan::call('tenants:seed', [
            '--tenants' => [$this->tenant->id],
            '--class' => 'TenantDatabaseSeeder',
            '--force' => true,
            '--no-interaction' => true,
        ]);
    }
}
