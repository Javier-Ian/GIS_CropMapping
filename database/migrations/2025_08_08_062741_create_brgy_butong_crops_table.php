<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('brgy_butong_crops', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('place')->nullable();
            $table->string('crop')->nullable();
            $table->string('planting_date')->nullable();
            $table->string('harvest_date')->nullable();
            $table->string('total_area')->nullable();
            $table->string('total_yield')->nullable();
            $table->integer('sheet_row_index')->nullable(); // Track which row in Google Sheets
            $table->timestamp('synced_at')->nullable(); // When last synced from sheets
            $table->timestamps();
            
            // Add index for faster lookups
            $table->index('sheet_row_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('brgy_butong_crops');
    }
};
