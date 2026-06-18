<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Événement déclenché lors d'une activité visiteur sur un tenant (boutique).
 *
 * Diffuse l'activité en temps réel vers le tableau de bord du vendeur.
 */
class VisitorActivity implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $data;

    /**
     * Crée une nouvelle instance de l'événement.
     *
     * @param  mixed  $data  Les données relatives à l'activité du visiteur (inclut le tenant_id).
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Détermine les canaux sur lesquels l'événement doit être diffusé.
     *
     * @return Channel
     */
    public function broadcastOn()
    {
        return new Channel('tenant.'.$this->data['tenant_id']);
    }
}
