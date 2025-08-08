<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\SheetsSyncService;
use Illuminate\Support\Facades\File;

class MonitorAutoSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sheets:monitor {--follow} {--lines=50}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Monitor automatic sync activity and webhook logs';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $follow = $this->option('follow');
        $lines = $this->option('lines');
        
        $this->info('📊 Automatic Sync Monitoring Dashboard');
        $this->newLine();

        // Show current sync statistics
        $this->showSyncStatistics();
        $this->newLine();

        // Show recent webhook activity
        $this->showRecentWebhookActivity($lines);
        $this->newLine();

        if ($follow) {
            $this->info('👀 Following logs... (Press Ctrl+C to stop)');
            $this->followLogs();
        } else {
            $this->info('💡 Use --follow flag to monitor real-time activity');
        }

        return 0;
    }

    protected function showSyncStatistics()
    {
        $this->info('📈 Current Sync Statistics:');
        
        try {
            $syncService = new SheetsSyncService();
            $stats = $syncService->getSyncStatistics();

            $tableData = [];
            foreach ($stats as $barangay => $stat) {
                $tableData[] = [
                    'Barangay' => $barangay,
                    'Total Records' => $stat['total_records'],
                    'Recently Synced' => $stat['recently_synced'],
                    'Last Sync' => $stat['last_sync'] ?? 'Never'
                ];
            }

            $this->table(
                ['Barangay', 'Total Records', 'Recently Synced', 'Last Sync'],
                $tableData
            );

        } catch (\Exception $e) {
            $this->error('Failed to get sync statistics: ' . $e->getMessage());
        }
    }

    protected function showRecentWebhookActivity($lines)
    {
        $this->info("🔗 Recent Webhook Activity (last {$lines} relevant entries):");
        
        $logFile = storage_path('logs/laravel.log');
        
        if (!File::exists($logFile)) {
            $this->warn('No log file found. Webhook activity will appear here when it occurs.');
            return;
        }

        try {
            // Read the log file and filter for webhook-related entries
            $content = File::get($logFile);
            $logLines = explode("\n", $content);
            
            // Filter for webhook and sync related logs
            $webhookLogs = array_filter($logLines, function($line) {
                return strpos($line, 'webhook') !== false || 
                       strpos($line, 'Automatic sync') !== false ||
                       strpos($line, 'Google Sheets webhook') !== false;
            });

            // Get the last N entries
            $recentLogs = array_slice($webhookLogs, -$lines);

            if (empty($recentLogs)) {
                $this->line('   No webhook activity found in recent logs.');
                $this->line('   💡 Activity will appear here when users save data in Google Sheets.');
            } else {
                foreach ($recentLogs as $log) {
                    // Clean up and format the log entry
                    $cleanLog = preg_replace('/^\[.*?\]\s*/', '', $log);
                    if (strpos($cleanLog, '✅') !== false) {
                        $this->line("   <info>{$cleanLog}</info>");
                    } elseif (strpos($cleanLog, '❌') !== false || strpos($cleanLog, 'ERROR') !== false) {
                        $this->line("   <error>{$cleanLog}</error>");
                    } elseif (strpos($cleanLog, '🔄') !== false) {
                        $this->line("   <comment>{$cleanLog}</comment>");
                    } else {
                        $this->line("   {$cleanLog}");
                    }
                }
            }

        } catch (\Exception $e) {
            $this->error('Failed to read log file: ' . $e->getMessage());
        }
    }

    protected function followLogs()
    {
        $logFile = storage_path('logs/laravel.log');
        
        if (!File::exists($logFile)) {
            $this->error('Log file not found');
            return;
        }

        // Get the current file size to start tailing from the end
        $lastSize = filesize($logFile);
        
        while (true) {
            clearstatcache();
            $currentSize = filesize($logFile);
            
            if ($currentSize > $lastSize) {
                // Read new content
                $handle = fopen($logFile, 'r');
                fseek($handle, $lastSize);
                
                while (($line = fgets($handle)) !== false) {
                    // Only show webhook/sync related logs
                    if (strpos($line, 'webhook') !== false || 
                        strpos($line, 'Automatic sync') !== false ||
                        strpos($line, 'Google Sheets webhook') !== false) {
                        
                        $timestamp = date('H:i:s');
                        $cleanLog = preg_replace('/^\[.*?\]\s*/', '', trim($line));
                        
                        if (strpos($cleanLog, '✅') !== false) {
                            $this->line("[{$timestamp}] <info>{$cleanLog}</info>");
                        } elseif (strpos($cleanLog, '❌') !== false || strpos($cleanLog, 'ERROR') !== false) {
                            $this->line("[{$timestamp}] <error>{$cleanLog}</error>");
                        } elseif (strpos($cleanLog, '🔄') !== false) {
                            $this->line("[{$timestamp}] <comment>{$cleanLog}</comment>");
                        } else {
                            $this->line("[{$timestamp}] {$cleanLog}");
                        }
                    }
                }
                
                fclose($handle);
                $lastSize = $currentSize;
            }
            
            sleep(1); // Check every second
        }
    }
}
