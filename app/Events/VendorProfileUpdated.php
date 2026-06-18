<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Foundation\Events\Dispatchable;

/**
 * Événement déclenché lors de la mise à jour du profil d'un vendeur.
 *
 * Contient les modifications apportées pour d'éventuels audits ou notifications.
 */
class VendorProfileUpdated
{
    use Dispatchable;

    public User $user;

    public array $changes;

    /**
     * Crée une nouvelle instance de l'événement.
     *
     * @param  User  $user  L'utilisateur (vendeur) dont le profil a été mis à jour.
     * @param  array  $changes  Le tableau associatif des modifications effectuées.
     */
    public function __construct(User $user, array $changes)
    {
        $this->user = $user;
        $this->changes = $changes;
    }
}
