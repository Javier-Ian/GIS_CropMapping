<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GoogleSheetsService;

class FixSheetColors extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sheets:fix-colors';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix blue headers to green headers for all barangay sheets';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Fixing header colors from blue to green for all barangay sheets...');
        
        $sheetsService = new GoogleSheetsService();
        
        // Get all existing sheets first
        try {
            $spreadsheet = $sheetsService->service->spreadsheets->get($sheetsService->spreadsheetId);
            $sheets = $spreadsheet->getSheets();
            
            foreach ($sheets as $sheet) {
                $sheetTitle = $sheet->getProperties()->getTitle();
                
                // Only process barangay sheets
                if (strpos($sheetTitle, 'Brgy.') === 0) {
                    $this->info("Processing {$sheetTitle}...");
                    
                    // Apply green header formatting
                    $result = $this->applyGreenHeaders($sheetsService, $sheetTitle);
                    
                    if ($result) {
                        $this->info("✅ Fixed headers for {$sheetTitle}");
                    } else {
                        $this->error("❌ Failed to fix headers for {$sheetTitle}");
                    }
                }
            }
            
        } catch (\Exception $e) {
            $this->error('Error fetching sheets: ' . $e->getMessage());
            return 1;
        }

        $this->info('🎉 Header color fix completed!');
        $this->info('All barangay sheets now have green headers.');
        
        return 0;
    }
    
    private function applyGreenHeaders($sheetsService, $sheetName)
    {
        try {
            $sheetId = $sheetsService->getSheetIdByName($sheetName);
            if (!$sheetId) {
                $this->error("Sheet not found: {$sheetName}");
                return false;
            }

            // Apply green header formatting
            $requests = [
                new \Google\Service\Sheets\Request([
                    'repeatCell' => [
                        'range' => [
                            'sheetId' => $sheetId,
                            'startRowIndex' => 0,
                            'endRowIndex' => 1,
                            'startColumnIndex' => 0,
                            'endColumnIndex' => 7
                        ],
                        'cell' => [
                            'userEnteredFormat' => [
                                'textFormat' => [
                                    'bold' => true,
                                    'foregroundColor' => [
                                        'red' => 1.0,
                                        'green' => 1.0,
                                        'blue' => 1.0
                                    ]
                                ],
                                'backgroundColor' => [
                                    'red' => 0.2,
                                    'green' => 0.5,
                                    'blue' => 0.3
                                ],
                                'horizontalAlignment' => 'CENTER',
                                'verticalAlignment' => 'MIDDLE',
                                'borders' => [
                                    'top' => ['style' => 'SOLID', 'width' => 1],
                                    'bottom' => ['style' => 'SOLID', 'width' => 1],
                                    'left' => ['style' => 'SOLID', 'width' => 1],
                                    'right' => ['style' => 'SOLID', 'width' => 1]
                                ]
                            ]
                        ],
                        'fields' => 'userEnteredFormat'
                    ]
                ])
            ];

            $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
                'requests' => $requests
            ]);

            $sheetsService->service->spreadsheets->batchUpdate($sheetsService->spreadsheetId, $batchUpdateRequest);
            
            return true;
            
        } catch (\Exception $e) {
            $this->error("Error fixing headers for {$sheetName}: " . $e->getMessage());
            return false;
        }
    }
}
