<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

/**
 * Job responsable de la génération d'une facture.
 *
 * Ce job traite la création de factures en arrière-plan.
 */
class GenerateInvoice implements ShouldQueue
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
