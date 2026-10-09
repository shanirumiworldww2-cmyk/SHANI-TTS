@echo off
echo ========================================================
echo     VOIVER Studio - Pocket TTS Engine (Kyutai 100M)
echo ========================================================
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python (3.10+) from https://python.org
    pause
    exit /b 1
)

echo [1/2] Checking and installing Pocket TTS dependencies...
python -m pip install pocket-tts flask flask-cors soundfile numpy

echo.
echo [2/2] Starting Pocket TTS local server on port 5003 (CPU Mode)...
echo.
python pocket_tts_server.py --port 5003
pause
