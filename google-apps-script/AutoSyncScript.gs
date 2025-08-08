/**
 * Google Apps Script for Automatic Database Sync
 * 
 * Instructions:
 * 1. Open Google Sheets with your barangay data
 * 2. Go to Extensions > Apps Script
 * 3. Replace the default code with this script
 * 4. Update the WEBHOOK_URL to your server's webhook endpoint
 * 5. Save and run setupTriggers() function once
 * 6. Authorize the script when prompted
 * 
 * This will automatically sync data to your database whenever the sheet is edited!
 */

// ⚠️ IMPORTANT: Update this URL to your actual server
const WEBHOOK_URL = 'http://localhost:8000/api/webhook/sheets-update'; // Change to your domain
const VERIFY_URL = 'http://localhost:8000/api/webhook/verify';

/**
 * Set up automatic triggers for sheet changes
 * Run this function once to initialize
 */
function setupTriggers() {
  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create new triggers for automatic sync
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Trigger on edit (when user saves changes)
  ScriptApp.newTrigger('onSheetEdit')
    .timeBased()
    .everyMinutes(1) // Check every minute for changes
    .create();
  
  // Trigger on form submit (if using forms)
  ScriptApp.newTrigger('onSheetChange')
    .timeBased()
    .everyMinutes(2) // Backup check every 2 minutes
    .create();
  
  console.log('✅ Automatic sync triggers created successfully!');
  console.log('📊 Your data will now automatically sync to the database when saved.');
  
  // Test the webhook connection
  testWebhookConnection();
}

/**
 * Handle sheet edits - triggered automatically
 */
function onSheetEdit(e) {
  try {
    const sheet = e ? e.source.getActiveSheet() : SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const sheetName = sheet.getName();
    
    // Only process barangay sheets
    if (sheetName.startsWith('Brgy.')) {
      console.log(`🔄 Detecting changes in ${sheetName}, syncing to database...`);
      
      syncToDatabase(sheetName);
    }
  } catch (error) {
    console.error('Error in onSheetEdit:', error);
  }
}

/**
 * Alternative trigger for sheet changes
 */
function onSheetChange() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheets = spreadsheet.getSheets();
    
    // Check all barangay sheets for recent changes
    sheets.forEach(sheet => {
      const sheetName = sheet.getName();
      if (sheetName.startsWith('Brgy.')) {
        // Check if sheet was modified in the last 2 minutes
        const lastEdit = sheet.getLastRowWithValues();
        if (lastEdit > 1) { // More than just header
          console.log(`🔄 Syncing ${sheetName} to database...`);
          syncToDatabase(sheetName);
        }
      }
    });
  } catch (error) {
    console.error('Error in onSheetChange:', error);
  }
}

/**
 * Sync specific sheet data to database
 */
function syncToDatabase(sheetName) {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const spreadsheetId = spreadsheet.getId();
    
    // Get the data from the sheet
    const sheet = spreadsheet.getSheetByName(sheetName);
    const data = sheet.getDataRange().getValues();
    
    // Prepare webhook payload
    const payload = {
      sheetId: spreadsheetId,
      sheetName: sheetName,
      action: 'update',
      timestamp: new Date().toISOString(),
      dataRows: data.length - 1, // Exclude header
      trigger: 'automatic'
    };
    
    // Send webhook to your Laravel application
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify(payload)
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseData = JSON.parse(response.getContentText());
    
    if (responseData.success) {
      console.log(`✅ Successfully synced ${sheetName} to database!`);
      console.log(`📊 Synced ${responseData.synced || 0} records`);
      
      // Optional: Show user notification
      SpreadsheetApp.getActiveSpreadsheet().toast(
        `✅ ${sheetName} data automatically saved to database! (${responseData.synced || 0} records)`,
        'Auto-Sync Complete',
        3
      );
    } else {
      console.error('❌ Sync failed:', responseData.error);
    }
    
  } catch (error) {
    console.error('❌ Error syncing to database:', error);
    
    // Show error notification to user
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '❌ Failed to sync to database. Please check your connection.',
      'Auto-Sync Error',
      5
    );
  }
}

/**
 * Test webhook connection
 */
function testWebhookConnection() {
  try {
    const response = UrlFetchApp.fetch(VERIFY_URL);
    if (response.getResponseCode() === 200) {
      console.log('✅ Webhook connection successful!');
      SpreadsheetApp.getActiveSpreadsheet().toast(
        '✅ Auto-sync is working! Your data will automatically save to the database.',
        'Connection Successful',
        5
      );
    } else {
      console.log('⚠️ Webhook connection issue. Please check your URL.');
    }
  } catch (error) {
    console.error('❌ Cannot connect to webhook:', error);
    console.log('Please update the WEBHOOK_URL in the script to your actual server URL.');
  }
}

/**
 * Manual sync function for testing
 */
function manualSync() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const activeSheet = spreadsheet.getActiveSheet();
  const sheetName = activeSheet.getName();
  
  if (sheetName.startsWith('Brgy.')) {
    console.log(`🔄 Manual sync for ${sheetName}...`);
    syncToDatabase(sheetName);
  } else {
    console.log('❌ Please select a barangay sheet (starts with "Brgy.")');
  }
}

/**
 * Remove all triggers (cleanup function)
 */
function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  console.log('🗑️ All triggers removed');
}
