<?php

namespace App\Jobs;

use App\Models\Tenant;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Artisan;

/**
 * Job responsable de la génération des permissions pour un tenant.
 *
 * Ce job exécute la commande Artisan de Filament Shield pour générer
 * l'ensemble des permissions nécessaires pour le panel vendeur du tenant.
 */
class GenerateTenantPermissions implements ShouldQueue
{
    use Queueable;

    /**
     * Crée une nouvelle instance du job.
     *
     * @param  Tenant  $tenant  Le tenant pour lequel les permissions doivent être générées.
     */
    public function __construct(protected Tenant $tenant) {}

    /**
     * Exécute le job.
     *
     * Lance la commande Artisan 'shield:generate' dans le contexte du tenant.
     */
    public function handle(): void
    {
        $this->tenant->run(function () {
            Artisan::call('shield:generate', [
                '--all' => true,
                '--option' => 'permissions',
                '--panel' => 'vendeur',
                '--no-interaction' => true,
            ]);
        });
    }
}
