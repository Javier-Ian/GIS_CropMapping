@echo off
title GIS Development Server
echo ============================================
echo         GIS Development Environment
echo ============================================
echo.
echo This will start both:
echo 1. Laravel Development Server (port 8000)
echo 2. ULTRA-FAST Auto-Sync Service (every 1 second!)
echo.
echo Press Ctrl+C to stop all services
echo.

cd /d "c:\xampp\htdocs\GIS"

echo Starting Laravel development server...
start "Laravel Server" cmd /k "php artisan serve --port=8000"

echo Waiting for server to start...
timeout /t 3 /nobreak >nul

echo Starting ultra-fast auto-sync service...
start "Ultra-Fast Auto-Sync" cmd /k "start-auto-sync.bat"

echo.
echo ✅ Both services are now running!
echo.
echo Laravel Server: http://localhost:8000
echo Ultra-Fast Auto-Sync: Running every 1 second!
echo.
echo Your data will sync ALMOST INSTANTLY! ⚡
echo.
echo Close this window or press Ctrl+C to stop everything.
pause
