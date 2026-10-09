#!/usr/bin/env bash
set -e

echo "========================================================"
echo "       VOIVER - Open-Source Coqui TTS Studio"
echo "========================================================"
echo ""

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js (v18+) from https://nodejs.org"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "[1/2] Installing dependencies..."
    npm install
fi

echo ""
echo "[2/2] Starting VOIVER Studio server on http://localhost:3000..."
echo ""
npm run dev
