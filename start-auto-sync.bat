@echo off
title GIS Auto-Sync Service
echo ============================================
echo      GIS Google Sheets Auto-Sync Service
echo ============================================
echo.
echo Starting ULTRA-FAST sync every 1 second...
echo This provides NEAR-INSTANT sync for real-time updates!
echo Press Ctrl+C to stop
echo.
echo Make sure Laravel development server is running first:
echo   php artisan serve --port=8000
echo.

cd /d "c:\xampp\htdocs\GIS"

:retry
echo [%time%] Starting ultra-fast auto-sync (1-second intervals)...
php artisan sheets:auto-sync --interval=1
echo [%time%] Auto-sync stopped. Restarting in 3 seconds...
timeout /t 3 /nobreak >nul
goto retry
