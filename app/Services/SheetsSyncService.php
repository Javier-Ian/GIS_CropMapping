<?php

namespace App\Services;

use App\Models\BrgyButongCrop;
use App\Models\BrgySalawaganCrop;
use App\Models\BrgySanJoseCrop;
use Illuminate\Support\Facades\Log;

class SheetsSyncService
{
    protected $googleSheetsService;
    
    // Map barangay names to their corresponding models
    protected $barangayModels = [
        'Brgy. Butong' => BrgyButongCrop::class,
        'Brgy. Salawagan' => BrgySalawaganCrop::class,
        'Brgy. San Jose' => BrgySanJoseCrop::class,
    ];

    public function __construct()
    {
        $this->googleSheetsService = new GoogleSheetsService();
    }

    /**
     * Sync all barangay sheets with database
     */
    public function syncAllBarangays()
    {
        $results = [];
        
        foreach ($this->barangayModels as $barangayName => $modelClass) {
            try {
                $result = $this->syncBarangaySheet($barangayName, $modelClass);
                $results[$barangayName] = $result;
                
                Log::info("Synced {$barangayName}: {$result['synced']} records, {$result['errors']} errors");
                
            } catch (\Exception $e) {
                $results[$barangayName] = ['error' => $e->getMessage()];
                Log::error("Failed to sync {$barangayName}: " . $e->getMessage());
            }
        }
        
        return $results;
    }

    /**
     * Sync a specific barangay sheet with its database table
     */
    public function syncBarangaySheet(string $barangayName, string $modelClass)
    {
        $syncedCount = 0;
        $errorCount = 0;
        $errors = [];

        try {
            // Get data from Google Sheets
            $sheetData = $this->getSheetData($barangayName);
            
            if (empty($sheetData)) {
                return [
                    'synced' => 0,
                    'errors' => 0,
                    'message' => 'No data found in sheet'
                ];
            }

            // Process each row (skip header row)
            for ($i = 1; $i < count($sheetData); $i++) {
                $row = $sheetData[$i];
                
                // Skip empty rows
                if ($this->isRowEmpty($row)) {
                    continue;
                }

                try {
                    $this->syncRowToDatabase($modelClass, $row, $i + 1); // +1 because sheets are 1-indexed
                    $syncedCount++;
                } catch (\Exception $e) {
                    $errorCount++;
                    $errors[] = "Row " . ($i + 1) . ": " . $e->getMessage();
                    Log::error("Error syncing row " . ($i + 1) . " for {$barangayName}: " . $e->getMessage());
                }
            }

        } catch (\Exception $e) {
            throw new \Exception("Failed to sync {$barangayName}: " . $e->getMessage());
        }

        return [
            'synced' => $syncedCount,
            'errors' => $errorCount,
            'error_details' => $errors
        ];
    }

    /**
     * Get data from a specific Google Sheet
     */
    protected function getSheetData(string $sheetName)
    {
        try {
            $range = $sheetName . '!A1:G1000'; // Get up to 1000 rows
            
            $response = $this->googleSheetsService->service->spreadsheets_values->get(
                $this->googleSheetsService->spreadsheetId,
                $range
            );

            return $response->getValues() ?? [];
            
        } catch (\Exception $e) {
            Log::error("Failed to get sheet data for {$sheetName}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Check if a row is empty (contains only empty values or placeholder text)
     */
    protected function isRowEmpty($row)
    {
        if (empty($row)) {
            return true;
        }

        // Check if all values are empty or contain placeholder text
        foreach ($row as $value) {
            $value = trim($value);
            if (!empty($value) && 
                $value !== 'Name' && 
                $value !== 'Place' && 
                $value !== 'Crop' && 
                $value !== 'm/d/yyyy xxxx' &&
                $value !== 'Total Area' &&
                $value !== 'Total Yield') {
                return false;
            }
        }

        return true;
    }

    /**
     * Sync a single row to the database
     */
    protected function syncRowToDatabase(string $modelClass, array $row, int $rowIndex)
    {
        // Ensure we have at least 7 columns, pad with empty strings if needed
        $row = array_pad($row, 7, '');

        $data = [
            'name' => trim($row[0] ?? ''),
            'place' => trim($row[1] ?? ''),
            'crop' => trim($row[2] ?? ''),
            'planting_date' => trim($row[3] ?? ''),
            'harvest_date' => trim($row[4] ?? ''),
            'total_area' => trim($row[5] ?? ''),
            'total_yield' => trim($row[6] ?? ''),
            'sheet_row_index' => $rowIndex,
            'synced_at' => now(),
        ];

        // Skip rows with placeholder data
        if ($this->isPlaceholderData($data)) {
            return;
        }

        // Update or create record based on sheet_row_index
        $modelClass::updateOrCreate(
            ['sheet_row_index' => $rowIndex],
            $data
        );
    }

    /**
     * Check if the data contains only placeholder values
     */
    protected function isPlaceholderData(array $data)
    {
        $placeholders = ['Name', 'Place', 'Crop', 'm/d/yyyy xxxx', 'Total Area', 'Total Yield'];
        
        foreach ($data as $key => $value) {
            if ($key === 'sheet_row_index' || $key === 'synced_at') {
                continue;
            }
            
            if (!empty($value) && !in_array($value, $placeholders)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get sync statistics for all barangays
     */
    public function getSyncStatistics()
    {
        $stats = [];

        foreach ($this->barangayModels as $barangayName => $modelClass) {
            $totalRecords = $modelClass::count();
            $recentlysynced = $modelClass::where('synced_at', '>=', now()->subHour())->count();
            $lastSync = $modelClass::latest('synced_at')->first()?->synced_at;

            $stats[$barangayName] = [
                'total_records' => $totalRecords,
                'recently_synced' => $recentlysynced,
                'last_sync' => $lastSync?->format('Y-m-d H:i:s'),
            ];
        }

        return $stats;
    }

    /**
     * Sync data for a specific barangay by name
     */
    public function syncSpecificBarangay(string $barangayName)
    {
        if (!isset($this->barangayModels[$barangayName])) {
            throw new \Exception("Unknown barangay: {$barangayName}");
        }

        $modelClass = $this->barangayModels[$barangayName];
        return $this->syncBarangaySheet($barangayName, $modelClass);
    }

    /**
     * Get all crop data for a specific barangay
     */
    public function getBarangayCropData(string $barangayName)
    {
        if (!isset($this->barangayModels[$barangayName])) {
            throw new \Exception("Unknown barangay: {$barangayName}");
        }

        $modelClass = $this->barangayModels[$barangayName];
        return $modelClass::orderBy('created_at', 'desc')->get();
    }

    /**
     * Get detailed sync status comparing sheet vs database
     */
    public function getDetailedSyncStatus()
    {
        $detailedStatus = [];

        foreach ($this->barangayModels as $barangayName => $modelClass) {
            $dbCount = $modelClass::count();
            $lastSync = $modelClass::latest('synced_at')->first()?->synced_at;
            
            try {
                // Get sheet data count using the barangay name directly as sheet name
                $response = $this->googleSheetsService->service->spreadsheets_values->get(
                    $this->googleSheetsService->spreadsheetId,
                    $barangayName . '!A:Z'
                );
                $sheetRowCount = count($response->getValues() ?? []) - 1; // Exclude header
                $sheetRowCount = max(0, $sheetRowCount);
                
                $detailedStatus[$barangayName] = [
                    'database_count' => $dbCount,
                    'sheet_count' => $sheetRowCount,
                    'last_sync' => $lastSync?->format('Y-m-d H:i:s'),
                    'sync_difference' => $sheetRowCount - $dbCount,
                    'needs_sync' => $sheetRowCount !== $dbCount,
                    'status' => $sheetRowCount === $dbCount ? 'Synced' : 'Needs Sync'
                ];
            } catch (\Exception $e) {
                $detailedStatus[$barangayName] = [
                    'database_count' => $dbCount,
                    'sheet_count' => 'Error',
                    'last_sync' => $lastSync?->format('Y-m-d H:i:s'),
                    'sync_difference' => 'Unknown',
                    'needs_sync' => true,
                    'status' => 'Error',
                    'error' => $e->getMessage()
                ];
            }
        }

        return $detailedStatus;
    }
}
