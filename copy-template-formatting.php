<?php

require_once 'vendor/autoload.php';

use App\Services\GoogleSheetsService;

// Create the service
$sheetsService = new GoogleSheetsService();

echo "Copying template formatting from 'Brgy. Butong' to other sheets...\n";

// Copy to Brgy. San Jose
echo "Processing Brgy. San Jose...\n";
$result1 = $sheetsService->copyFormattingFromTemplate('Brgy. San Jose', 'Brgy. Butong');
echo $result1 ? "✅ Successfully copied to Brgy. San Jose\n" : "❌ Failed to copy to Brgy. San Jose\n";

// Copy to Brgy. Salawagan
echo "Processing Brgy. Salawagan...\n";
$result2 = $sheetsService->copyFormattingFromTemplate('Brgy. Salawagan', 'Brgy. Butong');
echo $result2 ? "✅ Successfully copied to Brgy. Salawagan\n" : "❌ Failed to copy to Brgy. Salawagan\n";

echo "\n🎉 Template formatting copy completed!\n";
echo "All sheets should now match the 'Brgy. Butong' design.\n";
