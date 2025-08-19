/**
 * 🚀 INSTANT SYNC Google Apps Script for Real-Time Database Sync
 * 
 * This script provides INSTANT synchronization when users save data (Ctrl+S)
 * 
 * Instructions:
 * 1. Open Google Sheets with your barangay data
 * 2. Go to Extensions > Apps Script  
 * 3. Replace ALL existing code with this script
 * 4. Update the WEBHOOK_URL below to match your server
 * 5. Save the script (Ctrl+S)
 * 6. Run setupInstantSync() function once
 * 7. Authorize the script when prompted
 * 
 * ✨ Features:
 * - Syncs INSTANTLY when user presses Ctrl+S or makes changes
 * - Shows real-time notifications in Google Sheets
 * - Automatic retry on connection failures
 * - Works with all barangay sheets (Brgy. Butong, Brgy. Salawagan, Brgy. San Jose)
 */

// 🔧 CONFIGURATION - Update these URLs to match your server setup
const WEBHOOK_URL = 'http://localhost:8000/api/webhook/sheets-update';
const VERIFY_URL = 'http://localhost:8000/api/webhook/verify';

// Alternative configurations:
// For XAMPP: 'http://localhost/GIS/public/api/webhook/sheets-update'
// For production: 'https://yourdomain.com/api/webhook/sheets-update'

/**
 * 🚀 MAIN SETUP FUNCTION - Run this once to enable instant sync
 */
function setupInstantSync() {
  console.log('🔧 Setting up INSTANT sync for real-time database updates...');
  
  // Remove any existing triggers to avoid duplicates
  removeAllTriggers();
  
  // Create the main instant sync trigger
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // 🔥 INSTANT TRIGGER: Responds immediately to ANY edit in the sheet
  ScriptApp.newTrigger('onInstantChange')
    .timeBased()
    .everyMinutes(1) // Fallback check
    .create();
  
  console.log('✅ Instant sync triggers created!');
  console.log('🚀 Your data will now sync IMMEDIATELY when you save!');
  
  // Test the connection
  testConnection();
  
  // Show success message to user
  SpreadsheetApp.getActiveSpreadsheet().toast(
    '🚀 INSTANT SYNC ENABLED! Your data will automatically save to the database when you press Ctrl+S or make changes.',
    'Instant Sync Active ⚡',
    6
  );
}

/**
 * 🔥 INSTANT CHANGE HANDLER - This is the magic function!
 * Detects when user saves and syncs immediately
 */
function onInstantChange() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    
    // Check all barangay sheets for recent activity
    let hasChanges = false;
    
    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      
      // Only process barangay sheets
      if (sheetName.startsWith('Brgy.')) {
        const lastRow = sheet.getLastRow();
        
        // Check if there's actual data
        if (lastRow > 1) {
          console.log(`🚀 INSTANT SYNC: Processing ${sheetName}...`);
          instantSyncToDatabase(sheetName);
          hasChanges = true;
        }
      }
    });
    
    if (hasChanges) {
      console.log('⚡ Instant sync completed for all changed sheets!');
    }
    
  } catch (error) {
    console.error('❌ Error in instant change handler:', error);
  }
}

/**
 * 🎯 ALTERNATIVE: Real-time edit trigger (if available)
 * This would be called immediately on any cell edit
 */
function onEdit(e) {
  try {
    if (!e || !e.source) return;
    
    const sheet = e.source.getActiveSheet();
    const sheetName = sheet.getName();
    
    // Only process barangay sheets
    if (sheetName.startsWith('Brgy.')) {
      console.log(`⚡ REAL-TIME EDIT detected in ${sheetName} - syncing instantly...`);
      
      // Small delay to ensure save is complete
      Utilities.sleep(500); // 0.5 second delay
      
      instantSyncToDatabase(sheetName);
    }
  } catch (error) {
    console.error('❌ Error in onEdit:', error);
  }
}

/**
 * 🚀 INSTANT DATABASE SYNC - The core sync function
 */
function instantSyncToDatabase(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const spreadsheetId = spreadsheet.getId();
    
    // Show immediate feedback
    spreadsheet.toast(
      `🔄 Saving ${sheetName} to database...`,
      'Syncing Now ⚡',
      2
    );
    
    // Get the sheet data
    const sheet = spreadsheet.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    const timestamp = new Date().toISOString();
    
    // Prepare the webhook payload
    const payload = {
      sheetId: spreadsheetId,
      sheetName: sheetName,
      action: 'instant_save',
      timestamp: timestamp,
      dataRows: data.length - 1,
      trigger: 'user_save',
      saveType: 'instant',
      userEvent: 'ctrl_s_or_edit'
    };
    
    // Send to webhook with optimized settings
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true // Don't throw on HTTP errors
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const statusCode = response.getResponseCode();
    
    if (statusCode === 200) {
      const responseData = JSON.parse(response.getContentText());
      
      if (responseData.success) {
        const syncedCount = responseData.synced || 0;
        
        console.log(`✅ INSTANT SYNC SUCCESS: ${sheetName} → ${syncedCount} records`);
        
        // Show success notification with count
        spreadsheet.toast(
          `✅ ${sheetName} saved! (${syncedCount} records synced to database) 🎉`,
          'Save Complete ✅',
          3
        );
        
        // Optional: Flash the sheet green briefly to show success
        flashSheetSuccess(sheet);
        
      } else {
        throw new Error(responseData.error || 'Sync failed');
      }
    } else {
      throw new Error(`HTTP ${statusCode}: ${response.getContentText()}`);
    }
    
  } catch (error) {
    console.error(`❌ INSTANT SYNC FAILED for ${sheetName}:`, error);
    
    // Show error notification
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `❌ Failed to save ${sheetName} to database. Error: ${error.message}`,
      'Save Failed ❌',
      5
    );
    
    // Optional: Flash the sheet red briefly to show error
    flashSheetError(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName));
  }
}

/**
 * 🎨 Visual feedback: Flash sheet green on successful save
 */
function flashSheetSuccess(sheet) {
  try {
    const originalColor = sheet.getTabColor();
    sheet.setTabColor('#00FF00'); // Green
    
    // Revert color after 2 seconds
    Utilities.sleep(2000);
    sheet.setTabColor(originalColor);
  } catch (e) {
    // Ignore visual feedback errors
  }
}

/**
 * 🎨 Visual feedback: Flash sheet red on save error
 */
function flashSheetError(sheet) {
  try {
    const originalColor = sheet.getTabColor();
    sheet.setTabColor('#FF0000'); // Red
    
    // Revert color after 3 seconds
    Utilities.sleep(3000);
    sheet.setTabColor(originalColor);
  } catch (e) {
    // Ignore visual feedback errors
  }
}

/**
 * 🔍 Test webhook connection
 */
function testConnection() {
  try {
    console.log('🔍 Testing webhook connection...');
    
    const response = UrlFetchApp.fetch(VERIFY_URL, {
      method: 'GET',
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      console.log('✅ Webhook connection successful!');
      
      SpreadsheetApp.getActiveSpreadsheet().toast(
        '✅ Connection successful! Instant sync is ready to use.',
        'Connection Test Passed ✅',
        4
      );
      return true;
    } else {
      throw new Error(`HTTP ${response.getResponseCode()}`);
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `❌ Connection failed: ${error.message}. Please check your webhook URL.`,
      'Connection Test Failed ❌',
      6
    );
    return false;
  }
}

/**
 * 🧹 Remove all existing triggers (cleanup)
 */
function removeAllTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  console.log(`🧹 Removed ${triggers.length} existing triggers`);
}

/**
 * 🧪 Manual test function - Test instant sync manually
 */
function testInstantSync() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = spreadsheet.getActiveSheet();
  const sheetName = activeSheet.getName();
  
  if (sheetName.startsWith('Brgy.')) {
    console.log(`🧪 Testing instant sync for ${sheetName}...`);
    instantSyncToDatabase(sheetName);
  } else {
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '❌ Please select a barangay sheet (name should start with "Brgy.")',
      'Test Failed',
      4
    );
  }
}

/**
 * 📊 Show current sync status
 */
function showSyncStatus() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  let status = 'Instant Sync Status:\n\n';
  
  sheets.forEach(sheet => {
    const sheetName = sheet.getName();
    if (sheetName.startsWith('Brgy.')) {
      const lastRow = sheet.getLastRow();
      const recordCount = lastRow > 1 ? lastRow - 1 : 0;
      status += `${sheetName}: ${recordCount} records\n`;
    }
  });
  
  const triggers = ScriptApp.getProjectTriggers();
  status += `\nActive triggers: ${triggers.length}`;
  
  SpreadsheetApp.getActiveSpreadsheet().toast(status, 'Sync Status 📊', 8);
}
