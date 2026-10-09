@echo off
title VOIVER - Pocket TTS Local Server
echo ===================================================
echo   VOIVER - Pocket TTS (Kyutai 100M) Local Host
echo ===================================================
echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ from https://python.org
    pause
    exit /b 1
)

echo Installing dependencies (pocket-tts, flask, soundfile)...
pip install pocket-tts flask flask-cors soundfile numpy scipy

echo.
echo Starting Pocket TTS Server on http://localhost:5003 ...
python pocket_tts_server.py --port 5003
pause
