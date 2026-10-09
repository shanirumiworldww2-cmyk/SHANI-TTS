# VOIVER - Open-Source Coqui TTS Studio

VOIVER is a studio-grade Text-to-Speech (TTS) application inspired by ElevenLabs, powered by open-source **Coqui TTS** architectures (XTTS-v2, VITS, YourTTS) with unlimited character linguistic chunking, local model hosting, zero-shot voice cloning, and batch script processing.

---

## 🚀 Quick Start (Running on Your Local PC)

### Prerequisites
1. **Node.js** (v18 or higher): [https://nodejs.org](https://nodejs.org)
2. (Optional, for local Coqui TTS): **Python 3.9–3.11** with PyTorch and CUDA.

---

### Method 1: One-Click Runner

- **Windows**: Double-click `run.bat`
- **Mac / Linux**: Run `chmod +x run.sh && ./run.sh`

---

### Method 2: Manual Terminal Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment** (Optional):
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` in `.env` if you wish to use the cloud neural TTS fallback when your local Coqui server is offline.

3. **Start the Studio**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 🎙️ Connecting Your Local Coqui TTS Engine

VOIVER is designed to connect directly to your local Coqui TTS instance for private, on-device audio generation without character caps or telemetry.

### 1. Install Coqui TTS in Python:
```bash
pip install TTS
```

### 2. Launch the Coqui TTS Server:
```bash
tts-server --model_name tts_models/multilingual/multi-dataset/xtts_v2 --port 5002
```

### 3. Or Run via GPU Docker:
```bash
docker run --gpus all -d -p 5002:5002 \
  -v ~/.local/share/tts:/root/.local/share/tts \
  ghcr.io/coqui-ai/tts:latest \
  --model_name tts_models/multilingual/multi-dataset/xtts_v2 --port 5002
```

In the VOIVER UI, click **"Local Host"** tab, verify the URL is set to `http://localhost:5002`, and click **"Test Connection"**.

---

## ⚡ Pocket TTS Engine by Kyutai Labs (100% CPU · No GPU Needed)

VOIVER now includes full source code and runners for **Pocket TTS**, Kyutai Labs' revolutionary 100M parameter model designed specifically for fast speech synthesis purely on CPU with ~200ms latency.

### 1-Click Launchers (Included in project):
- **Windows**: Double-click `run_pocket_tts.bat`
- **Mac / Linux**: Run `chmod +x run_pocket_tts.sh && ./run_pocket_tts.sh`

### Manual Launch:
```bash
pip install pocket-tts flask flask-cors soundfile numpy
python pocket_tts_server.py --port 5003
```

In VOIVER, go to the **"Local Host"** tab, click **"Pocket TTS (5003 · CPU)"**, and click **"Test Connection"**.

---

## ✨ Features

- **Unlimited Characters**: Automatically splits arbitrarily long articles, chapters, and books at sentence boundaries and stitches them into a single master `.wav` file with natural breathing pauses.
- **ElevenLabs-Grade Interface**: Real-time interactive waveform visualizer, voice parameter sliders (Stability, Similarity, Style Exaggeration, Speaker Boost, Speed, Pitch), and instant WAV downloads.
- **Batch Processing**: Bulk-synthesize multi-character scripts, podcast dialogues, and CSV scripts with individual audio previews and a 1-click **Merge Master Audio** button.
- **Voice Lab & Cloner**: Zero-shot voice cloning from 3–10s audio samples via Coqui XTTS latents.
- **Custom Fine-Tuned Model Uploads**: Upload your own PyTorch `.pth`/`.pt` checkpoints, `config.json`, and `speakers.pth` files to host them directly in the studio.
- **Generation Archive**: Full history of generated audio stems with audio scrubbing and bulk download.
