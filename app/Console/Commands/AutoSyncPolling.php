<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SheetsSyncService;

class AutoSyncPolling extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sheets:auto-sync {--interval=30}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically sync Google Sheets to database every X seconds';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $interval = (int) $this->option('interval');
        
        $this->info("🔄 Starting automatic sync polling every {$interval} seconds...");
        $this->info('Press Ctrl+C to stop');
        $this->newLine();

        $syncService = new SheetsSyncService();
        $lastSyncData = [];

        while (true) {
            try {
                $this->line('[' . date('H:i:s') . '] Checking for changes...');
                
                // Get current statistics
                $currentStats = $syncService->getSyncStatistics();
                
                // Check if we should sync (first run or if it's been a while)
                $shouldSync = false;
                $syncReasons = [];

                foreach ($currentStats as $barangay => $stats) {
                    $lastSync = $stats['last_sync'];
                    
                    // If never synced or last sync was more than interval seconds ago
                    if (!$lastSync || strtotime($lastSync) < (time() - $interval)) {
                        $shouldSync = true;
                        $syncReasons[] = $barangay;
                    }
                }

                if ($shouldSync || empty($lastSyncData)) {
                    $this->info("🔄 Syncing: " . implode(', ', $syncReasons ?: ['Initial sync']));
                    
                    // Perform sync
                    $results = $syncService->syncAllBarangays();
                    
                    // Show results
                    $totalSynced = 0;
                    $totalErrors = 0;
                    
                    foreach ($results as $barangay => $result) {
                        if (isset($result['synced']) && $result['synced'] > 0) {
                            $this->info("✅ {$barangay}: {$result['synced']} records synced");
                            $totalSynced += $result['synced'];
                        }
                        if (isset($result['errors']) && $result['errors'] > 0) {
                            $this->warn("⚠️  {$barangay}: {$result['errors']} errors");
                            $totalErrors += $result['errors'];
                        }
                    }
                    
                    if ($totalSynced > 0) {
                        $this->info("📊 Total: {$totalSynced} records synced, {$totalErrors} errors");
                    } else {
                        $this->line("   No new changes detected");
                    }
                    
                    $lastSyncData = $results;
                } else {
                    $this->line("   No sync needed");
                }
                
            } catch (\Exception $e) {
                $this->error("❌ Sync error: " . $e->getMessage());
            }
            
            // Wait for the specified interval
            sleep($interval);
        }
    }
}
