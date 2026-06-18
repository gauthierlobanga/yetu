<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

/**
 * Job responsable de l'envoi des emails liés aux commandes.
 *
 * Ce job s'exécute en arrière-plan pour envoyer les confirmations de commande,
 * les mises à jour de statut, ou les reçus aux clients sans ralentir l'application.
 */
class SendOrderEmail implements ShouldQueue
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
     *
     * Prépare et envoie l'email au destinataire configuré.
     */
    public function handle(): void
    {
        //
    }
}
