import express from 'express';
import { Communicate } from 'edge-tts-universal';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  next();
});

app.get(['/api/health', '/health', '/api/index/health'], (_req, res) => {
  res.json({
    status: 'ok',
    engine: 'TOOL BY SHANI - Neural Edge TTS Vercel Serverless Engine',
    timestamp: new Date().toISOString(),
  });
});

function mapVoiceToEdgeVoice(voice: any, text?: string): string {
  if (voice?.baseSpeakerId && typeof voice.baseSpeakerId === 'string' && voice.baseSpeakerId.includes('Neural')) {
    return voice.baseSpeakerId;
  }

  const voiceName = voice?.name || '';
  const gender = voice?.gender || 'Male';
  const language = voice?.language || 'en';

  if (text && /[\u0600-\u06FF]/.test(text)) {
    return gender === 'Female' ? 'ur-PK-UzmaNeural' : 'ur-PK-AsadNeural';
  }
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

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    engine: 'TOOL BY SHANI - Neural Edge TTS Vercel Serverless Engine',
    timestamp: new Date().toISOString(),
  });
});

app.get(['/api/download-zip', '/download-zip'], (_req, res) => {
  res.redirect('/voiver-tts-studio.zip');
});

app.post(['/api/tts/synthesize', '/tts/synthesize', '/api/index/tts/synthesize', '/api/index', '/synthesize'], async (req, res) => {
  const { text, voice, settings, server_url, useLocalServer } = req.body;
  if (!text || !text.trim()) {
    res.status(400).json({ error: 'Text prompt is required' });
    return;
  }

  // 1. If user configured external local server URL, try forwarding
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
    } catch {}
  }

  // 2. High-Fidelity Studio Neural Speech via Edge TTS
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
      // Fallback to universal voice
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

    throw new Error('No audio chunks returned by neural engine');
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: `Speech synthesis error: ${errMsg}` });
  }
});

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
      return await fetch(`${targetUrl}/`, { signal: controller.signal });
    });

    clearTimeout(timeout);
    const latency = Date.now() - startTime;

    res.json({
      connected: true,
      url: targetUrl,
      latency,
      status: response.status,
      message: 'Successfully reached local server',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.json({
      connected: false,
      url: targetUrl,
      latency: null,
      error: message,
      message: 'Local server is unreachable at this URL. Running in built-in neural engine mode.',
    });
  }
});

export default app;
