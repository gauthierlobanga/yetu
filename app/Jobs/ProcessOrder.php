<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

/**
 * Job responsable du traitement d'une commande.
 *
 * Ce job gère les opérations liées à la validation et à l'exécution d'une commande.
 */
class ProcessOrder implements ShouldQueue
{
    use Queueable;

    /**
     * Crée une nouvelle instance du job.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Exécute le job.
     */
    public function handle(): void
    {
        //
    }
}
