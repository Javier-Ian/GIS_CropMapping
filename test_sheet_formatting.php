<?php

require_once 'vendor/autoload.php';

try {
    echo "Testing Google Sheets service with new formatting...\n";
    
    // Test direct Google Sheets API without Laravel service
    $client = new Google\Client();
    $client->setAuthConfig('public/credentials.json');
    $client->setScopes([Google\Service\Sheets::SPREADSHEETS]);
    
    $service = new Google\Service\Sheets($client);
    $spreadsheetId = '1KJbz08BhzwYH9vpFRGyrZWgqBoYWHEv8xcUU3NI0s4g';
    
    // Test creating "Brgy. Salawagan" sheet if it doesn't exist
    $testSheetName = 'Brgy. Salawagan';
    
    echo "Checking if '$testSheetName' exists...\n";
    
    $spreadsheet = $service->spreadsheets->get($spreadsheetId);
    $sheets = $spreadsheet->getSheets();
    
    $sheetExists = false;
    $sheetId = null;
    
    foreach ($sheets as $sheet) {
        if ($sheet->getProperties()->getTitle() === $testSheetName) {
            $sheetExists = true;
            $sheetId = $sheet->getProperties()->getSheetId();
            break;
        }
    }
    
    if ($sheetExists) {
        echo "Sheet '$testSheetName' already exists (ID: $sheetId)\n";
    } else {
        echo "Creating new sheet '$testSheetName'...\n";
        
        // Create the sheet
        $requests = [
            new Google\Service\Sheets\Request([
                'addSheet' => [
                    'properties' => [
                        'title' => $testSheetName,
                        'gridProperties' => [
                            'rowCount' => 1000,
                            'columnCount' => 7
                        ]
                    ]
                ]
            ])
        ];

        $batchUpdateRequest = new Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
            'requests' => $requests
        ]);

        $response = $service->spreadsheets->batchUpdate($spreadsheetId, $batchUpdateRequest);
        $sheetId = $response->getReplies()[0]->getAddSheet()->getProperties()->getSheetId();
        
        echo "Created sheet with ID: $sheetId\n";
        echo "Now applying formatting...\n";
        
        // Add headers
        $headers = [
            ['Farm Owner', 'Farm Address', 'Crop', 'Date Planted', 'Date Harvested', 'Total Area', 'Total Yield']
        ];
        
        $body = new Google\Service\Sheets\ValueRange([
            'values' => $headers
        ]);
        
        $service->spreadsheets_values->update(
            $spreadsheetId,
            $testSheetName . '!A1:G1',
            $body,
            ['valueInputOption' => 'RAW']
        );
        
        echo "Headers added successfully!\n";
    }
    
    $url = "https://docs.google.com/spreadsheets/d/$spreadsheetId/edit#gid=$sheetId";
    echo "Sheet URL: $url\n";
    
    // List all current sheets
    echo "\nAll sheets in spreadsheet:\n";
    $spreadsheet = $service->spreadsheets->get($spreadsheetId);
    $sheets = $spreadsheet->getSheets();
    foreach ($sheets as $sheet) {
        echo "- " . $sheet->getProperties()->getTitle() . " (ID: " . $sheet->getProperties()->getSheetId() . ")\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
