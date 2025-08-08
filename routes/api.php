<?php

use App\Http\Controllers\SheetsWebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Webhook routes (no authentication required)
Route::post('webhook/sheets-update', [SheetsWebhookController::class, 'handleSheetUpdate']);
Route::get('webhook/verify', [SheetsWebhookController::class, 'verifyWebhook']);
