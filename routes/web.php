<?php

use App\Http\Controllers\MapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $maps = \App\Models\Map::where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(function ($map) {
                if ($map->map_image_path) {
                    $map->map_image_url = \Illuminate\Support\Facades\Storage::url($map->map_image_path);
                }
                return $map;
            });

        return Inertia::render('dashboard', [
            'maps' => $maps
        ]);
    })->name('dashboard');

    // Map routes
    Route::get('maps/upload', [MapController::class, 'upload'])->name('maps.upload');
    Route::post('maps', [MapController::class, 'store'])->name('maps.store');
    Route::get('maps', [MapController::class, 'index'])->name('maps.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
