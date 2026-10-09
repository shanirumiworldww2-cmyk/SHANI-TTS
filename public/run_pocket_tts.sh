#!/usr/bin/env bash
set -e

echo "==================================================="
echo "  VOIVER - Pocket TTS (Kyutai 100M) Local Host"
echo "==================================================="

if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed or not in PATH."
    exit 1
fi

echo "Installing Pocket TTS requirements..."
python3 -m pip install --quiet pocket-tts flask flask-cors soundfile numpy scipy

echo "Starting Pocket TTS Server on http://localhost:5003..."
python3 pocket_tts_server.py --port 5003
