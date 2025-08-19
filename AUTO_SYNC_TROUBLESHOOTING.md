# 🔧 Auto-Sync Troubleshooting Guide

## Current Status ✅
- **Manual Sync**: Working (found 3 records in Brgy. Salawagan)
- **Auto-Sync Command**: Working (polling every 30 seconds)
- **Webhook Endpoint**: Working (verified)
- **Laravel Server**: Running on http://localhost:8000

## 🚨 Why Auto-Sync Wasn't Working

1. **Auto-sync process wasn't running** - You need to start the polling service
2. **Google Apps Script might not be configured** for your local environment
3. **Server might not be running** on the expected port

## 🛠️ How to Fix Auto-Sync

### Step 1: Start the Development Environment
Run this file to start everything at once:
```
start-development-server.bat
```

OR manually start each service:

**Option A: Start Laravel Server**
```
php artisan serve --port=8000
```

**Option B: Start Auto-Sync Service** (in a new terminal)
```
start-auto-sync.bat
```

### Step 2: Configure Google Apps Script

1. **Open your Google Sheets** with the barangay data
2. **Go to Extensions > Apps Script**
3. **Copy the code** from `google-apps-script/AutoSyncScript.gs`
4. **Update the webhook URLs** to match your setup:
   ```javascript
   // For Laravel development server (recommended):
   const WEBHOOK_URL = 'http://localhost:8000/api/webhook/sheets-update';
   
   // For XAMPP (if you prefer):
   const WEBHOOK_URL = 'http://localhost/GIS/public/api/webhook/sheets-update';
   ```
5. **Save and run** `setupTriggers()` function once
6. **Authorize** the script when prompted

### Step 3: Test the Setup

1. **Make a change** in your Google Sheets (add/edit data)
2. **Check the logs** to see if webhook was received:
   ```
   php artisan sheets:monitor
   ```

## 🔍 Current Working Components

✅ **Webhook Controller**: Receives Google Sheets notifications
✅ **Sync Service**: Processes data from sheets to database  
✅ **Auto-Sync Command**: Polls for changes every 30 seconds
✅ **Database Models**: Stores data for each barangay

## 📊 Monitoring Commands

**Check sync status:**
```
php artisan sheets:status
```

**Manual sync (for testing):**
```
php artisan sheets:sync
```

**Monitor live activity:**
```
php artisan sheets:monitor
```

**View recent logs:**
```
Get-Content storage\logs\laravel.log -Tail 20
```

## 🔧 Troubleshooting Tips

1. **If auto-sync stops working**: Restart `start-auto-sync.bat`
2. **If webhooks aren't received**: Check Google Apps Script configuration
3. **If sync finds 0 records**: Verify data exists in Google Sheets
4. **If server is unreachable**: Make sure Laravel server is running

## 🎯 Next Steps

1. **Start both services** using `start-development-server.bat`
2. **Configure Google Apps Script** with correct webhook URL
3. **Test by making changes** in your Google Sheets
4. **Monitor the logs** to confirm everything is working

The auto-sync should now work properly! 🚀
