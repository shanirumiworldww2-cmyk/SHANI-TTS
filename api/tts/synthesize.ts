import { Communicate } from 'edge-tts-universal';

// Helper to parse JSON body across Vercel Serverless / Node HTTP runtimes
async function parseRequestBody(req: any): Promise<any> {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

interface MappedVoiceResult {
  voice: string;
  isUrduScript: boolean;
  isHindiScript: boolean;
}

/**
 * Maps input voice and text to appropriate Edge TTS Neural voice.
 * CRITICAL: Detects Urdu and Hindi scripts FIRST before checking baseSpeakerId,
 * preserving baseSpeakerId only if it genuinely supports the detected script.
 */
function mapVoiceToEdgeVoice(voice: any, text?: string): MappedVoiceResult {
  const trimmedText = (text || '').trim();
  const isUrduScript = /[\u0600-\u06FF]/.test(trimmedText);
  const isHindiScript = /[\u0900-\u097F]/.test(trimmedText);
  const gender = voice?.gender || 'Male';
  const baseId = typeof voice?.baseSpeakerId === 'string' ? voice.baseSpeakerId : '';
  const lang = typeof voice?.language === 'string' ? voice.language.toLowerCase() : '';

  // 1. Detect Urdu/Arabic script BEFORE checking baseSpeakerId
  if (isUrduScript) {
    if (baseId.startsWith('ur-') || lang.includes('ur') || lang.includes('urdu')) {
      const selectedVoice = baseId.includes('Neural') ? baseId : (gender === 'Female' ? 'ur-PK-UzmaNeural' : 'ur-PK-AsadNeural');
      return { voice: selectedVoice, isUrduScript: true, isHindiScript: false };
    }
    // Incompatible baseSpeakerId (e.g. English Jenny) -> Route to genuine Urdu neural voice matching gender
    return {
      voice: gender === 'Female' ? 'ur-PK-UzmaNeural' : 'ur-PK-AsadNeural',
      isUrduScript: true,
      isHindiScript: false,
    };
  }

  // 2. Detect Hindi/Devanagari script BEFORE checking baseSpeakerId
  if (isHindiScript) {
    if (baseId.startsWith('hi-') || lang.includes('hi') || lang.includes('hindi')) {
      const selectedVoice = baseId.includes('Neural') ? baseId : (gender === 'Female' ? 'hi-IN-SwaraNeural' : 'hi-IN-MadhurNeural');
      return { voice: selectedVoice, isUrduScript: false, isHindiScript: true };
    }
    // Incompatible baseSpeakerId -> Route to genuine Hindi neural voice matching gender
    return {
      voice: gender === 'Female' ? 'hi-IN-SwaraNeural' : 'hi-IN-MadhurNeural',
      isUrduScript: false,
      isHindiScript: true,
    };
  }

  // 3. For Latin/other scripts, apply baseSpeakerId if it matches a Neural voice
  if (baseId && baseId.includes('Neural')) {
    return { voice: baseId, isUrduScript: false, isHindiScript: false };
  }

  const voiceName = (voice?.name || '').toLowerCase();
  if (voiceName.includes('asad') || voiceName.includes('tariq')) return { voice: 'ur-PK-AsadNeural', isUrduScript: false, isHindiScript: false };
  if (voiceName.includes('uzma') || voiceName.includes('fatima')) return { voice: 'ur-PK-UzmaNeural', isUrduScript: false, isHindiScript: false };
  if (voiceName.includes('adam')) return { voice: 'en-US-GuyNeural', isUrduScript: false, isHindiScript: false };
  if (voiceName.includes('rachel')) return { voice: 'en-US-JennyNeural', isUrduScript: false, isHindiScript: false };
  if (voiceName.includes('antoni')) return { voice: 'en-US-ChristopherNeural', isUrduScript: false, isHindiScript: false };
  if (voiceName.includes('george')) return { voice: 'en-GB-RyanNeural', isUrduScript: false, isHindiScript: false };
  if (voiceName.includes('bella')) return { voice: 'en-US-AriaNeural', isUrduScript: false, isHindiScript: false };
  if (voiceName.includes('liam')) return { voice: 'en-US-EricNeural', isUrduScript: false, isHindiScript: false };
  if (voiceName.includes('charlotte')) return { voice: 'en-GB-SoniaNeural', isUrduScript: false, isHindiScript: false };
  if (voiceName.includes('vikram')) return { voice: 'en-IN-PrabhatNeural', isUrduScript: false, isHindiScript: false };
  if (voiceName.includes('elena')) return { voice: 'es-ES-ElviraNeural', isUrduScript: false, isHindiScript: false };

  if (lang.includes('urdu') || lang.includes('ur')) {
    return { voice: gender === 'Female' ? 'ur-PK-UzmaNeural' : 'ur-PK-AsadNeural', isUrduScript: false, isHindiScript: false };
  }
  if (lang.includes('hindi') || lang.includes('hi')) {
    return { voice: gender === 'Female' ? 'hi-IN-SwaraNeural' : 'hi-IN-MadhurNeural', isUrduScript: false, isHindiScript: false };
  }
  if (lang.includes('spanish') || lang.includes('es')) {
    return { voice: gender === 'Female' ? 'es-ES-ElviraNeural' : 'es-ES-AlvaroNeural', isUrduScript: false, isHindiScript: false };
  }
  if (lang.includes('french') || lang.includes('fr')) {
    return { voice: gender === 'Female' ? 'fr-FR-DeniseNeural' : 'fr-FR-HenriNeural', isUrduScript: false, isHindiScript: false };
  }
  if (lang.includes('arabic') || lang.includes('ar')) {
    return { voice: gender === 'Female' ? 'ar-SA-ZariyahNeural' : 'ar-SA-HamedNeural', isUrduScript: false, isHindiScript: false };
  }
  if (lang.includes('japanese') || lang.includes('ja')) {
    return { voice: gender === 'Female' ? 'ja-JP-NanamiNeural' : 'ja-JP-KeitaNeural', isUrduScript: false, isHindiScript: false };
  }
  if (lang.includes('korean') || lang.includes('ko')) {
    return { voice: gender === 'Female' ? 'ko-KR-SunHiNeural' : 'ko-KR-InJoonNeural', isUrduScript: false, isHindiScript: false };
  }
  if (lang.includes('chinese') || lang.includes('zh')) {
    return { voice: gender === 'Female' ? 'zh-CN-XiaoxiaoNeural' : 'zh-CN-YunxiNeural', isUrduScript: false, isHindiScript: false };
  }

  return { voice: gender === 'Female' ? 'en-US-JennyNeural' : 'en-US-GuyNeural', isUrduScript: false, isHindiScript: false };
}

/**
 * Collects audio chunks from Edge TTS Communicate stream with an explicit timeout.
 * Cancels and cleans up the async generator stream on timeout or error.
 */
async function collectStreamWithTimeout(
  comm: Communicate,
  timeoutMs: number = 8500
): Promise<Buffer[]> {
  const chunks: Buffer[] = [];
  const generator = comm.stream();
  let timer: NodeJS.Timeout | null = null;
  let timedOut = false;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      timedOut = true;
      reject(new Error(`Edge TTS synthesis timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    await Promise.race([
      (async () => {
        for await (const chunk of generator) {
          if (timedOut) break;
          if (chunk.type === 'audio' && chunk.data) {
            chunks.push(chunk.data);
          }
        }
      })(),
      timeoutPromise,
    ]);
    return chunks;
  } catch (err) {
    try {
      await generator.return(undefined as any);
    } catch {
      // Stream iterator already closed or cleanup complete
    }
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export default async function handler(req: any, res: any) {
  const reqStart = Date.now();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      status: 'ok',
      engine: 'SHANI-TTS / VOIVER Neural TTS Cloud Engine',
      endpoint: '/api/tts/synthesize',
      usage: 'POST JSON with { text, voice, settings }',
    }));
    return;
  }

  try {
    const body = await parseRequestBody(req);
    const { text, voice, settings, server_url, useLocalServer } = body;

    if (!text || !text.trim()) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Text prompt is required' }));
      return;
    }

    // 1. If local Coqui server explicitly requested and configured, try it with short timeout
    if (useLocalServer && server_url) {
      const coquiStart = Date.now();
      try {
        const targetUrl = server_url.replace(/\/+$/, '');
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        console.log(`[TTS Timing] Attempting optional local server: ${targetUrl}`);
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
          if (buffer.length >= 256) {
            console.log(`[TTS Timing] Local server completed in ${Date.now() - coquiStart}ms (${buffer.length} bytes)`);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'audio/wav');
            res.setHeader('Content-Length', buffer.length);
            res.setHeader('X-TTS-Engine', 'local-coqui');
            res.setHeader('X-Response-Time-Ms', String(Date.now() - reqStart));
            res.end(buffer);
            return;
          }
        }
      } catch (coquiErr: unknown) {
        const msg = coquiErr instanceof Error ? coquiErr.message : String(coquiErr);
        console.warn(`[TTS Timing] Optional local server unreachable (${msg}) after ${Date.now() - coquiStart}ms, falling back to cloud neural engine`);
      }
    }

    // 2. High-Fidelity Studio Neural Speech via Edge TTS with language detection & explicit timeout
    const { voice: edgeVoice, isUrduScript, isHindiScript } = mapVoiceToEdgeVoice(voice, text.trim());
    const speedRatio = Number(settings?.speed) || 1.0;
    const rateDiff = Math.round((speedRatio - 1) * 100);
    const rateStr = rateDiff >= 0 ? `+${rateDiff}%` : `${rateDiff}%`;
    const pitchVal = Number(settings?.pitch) || 0;
    const pitchStr = pitchVal >= 0 ? `+${pitchVal * 2}Hz` : `${pitchVal * 2}Hz`;

    let chunks: Buffer[] = [];
    const edgeStart = Date.now();
    console.log(`[TTS Timing] Starting synthesis with primary voice "${edgeVoice}" (Urdu=${isUrduScript}, Hindi=${isHindiScript})`);

    try {
      const comm = new Communicate(text.trim(), {
        voice: edgeVoice,
        rate: rateStr,
        pitch: pitchStr,
      });

      chunks = await collectStreamWithTimeout(comm, 8500);
      console.log(`[TTS Timing] Primary voice "${edgeVoice}" generated ${chunks.length} chunks in ${Date.now() - edgeStart}ms`);
    } catch (primaryErr: unknown) {
      const primMsg = primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
      console.warn(`[TTS Timing] Primary voice "${edgeVoice}" failed in ${Date.now() - edgeStart}ms: ${primMsg}`);

      // Handle language-safe fallback:
      // CRITICAL: Do NOT silently switch Urdu or Hindi to an English-only voice!
      let fallbackVoice: string | null = null;
      if (isUrduScript) {
        // Fallback between native Urdu neural voices (Uzma <-> Asad)
        fallbackVoice = edgeVoice === 'ur-PK-UzmaNeural' ? 'ur-PK-AsadNeural' : 'ur-PK-UzmaNeural';
      } else if (isHindiScript) {
        // Fallback between native Hindi neural voices (Swara <-> Madhur)
        fallbackVoice = edgeVoice === 'hi-IN-SwaraNeural' ? 'hi-IN-MadhurNeural' : 'hi-IN-SwaraNeural';
      } else {
        // For English and other Latin scripts, fallback to universal neural voices
        fallbackVoice = voice?.gender === 'Female' ? 'en-US-JennyNeural' : 'en-US-GuyNeural';
      }

      if (fallbackVoice && fallbackVoice !== edgeVoice) {
        const fallbackStart = Date.now();
        console.log(`[TTS Timing] Retrying with language-compatible fallback voice "${fallbackVoice}"`);
        try {
          const commFallback = new Communicate(text.trim(), { voice: fallbackVoice, rate: rateStr, pitch: pitchStr });
          chunks = await collectStreamWithTimeout(commFallback, 8000);
          console.log(`[TTS Timing] Fallback voice "${fallbackVoice}" generated ${chunks.length} chunks in ${Date.now() - fallbackStart}ms`);
        } catch (fallbackErr: unknown) {
          const fbMsg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
          console.error(`[TTS Timing] Fallback voice "${fallbackVoice}" failed after ${Date.now() - fallbackStart}ms: ${fbMsg}`);
          // If Urdu or Hindi failed completely on both native voices, do NOT switch to English!
          if (isUrduScript) {
            throw new Error(`Urdu speech synthesis failed: Both Urdu neural voices were unavailable (${fbMsg}). English voices cannot synthesize Urdu script.`);
          }
          if (isHindiScript) {
            throw new Error(`Hindi speech synthesis failed: Both Hindi neural voices were unavailable (${fbMsg}). English voices cannot synthesize Hindi script.`);
          }
        }
      } else if (isUrduScript) {
        throw new Error(`Urdu speech synthesis failed with voice "${edgeVoice}": ${primMsg}`);
      } else if (isHindiScript) {
        throw new Error(`Hindi speech synthesis failed with voice "${edgeVoice}": ${primMsg}`);
      }
    }

    if (chunks.length > 0) {
      const audioBuffer = Buffer.concat(chunks);
      if (audioBuffer.length >= 256) {
        const totalDuration = Date.now() - reqStart;
        console.log(`[TTS Timing] Successfully delivering ${audioBuffer.length} bytes audio/mpeg in ${totalDuration}ms`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.length);
        res.setHeader('X-TTS-Engine', 'edge-neural');
        res.setHeader('X-Response-Time-Ms', String(totalDuration));
        res.end(audioBuffer);
        return;
      }
    }

    // 3. Optional Gemini Cloud TTS fallback if GEMINI_API_KEY is configured
    // Supported official model from @google/genai: 'gemini-3.8-flash-lite-tts'
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const geminiStart = Date.now();
      console.log(`[TTS Timing] Attempting Gemini TTS fallback using gemini-3.8-flash-lite-tts...`);
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        const geminiVoice = voice?.gender === 'Female' ? 'Kore' : 'Fenrir';

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: text.trim(),
                  speechMetadata: {
                    style: `${voice?.description || 'Natural professional speech'}. Rate: ${speedRatio}x.`,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: geminiVoice },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          const wavBuffer = Buffer.from(base64Audio, 'base64');
          if (wavBuffer.length >= 256) {
            const totalDuration = Date.now() - reqStart;
            console.log(`[TTS Timing] Gemini TTS fallback succeeded in ${Date.now() - geminiStart}ms (${wavBuffer.length} bytes, total ${totalDuration}ms)`);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'audio/wav');
            res.setHeader('Content-Length', wavBuffer.length);
            res.setHeader('X-TTS-Engine', 'gemini-3.8-flash-lite-tts');
            res.setHeader('X-Response-Time-Ms', String(totalDuration));
            res.end(wavBuffer);
            return;
          }
        }
      } catch (geminiErr: unknown) {
        const geminiMsg = geminiErr instanceof Error ? geminiErr.message : String(geminiErr);
        console.error(`[TTS Timing] Gemini fallback failed after ${Date.now() - geminiStart}ms:`, geminiMsg);
      }
    }

    throw new Error('No audio returned by neural voice engine');
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    const totalDuration = Date.now() - reqStart;
    console.error(`[API /api/tts/synthesize error after ${totalDuration}ms]:`, errMsg);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('X-Response-Time-Ms', String(totalDuration));
    res.end(JSON.stringify({
      error: errMsg,
      timingMs: totalDuration,
      timestamp: new Date().toISOString(),
    }));
  }
}
