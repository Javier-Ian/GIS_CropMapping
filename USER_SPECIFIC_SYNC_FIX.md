# Fix: User-Specific Crop Data Sync

## Problem Identified

The crop sync data was visible to all users because the crop tables didn't have a `user_id` column. When User 2 synced data, it appeared in User 1's view because:

1. **No User Isolation**: The crop tables (`brgy_butong_crops`, `brgy_salawagan_crops`, `brgy_san_jose_crops`) lacked a `user_id` field
2. **Global Data Storage**: All synced crop data was stored globally without tracking which user performed the sync
3. **Unfiltered Queries**: Database queries didn't filter by authenticated user

## Solution Implemented

### 1. Database Migration
Added a `user_id` foreign key column to all three crop tables:
- `brgy_butong_crops`
- `brgy_salawagan_crops`
- `brgy_san_jose_crops`

**Migration File**: `database/migrations/2025_11_02_000001_add_user_id_to_crop_tables.php`

### 2. Model Updates
Updated all crop models to:
- Include `user_id` in the `$fillable` array
- Add a `user()` relationship method

**Updated Files**:
- `app/Models/BrgyButongCrop.php`
- `app/Models/BrgySalawaganCrop.php`
- `app/Models/BrgySanJoseCrop.php`

### 3. Service Layer Updates
Updated `SheetsSyncService` to:
- Accept and store `user_id` in the constructor
- Include `user_id` when syncing data from Google Sheets
- Filter all queries by authenticated user's ID
- Use composite key (`user_id` + `sheet_row_index`) for updateOrCreate operations

**Updated File**: `app/Services/SheetsSyncService.php`

## How to Apply the Fix

### Step 1: Run the Migration
```bash
php artisan migrate
```

This will add the `user_id` column to all crop tables.

### Step 2: Clear Existing Data (Optional)
If you want to remove old data that isn't associated with any user:
```bash
php artisan tinker
```
Then in tinker:
```php
App\Models\BrgyButongCrop::whereNull('user_id')->delete();
App\Models\BrgySalawaganCrop::whereNull('user_id')->delete();
App\Models\BrgySanJoseCrop::whereNull('user_id')->delete();
```

### Step 3: Clear Application Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Step 4: Test the Fix
1. **Login as User 1**: Sync some data for any barangay
2. **Login as User 2**: Sync different data for the same barangay
3. **Verify**: 
   - User 1 should only see their own synced data
   - User 2 should only see their own synced data
   - The "Synced At" timestamp should reflect each user's last sync

## What Changed

### Before
```php
// Data was stored without user association
$modelClass::updateOrCreate(
    ['sheet_row_index' => $rowIndex],
    $data
);

// Queries returned all data
$modelClass::count();
$modelClass::orderBy('created_at', 'desc')->get();
```

### After
```php
// Data is stored with user association
$modelClass::updateOrCreate(
    [
        'user_id' => $this->userId,
        'sheet_row_index' => $rowIndex
    ],
    $data
);

// Queries are filtered by user
$modelClass::where('user_id', $this->userId)->count();
$modelClass::where('user_id', $this->userId)->orderBy('created_at', 'desc')->get();
```

## Benefits

1. **Data Isolation**: Each user only sees their own synced crop data
2. **Multi-User Support**: Multiple users can sync the same barangays independently
3. **Data Integrity**: Each user maintains their own version of the crop data
4. **Privacy**: Users can't see other users' crop data

## Notes

- The `user_id` is automatically retrieved from `auth()->id()` when the service is instantiated
- The foreign key constraint ensures data integrity (if a user is deleted, their crop data is also deleted)
- The composite unique key (`user_id` + `sheet_row_index`) prevents duplicate entries for the same sheet row per user
- Different users can have different data for the same sheet row index

## Rollback (if needed)

If you need to rollback this change:
```bash
php artisan migrate:rollback --step=1
```

Then revert the changes to:
- `app/Models/BrgyButongCrop.php`
- `app/Models/BrgySalawaganCrop.php`
- `app/Models/BrgySanJoseCrop.php`
- `app/Services/SheetsSyncService.php`
