<?php

namespace App\Listeners;

/**
 * Met à jour la date et l'heure de la dernière connexion de l'utilisateur.
 *
 * Ce listener est destiné à écouter les événements de connexion
 * afin de garder une trace du dernier accès au compte de l'utilisateur.
 */
class UpdateLastLogin
{
    /**
     * Crée une nouvelle instance du listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Gère l'événement de connexion.
     *
     * @param  object  $event  L'événement générique.
     */
    public function handle(object $event): void
    {
        //
    }
}
