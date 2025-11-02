# Quick Fix: Regenerate Google Service Account Credentials

## Current Status
✗ **Service Account Email**: `cjgis-mapping-googlesheets@sign-in-api-441001.iam.gserviceaccount.com`  
✗ **Error**: Invalid or expired credentials  
✗ **Impact**: Cannot access Google Sheets for all 3 barangays

---

## Option 1: Generate New Key for Existing Service Account (Recommended - 5 minutes)

### Step 1: Go to Google Cloud Console
1. Open: https://console.cloud.google.com/
2. Sign in with your Google account
3. Select project: **sign-in-api-441001**

### Step 2: Navigate to Service Account
1. Click **☰ Menu** (top left)
2. Go to **IAM & Admin** → **Service Accounts**
3. Find: `cjgis-mapping-googlesheets@sign-in-api-441001.iam.gserviceaccount.com`
4. Click on it

### Step 3: Generate New Key
1. Go to the **Keys** tab
2. Click **Add Key** → **Create New Key**
3. Select **JSON** format
4. Click **Create**
5. A JSON file will download automatically (e.g., `sign-in-api-441001-abc123.json`)

### Step 4: Replace credentials.json
1. Locate the downloaded JSON file (usually in your Downloads folder)
2. **Backup old credentials** (optional):
   ```powershell
   Copy-Item "c:\xampp\htdocs\CJ_GIS\public\credentials.json" "c:\xampp\htdocs\CJ_GIS\public\credentials.json.backup"
   ```
3. **Replace the file**:
   - Rename downloaded file to: `credentials.json`
   - Copy it to: `c:\xampp\htdocs\CJ_GIS\public\credentials.json`
   
   Or use PowerShell:
   ```powershell
   Move-Item "C:\Users\Ian Dave\Downloads\sign-in-api-441001-*.json" "c:\xampp\htdocs\CJ_GIS\public\credentials.json" -Force
   ```

### Step 5: Verify Service Account Has Spreadsheet Access
1. Open your Google Spreadsheet: https://docs.google.com/spreadsheets/d/1KJbz08BhzwYH9vpFRGyrZWgqBoYWHEv8xcUU3NI0s4g/edit
2. Click **Share** button (top right)
3. Check if `cjgis-mapping-googlesheets@sign-in-api-441001.iam.gserviceaccount.com` is in the list
4. If **NOT** in the list:
   - Click "Add people and groups"
   - Paste: `cjgis-mapping-googlesheets@sign-in-api-441001.iam.gserviceaccount.com`
   - Select **Editor** role
   - **UNCHECK** "Notify people"
   - Click **Share**

### Step 6: Clear Cache & Test
```powershell
cd c:\xampp\htdocs\CJ_GIS
php artisan config:clear
php artisan cache:clear
php test_google_sheets_connection.php
```

If you see ✓ marks, **IT'S WORKING!** Try clicking the Google Sheets button again.

---

## Option 2: Create Completely New Service Account (If Option 1 Fails - 10 minutes)

### Step 1: Create New Service Account
1. Go to: https://console.cloud.google.com/
2. Select project: **sign-in-api-441001**
3. Go to **IAM & Admin** → **Service Accounts**
4. Click **Create Service Account**
5. **Name**: `CJ-GIS Crop Mapping Service`
6. **ID**: Will auto-generate (e.g., `cj-gis-crop-mapping-service@sign-in-api-441001.iam.gserviceaccount.com`)
7. Click **Create and Continue**
8. **Role**: Skip (not needed for Sheets API)
9. Click **Continue** → **Done**

### Step 2: Generate Key
1. Click on the newly created service account
2. Go to **Keys** tab
3. Click **Add Key** → **Create New Key**
4. Select **JSON**
5. Click **Create** (file downloads automatically)

### Step 3: Replace credentials.json
Same as Option 1, Step 4

### Step 4: Share Spreadsheet with NEW Service Account
1. Open the downloaded JSON file
2. Copy the `client_email` value (the new service account email)
3. Go to spreadsheet: https://docs.google.com/spreadsheets/d/1KJbz08BhzwYH9vpFRGyrZWgqBoYWHEv8xcUU3NI0s4g/edit
4. Click **Share**
5. Paste the new email address
6. Select **Editor** role
7. **UNCHECK** "Notify people"
8. Click **Share**

### Step 5: Test
```powershell
cd c:\xampp\htdocs\CJ_GIS
php artisan config:clear
php test_google_sheets_connection.php
```

---

## Troubleshooting

### Issue: "Project not found"
**Solution**: You may not have access to the project. Create a new Google Cloud project:
1. Go to: https://console.cloud.google.com/
2. Click project dropdown (top)
3. Click **New Project**
4. Name: "CJ GIS Crop Mapping"
5. Click **Create**
6. **Enable Google Sheets API**:
   - Go to **APIs & Services** → **Library**
   - Search: "Google Sheets API"
   - Click **Enable**
7. Then follow Option 2 above

### Issue: Still getting errors after replacing credentials
**Solutions**:
1. Make sure file is named exactly: `credentials.json`
2. Check file permissions (should be readable)
3. Verify JSON is valid (open in notepad, should be valid JSON)
4. Clear browser cache: `Ctrl + Shift + Delete`
5. Restart your development server

### Issue: "Permission denied" on spreadsheet
**Solution**: The service account must be explicitly shared with the spreadsheet. Follow Step 5 in Option 1.

---

## Expected Result

After successful fix, you should see:

✅ **Diagnostic Test**:
```
✓ Successfully got URL for Brgy. Butong
✓ Successfully got URL for Brgy. Salawagan
✓ Successfully got URL for Brgy. San Jose
```

✅ **Browser**: Clicking Google Sheets button redirects to the correct sheet

✅ **All 3 Barangays**: Butong, Salawagan, San Jose all work

---

## Security Notes

⚠️ **IMPORTANT**:
- Never share or commit `credentials.json` to GitHub
- Keep the JSON file secure
- Rotate keys every 90 days (best practice)
- Delete old keys after creating new ones

---

## Need Help?

If you're still stuck after trying these options:
1. Check the Laravel logs: `storage/logs/laravel.log`
2. Run the diagnostic: `php test_google_sheets_connection.php`
3. Check if you have owner/editor access to the Google Cloud project
4. Verify your Google account has permissions

---

**Estimated Time**: 5-10 minutes  
**Difficulty**: Easy  
**Success Rate**: 99% (if you have access to Google Cloud Console)
