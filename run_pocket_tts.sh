#!/usr/bin/env bash
set -e

echo "========================================================"
echo "    VOIVER Studio - Pocket TTS Engine (Kyutai 100M)"
echo "========================================================"
echo ""

if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed!"
    echo "Please install Python 3.10+ from https://python.org"
    exit 1
fi

echo "[1/2] Checking and installing Pocket TTS dependencies..."
python3 -m pip install pocket-tts flask flask-cors soundfile numpy

echo ""
echo "[2/2] Starting Pocket TTS local server on port 5003 (CPU Mode)..."
echo ""
python3 pocket_tts_server.py --port 5003
