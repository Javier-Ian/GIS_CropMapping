<?php

use App\Http\Controllers\MapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $maps = \App\Models\Map::with('user') // Load user relationship
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
    Route::get('maps/{map}', [MapController::class, 'show'])->name('maps.show');
    Route::get('maps/{map}/edit', [MapController::class, 'edit'])->name('maps.edit');
    Route::put('maps/{map}', [MapController::class, 'update'])->name('maps.update');
    Route::delete('maps/{map}', [MapController::class, 'destroy'])->name('maps.destroy');
    Route::get('maps/{map}/download', [MapController::class, 'download'])->name('maps.download');
    
    // Ultra-Unique Notification Test Route
    Route::get('notification-test', function () {
        return Inertia::render('notification-test');
    })->name('notification.test');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
