<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GoogleSheetsService;

class TestNewSheet extends Command
{
    protected $signature = 'sheets:test-new {barangay}';
    protected $description = 'Test creating a new sheet with clean green formatting';

    public function handle()
    {
        $barangay = $this->argument('barangay');
        $this->info("Testing creation of new sheet for: {$barangay}");
        
        $sheetsService = new GoogleSheetsService();
        
        // Get sheet URL (this will create the sheet if it doesn't exist)
        $url = $sheetsService->getSheetUrlForBarangay($barangay);
        
        if ($url) {
            $this->info("✅ Successfully created/accessed sheet for {$barangay}");
            $this->info("URL: {$url}");
        } else {
            $this->error("❌ Failed to create sheet for {$barangay}");
        }
        
        return 0;
    }
}
