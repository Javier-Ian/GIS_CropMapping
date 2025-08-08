@echo off
title GIS Auto-Sync Service
echo ============================================
echo      GIS Google Sheets Auto-Sync Service
echo ============================================
echo.
echo Starting automatic sync every 30 seconds...
echo Press Ctrl+C to stop
echo.

cd /d "c:\xampp\htdocs\GIS"
php artisan sheets:auto-sync --interval=30
