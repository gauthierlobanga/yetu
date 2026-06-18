<?php

namespace App\Listeners;

use App\Events\OrderCreated;

/**
 * Met à jour l'inventaire après la création d'une commande.
 *
 * Ce listener écoute l'événement OrderCreated pour déduire
 * les quantités de produits achetés de l'inventaire de la boutique.
 */
class UpdateInventory
{
    /**
     * Crée une nouvelle instance du listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Gère l'événement de création de commande.
     *
     * @param  OrderCreated  $event  L'événement contenant la commande nouvellement créée.
     */
    public function handle(OrderCreated $event): void
    {
        //
    }
}
