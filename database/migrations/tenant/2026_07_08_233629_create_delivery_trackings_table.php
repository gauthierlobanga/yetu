<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_trackings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('commande_id')->constrained('commandes')->onDelete('cascade');
            $table->string('tracking_number')->unique();
            $table->string('carrier')->nullable();
            $table->string('status')->default('pending');
            $table->json('current_location')->nullable();
            $table->json('route_geometry')->nullable();
            $table->timestamp('estimated_delivery_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_trackings');
    }
};
