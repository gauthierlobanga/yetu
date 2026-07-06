<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('produits', 'search_embedding')) {
            $dimension = (int) config('services.embedding.dimensions', 1536);
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE produits ADD COLUMN search_embedding public.vector({$dimension}) NULL");
        }
    }

    public function down(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            $table->dropColumn('search_embedding');
        });
    }
};
