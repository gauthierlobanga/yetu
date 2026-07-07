<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Supprimer l'ancienne contrainte
        DB::statement('ALTER TABLE commandes DROP CONSTRAINT IF EXISTS commandes_statut_check');

        // Recréer la contrainte avec les valeurs existantes + les nouvelles
        DB::statement("
            ALTER TABLE commandes
            ADD CONSTRAINT commandes_statut_check
            CHECK (statut IN (
                'en_attente',
                'payee',
                'en_preparation',
                'expediee',
                'livree',
                'annulee',
                'remboursee',
                'echec_paiement',
                'termine',
                'en_cours',
                'rejete'
            ))
        ");
    }

    public function down()
    {
        // En cas de rollback, restaurer la contrainte sans les nouvelles valeurs
        DB::statement('ALTER TABLE commandes DROP CONSTRAINT IF EXISTS commandes_statut_check');
        DB::statement("
            ALTER TABLE commandes
            ADD CONSTRAINT commandes_statut_check
            CHECK (statut IN (
                'en_attente',
                'payee',
                'en_preparation',
                'expediee',
                'livree',
                'annulee',
                'remboursee',
                'echec_paiement'
            ))
        ");
    }
};
