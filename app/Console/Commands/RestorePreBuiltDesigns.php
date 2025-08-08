<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GoogleSheetsService;

class RestorePreBuiltDesigns extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sheets:restore-prebuilt';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restore beautiful pre-built table designs for all barangay sheets';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Restoring beautiful pre-built designs for all barangay sheets...');
        
        $sheetsService = new GoogleSheetsService();
        
        // Get all existing sheets
        try {
            $spreadsheet = $sheetsService->service->spreadsheets->get($sheetsService->spreadsheetId);
            $sheets = $spreadsheet->getSheets();
            
            foreach ($sheets as $sheet) {
                $sheetTitle = $sheet->getProperties()->getTitle();
                
                // Only process barangay sheets
                if (strpos($sheetTitle, 'Brgy.') === 0) {
                    $this->info("Restoring pre-built design for {$sheetTitle}...");
                    
                    $result = $this->restorePreBuiltDesign($sheetsService, $sheetTitle);
                    
                    if ($result) {
                        $this->info("✅ Successfully restored pre-built design for {$sheetTitle}");
                    } else {
                        $this->error("❌ Failed to restore design for {$sheetTitle}");
                    }
                }
            }
            
        } catch (\Exception $e) {
            $this->error('Error processing sheets: ' . $e->getMessage());
            return 1;
        }

        $this->info('🎉 Pre-built design restoration completed!');
        $this->info('All barangay sheets now have beautiful pre-built table designs.');
        
        return 0;
    }
    
    private function restorePreBuiltDesign($sheetsService, $sheetName)
    {
        try {
            $sheetId = $sheetsService->getSheetIdByName($sheetName);
            if (!$sheetId) {
                $this->error("Sheet not found: {$sheetName}");
                return false;
            }

            // Step 1: Clear existing formatting but preserve data
            $this->clearFormattingOnly($sheetsService, $sheetId);
            
            // Step 2: Apply the beautiful pre-built design
            $this->applyPreBuiltDesign($sheetsService, $sheetId, $sheetName);
            
            return true;
            
        } catch (\Exception $e) {
            $this->error("Error restoring design for {$sheetName}: " . $e->getMessage());
            return false;
        }
    }
    
    private function clearFormattingOnly($sheetsService, $sheetId)
    {
        try {
            // Remove existing banding
            $spreadsheet = $sheetsService->service->spreadsheets->get($sheetsService->spreadsheetId);
            $sheets = $spreadsheet->getSheets();
            
            $targetSheet = null;
            foreach ($sheets as $sheet) {
                if ($sheet->getProperties()->getSheetId() === $sheetId) {
                    $targetSheet = $sheet;
                    break;
                }
            }
            
            if ($targetSheet) {
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
                
                if (!empty($requests)) {
                    $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
                        'requests' => $requests
                    ]);

                    $sheetsService->service->spreadsheets->batchUpdate($sheetsService->spreadsheetId, $batchUpdateRequest);
                }
            }
            
            // Clear all formatting but keep data
            $requests = [
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
            
        } catch (\Exception $e) {
            $this->warn('Could not clear existing formatting: ' . $e->getMessage());
        }
    }
    
    private function applyPreBuiltDesign($sheetsService, $sheetId, $sheetName)
    {
        // Apply the beautiful pre-built design
        $this->applyRichHeaders($sheetsService, $sheetId);
        $this->applyRichStyling($sheetsService, $sheetId);
        $this->addPreBuiltSampleData($sheetsService, $sheetName);
    }
    
    private function applyRichHeaders($sheetsService, $sheetId)
    {
        $requests = [
            // Rich green header with beautiful styling (matching Brgy. Butong)
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
                                'fontSize' => 11,
                                'foregroundColor' => [
                                    'red' => 1.0,
                                    'green' => 1.0,
                                    'blue' => 1.0
                                ]
                            ],
                            'backgroundColor' => [
                                'red' => 0.18,
                                'green' => 0.49,
                                'blue' => 0.31
                            ],
                            'horizontalAlignment' => 'CENTER',
                            'verticalAlignment' => 'MIDDLE',
                            'borders' => [
                                'top' => ['style' => 'SOLID', 'width' => 2, 'color' => ['red' => 0.15, 'green' => 0.4, 'blue' => 0.25]],
                                'bottom' => ['style' => 'SOLID', 'width' => 2, 'color' => ['red' => 0.15, 'green' => 0.4, 'blue' => 0.25]],
                                'left' => ['style' => 'SOLID', 'width' => 1, 'color' => ['red' => 0.15, 'green' => 0.4, 'blue' => 0.25]],
                                'right' => ['style' => 'SOLID', 'width' => 1, 'color' => ['red' => 0.15, 'green' => 0.4, 'blue' => 0.25]]
                            ],
                            'padding' => [
                                'top' => 8,
                                'bottom' => 8,
                                'left' => 4,
                                'right' => 4
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
    }
    
    private function applyRichStyling($sheetsService, $sheetId)
    {
        $requests = [
            // Add beautiful alternating rows with subtle colors
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
                                'red' => 0.95,
                                'green' => 0.97,
                                'blue' => 0.95
                            ]
                        ]
                    ]
                ]
            ]),
            // Add advanced filter with beautiful dropdown styling
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
            // Set optimal column widths (matching Brgy. Butong)
            new \Google\Service\Sheets\Request([
                'updateDimensionProperties' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'dimension' => 'COLUMNS',
                        'startIndex' => 0,
                        'endIndex' => 1
                    ],
                    'properties' => [
                        'pixelSize' => 150
                    ],
                    'fields' => 'pixelSize'
                ]
            ]),
            new \Google\Service\Sheets\Request([
                'updateDimensionProperties' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'dimension' => 'COLUMNS',
                        'startIndex' => 1,
                        'endIndex' => 2
                    ],
                    'properties' => [
                        'pixelSize' => 200
                    ],
                    'fields' => 'pixelSize'
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
            ]),
            // Set row height for header
            new \Google\Service\Sheets\Request([
                'updateDimensionProperties' => [
                    'range' => [
                        'sheetId' => $sheetId,
                        'dimension' => 'ROWS',
                        'startIndex' => 0,
                        'endIndex' => 1
                    ],
                    'properties' => [
                        'pixelSize' => 45
                    ],
                    'fields' => 'pixelSize'
                ]
            ])
        ];

        $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
            'requests' => $requests
        ]);

        $sheetsService->service->spreadsheets->batchUpdate($sheetsService->spreadsheetId, $batchUpdateRequest);
    }
    
    private function addPreBuiltSampleData($sheetsService, $sheetName)
    {
        // Add sample data rows to show the beautiful pre-built format
        $sampleData = [
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'],
            ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield']
        ];

        $body = new \Google\Service\Sheets\ValueRange([
            'values' => $sampleData
        ]);

        $sheetsService->service->spreadsheets_values->update(
            $sheetsService->spreadsheetId,
            $sheetName . '!A2:G15',
            $body,
            ['valueInputOption' => 'RAW']
        );
    }
}
