<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GoogleSheetsService;

class AddSampleSheetData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sheets:add-sample-data {barangay?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Add sample crop data to Google Sheets for testing sync functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $barangay = $this->argument('barangay') ?? 'Brgy. Butong';
        
        $this->info("Adding sample data to {$barangay}...");
        
        $sheetsService = new GoogleSheetsService();
        
        // Sample data for testing
        $sampleData = [
            ['Juan Dela Cruz', 'Sitio 1', 'Rice', '01/15/2024', '04/20/2024', '2 hectares', '8 tons'],
            ['Maria Santos', 'Sitio 2', 'Corn', '02/01/2024', '05/15/2024', '1.5 hectares', '5 tons'],
            ['Pedro Garcia', 'Sitio 3', 'Rice', '01/20/2024', '04/25/2024', '3 hectares', '12 tons'],
            ['Ana Reyes', 'Sitio 1', 'Vegetables', '03/01/2024', '05/30/2024', '0.5 hectares', '2 tons'],
            ['Carlos Lopez', 'Sitio 4', 'Sugarcane', '12/01/2023', '11/30/2024', '5 hectares', '25 tons'],
        ];

        try {
            // First, clear existing sample data (rows 2-15 which contain our template data)
            $clearRange = $barangay . '!A2:G15';
            $clearBody = new \Google\Service\Sheets\ValueRange([
                'values' => array_fill(0, 13, array_fill(0, 7, ''))
            ]);

            $sheetsService->service->spreadsheets_values->update(
                $sheetsService->spreadsheetId,
                $clearRange,
                $clearBody,
                ['valueInputOption' => 'RAW']
            );

            // Add the sample data starting from row 2
            $range = $barangay . '!A2:G' . (count($sampleData) + 1);
            $body = new \Google\Service\Sheets\ValueRange([
                'values' => $sampleData
            ]);

            $result = $sheetsService->service->spreadsheets_values->update(
                $sheetsService->spreadsheetId,
                $range,
                $body,
                ['valueInputOption' => 'RAW']
            );

            $this->info("✅ Successfully added " . count($sampleData) . " sample records to {$barangay}");
            $this->info("📝 Sample data includes farmers: Juan Dela Cruz, Maria Santos, Pedro Garcia, Ana Reyes, Carlos Lopez");
            $this->newLine();
            $this->info("🔄 Now you can test the sync functionality:");
            $this->info("   • Run: php artisan sheets:sync \"{$barangay}\"");
            $this->info("   • Or use the web interface at /sync");
            
        } catch (\Exception $e) {
            $this->error('Failed to add sample data: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
