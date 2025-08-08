<?php

require_once 'vendor/autoload.php';

try {
    echo "Testing Google client initialization...\n";
    
    $client = new Google\Client();
    $client->setAuthConfig('public/credentials.json');
    
    echo "Google client initialized successfully!\n";
    
    // Test if we can access the spreadsheet
    $client->setScopes([Google\Service\Sheets::SPREADSHEETS]);
    $service = new Google\Service\Sheets($client);
    
    $spreadsheetId = '1KJbz08BhzwYH9vpFRGyrZWgqBoYWHEv8xcUU3NI0s4g';
    $spreadsheet = $service->spreadsheets->get($spreadsheetId);
    
    echo "Successfully connected to spreadsheet: " . $spreadsheet->getProperties()->getTitle() . "\n";
    
    $sheets = $spreadsheet->getSheets();
    echo "Found " . count($sheets) . " sheets:\n";
    foreach ($sheets as $sheet) {
        echo "- " . $sheet->getProperties()->getTitle() . " (ID: " . $sheet->getProperties()->getSheetId() . ")\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
