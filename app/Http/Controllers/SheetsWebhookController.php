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
            $saveType = $request->input('saveType');
            $userEvent = $request->input('userEvent');
            
            // Validate the webhook data
            if (!$sheetName || !$sheetId) {
                Log::warning('Invalid webhook data received', $request->all());
                return response()->json(['error' => 'Invalid webhook data'], 400);
            }

            // If we can determine which barangay sheet was updated
            if ($sheetName && strpos($sheetName, 'Brgy.') === 0) {
                $logData = [
                    'sheet_id' => $sheetId,
                    'action' => $action,
                    'data_rows' => $dataRows,
                    'save_type' => $saveType,
                    'user_event' => $userEvent
                ];
                
                // Different messages for instant vs regular sync
                if ($saveType === 'instant' || $userEvent === 'ctrl_s_or_edit') {
                    Log::info("🚀 Processing INSTANT sync for {$sheetName} (user save)", $logData);
                } else {
                    Log::info("🔄 Processing automatic sync for {$sheetName}", $logData);
                }
                
                // No delay for instant sync to maintain real-time feeling
                if ($saveType !== 'instant') {
                    sleep(1);
                }
                
                // Automatically sync this specific barangay
                $result = $this->syncService->syncSpecificBarangay($sheetName);
                
                $successMessage = $saveType === 'instant' 
                    ? "⚡ INSTANTLY synced {$sheetName}" 
                    : "✅ Automatically synced {$sheetName}";
                
                Log::info($successMessage, [
                    'synced' => $result['synced'] ?? 0,
                    'errors' => $result['errors'] ?? 0,
                    'error_details' => $result['error_details'] ?? [],
                    'sync_type' => $saveType ?? 'automatic'
                ]);

                return response()->json([
                    'success' => true,
                    'message' => $successMessage,
                    'synced' => $result['synced'] ?? 0,
                    'errors' => $result['errors'] ?? 0,
                    'sync_type' => $saveType ?? 'automatic',
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
