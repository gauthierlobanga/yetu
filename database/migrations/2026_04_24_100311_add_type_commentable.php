<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // public function up(): void
    // {
    //     Schema::create('commentable', function (Blueprint $table) {
    //         $table->foreignUuid('comment_id')->constrained()->cascadeOnDelete();
    //         $table->uuidMorphs('commentable');
    //         $table->unique(['comment_id', 'commentable_id', 'commentable_type']);
    //     });
    // }

    // public function down(): void
    // {
    //     Schema::dropIfExists('commentable');
    // }
};
