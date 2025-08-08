<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GoogleSheetsService;

class ClearBlueFormatting extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sheets:clear-blue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Completely remove all blue formatting from sheets and apply clean green template';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Removing ALL blue formatting from barangay sheets...');
        
        $sheetsService = new GoogleSheetsService();
        
        // Get all existing sheets first
        try {
            $spreadsheet = $sheetsService->service->spreadsheets->get($sheetsService->spreadsheetId);
            $sheets = $spreadsheet->getSheets();
            
            foreach ($sheets as $sheet) {
                $sheetTitle = $sheet->getProperties()->getTitle();
                
                // Only process barangay sheets
                if (strpos($sheetTitle, 'Brgy.') === 0) {
                    $this->info("Cleaning {$sheetTitle}...");
                    
                    // Complete cleanup and reformat
                    $result = $this->completeSheetCleanup($sheetsService, $sheetTitle);
                    
                    if ($result) {
                        $this->info("✅ Completely cleaned and reformatted {$sheetTitle}");
                    } else {
                        $this->error("❌ Failed to clean {$sheetTitle}");
                    }
                }
            }
            
        } catch (\Exception $e) {
            $this->error('Error processing sheets: ' . $e->getMessage());
            return 1;
        }

        $this->info('🎉 Complete cleanup finished!');
        $this->info('All sheets are now clean with consistent green formatting.');
        
        return 0;
    }
    
    private function completeSheetCleanup($sheetsService, $sheetName)
    {
        try {
            $sheetId = $sheetsService->getSheetIdByName($sheetName);
            if (!$sheetId) {
                $this->error("Sheet not found: {$sheetName}");
                return false;
            }

            // Step 1: Remove all existing banding and conditional formatting
            $this->removeAllBandingAndConditionalFormatting($sheetsService, $sheetId);
            
            // Step 2: Clear ALL formatting from the entire sheet
            $this->clearAllFormatting($sheetsService, $sheetId);
            
            // Step 3: Clear all data except headers
            $this->clearDataButKeepHeaders($sheetsService, $sheetName);
            
            // Step 4: Apply fresh green header formatting
            $this->applyCleanGreenHeaders($sheetsService, $sheetId);
            
            // Step 5: Apply clean alternating row formatting (white/light gray only)
            $this->applyCleanRowFormatting($sheetsService, $sheetId);
            
            // Step 6: Add borders and basic styling
            $this->applyBasicStyling($sheetsService, $sheetId);
            
            return true;
            
        } catch (\Exception $e) {
            $this->error("Error cleaning {$sheetName}: " . $e->getMessage());
            return false;
        }
    }
    
    private function removeAllBandingAndConditionalFormatting($sheetsService, $sheetId)
    {
        try {
            // Get current sheet data to find existing banding
            $spreadsheet = $sheetsService->service->spreadsheets->get($sheetsService->spreadsheetId);
            $sheets = $spreadsheet->getSheets();
            
            $targetSheet = null;
            foreach ($sheets as $sheet) {
                if ($sheet->getProperties()->getSheetId() === $sheetId) {
                    $targetSheet = $sheet;
                    break;
                }
            }
            
            if (!$targetSheet) {
                return;
            }
            
            $requests = [];
            
            // Remove all banded ranges
            $bandedRanges = $targetSheet->getBandedRanges();
            if ($bandedRanges) {
                foreach ($bandedRanges as $bandedRange) {
                    $requests[] = new \Google\Service\Sheets\Request([
                        'deleteBanding' => [
                            'bandedRangeId' => $bandedRange->getBandedRangeId()
                        ]
                    ]);
                }
            }
            
            // Remove all conditional formatting rules
            $conditionalFormats = $targetSheet->getConditionalFormats();
            if ($conditionalFormats) {
                foreach ($conditionalFormats as $index => $format) {
                    $requests[] = new \Google\Service\Sheets\Request([
                        'deleteConditionalFormatRule' => [
                            'sheetId' => $sheetId,
                            'index' => $index
                        ]
                    ]);
                }
            }
            
            if (!empty($requests)) {
                $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
                    'requests' => $requests
                ]);

                $sheetsService->service->spreadsheets->batchUpdate($sheetsService->spreadsheetId, $batchUpdateRequest);
            }
            
        } catch (\Exception $e) {
            $this->warn("Could not remove existing formatting: " . $e->getMessage());
            // Continue anyway
        }
    }
    
    private function clearAllFormatting($sheetsService, $sheetId)
    {
        $requests = [
            // Clear ALL formatting from the entire sheet
            new \Google\Service\Sheets\Request([
                'repeatCell' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'startRowIndex' => 0,
                        'endRowIndex' => 1000,
                        'startColumnIndex' => 0,
                        'endColumnIndex' => 10
                    ],
                    'cell' => [
                        'userEnteredFormat' => []
                    ],
                    'fields' => 'userEnteredFormat'
                ]
            ])
        ];

        $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
            'requests' => $requests
        ]);

        $sheetsService->service->spreadsheets->batchUpdate($sheetsService->spreadsheetId, $batchUpdateRequest);
    }
    
    private function clearDataButKeepHeaders($sheetsService, $sheetName)
    {
        // Clear everything from row 2 onwards, keep only headers
        $range = $sheetName . '!A2:Z1000';
        
        $body = new \Google\Service\Sheets\ValueRange([
            'values' => [[]] // Empty array to clear content
        ]);
        
        $sheetsService->service->spreadsheets_values->clear(
            $sheetsService->spreadsheetId,
            $range,
            new \Google\Service\Sheets\ClearValuesRequest()
        );
    }
    
    private function applyCleanGreenHeaders($sheetsService, $sheetId)
    {
        $requests = [
            // Apply ONLY green header formatting
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
                            'verticalAlignment' => 'MIDDLE'
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
    }
    
    private function applyCleanRowFormatting($sheetsService, $sheetId)
    {
        // Remove any existing banding first
        $requests = [
            // Apply simple alternating rows (white and very light gray only)
            new \Google\Service\Sheets\Request([
                'addBanding' => [
                    'bandedRange' => [
                        'range' => [
                            'sheetId' => $sheetId,
                            'startRowIndex' => 1,
                            'endRowIndex' => 1000,
                            'startColumnIndex' => 0,
                            'endColumnIndex' => 7
                        ],
                        'rowProperties' => [
                            'firstBandColor' => [
                                'red' => 1.0,
                                'green' => 1.0,
                                'blue' => 1.0
                            ],
                            'secondBandColor' => [
                                'red' => 0.98,
                                'green' => 0.98,
                                'blue' => 0.98
                            ]
                        ]
                    ]
                ]
            ])
        ];

        $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
            'requests' => $requests
        ]);

        $sheetsService->service->spreadsheets->batchUpdate($sheetsService->spreadsheetId, $batchUpdateRequest);
    }
    
    private function applyBasicStyling($sheetsService, $sheetId)
    {
        $requests = [
            // Add basic filter
            new \Google\Service\Sheets\Request([
                'setBasicFilter' => [
                    'filter' => [
                        'range' => [
                            'sheetId' => $sheetId,
                            'startRowIndex' => 0,
                            'endRowIndex' => 1000,
                            'startColumnIndex' => 0,
                            'endColumnIndex' => 7
                        ]
                    ]
                ]
            ]),
            // Freeze header row
            new \Google\Service\Sheets\Request([
                'updateSheetProperties' => [
                    'properties' => [
                        'sheetId' => $sheetId,
                        'gridProperties' => [
                            'frozenRowCount' => 1
                        ]
                    ],
                    'fields' => 'gridProperties.frozenRowCount'
                ]
            ])
        ];

        $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
            'requests' => $requests
        ]);

        $sheetsService->service->spreadsheets->batchUpdate($sheetsService->spreadsheetId, $batchUpdateRequest);
    }
}
