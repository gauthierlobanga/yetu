<?php

namespace App\Listeners;

use App\Events\VendorProfileUpdated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Synchronise les mises à jour du profil vendeur vers la base de données centrale.
 *
 * Ce listener est déclenché lorsqu'un vendeur met à jour son profil depuis
 * l'espace tenant. Il s'assure que les modifications (nom, email, mot de passe, avatar)
 * sont répercutées dans la table "users" de la base de données centrale.
 */
class SyncCentralUserProfile
{
    /**
     * Gère l'événement de mise à jour du profil.
     *
     * @param  VendorProfileUpdated  $event  L'événement contenant l'utilisateur et les champs modifiés.
     */
    public function handle(VendorProfileUpdated $event): void
    {
        $user = $event->user;
        $changes = $event->changes;

        // Ne s'exécute que dans le contexte tenant
        if (! function_exists('tenancy') || ! tenancy()->initialized) {
            return;
        }

        $centralConnection = config('tenancy.database.central_connection', config('database.default'));
        $updateData = [];

        if (isset($changes['name'])) {
            $updateData['name'] = $user->name;
        }
        if (isset($changes['email'])) {
            $updateData['email'] = $user->email;
            $updateData['email_verified_at'] = null;
            if (Schema::connection($centralConnection)->hasColumn('users', 'email_verifie')) {
                $updateData['email_verifie'] = false;
            }
        }
        if (isset($changes['password'])) {
            $updateData['password'] = $user->password;
        }
        if (isset($changes['avatar'])) {
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
