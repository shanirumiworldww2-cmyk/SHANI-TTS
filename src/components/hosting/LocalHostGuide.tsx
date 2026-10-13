import React, { useState } from 'react';
import {
  Server,
  Terminal,
  Copy,
  Check,
  RefreshCw,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Code,
  Shield,
  Zap,
  Download,
} from 'lucide-react';
import { ServerConfig, CoquiModel } from '../../types/tts';

interface LocalHostGuideProps {
  serverConfig: ServerConfig;
  onUpdateServerConfig: (config: ServerConfig) => void;
  models: CoquiModel[];
}

export const LocalHostGuide: React.FC<LocalHostGuideProps> = ({
  serverConfig,
  onUpdateServerConfig,
  models,
}) => {
  const [testUrl, setTestUrl] = useState(serverConfig.localServerUrl);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    connected: boolean;
    latency?: number;
    message?: string;
  } | null>(null);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePingServer = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/coqui/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: testUrl }),
      });
      const data = await res.json();

      setTestResult({
        connected: data.connected,
        latency: data.latency,
        message: data.message,
      });

      onUpdateServerConfig({
        ...serverConfig,
        localServerUrl: testUrl,
        connected: data.connected,
        latency: data.latency,
        lastTested: new Date().toISOString(),
      });
    } catch (err: unknown) {
      setTestResult({
        connected: false,
        message: 'Could not connect to proxy. Ensure local server is running.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const pythonCliCommand = `pip install TTS
tts-server --model_name tts_models/multilingual/multi-dataset/xtts_v2 --port 5002`;

  const dockerCommand = `docker run --gpus all -d -p 5002:5002 \\
  -v ~/.local/share/tts:/root/.local/share/tts \\
  ghcr.io/coqui-ai/tts:latest \\
  --model_name tts_models/multilingual/multi-dataset/xtts_v2 --port 5002`;

  const pocketTtsCommand = `pip install pocket-tts flask flask-cors soundfile numpy
python pocket_tts_server.py --port 5003`;

  const customPythonServerScript = `from TTS.api import TTS
from flask import Flask, request, send_file
import io

app = Flask(__name__)

# Initialize custom fine-tuned checkpoint or XTTS-v2
tts = TTS(
    model_path="./checkpoints/best_model.pth",
    config_path="./checkpoints/config.json",
    gpu=True
)

@app.route("/api/tts", methods=["POST"])
def synthesize():
    data = request.json or {}
    text = data.get("text", "")
    speaker = data.get("speaker_id", "speaker_0")
    language = data.get("language", "en")
    
    # Synthesize to memory buffer
    wav_bytes = io.BytesIO()
    tts.tts_to_file(
        text=text,
        file_path="temp.wav",
        speaker_wav="./checkpoints/reference.wav", # or speaker=speaker
        language=language
    )
    return send_file("temp.wav", mimetype="audio/wav")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* 1-Click PC Download Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl flex-shrink-0">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">
              Execute TOOL BY SHANI on Your Local PC
            </h3>
            <p className="text-xs text-zinc-300 mt-0.5">
              Includes complete source code, Windows 1-click launcher (<code className="text-amber-300 font-mono">run.bat</code>), Mac/Linux launcher (<code className="text-amber-300 font-mono">run.sh</code>), Pocket TTS, Vercel serverless config, and 130+ voices.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <a
            href="/api/download-zip"
            download="voiver-tts-studio.zip"
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Download className="h-4 w-4 stroke-[2.5]" />
            <span>Download Project ZIP</span>
          </a>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#12141e] border border-white/[0.08] p-6 rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                Local Coqui TTS Host & Inference Engine
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Host open-source Coqui XTTS-v2 and VITS locally on your machine, workstation, or private GPU container with zero telemetry and unlimited characters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                serverConfig.connected
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  serverConfig.connected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              {serverConfig.connected ? 'Coqui Connected (Local)' : 'Local Host Ready'}
            </span>
          </div>
        </div>

        {/* Server Connection Form */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-8">
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Coqui TTS Local Server Endpoint URL
            </label>
            <div className="flex items-center bg-[#161824] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white">
              <span className="text-zinc-500 mr-2 font-mono">http://</span>
              <input
                type="text"
                value={testUrl.replace(/^https?:\/\//, '')}
                onChange={(e) => setTestUrl(`http://${e.target.value}`)}
                placeholder="localhost:5002"
                className="w-full bg-transparent focus:outline-none font-mono text-zinc-200"
              />
            </div>
            {/* Quick Presets */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] text-zinc-400">Quick Presets:</span>
              <button
                type="button"
                onClick={() => setTestUrl('http://localhost:5002')}
                className={`px-2 py-0.5 text-[11px] rounded-md font-mono border transition-colors ${
                  testUrl === 'http://localhost:5002'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/[0.04] text-zinc-300 border-white/[0.06] hover:bg-white/[0.08]'
                }`}
              >
                Coqui (5002)
              </button>
              <button
                type="button"
                onClick={() => setTestUrl('http://localhost:5003')}
                className={`px-2 py-0.5 text-[11px] rounded-md font-mono border transition-colors ${
                  testUrl === 'http://localhost:5003'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/[0.04] text-zinc-300 border-white/[0.06] hover:bg-white/[0.08]'
                }`}
              >
                Pocket TTS (5003 · CPU)
              </button>
            </div>
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <button
              onClick={handlePingServer}
              disabled={isTesting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl transition-all shadow-md"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>

        {/* Test Result Feedback */}
        {testResult && (
          <div
            className={`mt-4 p-3.5 rounded-xl border text-xs flex items-center gap-3 ${
              testResult.connected
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {testResult.connected ? (
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-400" />
            )}
            <div className="flex-1">
              <div>{testResult.message}</div>
              {testResult.latency && (
                <div className="text-[11px] opacity-80 font-mono mt-0.5">
                  Roundtrip latency: {testResult.latency}ms
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Deployment Guides & Terminal Recipes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method 1: Python CLI */}
        <div className="bg-[#10121b] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                1. Native Python Server (Fastest)
              </h3>
            </div>
            <button
              onClick={() => handleCopy(pythonCliCommand, 1)}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/[0.06] transition-colors"
              title="Copy Command"
            >
              {copiedIndex === 1 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="text-xs text-zinc-400">
            Install the open-source Coqui TTS engine and launch the local HTTP server on port 5002:
          </p>
          <pre className="bg-[#0b0c12] p-3 rounded-xl border border-white/[0.06] text-xs font-mono text-amber-300/90 overflow-x-auto leading-relaxed">
            {pythonCliCommand}
          </pre>
        </div>

        {/* Method 2: Docker GPU */}
        <div className="bg-[#10121b] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                2. Docker GPU Container (Production)
              </h3>
            </div>
            <button
              onClick={() => handleCopy(dockerCommand, 2)}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/[0.06] transition-colors"
              title="Copy Command"
            >
              {copiedIndex === 2 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="text-xs text-zinc-400">
            Run isolated Docker container with full NVIDIA CUDA GPU passthrough:
          </p>
          <pre className="bg-[#0b0c12] p-3 rounded-xl border border-white/[0.06] text-xs font-mono text-blue-300/90 overflow-x-auto leading-relaxed">
            {dockerCommand}
          </pre>
        </div>

        {/* Method 3: Pocket TTS by Kyutai Labs (CPU-Native) */}
        <div className="lg:col-span-2 bg-[#10121b] border border-emerald-500/20 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>3. Pocket TTS by Kyutai Labs (100% CPU · 200ms Latency · No GPU Needed)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                  Pre-Packaged
                </span>
              </h3>
            </div>
            <button
              onClick={() => handleCopy(pocketTtsCommand, 4)}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/[0.06] transition-colors"
              title="Copy Command"
            >
              {copiedIndex === 4 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="text-xs text-zinc-300">
            Pocket TTS is a revolutionary 100M parameter neural model by Kyutai Labs engineered specifically for fast, natural speech synthesis purely on CPU. Runs ~6x real-time on standard laptop CPUs with zero GPU requirements!
          </p>
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
            <span>• Pre-packaged launcher:</span>
            <code className="text-amber-300 bg-white/[0.04] px-1.5 py-0.5 rounded">run_pocket_tts.bat</code>
            <span>(Windows) or</span>
            <code className="text-amber-300 bg-white/[0.04] px-1.5 py-0.5 rounded">./run_pocket_tts.sh</code>
            <span>(Mac/Linux)</span>
          </div>

          {/* Direct File Downloads */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href="/pocket_tts_server.py"
              download="pocket_tts_server.py"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 hover:text-white rounded-lg text-xs font-mono border border-white/[0.08] transition-colors"
            >
              <Download className="h-3 w-3 text-emerald-400" />
              <span>pocket_tts_server.py</span>
            </a>
            <a
              href="/run_pocket_tts.bat"
              download="run_pocket_tts.bat"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 hover:text-white rounded-lg text-xs font-mono border border-white/[0.08] transition-colors"
            >
              <Download className="h-3 w-3 text-amber-400" />
              <span>run_pocket_tts.bat (Windows)</span>
            </a>
            <a
              href="/run_pocket_tts.sh"
              download="run_pocket_tts.sh"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 hover:text-white rounded-lg text-xs font-mono border border-white/[0.08] transition-colors"
            >
              <Download className="h-3 w-3 text-cyan-400" />
              <span>run_pocket_tts.sh (Mac/Linux)</span>
            </a>
          </div>
          <pre className="bg-[#0b0c12] p-3 rounded-xl border border-white/[0.06] text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed">
            {pocketTtsCommand}
          </pre>
        </div>

        {/* Method 4: Custom Checkpoint Server Template */}
        <div className="lg:col-span-2 bg-[#10121b] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                4. Custom Fine-Tuned Checkpoint Server Script (`serve_custom.py`)
              </h3>
            </div>
            <button
              onClick={() => handleCopy(customPythonServerScript, 3)}
              className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-white/[0.06] transition-colors"
              title="Copy Python Code"
            >
              {copiedIndex === 3 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
          <p className="text-xs text-zinc-400">
            Save this Python script to load your fine-tuned <code className="text-amber-300">best_model.pth</code> and expose the VOIVER synthesis API:
          </p>
          <pre className="bg-[#0b0c12] p-4 rounded-xl border border-white/[0.06] text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed max-h-72">
            {customPythonServerScript}
          </pre>
        </div>

        {/* Method 5: Vercel & Cloud Deployment */}
        <div className="lg:col-span-2 bg-[#10121b] border border-blue-500/20 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>5. Vercel & GitHub Deployment (Fix HTTP 404)</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.2 rounded font-mono">
                  Serverless Ready
                </span>
              </h3>
            </div>
          </div>
          <p className="text-xs text-zinc-300">
            If you deployed to Vercel via GitHub and saw <strong>HTTP 404</strong>, this repository now includes pre-configured <code className="text-amber-300">vercel.json</code> and <code className="text-amber-300">api/index.ts</code> serverless functions! Simply push this update to your GitHub repo, and Vercel will automatically route synthesis calls without any 404 errors.
          </p>
          <div className="bg-[#0b0c12] p-3 rounded-xl border border-white/[0.06] text-xs font-mono text-blue-300/90 leading-relaxed">
            <div># Git commit and push to Vercel</div>
            <div className="text-zinc-200">git add vercel.json api/index.ts</div>
            <div className="text-zinc-200">git commit -m &quot;Add Vercel serverless API handlers&quot;</div>
            <div className="text-zinc-200">git push origin main</div>
          </div>
        </div>
      </div>
    </div>
  );
};
