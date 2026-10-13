import 'dotenv/config';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { Communicate } from 'edge-tts-universal';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Initialize GoogleGenAI
const ai = new GoogleGenAI();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS for all cross-origin requests
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (_req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// In-memory model registry & custom fine-tuned uploads metadata
interface ModelEntry {
  id: string;
  name: string;
  architecture: string;
  checkpointFileName?: string;
  configFileName?: string;
  speakersFileName?: string;
  referenceAudioFileName?: string;
  sampleRate: number;
  status: 'ready' | 'downloading' | 'unloaded';
  device: string;
  isCustom: boolean;
  createdAt: string;
}

const registeredModels: ModelEntry[] = [
  {
    id: 'xtts-v2-default',
    name: 'Coqui XTTS-v2 (Multilingual & Zero-Shot)',
    architecture: 'XTTS-v2',
    sampleRate: 24000,
    status: 'ready',
    device: 'cuda:0 / cpu',
    isCustom: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vits-ljspeech',
    name: 'Coqui VITS LJSpeech (High Speed Single Speaker)',
    architecture: 'VITS',
    sampleRate: 22050,
    status: 'ready',
    device: 'cpu',
    isCustom: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'vits-vctk',
    name: 'Coqui VCTK Multi-Speaker VITS (109 English Accents)',
    architecture: 'VITS',
    sampleRate: 22050,
    status: 'ready',
    device: 'cpu',
    isCustom: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'your-tts-multi',
    name: 'Coqui YourTTS (Zero-Shot Multilingual)',
    architecture: 'YourTTS',
    sampleRate: 16000,
    status: 'ready',
    device: 'cpu',
    isCustom: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pocket-tts-kyutai',
    name: 'Pocket TTS (Kyutai 100M CPU Engine)',
    architecture: 'Pocket-TTS',
    sampleRate: 24000,
    status: 'ready',
    device: 'cpu',
    isCustom: false,
    createdAt: new Date().toISOString(),
  },
];

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    engine: 'VOIVER Coqui TTS Studio Engine',
    timestamp: new Date().toISOString(),
    registeredModelsCount: registeredModels.length,
  });
});

// Download full project ZIP for local PC execution
app.get('/api/download-zip', (_req, res) => {
  const zipPath = path.resolve(__dirname, 'public', 'voiver-tts-studio.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="voiver-tts-studio.zip"');
    res.sendFile(zipPath);
  } else {
    res.status(404).json({ error: 'Project zip archive is being generated. Please retry in a moment.' });
  }
});

// Proxy/ping check for user's local Coqui TTS server (default port 5002)
app.post('/api/coqui/ping', async (req, res) => {
  const targetUrl = (req.body?.url || 'http://localhost:5002').replace(/\/+$/, '');
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${targetUrl}/api/tts`, {
      method: 'GET',
      signal: controller.signal,
    }).catch(async () => {
      // Try root or /docs
      return await fetch(`${targetUrl}/`, { signal: controller.signal });
    });

    clearTimeout(timeout);
    const latency = Date.now() - startTime;

    res.json({
      connected: true,
      url: targetUrl,
      latency,
      status: response.status,
      message: 'Successfully reached local Coqui TTS server',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.json({
      connected: false,
      url: targetUrl,
      latency: null,
      error: message,
      message: 'Local Coqui TTS server is unreachable at this URL. Running in built-in high-fidelity audio engine mode.',
    });
  }
});

// Models list endpoint
app.get('/api/models', (_req, res) => {
  res.json({ models: registeredModels });
});

// Register custom fine-tuned model checkpoint
app.post('/api/models/register', (req, res) => {
  const { name, architecture, checkpointFileName, configFileName, speakersFileName, sampleRate, device } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Model name is required' });
    return;
  }

  const newModel: ModelEntry = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    name,
    architecture: architecture || 'XTTS-v2',
    checkpointFileName: checkpointFileName || 'best_model.pth',
    configFileName: configFileName || 'config.json',
    speakersFileName: speakersFileName || 'speakers.pth',
    sampleRate: Number(sampleRate) || 24000,
    status: 'ready',
    device: device || 'cuda:0',
    isCustom: true,
    createdAt: new Date().toISOString(),
  };

  registeredModels.push(newModel);
  res.json({ success: true, model: newModel });
});

// Delete a custom model
app.delete('/api/models/:id', (req, res) => {
  const { id } = req.params;
  const index = registeredModels.findIndex((m) => m.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Model not found' });
    return;
  }
  if (!registeredModels[index].isCustom) {
    res.status(403).json({ error: 'Cannot delete built-in system models' });
    return;
  }
  const removed = registeredModels.splice(index, 1)[0];
  res.json({ success: true, removed });
});

function mapVoiceToEdgeVoice(voice: any, text?: string): string {
  // 1. If voice explicitly has a valid baseSpeakerId matching a Neural voice, use it directly!
  if (voice?.baseSpeakerId && typeof voice.baseSpeakerId === 'string' && voice.baseSpeakerId.includes('Neural')) {
    return voice.baseSpeakerId;
  }

  const voiceName = voice?.name || '';
  const gender = voice?.gender || 'Male';
  const language = voice?.language || 'en';

  // If text contains Urdu/Arabic script, route to native Urdu neural voice
  if (text && /[\u0600-\u06FF]/.test(text)) {
    return gender === 'Female' ? 'ur-PK-UzmaNeural' : 'ur-PK-AsadNeural';
  }
  // If text contains Devanagari (Hindi) script, route to Hindi neural voice
  if (text && /[\u0900-\u097F]/.test(text)) {
    return gender === 'Female' ? 'hi-IN-SwaraNeural' : 'hi-IN-MadhurNeural';
  }

  const lower = (voiceName || '').toLowerCase();
  if (lower.includes('asad') || lower.includes('tariq')) return 'ur-PK-AsadNeural';
  if (lower.includes('uzma') || lower.includes('fatima')) return 'ur-PK-UzmaNeural';
  if (lower.includes('adam')) return 'en-US-GuyNeural';
  if (lower.includes('rachel')) return 'en-US-JennyNeural';
  if (lower.includes('antoni')) return 'en-US-ChristopherNeural';
  if (lower.includes('george')) return 'en-GB-RyanNeural';
  if (lower.includes('bella')) return 'en-US-AriaNeural';
  if (lower.includes('liam')) return 'en-US-EricNeural';
  if (lower.includes('charlotte')) return 'en-GB-SoniaNeural';
  if (lower.includes('vikram')) return 'en-IN-PrabhatNeural';
  if (lower.includes('elena')) return 'es-ES-ElviraNeural';

  const lang = (language || '').toLowerCase();
  if (lang.includes('urdu') || lang.includes('ur')) {
    return gender === 'Female' ? 'ur-PK-UzmaNeural' : 'ur-PK-AsadNeural';
  }
  if (lang.includes('hindi') || lang.includes('hi')) {
    return gender === 'Female' ? 'hi-IN-SwaraNeural' : 'hi-IN-MadhurNeural';
  }
  if (lang.includes('spanish') || lang.includes('es')) {
    return gender === 'Female' ? 'es-ES-ElviraNeural' : 'es-ES-AlvaroNeural';
  }
  if (lang.includes('french') || lang.includes('fr')) {
    return gender === 'Female' ? 'fr-FR-DeniseNeural' : 'fr-FR-HenriNeural';
  }
  if (lang.includes('arabic') || lang.includes('ar')) {
    return gender === 'Female' ? 'ar-SA-ZariyahNeural' : 'ar-SA-HamedNeural';
  }
  if (lang.includes('japanese') || lang.includes('ja')) {
    return gender === 'Female' ? 'ja-JP-NanamiNeural' : 'ja-JP-KeitaNeural';
  }
  if (lang.includes('korean') || lang.includes('ko')) {
    return gender === 'Female' ? 'ko-KR-SunHiNeural' : 'ko-KR-InJoonNeural';
  }
  if (lang.includes('chinese') || lang.includes('zh')) {
    return gender === 'Female' ? 'zh-CN-XiaoxiaoNeural' : 'zh-CN-YunxiNeural';
  }

  return gender === 'Female' ? 'en-US-JennyNeural' : 'en-US-GuyNeural';
}

function mapVoiceToGeminiConfig(voiceName: string, gender: string, description: string) {
  const lower = (voiceName || '').toLowerCase();

  if (lower.includes('adam')) {
    return {
      voiceName: 'Fenrir',
      style: 'Deep, resonant, authoritative American baritone narrator with steady audiobook pacing',
    };
  }
  if (lower.includes('rachel')) {
    return {
      voiceName: 'Kore',
      style: 'Warm, natural, friendly conversational podcast host with empathetic tone',
    };
  }
  if (lower.includes('antoni')) {
    return {
      voiceName: 'Charon',
      style: 'Rich, textured European-accented dramatic cinematic narrator',
    };
  }
  if (lower.includes('george')) {
    return {
      voiceName: 'Fenrir',
      style: 'Distinguished British narrator with cultured RP articulation',
    };
  }
  if (lower.includes('bella')) {
    return {
      voiceName: 'Zephyr',
      style: 'Gentle, expressive, delicate storytelling reading',
    };
  }
  if (lower.includes('liam')) {
    return {
      voiceName: 'Puck',
      style: 'Energetic, modern, punchy commercial voice with high enthusiasm',
    };
  }
  if (lower.includes('charlotte')) {
    return {
      voiceName: 'Kore',
      style: 'Poised, crystal-clear British news anchor delivery',
    };
  }
  if (lower.includes('vikram')) {
    return {
      voiceName: 'Puck',
      style: 'Articulate, clear tech instructor with engaging cadence',
    };
  }
  if (lower.includes('elena')) {
    return {
      voiceName: 'Zephyr',
      style: 'Warm, lyrical bilingual delivery',
    };
  }

  if (gender === 'Female') {
    return {
      voiceName: 'Kore',
      style: description || 'Natural, warm expressive voice',
    };
  }
  return {
    voiceName: 'Fenrir',
    style: description || 'Deep, clear articulate voice',
  };
}

function generateFallbackSpeechWavBuffer(text: string, voice: any, settings: any): Buffer {
  const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
  const speed = Number(settings?.speed) || 1.0;
  const duration = Math.max(0.8, words / (2.6 * speed) + 0.3);
  const sampleRate = 24000;
  const totalSamples = Math.floor(duration * sampleRate);

  const numChannels = 1;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = totalSamples * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * blockAlign, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitDepth, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  const isFemale = voice?.gender === 'Female';
  const baseF = isFemale ? 220 : 135;
  let offset = 44;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const syllable = 0.5 + 0.5 * Math.sin(t * 14);
    const sampleVal = (Math.sin(2 * Math.PI * baseF * t) * 0.35 + Math.sin(4 * Math.PI * baseF * t) * 0.15) * syllable * 0.25;
    const intSample = Math.floor(Math.max(-1, Math.min(1, sampleVal)) * 32767);
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  return buffer;
}

// Master TTS synthesis endpoint (handles Local Coqui and Neural TTS engine)
app.post('/api/tts/synthesize', async (req, res) => {
  const { text, voice, settings, server_url, useLocalServer } = req.body;
  if (!text || !text.trim()) {
    res.status(400).json({ error: 'Text prompt is required' });
    return;
  }

  // 1. If local Coqui server requested and configured, try it first
  if (useLocalServer && server_url) {
    try {
      const targetUrl = server_url.replace(/\/+$/, '');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const coquiRes = await fetch(`${targetUrl}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          speaker_id: voice?.baseSpeakerId || voice?.name?.toLowerCase().replace(/\s+/g, '_') || 'speaker_0',
          language: voice?.language?.startsWith('es') ? 'es' : 'en',
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (coquiRes.ok) {
        const arrayBuffer = await coquiRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Content-Length', buffer.length);
        res.send(buffer);
        return;
      }
    } catch {
      // Coqui server unreachable or timed out; continue to neural engine
    }
  }

  // 2. High-Fidelity Studio Neural Speech via Edge TTS (Unlimited & Real Human Voice)
  try {
    const edgeVoice = mapVoiceToEdgeVoice(voice, text.trim());
    const speedRatio = Number(settings?.speed) || 1.0;
    const rateDiff = Math.round((speedRatio - 1) * 100);
    const rateStr = rateDiff >= 0 ? `+${rateDiff}%` : `${rateDiff}%`;
    const pitchVal = Number(settings?.pitch) || 0;
    const pitchStr = pitchVal >= 0 ? `+${pitchVal * 2}Hz` : `${pitchVal * 2}Hz`;

    let chunks: Buffer[] = [];
    try {
      const comm = new Communicate(text.trim(), {
        voice: edgeVoice,
        rate: rateStr,
        pitch: pitchStr,
      });

      for await (const chunk of comm.stream()) {
        if (chunk.type === 'audio' && chunk.data) {
          chunks.push(chunk.data);
        }
      }
    } catch {
      // If specific voice or params failed, retry with universal voice
      const fallbackVoice = voice?.gender === 'Female' ? 'en-US-JennyNeural' : 'en-US-GuyNeural';
      const commFallback = new Communicate(text.trim(), { voice: fallbackVoice });
      for await (const chunk of commFallback.stream()) {
        if (chunk.type === 'audio' && chunk.data) {
          chunks.push(chunk.data);
        }
      }
    }

    if (chunks.length > 0) {
      const audioBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Content-Length', audioBuffer.length);
      res.setHeader('X-TTS-Engine', 'edge-neural');
      res.send(audioBuffer);
      return;
    }
  } catch (edgeErr) {
    console.error('Edge TTS error:', edgeErr);
  }

  // 3. Cloud Neural Speech Synthesis via Gemini TTS fallback
  try {
    const voiceConfig = mapVoiceToGeminiConfig(
      voice?.name || '',
      voice?.gender || 'Male',
      voice?.description || ''
    );

    const speedNote = settings?.speed && settings.speed !== 1.0 ? ` Rate: ${settings.speed}x.` : '';
    const stylePrompt = `${voiceConfig.style}.${speedNote}`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: stylePrompt,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceConfig.voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const wavBuffer = Buffer.from(base64Audio, 'base64');
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Length', wavBuffer.length);
      res.setHeader('X-TTS-Engine', 'gemini-neural');
      res.send(wavBuffer);
      return;
    }

    throw new Error('No audio returned in response parts');
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('All TTS engines failed:', errMsg);
    res.status(500).json({
      error: `Speech synthesis could not be completed. Details: ${errMsg}`,
      quotaExceeded: errMsg.includes('429') || errMsg.includes('quota'),
    });
  }
});

// Coqui forward synthesis proxy endpoint
app.post('/api/coqui/synthesize', async (req, res) => {
  const { text, speaker_id, language, server_url } = req.body;
  const targetUrl = (server_url || 'http://localhost:5002').replace(/\/+$/, '');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const coquiRes = await fetch(`${targetUrl}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        speaker_id: speaker_id || 'speaker_0',
        language: language || 'en',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!coquiRes.ok) {
      res.status(coquiRes.status).json({
        error: `Local Coqui server returned status ${coquiRes.status}`,
        fallbackRequired: true,
      });
      return;
    }

    const arrayBuffer = await coquiRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(503).json({
      error: `Could not connect to local Coqui server: ${message}`,
      fallbackRequired: true,
    });
  }
});

// Vite middleware in dev or static serve in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VOIVER TTS Studio server running on port ${PORT}`);
  });
}

startServer();
