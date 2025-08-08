# 🔄 Automatic Google Sheets to Database Sync

## Overview
This system enables **real-time automatic synchronization** from Google Sheets to your XAMPP database. When users press **Ctrl+S** or auto-save occurs in Google Sheets, the data is immediately stored in your database.

## 🚀 How It Works

### The Process:
1. **User edits data** in Google Sheets (name, place, crop, dates, etc.)
2. **User saves** (Ctrl+S) or Google Sheets auto-saves
3. **Google Apps Script trigger** detects the change
4. **Webhook is sent** to your Laravel application
5. **Laravel automatically syncs** data to the appropriate barangay database table
6. **User sees notification** confirming data was saved to database

### Technical Flow:
```
Google Sheets → Google Apps Script → Webhook → Laravel → Database
```

## 📋 Setup Instructions

### Step 1: Server Setup (Already Done ✅)
- Webhook endpoints created at `/webhook/sheets-update` and `/webhook/verify`
- Database tables for each barangay created
- Automatic sync service implemented

### Step 2: Configure Your Domain
Run this command with your actual domain:
```bash
php artisan sheets:setup-auto-sync --domain=yourdomain.com
```

### Step 3: Google Apps Script Setup
1. **Open Google Sheets** with your barangay data
2. **Go to Extensions > Apps Script**
3. **Replace default code** with the script from `google-apps-script/AutoSyncScript.gs`
4. **Update the URLs** in the script:
   ```javascript
   const WEBHOOK_URL = 'http://yourdomain.com/webhook/sheets-update';
   const VERIFY_URL = 'http://yourdomain.com/webhook/verify';
   ```
5. **Save the script** (Ctrl+S)
6. **Run `setupTriggers()` function** once
7. **Authorize** when prompted

### Step 4: Test the Setup
1. **Edit data** in any barangay sheet
2. **Save** (Ctrl+S)
3. **Check logs**: `php artisan sheets:monitor --follow`
4. **Verify database**: Check your database tables

## 🎯 What Gets Synced

### Data Mapping:
| Google Sheets Column | Database Field |
|---------------------|---------------|
| Column A (Name) | `name` |
| Column B (Place) | `place` |
| Column C (Crop) | `crop` |
| Column D (Planting Date) | `planting_date` |
| Column E (Harvest Date) | `harvest_date` |
| Column F (Total Area) | `total_area` |
| Column G (Total Yield) | `total_yield` |

### Database Tables:
- **Brgy. Butong** → `brgy_butong_crops`
- **Brgy. Salawagan** → `brgy_salawagan_crops`
- **Brgy. San Jose** → `brgy_san_jose_crops`

## 🔧 Management Commands

### Setup and Configuration:
```bash
# Setup automatic sync
php artisan sheets:setup-auto-sync --domain=yourdomain.com

# Monitor sync activity in real-time
php artisan sheets:monitor --follow

# Check current statistics
php artisan sheets:monitor
```

### Manual Sync (Backup):
```bash
# Sync all barangays manually
php artisan sheets:sync

# Sync specific barangay
php artisan sheets:sync "Brgy. Butong"
```

### Testing:
```bash
# Add sample data for testing
php artisan sheets:add-sample-data "Brgy. Butong"
```

## 📊 Monitoring and Logs

### Real-time Monitoring:
```bash
# Follow webhook activity
php artisan sheets:monitor --follow

# View recent activity
php artisan sheets:monitor --lines=20
```

### Log Locations:
- **Laravel Logs**: `storage/logs/laravel.log`
- **Google Apps Script**: Check execution transcript in Apps Script editor

### What to Look For:
- ✅ `Successfully synced [X] records`
- 🔄 `Processing automatic sync for Brgy. [Name]`
- ❌ Error messages if sync fails

## 🔒 Security

### Webhook Security:
- Webhooks are logged for monitoring
- Rate limiting can be added if needed
- Only processes barangay sheets (starts with "Brgy.")

### Data Validation:
- Skips empty rows and placeholder data
- Validates sheet names before processing
- Error handling prevents data corruption

## 🐛 Troubleshooting

### Common Issues:

#### 1. Webhook Not Triggered
**Symptoms**: No logs, no auto-sync
**Solutions**:
- Check if Google Apps Script triggers are set up
- Verify webhook URLs are correct
- Ensure server is accessible from internet

#### 2. Sync Fails
**Symptoms**: Webhook received but no database updates
**Solutions**:
- Check Laravel logs for errors
- Verify database connection
- Test manual sync: `php artisan sheets:sync`

#### 3. Google Apps Script Errors
**Symptoms**: Script execution fails
**Solutions**:
- Check Apps Script execution transcript
- Re-authorize the script
- Verify webhook URLs are accessible

### Debug Commands:
```bash
# Test webhook endpoint
curl -X POST http://yourdomain.com/webhook/sheets-update \
  -H "Content-Type: application/json" \
  -d '{"sheetName":"Brgy. Butong","action":"test"}'

# Check database records
php artisan tinker --execute="echo App\Models\BrgyButongCrop::count();"

# Monitor logs
tail -f storage/logs/laravel.log | grep webhook
```

## ✨ Features

### Automatic Features:
- **Real-time sync** when data is saved
- **Smart detection** of barangay sheets only
- **Duplicate prevention** using row tracking
- **Error recovery** with detailed logging
- **User notifications** in Google Sheets

### Manual Features:
- **Web interface** for manual sync at `/sync`
- **Command-line tools** for admin management
- **Statistics dashboard** for monitoring
- **Sample data generation** for testing

## 🎉 Success Indicators

### When Working Correctly:
1. **User saves data** in Google Sheets
2. **Toast notification** appears: "✅ Data automatically saved to database!"
3. **Laravel logs** show: "✅ Automatic sync completed for Brgy. [Name]"
4. **Database contains** the new/updated records
5. **Web interface** shows updated statistics

## 📈 Next Steps

### Once Set Up:
1. **Train users** on the process
2. **Monitor logs** regularly
3. **Set up automated monitoring** alerts
4. **Consider backup schedules** for critical data

### Potential Enhancements:
- **Real-time notifications** to users when sync completes
- **Conflict resolution** for simultaneous edits
- **Data validation rules** before sync
- **Automatic retry** on failed syncs
- **Mobile app integration** for field data collection

---

**🚀 Your Google Sheets now automatically sync to the database when saved!**
