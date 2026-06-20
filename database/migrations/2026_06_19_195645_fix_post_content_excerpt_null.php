<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('posts')
            ->whereNull('content')
            ->orWhere('content', '')
            ->update(['content' => '{"type":"doc","content":[]}']);

        DB::table('posts')
            ->whereNull('excerpt')
            ->orWhere('excerpt', '')
            ->update(['excerpt' => '{"type":"doc","content":[]}']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
