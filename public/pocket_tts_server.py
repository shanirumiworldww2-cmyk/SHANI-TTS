"""
Pocket TTS Local Server (Kyutai Labs 100M CPU Engine)
Compatible with VOIVER TTS Studio
Port: 5003

Installation:
  pip install pocket-tts flask flask-cors soundfile numpy scipy
Run:
  python pocket_tts_server.py --port 5003
"""

import os
import sys
import io
import argparse
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

pocket_model = None

def init_pocket_model():
    global pocket_model
    try:
        # Check if pocket-tts is installed
        import pocket_tts
        print("[Pocket TTS] Loading Kyutai 100M CPU model...")
        pocket_model = pocket_tts.load_model()
        print("[Pocket TTS] Model successfully loaded on CPU!")
    except ImportError:
        print("[Pocket TTS] Warning: 'pocket-tts' package not found.")
        print("[Pocket TTS] Run: pip install pocket-tts")
        pocket_model = None
    except Exception as e:
        print(f"[Pocket TTS] Error loading model: {e}")
        pocket_model = None

@app.route("/", methods=["GET"])
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "engine": "Pocket TTS (Kyutai 100M Engine)",
        "model_loaded": pocket_model is not None,
        "device": "cpu",
        "default_sample_rate": 24000
    })

@app.route("/api/tts", methods=["POST", "GET"])
def synthesize():
    if request.method == "GET":
        text = request.args.get("text", "")
        voice = request.args.get("voice", "default")
    else:
        data = request.json or {}
        text = data.get("text", "")
        voice = data.get("voice") or data.get("speaker_id", "default")

    if not text or not text.strip():
        return jsonify({"error": "Text parameter is required"}), 400

    print(f"[Pocket TTS] Synthesizing: {text[:60]}... (Voice: {voice})")

    try:
        # If pocket_tts package is available, use real inference
        if pocket_model is not None:
            import soundfile as sf
            wav_bytes = io.BytesIO()
            audio_array, sample_rate = pocket_model.synthesize(text, voice=voice)
            sf.write(wav_bytes, audio_array, sample_rate, format='WAV', subtype='PCM_16')
            wav_bytes.seek(0)
            return send_file(wav_bytes, mimetype="audio/wav")

        # Fallback to local TTS or edge synthesis if pocket-tts is installing
        try:
            import edge_tts
            import asyncio
            async def run_edge():
                communicate = edge_tts.Communicate(text, "en-US-GuyNeural")
                out = io.BytesIO()
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        out.write(chunk["data"])
                out.seek(0)
                return out
            audio_io = asyncio.run(run_edge())
            return send_file(audio_io, mimetype="audio/mpeg")
        except Exception:
            return jsonify({
                "error": "Pocket TTS model not loaded. Please run 'pip install pocket-tts' and restart.",
                "status": "model_missing"
            }), 503

    except Exception as e:
        print(f"[Pocket TTS] Synthesis error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="VOIVER Pocket TTS Server")
    parser.add_argument("--port", type=int, default=5003, help="Port to run server on (default: 5003)")
    parser.add_argument("--host", type=str, default="0.0.0.0", help="Host interface (default: 0.0.0.0)")
    args = parser.parse_args()

    init_pocket_model()
    print(f"==================================================")
    print(f"  VOIVER - Pocket TTS (Kyutai 100M) Local Server  ")
    print(f"  Running on: http://localhost:{args.port}        ")
    print(f"  CPU-Native Inference: Zero GPU Required         ")
    print(f"==================================================")
    app.run(host=args.host, port=args.port, debug=False)
