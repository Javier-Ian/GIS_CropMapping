<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrgyButongCrop extends Model
{
    protected $fillable = [
        'name',
        'place',
        'crop',
        'planting_date',
        'harvest_date',
        'total_area',
        'total_yield',
        'sheet_row_index',
        'synced_at',
    ];

    protected $casts = [
        'synced_at' => 'datetime',
    ];

    /**
     * Get the barangay name for this model
     */
    public static function getBarangayName(): string
    {
        return 'Brgy. Butong';
    }

    /**
     * Get the sheet name for this model
     */
    public static function getSheetName(): string
    {
        return 'Brgy. Butong';
    }
}
