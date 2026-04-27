<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    // /**
    //  * Run the migrations.
    //  */
    // public function up(): void
    // {
    //     // 1. Ajouter la colonne 'id' temporairement nullable
    //     Schema::table('user_tenant', function (Blueprint $table) {
    //         $table->uuid('id')->after('user_id');
    //     });

    //     // 2. Remplir les valeurs NULL avec un UUID généré pour chaque ligne existante
    //     DB::table('user_tenant')->orderBy('tenant_id')->each(function ($row) {
    //         DB::table('user_tenant')
    //             ->where('tenant_id', $row->tenant_id)
    //             ->where('user_id', $row->user_id)
    //             ->update(['id' => (string) Str::orderedUuid()]);
    //     });

    //     // 4. Supprimer l'ancienne clé primaire composite (si elle existe)
    //     // Le nom par défaut peut être 'user_tenant_pkey', on le tente
    //     try {
    //         DB::statement('ALTER TABLE user_tenant DROP CONSTRAINT IF EXISTS user_tenant_pkey');
    //     } catch (Exception $e) {
    //         // déjà supprimée ou inexistante
    //     }

    //     // 5. Ajouter une contrainte unique pour éviter les doublons de liaison
    //     Schema::table('user_tenant', function (Blueprint $table) {
    //         $table->unique(['tenant_id', 'user_id']);
    //     });
    // }

    // /**
    //  * Reverse the migrations.
    //  */
    // public function down(): void
    // {
    //     Schema::table('user_tenant', function (Blueprint $table) {
    //         $table->dropPrimary('user_tenant_pkey');
    //         $table->dropUnique(['tenant_id', 'user_id']);
    //         $table->dropColumn('id');
    //         $table->primary(['tenant_id', 'user_id']);
    //     });
    // }
};
