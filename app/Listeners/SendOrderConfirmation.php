<?php

namespace App\Listeners;

use App\Events\OrderCreated;

/**
 * Envoie un email de confirmation de commande au client.
 *
 * Ce listener écoute l'événement de création de commande (OrderCreated)
 * et devrait déclencher l'envoi de la notification de confirmation correspondante.
 */
class SendOrderConfirmation
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
