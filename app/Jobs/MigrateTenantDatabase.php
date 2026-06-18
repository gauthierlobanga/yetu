<?php

namespace App\Jobs;

use App\Models\Tenant;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Artisan;

/**
 * Job responsable de la migration de la base de données d'un tenant.
 *
 * Ce job s'assure que les tables nécessaires sont créées dans la base de données
 * dédiée au tenant fraîchement créé.
 */
class MigrateTenantDatabase implements ShouldQueue
{
    use Queueable;

    /**
     * Crée une nouvelle instance du job.
     *
     * @param  Tenant  $tenant  Le tenant dont la base de données doit être migrée.
     */
    public function __construct(protected Tenant $tenant) {}

    /**
     * Exécute le job.
     *
     * Lance la commande Artisan 'tenants:migrate' pour le tenant spécifique.
     */
    public function handle(): void
    {
        Artisan::call('tenants:migrate', [
            '--tenants' => [$this->tenant->id],
            '--force' => true,
            '--no-interaction' => true,
        ]);
    }
}
