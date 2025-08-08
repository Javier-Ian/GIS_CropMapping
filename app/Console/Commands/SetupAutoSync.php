<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SetupAutoSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sheets:setup-auto-sync {--domain=localhost}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup automatic Google Sheets to Database synchronization';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $domain = $this->option('domain');
        
        $this->info('🚀 Setting up Automatic Google Sheets Sync...');
        $this->newLine();

        // Display webhook URLs
        $webhookUrl = "http://{$domain}/webhook/sheets-update";
        $verifyUrl = "http://{$domain}/webhook/verify";

        $this->info('📡 Webhook URLs:');
        $this->line("   • Update: {$webhookUrl}");
        $this->line("   • Verify: {$verifyUrl}");
        $this->newLine();

        // Check if webhook endpoint is accessible
        $this->info('🔍 Testing webhook endpoint...');
        try {
            $response = file_get_contents($verifyUrl);
            if ($response) {
                $this->info('✅ Webhook endpoint is accessible!');
            }
        } catch (\Exception $e) {
            $this->warn('⚠️  Could not test webhook endpoint. Make sure your server is running.');
        }
        $this->newLine();

        // Display Google Apps Script setup instructions
        $this->info('📋 Google Apps Script Setup Instructions:');
        $this->newLine();
        
        $this->line('1. 📊 Open your Google Sheets with barangay data');
        $this->line('2. 🔧 Go to Extensions > Apps Script');
        $this->line('3. 📝 Replace the default code with the script from:');
        $this->line('   google-apps-script/AutoSyncScript.gs');
        $this->newLine();
        
        $this->line('4. ⚙️  Update these variables in the script:');
        $this->line("   const WEBHOOK_URL = '{$webhookUrl}';");
        $this->line("   const VERIFY_URL = '{$verifyUrl}';");
        $this->newLine();
        
        $this->line('5. 💾 Save the script');
        $this->line('6. ▶️  Run the setupTriggers() function once');
        $this->line('7. ✅ Authorize the script when prompted');
        $this->newLine();

        // Display how it works
        $this->info('🔄 How Automatic Sync Works:');
        $this->line('   • User edits data in Google Sheets');
        $this->line('   • User saves (Ctrl+S) or auto-save occurs');
        $this->line('   • Google Apps Script detects the change');
        $this->line('   • Script sends webhook to your Laravel app');
        $this->line('   • Laravel automatically syncs data to database');
        $this->line('   • User sees confirmation notification in sheets');
        $this->newLine();

        // Display testing instructions
        $this->info('🧪 Testing the Setup:');
        $this->line('1. Add/edit data in any barangay sheet');
        $this->line('2. Save the sheet (Ctrl+S)');
        $this->line('3. Check Laravel logs: tail -f storage/logs/laravel.log');
        $this->line('4. Verify data in database with: php artisan sheets:sync --stats');
        $this->newLine();

        // Display troubleshooting
        $this->info('🔧 Troubleshooting:');
        $this->line('   • Check Laravel logs for webhook activity');
        $this->line('   • Verify Google Apps Script execution transcript');
        $this->line('   • Ensure webhook URLs are accessible from internet');
        $this->line('   • Test manual sync: php artisan sheets:sync');
        $this->newLine();

        $this->info('🎉 Setup complete! Your Google Sheets will now automatically sync to the database.');
        
        return 0;
    }
}
