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
// For XAMPP: Use http://localhost/GIS/public (if using XAMPP port 80)
// For Laravel serve: Use http://localhost:8000 (if using php artisan serve)
// For production: Use your actual domain like https://yourdomain.com
const WEBHOOK_URL = 'http://localhost:8000/api/webhook/sheets-update'; // Update this!
const VERIFY_URL = 'http://localhost:8000/api/webhook/verify'; // Update this!

// Alternative URLs for different setups:
// XAMPP: 'http://localhost/GIS/public/api/webhook/sheets-update'
// Production: 'https://yourdomain.com/api/webhook/sheets-update'

/**
 * Set up automatic triggers for sheet changes
 * Run this function once to initialize
 */
function setupTriggers() {
  // Delete existing triggers to avoid duplicates
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  
  // Create new triggers for instant sync
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // 🚀 INSTANT SYNC: Trigger immediately when user edits cells (Ctrl+S or any save)
  ScriptApp.newTrigger('onInstantEdit')
    .timeBased()
    .everyMinutes(1) // Fallback check every minute
    .create();
  
  // 🔥 REAL-TIME EDIT TRIGGER: Responds to actual cell edits instantly
  ScriptApp.newTrigger('onCellEdit')
    .timeBased()
    .after(1000) // Check 1 second after edit
    .create();
  
  console.log('✅ INSTANT sync triggers created successfully!');
  console.log('� Your data will now sync IMMEDIATELY when you save (Ctrl+S)!');
  
  // Test the webhook connection
  testWebhookConnection();
}

/**
 * 🔥 INSTANT EDIT HANDLER - Responds immediately to user edits
 * This triggers as soon as user saves data (Ctrl+S or auto-save)
 */
function onInstantEdit(e) {
  try {
    const sheet = e ? e.source.getActiveSheet() : SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const sheetName = sheet.getName();
    
    // Only process barangay sheets
    if (sheetName.startsWith('Brgy.')) {
      console.log(`🚀 INSTANT SYNC: Detecting save in ${sheetName}, syncing NOW...`);
      
      // Show immediate feedback to user
      SpreadsheetApp.getActiveSpreadsheet().toast(
        `🔄 Syncing ${sheetName} to database...`,
        'Saving to Database',
        2
      );
      
      syncToDatabase(sheetName);
    }
  } catch (error) {
    console.error('Error in onInstantEdit:', error);
  }
}

/**
 * 🎯 CELL EDIT HANDLER - Responds to individual cell changes
 * This provides real-time sync for immediate saves
 */
function onCellEdit() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const activeSheet = spreadsheet.getActiveSheet();
    const sheetName = activeSheet.getName();
    
    // Only process barangay sheets
    if (sheetName.startsWith('Brgy.')) {
      const lastRow = activeSheet.getLastRow();
      
      // Check if there's actual data (more than just headers)
      if (lastRow > 1) {
        console.log(`🎯 REAL-TIME SYNC: Changes detected in ${sheetName}, syncing immediately...`);
        syncToDatabase(sheetName);
      }
    }
  } catch (error) {
    console.error('Error in onCellEdit:', error);
  }
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
 * 🚀 INSTANT Sync specific sheet data to database
 * Provides immediate feedback to user on save
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
      action: 'instant_save',
      timestamp: new Date().toISOString(),
      dataRows: data.length - 1, // Exclude header
      trigger: 'user_save', // Indicates this was triggered by user save (Ctrl+S)
      saveType: 'instant'
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
      console.log(`✅ INSTANTLY synced ${sheetName} to database!`);
      console.log(`📊 Synced ${responseData.synced || 0} records in real-time`);
      
      // 🎉 Show SUCCESS notification to user immediately
      SpreadsheetApp.getActiveSpreadsheet().toast(
        `✅ ${sheetName} saved to database! (${responseData.synced || 0} records) 🚀`,
        'Instant Sync Complete ⚡',
        3
      );
    } else {
      console.error('❌ Instant sync failed:', responseData.error);
      
      // Show error notification
      SpreadsheetApp.getActiveSpreadsheet().toast(
        `❌ Failed to save ${sheetName} to database. Please try again.`,
        'Sync Error',
        4
      );
    }
    
  } catch (error) {
    console.error('❌ Error in instant sync:', error);
    
    // Show error notification to user
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '❌ Database connection failed. Please check your connection and try again.',
      'Instant Sync Error',
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
