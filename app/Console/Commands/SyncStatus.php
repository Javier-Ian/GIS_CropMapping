<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SheetsSyncService;

class SyncStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sheets:status {--detailed} {--watch}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check Google Sheets sync status and statistics';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $syncService = new SheetsSyncService();
        
        if ($this->option('watch')) {
            return $this->watchStatus($syncService);
        }
        
        $this->showStatus($syncService);
    }
    
    private function showStatus(SheetsSyncService $syncService)
    {
        $this->info('📊 Google Sheets Sync Status');
        $this->newLine();

        if ($this->option('detailed')) {
            $status = $syncService->getDetailedSyncStatus();
            
            $headers = ['Barangay', 'Database', 'Sheet', 'Difference', 'Status', 'Last Sync'];
            $rows = [];
            
            foreach ($status as $barangay => $data) {
                $statusIcon = match($data['status']) {
                    'Synced' => '✅',
                    'Needs Sync' => '⚠️',
                    'Error' => '❌',
                    default => '?'
                };
                
                $difference = $data['sync_difference'];
                if (is_numeric($difference)) {
                    $differenceDisplay = $difference > 0 ? "+{$difference}" : ($difference < 0 ? $difference : '0');
                } else {
                    $differenceDisplay = $difference;
                }
                
                $rows[] = [
                    $barangay,
                    $data['database_count'],
                    $data['sheet_count'],
                    $differenceDisplay,
                    $statusIcon . ' ' . $data['status'],
                    $data['last_sync'] ?? 'Never'
                ];
            }
            
            $this->table($headers, $rows);
            
            // Show any errors
            foreach ($status as $barangay => $data) {
                if (isset($data['error'])) {
                    $this->error("❌ {$barangay}: {$data['error']}");
                }
            }
        } else {
            $statistics = $syncService->getSyncStatistics();
            
            foreach ($statistics as $barangay => $stats) {
                $this->line("📍 <info>{$barangay}</info>");
                $this->line("   Records: {$stats['total_records']}");
                $this->line("   Recently synced: {$stats['recently_synced']}");
                $this->line("   Last sync: " . ($stats['last_sync'] ?? 'Never'));
                $this->newLine();
            }
        }
        
        $this->info('💡 Use --detailed for sheet comparison');
        $this->info('💡 Use --watch for live monitoring');
    }
    
    private function watchStatus(SheetsSyncService $syncService)
    {
        $this->info('🔍 Watching sync status (Press Ctrl+C to stop)');
        $this->newLine();
        
        while (true) {
            // Clear previous output (for Windows)
            if (PHP_OS_FAMILY === 'Windows') {
                system('cls');
            } else {
                system('clear');
            }
            
            $this->info('🔍 Live Sync Status - ' . date('Y-m-d H:i:s'));
            $this->newLine();
            
            $status = $syncService->getDetailedSyncStatus();
            
            foreach ($status as $barangay => $data) {
                $statusIcon = match($data['status']) {
                    'Synced' => '✅',
                    'Needs Sync' => '⚠️',
                    'Error' => '❌',
                    default => '?'
                };
                
                $this->line("📍 <info>{$barangay}</info> {$statusIcon}");
                $this->line("   DB: {$data['database_count']} | Sheet: {$data['sheet_count']} | Diff: {$data['sync_difference']}");
                $this->line("   Last sync: " . ($data['last_sync'] ?? 'Never'));
                
                if (isset($data['error'])) {
                    $this->error("   Error: {$data['error']}");
                }
                $this->newLine();
            }
            
            sleep(5); // Update every 5 seconds
        }
    }
}
