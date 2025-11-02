# Google Sheets Authentication Error - Fix Guide

## Problem
You're seeing a **500 SERVER ERROR** or "Invalid JWT Signature" error when trying to access Google Sheets through the GIS Crop Mapping system.

## Root Cause
The Google Service Account credentials (`credentials.json`) have expired or are invalid. Google Service Account keys can expire or become invalid for several reasons:

1. **Key Expiration**: Service account keys can be rotated or expired for security
2. **Invalid Signature**: The JWT token signature doesn't match
3. **Revoked Access**: The service account may have had its access revoked
4. **Changed Permissions**: The service account no longer has access to the spreadsheet

## Solution: Regenerate Service Account Credentials

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with the account that created the original service account
3. Select your project (or create a new one if needed)

### Step 2: Enable Google Sheets API
1. Navigate to **APIs & Services** > **Library**
2. Search for "Google Sheets API"
3. Click **Enable** if not already enabled

### Step 3: Create/Update Service Account
1. Go to **APIs & Services** > **Credentials**
2. If you have an existing service account:
   - Find your service account in the list
   - Click on it to view details
3. If you need to create a new one:
   - Click **Create Credentials** > **Service Account**
   - Enter a name (e.g., "GIS Crop Mapping Service")
   - Click **Create and Continue**
   - Skip the optional steps and click **Done**

### Step 4: Generate New Key
1. In the service account details page
2. Go to the **Keys** tab
3. Click **Add Key** > **Create New Key**
4. Select **JSON** format
5. Click **Create**
6. The key will download automatically as a JSON file

### Step 5: Replace credentials.json
1. Locate the downloaded JSON file (usually in your Downloads folder)
2. Rename it to `credentials.json`
3. Replace the existing file at:
   ```
   c:\xampp\htdocs\CJ_GIS\public\credentials.json
   ```

### Step 6: Share Spreadsheet with Service Account
1. Open the downloaded `credentials.json` file
2. Find the `client_email` field (looks like: `xxx@xxx.iam.gserviceaccount.com`)
3. Copy this email address
4. Open your Google Spreadsheet (ID: `1KJbz08BhzwYH9vpFRGyrZWgqBoYWHEv8xcUU3NI0s4g`)
5. Click **Share** button
6. Paste the service account email
7. Grant **Editor** permissions
8. Uncheck "Notify people" (it's a bot account)
9. Click **Share**

### Step 7: Verify the Fix
1. Clear the Laravel cache:
   ```bash
   php artisan cache:clear
   php artisan config:clear
   ```
2. Try accessing the Google Sheets redirect again
3. It should now work without errors

## Quick Verification Script

Run this in your terminal to check if credentials are valid:

```bash
php artisan tinker
```

Then run:
```php
$service = new \App\Services\GoogleSheetsService();
$url = $service->getSheetUrlForBarangay('Butong');
echo $url;
```

If you get a URL without errors, the credentials are working!

## Common Issues

### Issue: "Credentials file not found"
**Solution**: Make sure `credentials.json` is in the `public` folder, not `storage`

### Issue: "Permission denied" 
**Solution**: Make sure you shared the spreadsheet with the service account email

### Issue: "Quota exceeded"
**Solution**: Google has API usage limits. Wait a few minutes or upgrade your Google Cloud project

## Security Best Practices

1. **Never commit credentials.json to Git**: Add it to `.gitignore`
2. **Rotate keys regularly**: Generate new keys every 90 days
3. **Limit permissions**: Only grant necessary permissions to the service account
4. **Monitor usage**: Check Google Cloud Console for unusual activity

## Need Help?

If you're still experiencing issues:
1. Check the Laravel logs: `storage/logs/laravel.log`
2. Look for detailed error messages
3. Verify all steps above were completed correctly
4. Contact your system administrator

## Additional Resources

- [Google Service Accounts Documentation](https://cloud.google.com/iam/docs/service-accounts)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Service Account Key Best Practices](https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys)
