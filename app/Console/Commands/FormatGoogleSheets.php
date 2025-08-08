<?php

namespace App\Console\Commands;

use App\Services\GoogleSheetsService;
use Illuminate\Console\Command;

class FormatGoogleSheets extends Command
{
    protected $signature = 'sheets:format {sheet?}';
    protected $description = 'Apply table formatting to Google Sheets';

    public function handle()
    {
        $sheetName = $this->argument('sheet');
        
        try {
            $service = new GoogleSheetsService();
            
            if ($sheetName) {
                if ($sheetName === 'Brgy. Butong') {
                    $this->info("Skipping Brgy. Butong - it's the template sheet");
                    return;
                }
                
                $this->info("Applying formatting to sheet: $sheetName");
                $result = $service->copyFormattingFromTemplate($sheetName);
                
                if ($result) {
                    $this->info("Successfully applied formatting to $sheetName");
                } else {
                    $this->error("Failed to apply formatting to $sheetName");
                }
            } else {
                // Apply formatting to all barangay sheets (except Brgy. Butong template)
                $this->info("Getting all barangay sheets...");
                $sheets = $service->getBarangaySheets();
                
                foreach ($sheets as $sheet) {
                    if ($sheet === 'Brgy. Butong') {
                        $this->info("Skipping $sheet - it's the template");
                        continue;
                    }
                    
                    $this->info("Applying formatting to: $sheet");
                    $result = $service->copyFormattingFromTemplate($sheet);
                    
                    if ($result) {
                        $this->info("✓ Successfully formatted $sheet");
                    } else {
                        $this->error("✗ Failed to format $sheet");
                    }
                }
                
                $this->info("Formatting complete!");
            }
            
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
        }
    }
}
