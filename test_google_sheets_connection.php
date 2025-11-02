<?php

/**
 * Google Sheets Connection Diagnostic Script
 * 
 * Run this script to test your Google Sheets credentials
 * Usage: php test_google_sheets_connection.php
 */

// Bootstrap Laravel
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Services\GoogleSheetsService;

echo "\n";
echo "==========================================\n";
echo "  Google Sheets Connection Diagnostic\n";
echo "==========================================\n\n";

// Test 1: Check if credentials file exists
echo "Test 1: Checking credentials file...\n";
$credentialsPath = __DIR__ . '/public/credentials.json';
if (file_exists($credentialsPath)) {
    echo "✓ Credentials file found at: $credentialsPath\n";
    
    // Check file permissions
    if (is_readable($credentialsPath)) {
        echo "✓ Credentials file is readable\n";
    } else {
        echo "✗ ERROR: Credentials file is not readable\n";
        exit(1);
    }
    
    // Check file content
    $credentials = json_decode(file_get_contents($credentialsPath), true);
    if ($credentials) {
        echo "✓ Credentials file contains valid JSON\n";
        
        if (isset($credentials['client_email'])) {
            echo "✓ Service account email: " . $credentials['client_email'] . "\n";
        } else {
            echo "✗ ERROR: Missing client_email in credentials\n";
        }
        
        if (isset($credentials['private_key'])) {
            echo "✓ Private key present\n";
        } else {
            echo "✗ ERROR: Missing private_key in credentials\n";
        }
    } else {
        echo "✗ ERROR: Credentials file contains invalid JSON\n";
        exit(1);
    }
} else {
    echo "✗ ERROR: Credentials file not found at: $credentialsPath\n";
    echo "   Please create credentials.json in the public directory\n";
    exit(1);
}

echo "\n";

// Test 2: Initialize Google Sheets Service
echo "Test 2: Initializing Google Sheets Service...\n";
try {
    $service = new GoogleSheetsService();
    echo "✓ Google Sheets Service initialized successfully\n";
} catch (\Exception $e) {
    echo "✗ ERROR: Failed to initialize service\n";
    echo "   Error: " . $e->getMessage() . "\n";
    exit(1);
}

echo "\n";

// Test 3: Test connection for each barangay
$barangays = ['Butong', 'Salawagan', 'San Jose'];
echo "Test 3: Testing Google Sheets access for barangays...\n";

foreach ($barangays as $barangay) {
    echo "\nTesting Brgy. $barangay...\n";
    try {
        $url = $service->getSheetUrlForBarangay($barangay);
        
        if ($url) {
            echo "✓ Successfully got URL for Brgy. $barangay\n";
            echo "  URL: $url\n";
        } else {
            echo "✗ Failed to get URL for Brgy. $barangay (returned null)\n";
        }
    } catch (\Exception $e) {
        echo "✗ ERROR for Brgy. $barangay\n";
        echo "  Error: " . $e->getMessage() . "\n";
        
        // Check if it's an authentication error
        if (strpos($e->getMessage(), 'invalid_grant') !== false || 
            strpos($e->getMessage(), 'JWT') !== false) {
            echo "\n";
            echo "  This is an AUTHENTICATION ERROR!\n";
            echo "  The credentials have expired or are invalid.\n";
            echo "  Please follow the guide in GOOGLE_SHEETS_AUTH_FIX.md\n";
        }
    }
}

echo "\n";
echo "==========================================\n";
echo "  Diagnostic Complete\n";
echo "==========================================\n\n";

// Summary
echo "Summary:\n";
echo "--------\n";
echo "If you see authentication errors above:\n";
echo "  1. Read GOOGLE_SHEETS_AUTH_FIX.md for detailed instructions\n";
echo "  2. Generate a new service account key from Google Cloud Console\n";
echo "  3. Replace public/credentials.json with the new key\n";
echo "  4. Share the spreadsheet with the service account email\n";
echo "  5. Run this script again to verify\n";
echo "\n";
echo "If all tests passed:\n";
echo "  ✓ Your Google Sheets connection is working!\n";
echo "  ✓ Try accessing the redirect buttons in the application\n";
echo "\n";
