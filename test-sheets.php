<?php

require_once 'vendor/autoload.php';
require_once 'bootstrap/app.php';

use App\Services\GoogleSheetsService;

echo "Testing GoogleSheetsService...\n";

try {
    $service = new GoogleSheetsService();
    echo "✅ GoogleSheetsService created successfully\n";
    
    // Test a simple method
    $url = $service->getSheetUrlForBarangay('Butong');
    if ($url) {
        echo "✅ getSheetUrlForBarangay works: $url\n";
    } else {
        echo "❌ getSheetUrlForBarangay failed\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
