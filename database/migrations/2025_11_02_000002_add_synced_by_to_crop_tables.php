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
        // Add synced_by to brgy_butong_crops
        Schema::table('brgy_butong_crops', function (Blueprint $table) {
            $table->string('synced_by')->nullable()->after('synced_at');
        });

        // Add synced_by to brgy_salawagan_crops
        Schema::table('brgy_salawagan_crops', function (Blueprint $table) {
            $table->string('synced_by')->nullable()->after('synced_at');
        });

        // Add synced_by to brgy_san_jose_crops
        Schema::table('brgy_san_jose_crops', function (Blueprint $table) {
            $table->string('synced_by')->nullable()->after('synced_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('brgy_butong_crops', function (Blueprint $table) {
            $table->dropColumn('synced_by');
        });

        Schema::table('brgy_salawagan_crops', function (Blueprint $table) {
            $table->dropColumn('synced_by');
        });

        Schema::table('brgy_san_jose_crops', function (Blueprint $table) {
            $table->dropColumn('synced_by');
        });
    }
};
