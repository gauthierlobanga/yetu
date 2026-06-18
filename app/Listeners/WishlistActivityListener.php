<?php

namespace App\Listeners;

use App\Events\WishlistActivity;

/**
 * Gère l'activité liée à la liste de souhaits.
 *
 * Ce listener écoute l'événement WishlistActivity pour effectuer
 * des actions supplémentaires lors de l'ajout ou du retrait d'articles.
 */
class WishlistActivityListener
{
    /**
     * Crée une nouvelle instance du listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Gère l'événement d'activité de la liste de souhaits.
     *
     * @param  WishlistActivity  $event  L'événement lié à la liste de souhaits.
     */
    public function handle(WishlistActivity $event): void
    {
        //
    }
}
