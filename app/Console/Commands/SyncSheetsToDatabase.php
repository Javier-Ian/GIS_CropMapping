<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SheetsSyncService;

class SyncSheetsToDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sheets:sync {barangay?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync Google Sheets data to database tables for each barangay';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Starting Google Sheets to Database Sync...');
        
        $syncService = new SheetsSyncService();
        $specificBarangay = $this->argument('barangay');

        try {
            if ($specificBarangay) {
                // Sync specific barangay
                $this->info("Syncing data for: {$specificBarangay}");
                $result = $syncService->syncSpecificBarangay($specificBarangay);
                
                $this->displaySyncResult($specificBarangay, $result);
                
            } else {
                // Sync all barangays
                $this->info('Syncing data for all barangays...');
                $results = $syncService->syncAllBarangays();
                
                foreach ($results as $barangay => $result) {
                    $this->displaySyncResult($barangay, $result);
                }
            }

            // Show statistics
            $this->newLine();
            $this->info('📊 Sync Statistics:');
            $stats = $syncService->getSyncStatistics();
            
            $this->table(
                ['Barangay', 'Total Records', 'Recently Synced', 'Last Sync'],
                collect($stats)->map(function ($stat, $barangay) {
                    return [
                        $barangay,
                        $stat['total_records'],
                        $stat['recently_synced'],
                        $stat['last_sync'] ?? 'Never'
                    ];
                })->toArray()
            );

        } catch (\Exception $e) {
            $this->error('❌ Sync failed: ' . $e->getMessage());
            return 1;
        }

        $this->info('✅ Sync completed successfully!');
        return 0;
    }

    private function displaySyncResult($barangay, $result)
    {
        if (isset($result['error'])) {
            $this->error("❌ {$barangay}: {$result['error']}");
            return;
        }

        $this->info("✅ {$barangay}: {$result['synced']} records synced");
        
        if ($result['errors'] > 0) {
            $this->warn("⚠️  {$barangay}: {$result['errors']} errors occurred");
            
            if (isset($result['error_details'])) {
                foreach ($result['error_details'] as $error) {
                    $this->line("   • {$error}");
                }
            }
        }
    }
}
