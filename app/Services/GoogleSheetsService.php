<?php

namespace App\Services;

use Google\Client;
use Google\Service\Sheets;
use Illuminate\Support\Facades\Log;

class GoogleSheetsService
{
    private $client;
    public $service;
    public $spreadsheetId = '1KJbz08BhzwYH9vpFRGyrZWgqBoYWHEv8xcUU3NI0s4g';

    public function __construct()
    {
        $this->initializeClient();
    }

    private function initializeClient()
    {
        try {
            $this->client = new Client();
            $this->client->setApplicationName('GIS Crop Mapping');
            
            // Use service account credentials
            $credentialsPath = public_path('credentials.json');
            $this->client->setAuthConfig($credentialsPath);
            $this->client->setScopes([Sheets::SPREADSHEETS]);
            
            $this->service = new Sheets($this->client);
        } catch (\Exception $e) {
            Log::error('Failed to initialize Google Sheets client: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Get the sheet URL for a specific barangay
     */
    public function getSheetUrlForBarangay($barangay)
    {
        try {
            $sheetName = "Brgy. " . $barangay;
            
            // Get or create the sheet
            $sheetId = $this->getOrCreateSheet($sheetName);
            
            if ($sheetId === null) {
                return null;
            }

            return "https://docs.google.com/spreadsheets/d/{$this->spreadsheetId}/edit#gid={$sheetId}";
        } catch (\Exception $e) {
            Log::error('Failed to get sheet URL for barangay: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get or create a sheet with the given name
     */
    private function getOrCreateSheet($sheetName)
    {
        try {
            // First, try to find existing sheet
            $spreadsheet = $this->service->spreadsheets->get($this->spreadsheetId);
            $sheets = $spreadsheet->getSheets();
            
            foreach ($sheets as $sheet) {
                if ($sheet->getProperties()->getTitle() === $sheetName) {
                    $sheetId = $sheet->getProperties()->getSheetId();
                    
                    // Just return the existing sheet without applying any formatting
                    // This preserves any pre-built table designs that users have created
                    Log::info('Found existing sheet: ' . $sheetName . ', keeping existing design intact');
                    
                    return $sheetId;
                }
            }
            
            // Sheet doesn't exist, create it
            return $this->createNewSheet($sheetName);
            
        } catch (\Exception $e) {
            Log::error('Failed to get or create sheet: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Create a new sheet with the given name and setup headers
     */
    private function createNewSheet($sheetName)
    {
        try {
            // Create the sheet
            $requests = [
                new \Google\Service\Sheets\Request([
                    'addSheet' => [
                        'properties' => [
                            'title' => $sheetName,
                            'gridProperties' => [
                                'rowCount' => 1000,
                                'columnCount' => 7
                            ]
                        ]
                    ]
                ])
            ];

            $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
                'requests' => $requests
            ]);

            $response = $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);
            $newSheetId = $response->getReplies()[0]->getAddSheet()->getProperties()->getSheetId();

            // Setup headers first
            $this->setupSheetHeaders($sheetName);
            
            // Copy the exact formatting from Brgy. Butong template
            $this->copyFormattingFromTemplate($sheetName, 'Brgy. Butong');

            Log::info('Successfully created new sheet with template formatting: ' . $sheetName . ' with ID: ' . $newSheetId);

            return $newSheetId;
            
        } catch (\Exception $e) {
            Log::error('Failed to create new sheet: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Add a sample data row to show the table format
     */
    private function addSampleDataRow($sheetName)
    {
        try {
            $sampleData = [
                ['Ian Dave Javier', 'San Jose Quezon, Bukidnon', 'corn', '9/1/2025', '9/18/2025', '5 hectares', '50kg']
            ];

            $this->writeSheetData($sheetName, 'A2:G2', $sampleData);
            
        } catch (\Exception $e) {
            Log::error('Failed to add sample data row: ' . $e->getMessage());
        }
    }

    /**
     * Setup headers for a new sheet to match the format
     */
    private function setupSheetHeaders($sheetName)
    {
        try {
            // First, add the headers
            $headers = [
                ['Farm Owner', 'Farm Address', 'Crop', 'Date Planted', 'Date Harvested', 'Total Area', 'Total Yield']
            ];

            $this->writeSheetData($sheetName, 'A1:G1', $headers);

            $sheetId = $this->getSheetIdByName($sheetName);

            // Create comprehensive formatting requests to match Brgy. Butong design
            $requests = [
                // Format header row with GREEN background and white text (matching Brgy. Butong)
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
                        'fields' => 'userEnteredFormat(textFormat,backgroundColor,horizontalAlignment,verticalAlignment)'
                    ]
                ]),
                
                // Add borders to the entire data range (A1:G100)
                new \Google\Service\Sheets\Request([
                    'updateBorders' => [
                        'range' => [
                            'sheetId' => $sheetId,
                            'startRowIndex' => 0,
                            'endRowIndex' => 100,
                            'startColumnIndex' => 0,
                            'endColumnIndex' => 7
                        ],
                        'top' => [
                            'style' => 'SOLID',
                            'width' => 1,
                            'color' => ['red' => 0.8, 'green' => 0.8, 'blue' => 0.8]
                        ],
                        'bottom' => [
                            'style' => 'SOLID',
                            'width' => 1,
                            'color' => ['red' => 0.8, 'green' => 0.8, 'blue' => 0.8]
                        ],
                        'left' => [
                            'style' => 'SOLID',
                            'width' => 1,
                            'color' => ['red' => 0.8, 'green' => 0.8, 'blue' => 0.8]
                        ],
                        'right' => [
                            'style' => 'SOLID',
                            'width' => 1,
                            'color' => ['red' => 0.8, 'green' => 0.8, 'blue' => 0.8]
                        ],
                        'innerHorizontal' => [
                            'style' => 'SOLID',
                            'width' => 1,
                            'color' => ['red' => 0.8, 'green' => 0.8, 'blue' => 0.8]
                        ],
                        'innerVertical' => [
                            'style' => 'SOLID',
                            'width' => 1,
                            'color' => ['red' => 0.8, 'green' => 0.8, 'blue' => 0.8]
                        ]
                    ]
                ]),

                // Apply alternating row colors (banded rows)
                new \Google\Service\Sheets\Request([
                    'addBanding' => [
                        'bandedRange' => [
                            'range' => [
                                'sheetId' => $sheetId,
                                'startRowIndex' => 1, // Start from row 2 (after header)
                                'endRowIndex' => 1000,
                                'startColumnIndex' => 0,
                                'endColumnIndex' => 7
                            ],
                            'rowProperties' => [
                                'headerColor' => [
                                    'red' => 0.26,
                                    'green' => 0.52,
                                    'blue' => 0.96
                                ],
                                'firstBandColor' => [
                                    'red' => 1.0,
                                    'green' => 1.0,
                                    'blue' => 1.0
                                ],
                                'secondBandColor' => [
                                    'red' => 0.95,
                                    'green' => 0.95,
                                    'blue' => 0.95
                                ]
                            ]
                        ]
                    ]
                ]),

                // Set column widths to match the original
                new \Google\Service\Sheets\Request([
                    'updateDimensionProperties' => [
                        'range' => [
                            'sheetId' => $sheetId,
                            'dimension' => 'COLUMNS',
                            'startIndex' => 0,
                            'endIndex' => 1
                        ],
                        'properties' => [
                            'pixelSize' => 120 // Farm Owner column
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
                            'pixelSize' => 150 // Farm Address column
                        ],
                        'fields' => 'pixelSize'
                    ]
                ]),
                new \Google\Service\Sheets\Request([
                    'updateDimensionProperties' => [
                        'range' => [
                            'sheetId' => $sheetId,
                            'dimension' => 'COLUMNS',
                            'startIndex' => 2,
                            'endIndex' => 3
                        ],
                        'properties' => [
                            'pixelSize' => 80 // Crop column
                        ],
                        'fields' => 'pixelSize'
                    ]
                ]),
                new \Google\Service\Sheets\Request([
                    'updateDimensionProperties' => [
                        'range' => [
                            'sheetId' => $sheetId,
                            'dimension' => 'COLUMNS',
                            'startIndex' => 3,
                            'endIndex' => 4
                        ],
                        'properties' => [
                            'pixelSize' => 110 // Date Planted column
                        ],
                        'fields' => 'pixelSize'
                    ]
                ]),
                new \Google\Service\Sheets\Request([
                    'updateDimensionProperties' => [
                        'range' => [
                            'sheetId' => $sheetId,
                            'dimension' => 'COLUMNS',
                            'startIndex' => 4,
                            'endIndex' => 5
                        ],
                        'properties' => [
                            'pixelSize' => 120 // Date Harvested column
                        ],
                        'fields' => 'pixelSize'
                    ]
                ]),
                new \Google\Service\Sheets\Request([
                    'updateDimensionProperties' => [
                        'range' => [
                            'sheetId' => $sheetId,
                            'dimension' => 'COLUMNS',
                            'startIndex' => 5,
                            'endIndex' => 6
                        ],
                        'properties' => [
                            'pixelSize' => 100 // Total Area column
                        ],
                        'fields' => 'pixelSize'
                    ]
                ]),
                new \Google\Service\Sheets\Request([
                    'updateDimensionProperties' => [
                        'range' => [
                            'sheetId' => $sheetId,
                            'dimension' => 'COLUMNS',
                            'startIndex' => 6,
                            'endIndex' => 7
                        ],
                        'properties' => [
                            'pixelSize' => 100 // Total Yield column
                        ],
                        'fields' => 'pixelSize'
                    ]
                ]),

                // Freeze the header row
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

            $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);
            
            Log::info('Successfully setup sheet headers and formatting for: ' . $sheetName);
            
        } catch (\Exception $e) {
            Log::error('Failed to setup sheet headers: ' . $e->getMessage());
        }
    }

    /**
     * Copy the exact formatting from Brgy. Butong to another sheet
     */
    public function copyFormattingFromTemplate($targetSheetName, $templateSheetName = 'Brgy. Butong')
    {
        try {
            // NEVER modify the original Brgy. Butong template
            if ($targetSheetName === 'Brgy. Butong') {
                Log::info("Skipping formatting copy - Brgy. Butong is the template");
                return true;
            }
            
            $targetSheetId = $this->getSheetIdByName($targetSheetName);
            
            if (!$targetSheetId) {
                Log::error('Could not find target sheet', [
                    'target' => $targetSheetName,
                    'target_id' => $targetSheetId
                ]);
                return false;
            }

            Log::info("Applying clean green formatting to {$targetSheetName} (copying from template)");

            // First, completely clear the sheet
            $this->clearSheetCompletely($targetSheetId);
            
            // Then apply clean green headers
            $this->setupCleanGreenHeaders($targetSheetName);
            
            // Add basic styling
            $this->applyBasicSheetStyling($targetSheetId);

            Log::info("Successfully applied clean formatting to {$targetSheetName}");
            return true;

        } catch (\Exception $e) {
            Log::error('Failed to copy formatting: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Clear a sheet completely of all formatting and data except headers
     */
    private function clearSheetCompletely($sheetId)
    {
        try {
            // Remove all existing banding and conditional formatting first
            $this->removeExistingFormatting($sheetId);
            
            // Clear all formatting
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

            $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);
            
        } catch (\Exception $e) {
            Log::error('Failed to clear sheet completely: ' . $e->getMessage());
        }
    }

    /**
     * Remove all existing banding and conditional formatting
     */
    private function removeExistingFormatting($sheetId)
    {
        try {
            $spreadsheet = $this->service->spreadsheets->get($this->spreadsheetId);
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
            
            if (!empty($requests)) {
                $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
                    'requests' => $requests
                ]);

                $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);
            }
            
        } catch (\Exception $e) {
            Log::warning('Could not remove existing formatting: ' . $e->getMessage());
        }
    }

    /**
     * Setup clean green headers without any blue formatting
     */
    private function setupCleanGreenHeaders($sheetName)
    {
        try {
            // Add headers
            $headers = [
                ['Farm Owner', 'Farm Address', 'Crop', 'Date Planted', 'Date Harvested', 'Total Area', 'Total Yield']
            ];

            $this->writeSheetData($sheetName, 'A1:G1', $headers);

            $sheetId = $this->getSheetIdByName($sheetName);

            // Apply ONLY green header formatting
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

            $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);

        } catch (\Exception $e) {
            Log::error('Failed to setup clean headers: ' . $e->getMessage());
        }
    }

    /**
     * Apply basic styling (filters, freeze, alternating rows)
     */
    private function applyBasicSheetStyling($sheetId)
    {
        try {
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
                ]),
                // Add clean alternating rows
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

            $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);

        } catch (\Exception $e) {
            Log::error('Failed to apply basic styling: ' . $e->getMessage());
        }
    }

    /**
     * Clear existing formatting from a sheet
     */
    private function clearSheetFormatting($sheetId)
    {
        try {
            $requests = [
                // Clear all formatting
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

            $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);
            
        } catch (\Exception $e) {
            Log::error('Failed to clear sheet formatting: ' . $e->getMessage());
        }
    }

    /**
     * Copy header row from template to target
     */
    private function copyHeaderRow($templateSheetName, $targetSheetName)
    {
        try {
            // Get header data from template
            $response = $this->service->spreadsheets_values->get(
                $this->spreadsheetId,
                $templateSheetName . '!A1:G1'
            );
            
            $headerValues = $response->getValues();
            
            if ($headerValues) {
                // Write headers to target sheet
                $body = new \Google\Service\Sheets\ValueRange([
                    'values' => $headerValues
                ]);
                
                $this->service->spreadsheets_values->update(
                    $this->spreadsheetId,
                    $targetSheetName . '!A1:G1',
                    $body,
                    ['valueInputOption' => 'RAW']
                );
            }

            // Now copy the exact formatting
            $targetSheetId = $this->getSheetIdByName($targetSheetName);
            
            $requests = [
                // Apply the green header formatting to match Brgy. Butong
                new \Google\Service\Sheets\Request([
                    'repeatCell' => [
                        'range' => [
                            'sheetId' => $targetSheetId,
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

            $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);

        } catch (\Exception $e) {
            Log::error('Failed to copy header row: ' . $e->getMessage());
        }
    }

    /**
     * Copy filter settings from template to target
     */
    private function copyFilterSettings($templateSheetId, $targetSheetId)
    {
        try {
            $requests = [
                // Add basic filter (dropdown arrows)
                new \Google\Service\Sheets\Request([
                    'setBasicFilter' => [
                        'filter' => [
                            'range' => [
                                'sheetId' => $targetSheetId,
                                'startRowIndex' => 0,
                                'endRowIndex' => 1000,
                                'startColumnIndex' => 0,
                                'endColumnIndex' => 7
                            ]
                        ]
                    ]
                ])
            ];

            $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
                'requests' => $requests
            ]);

            $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);

        } catch (\Exception $e) {
            Log::error('Failed to copy filter settings: ' . $e->getMessage());
        }
    }

    /**
     * Copy conditional formatting
     */
    private function copyConditionalFormatting($templateSheetId, $targetSheetId)
    {
        try {
            $requests = [
                // Add alternating row colors
                new \Google\Service\Sheets\Request([
                    'addBanding' => [
                        'bandedRange' => [
                            'range' => [
                                'sheetId' => $targetSheetId,
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
                                    'green' => 0.95,
                                    'blue' => 0.95
                                ]
                            ]
                        ]
                    ]
                ])
            ];

            $batchUpdateRequest = new \Google\Service\Sheets\BatchUpdateSpreadsheetRequest([
                'requests' => $requests
            ]);

            $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);

        } catch (\Exception $e) {
            Log::error('Failed to copy conditional formatting: ' . $e->getMessage());
        }
    }

    /**
     * Copy column properties
     */
    private function copyColumnProperties($templateSheetId, $targetSheetId)
    {
        try {
            $requests = [
                // Set column widths to match template
                new \Google\Service\Sheets\Request([
                    'updateDimensionProperties' => [
                        'range' => [
                            'sheetId' => $targetSheetId,
                            'dimension' => 'COLUMNS',
                            'startIndex' => 0,
                            'endIndex' => 7
                        ],
                        'properties' => [
                            'pixelSize' => 120
                        ],
                        'fields' => 'pixelSize'
                    ]
                ]),
                // Freeze header row
                new \Google\Service\Sheets\Request([
                    'updateSheetProperties' => [
                        'properties' => [
                            'sheetId' => $targetSheetId,
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

            $this->service->spreadsheets->batchUpdate($this->spreadsheetId, $batchUpdateRequest);

        } catch (\Exception $e) {
            Log::error('Failed to copy column properties: ' . $e->getMessage());
        }
    }

    /**
     * Copy sample data formatting
     */
    private function copySampleDataFormatting($templateSheetName, $targetSheetName)
    {
        try {
            // Get sample data from template (if any exists)
            $response = $this->service->spreadsheets_values->get(
                $this->spreadsheetId,
                $templateSheetName . '!A2:G10'
            );
            
            $sampleData = $response->getValues();
            
            if ($sampleData && count($sampleData) > 0) {
                // Copy the first row of sample data to show the format
                $firstRow = [$sampleData[0]];
                
                $body = new \Google\Service\Sheets\ValueRange([
                    'values' => $firstRow
                ]);
                
                $this->service->spreadsheets_values->update(
                    $this->spreadsheetId,
                    $targetSheetName . '!A2:G2',
                    $body,
                    ['valueInputOption' => 'RAW']
                );
            }

        } catch (\Exception $e) {
            Log::error('Failed to copy sample data: ' . $e->getMessage());
        }
    }

    /**
     * Get sheet ID by sheet name
     */
    public function getSheetIdByName($sheetName)
    {
        try {
            $spreadsheet = $this->service->spreadsheets->get($this->spreadsheetId);
            $sheets = $spreadsheet->getSheets();
            
            foreach ($sheets as $sheet) {
                if ($sheet->getProperties()->getTitle() === $sheetName) {
                    return $sheet->getProperties()->getSheetId();
                }
            }
            
            return null;
        } catch (\Exception $e) {
            Log::error('Failed to get sheet ID by name: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get sheet names from the spreadsheet
     */
    public function getSheetNames()
    {
        try {
            $spreadsheet = $this->service->spreadsheets->get($this->spreadsheetId);
            $sheets = $spreadsheet->getSheets();
            
            $sheetNames = [];
            foreach ($sheets as $sheet) {
                $sheetNames[] = $sheet->getProperties()->getTitle();
            }
            
            return $sheetNames;
        } catch (\Exception $e) {
            Log::error('Failed to get sheet names: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Get all barangay sheets (sheets that start with "Brgy. ")
     */
    public function getBarangaySheets()
    {
        try {
            $allSheets = $this->getSheetNames();
            $barangaySheets = [];
            
            foreach ($allSheets as $sheetName) {
                if (strpos($sheetName, 'Brgy. ') === 0) {
                    $barangaySheets[] = $sheetName;
                }
            }
            
            return $barangaySheets;
        } catch (\Exception $e) {
            Log::error('Failed to get barangay sheets: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Read data from a specific sheet
     */
    public function readSheetData($sheetName, $range = 'A:Z')
    {
        try {
            $response = $this->service->spreadsheets_values->get(
                $this->spreadsheetId,
                $sheetName . '!' . $range
            );
            
            return $response->getValues();
        } catch (\Exception $e) {
            Log::error('Failed to read sheet data: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Write data to a specific sheet
     */
    public function writeSheetData($sheetName, $range, $values)
    {
        try {
            $body = new \Google\Service\Sheets\ValueRange([
                'values' => $values
            ]);
            
            $params = [
                'valueInputOption' => 'RAW'
            ];
            
            $result = $this->service->spreadsheets_values->update(
                $this->spreadsheetId,
                $sheetName . '!' . $range,
                $body,
                $params
            );
            
            return $result->getUpdatedCells();
        } catch (\Exception $e) {
            Log::error('Failed to write sheet data: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Append data to a specific sheet
     */
    public function appendSheetData($sheetName, $values)
    {
        try {
            $body = new \Google\Service\Sheets\ValueRange([
                'values' => $values
            ]);
            
            $params = [
                'valueInputOption' => 'RAW'
            ];
            
            $result = $this->service->spreadsheets_values->append(
                $this->spreadsheetId,
                $sheetName,
                $body,
                $params
            );
            
            return $result->getUpdates()->getUpdatedCells();
        } catch (\Exception $e) {
            Log::error('Failed to append sheet data: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Export map data to Google Sheets
     */
    public function exportMapData($map, $sheetName = null)
    {
        try {
            if (!$sheetName) {
                $sheetName = "Brgy. " . ($map->barangay ?: 'General');
            }

            // Ensure the sheet exists
            $this->getOrCreateSheet($sheetName);

            // Prepare data for export
            $values = [
                [
                    $map->title, // Using map title as farm owner for now
                    $map->barangay ? "Brgy. " . $map->barangay : 'Not specified',
                    'Crop', // You might want to add a crop field to your map model
                    date('m/d/Y'), // Current date as placeholder
                    '', // Empty for date harvested
                    'Total Area', // Placeholder
                    'Total Yield' // Placeholder
                ]
            ];

            return $this->appendSheetData($sheetName, $values);
        } catch (\Exception $e) {
            Log::error('Failed to export map data: ' . $e->getMessage());
            return false;
        }
    }
}
