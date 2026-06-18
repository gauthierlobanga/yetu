<?php

namespace App\Listeners;

use App\Events\VendorProfileUpdated;
use Illuminate\Support\Facades\DB;

/**
 * Synchronise les informations du vendeur vers la base de données centrale.
 *
 * Similaire à SyncCentralUserProfile, ce listener écoute les mises à jour
 * de profil et applique les changements (nom, email, mot de passe, avatar)
 * sur la connexion de la base de données centrale.
 */
class SyncVendorToCentral
{
    /**
     * Gère l'événement de mise à jour du profil.
     *
     * @param  VendorProfileUpdated  $event  L'événement contenant les informations modifiées.
     */
    public function handle(VendorProfileUpdated $event): void
    {
        $user = $event->user;
        $centralConnection = config('tenancy.database.central_connection', config('database.default'));

        $updateData = [];

        if (isset($event->changes['name'])) {
            $updateData['name'] = $user->name;
        }
        if (isset($event->changes['email'])) {
            $updateData['email'] = $user->email;
            $updateData['email_verified_at'] = null;
        }
        if (isset($event->changes['password'])) {
            $updateData['password'] = $user->password; // déjà hashé
        }
        if (isset($event->changes['avatar'])) {
            $updateData['avatar'] = $user->avatar;
        }

        if (! empty($updateData)) {
            DB::connection($centralConnection)
                ->table('users')
                ->where('id', $user->id)
                ->update($updateData);
        }
    }
}
