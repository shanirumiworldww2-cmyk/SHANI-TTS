@echo off
echo ========================================================
echo        VOIVER - Open-Source Coqui TTS Studio
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js (v18+) from https://nodejs.org
    pause
    exit /b 1
)

if not exist node_modules (
    echo [1/2] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
)

echo.
echo [2/2] Starting VOIVER Studio server on http://localhost:3000...
echo.
call npm run dev
pause
