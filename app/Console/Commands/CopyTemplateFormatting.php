<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\GoogleSheetsService;

class CopyTemplateFormatting extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sheets:copy-template';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Copy formatting from Brgy. Butong template to other sheets';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Copying template formatting from "Brgy. Butong" to other sheets...');
        
        $sheetsService = new GoogleSheetsService();

        // Copy to Brgy. San Jose
        $this->info('Processing Brgy. San Jose...');
        $result1 = $sheetsService->copyFormattingFromTemplate('Brgy. San Jose', 'Brgy. Butong');
        
        if ($result1) {
            $this->info('✅ Successfully copied to Brgy. San Jose');
        } else {
            $this->error('❌ Failed to copy to Brgy. San Jose');
        }

        // Copy to Brgy. Salawagan
        $this->info('Processing Brgy. Salawagan...');
        $result2 = $sheetsService->copyFormattingFromTemplate('Brgy. Salawagan', 'Brgy. Butong');
        
        if ($result2) {
            $this->info('✅ Successfully copied to Brgy. Salawagan');
        } else {
            $this->error('❌ Failed to copy to Brgy. Salawagan');
        }

        $this->info('🎉 Template formatting copy completed!');
        $this->info('All sheets should now match the "Brgy. Butong" design.');
        
        return 0;
    }
}
