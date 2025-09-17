<?php
require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$maps = \App\Models\Map::whereNotNull('map_image_path')->get(['id', 'title', 'map_image_path']);

echo "Maps with images:\n";
foreach($maps as $map) {
    echo $map->id . ': ' . $map->title . ' -> ' . $map->map_image_path . "\n";
}

echo "\nTotal maps with images: " . $maps->count() . "\n";

// Test URL generation
if($maps->count() > 0) {
    $firstMap = $maps->first();
    $url = \Illuminate\Support\Facades\Storage::url($firstMap->map_image_path);
    echo "Sample URL: " . $url . "\n";
}