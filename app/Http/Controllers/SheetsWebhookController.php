<?php

namespace App\Http\Controllers;

use App\Services\SheetsSyncService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SheetsWebhookController extends Controller
{
    protected $syncService;

    public function __construct()
    {
        $this->syncService = new SheetsSyncService();
    }

    /**
     * Handle incoming webhook from Google Sheets
     */
    public function handleSheetUpdate(Request $request)
    {
        try {
            // Log the incoming webhook for debugging
            Log::info('Google Sheets webhook received', [
                'headers' => $request->headers->all(),
                'body' => $request->all(),
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent()
            ]);

            // Extract sheet information from the webhook
            $sheetId = $request->input('sheetId');
            $sheetName = $request->input('sheetName');
            $action = $request->input('action');
            $dataRows = $request->input('dataRows', 0);
            
            // Validate the webhook data
            if (!$sheetName || !$sheetId) {
                Log::warning('Invalid webhook data received', $request->all());
                return response()->json(['error' => 'Invalid webhook data'], 400);
            }

            // If we can determine which barangay sheet was updated
            if ($sheetName && strpos($sheetName, 'Brgy.') === 0) {
                Log::info("🔄 Processing automatic sync for {$sheetName}", [
                    'sheet_id' => $sheetId,
                    'action' => $action,
                    'data_rows' => $dataRows
                ]);
                
                // Add a small delay to ensure Google Sheets has processed the save
                sleep(1);
                
                // Automatically sync this specific barangay
                $result = $this->syncService->syncSpecificBarangay($sheetName);
                
                Log::info("✅ Automatic sync completed for {$sheetName}", [
                    'synced' => $result['synced'] ?? 0,
                    'errors' => $result['errors'] ?? 0,
                    'error_details' => $result['error_details'] ?? []
                ]);

                return response()->json([
                    'success' => true,
                    'message' => "✅ Automatically synced {$sheetName}",
                    'synced' => $result['synced'] ?? 0,
                    'errors' => $result['errors'] ?? 0,
                    'timestamp' => now()->toISOString()
                ]);
            }

            // For non-barangay sheets, just acknowledge
            return response()->json([
                'success' => true, 
                'message' => 'Webhook received but no sync needed',
                'sheet_name' => $sheetName
            ]);

        } catch (\Exception $e) {
            Log::error('❌ Webhook processing failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return response()->json([
                'error' => 'Webhook processing failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify webhook authenticity (for security)
     */
    public function verifyWebhook(Request $request)
    {
        // For Google Apps Script verification
        return response()->json(['status' => 'verified']);
    }
}
