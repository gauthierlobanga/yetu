<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('produits', 'search_document')) {
            Schema::table('produits', function (Blueprint $table) {
                $table->text('search_document')->nullable()->after('expires_at');
                $table->jsonb('image_search_metadata')->nullable()->after('search_document');
                $table->timestamp('search_embedding_synced_at')->nullable()->after('image_search_metadata');
            });
        }

        if (DB::getDriverName() !== 'pgsql') {
            return;
        }

        DB::statement('create extension if not exists vector');

        if (! Schema::hasColumn('produits', 'search_embedding')) {
            DB::statement('alter table produits add column search_embedding vector(1536)');
            DB::statement('create index if not exists produits_search_embedding_idx on produits using ivfflat (search_embedding vector_cosine_ops) with (lists = 100)');
        }

        DB::statement("
            update produits
            set search_document = trim(
                concat_ws(
                    ' ',
                    nom,
                    reference,
                    sku,
                    ean,
                    short_description,
                    description_longue
                )
            )
            where search_document is null
        ");
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql' && Schema::hasColumn('produits', 'search_embedding')) {
            DB::statement('drop index if exists produits_search_embedding_idx');
            DB::statement('alter table produits drop column if exists search_embedding');
        }

        Schema::table('produits', function (Blueprint $table) {
            if (Schema::hasColumn('produits', 'search_embedding_synced_at')) {
                $table->dropColumn('search_embedding_synced_at');
            }

            if (Schema::hasColumn('produits', 'image_search_metadata')) {
                $table->dropColumn('image_search_metadata');
            }

            if (Schema::hasColumn('produits', 'search_document')) {
                $table->dropColumn('search_document');
            }
        });
    }
};
