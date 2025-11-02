<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BrgySalawaganCrop extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'place',
        'crop',
        'planting_date',
        'harvest_date',
        'total_area',
        'total_yield',
        'sheet_row_index',
        'synced_at',
        'synced_by',
    ];

    protected $casts = [
        'synced_at' => 'datetime',
    ];

    /**
     * Get the user that owns the crop data
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the barangay name for this model
     */
    public static function getBarangayName(): string
    {
        return 'Brgy. Salawagan';
    }

    /**
     * Get the sheet name for this model
     */
    public static function getSheetName(): string
    {
        return 'Brgy. Salawagan';
    }
}
