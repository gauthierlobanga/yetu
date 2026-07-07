<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('commandes', function (Blueprint $table) {
            $table->uuid('adresse_facturation_id')->nullable()->change();
        });

        Schema::table('ligne_commandes', function (Blueprint $table) {
            $table->uuid('variante_produit_id')->nullable()->change();
        });

        // Supprimer l'ancienne contrainte
        DB::statement('ALTER TABLE paiements DROP CONSTRAINT paiements_mode_check');

        // Recréer avec la valeur 'cash' incluse
        DB::statement("
            ALTER TABLE paiements
            ADD CONSTRAINT paiements_mode_check
            CHECK (mode IN ('carte', 'mobile_money', 'especes', 'virement', 'paypal', 'cheque', 'crypto', 'cash'))
        ");
    }

    public function down()
    {
        Schema::table('commandes', function (Blueprint $table) {
            $table->uuid('adresse_facturation_id')->nullable(false)->change();
        });

        Schema::table('ligne_commandes', function (Blueprint $table) {
            $table->uuid('variante_produit_id')->nullable(false)->change();
        });

        DB::statement('ALTER TABLE paiements DROP CONSTRAINT paiements_mode_check');
        DB::statement("
            ALTER TABLE paiements
            ADD CONSTRAINT paiements_mode_check
            CHECK (mode IN ('carte', 'mobile_money', 'especes', 'virement', 'paypal', 'cheque', 'crypto'))
        ");
    }
};
