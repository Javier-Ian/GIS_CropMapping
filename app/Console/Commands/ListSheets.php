<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GoogleSheetsService;

class ListSheets extends Command
{
    protected $signature = 'sheets:list';
    protected $description = 'List all available sheets in the Google Spreadsheet';

    public function handle()
    {
        $this->info('Fetching all sheets from Google Spreadsheet...');
        
        $sheetsService = new GoogleSheetsService();
        
        try {
            $spreadsheet = $sheetsService->service->spreadsheets->get($sheetsService->spreadsheetId);
            $sheets = $spreadsheet->getSheets();
            
            $this->info('Available sheets:');
            foreach ($sheets as $sheet) {
                $title = $sheet->getProperties()->getTitle();
                $sheetId = $sheet->getProperties()->getSheetId();
                $this->info("- {$title} (ID: {$sheetId})");
            }
            
        } catch (\Exception $e) {
            $this->error('Error fetching sheets: ' . $e->getMessage());
        }
        
        return 0;
    }
}
