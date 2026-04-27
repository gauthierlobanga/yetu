<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('activity_log') || Schema::hasColumn('activity_log', 'attribute_changes')) {
            return;
        }

        Schema::table('activity_log', function (Blueprint $table) {
            $table->jsonb('attribute_changes')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('activity_log') || ! Schema::hasColumn('activity_log', 'attribute_changes')) {
            return;
        }

        Schema::table('activity_log', function (Blueprint $table) {
            $table->dropColumn('attribute_changes');
        });
    }
};
