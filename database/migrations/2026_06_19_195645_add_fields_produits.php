<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('produits', 'image_search_metadata')) {
            $dimension = (int) config('services.embedding.dimensions', 1536);
            DB::statement("ALTER TABLE produits ADD COLUMN image_search_metadata public.vector({$dimension}) NULL");
        }

        Schema::table('produits', function (Blueprint $table) {

            if (! Schema::hasColumn('produits', 'search_embedding_synced_at')) {
                $table->timestamp('search_embedding_synced_at')->nullable();
            }

            if (! Schema::hasColumn('produits', 'search_document')) {
                $table->text('search_document')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('produits', function (Blueprint $table) {
            $table->dropColumn([
                'image_search_metadata',
                'search_embedding_synced_at',
                'search_document',
            ]);
        });
    }
};
