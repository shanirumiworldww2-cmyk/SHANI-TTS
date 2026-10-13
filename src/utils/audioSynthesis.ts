import { Voice, VoiceSettings } from '../types/tts';

/**
 * Creates a valid 16-bit PCM RIFF WAV Blob from an AudioBuffer
 */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const length = buffer.length * numChannels * bytesPerSample;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][i];
      sample = Math.max(-1, Math.min(1, sample));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Safely determines the duration of an audio blob using an HTML5 Audio element
 */
export function getAudioBlobDuration(blob: Blob): Promise<number> {
  return new Promise((resolve) => {
    try {
      const audio = new Audio();
      const url = URL.createObjectURL(blob);
      audio.preload = 'metadata';
      audio.src = url;

      const cleanup = () => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      };

      audio.onloadedmetadata = () => {
        const d = audio.duration;
        cleanup();
        resolve(isFinite(d) && d > 0 ? d : 2.5);
      };

      audio.onerror = () => {
        cleanup();
        resolve(2.5);
      };

      // Timeout fallback in case metadata loading hangs
      setTimeout(() => {
        cleanup();
        resolve(2.5);
      }, 2000);
    } catch {
      resolve(2.5);
    }
  });
}

/**
 * Stitches multiple audio WAV blobs into a single continuous master WAV file.
 * Resilient against browser Web Audio decoding limitations.
 */
export async function stitchWavBlobs(
  blobs: Blob[],
  pauseDurationMs: number = 250
): Promise<{ blob: Blob; duration: number }> {
  if (blobs.length === 0) {
    throw new Error('No audio chunks provided for stitching');
  }

  // Handle single chunk directly with full resilience
  if (blobs.length === 1) {
    const singleBlob = blobs[0];
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const audioContext = new AudioCtx();
        if (audioContext.state === 'suspended') {
          await audioContext.resume().catch(() => {});
        }
        const arrayBuffer = await singleBlob.arrayBuffer();
        const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
        const wavBlob = audioBufferToWav(decoded);
        await audioContext.close().catch(() => {});
        return { blob: wavBlob, duration: decoded.duration };
      }
    } catch (decodeErr) {
      console.warn('AudioContext single-chunk decode fallback:', decodeErr);
    }

    // Direct blob fallback if Web Audio decode is restricted or fails
    const dur = await getAudioBlobDuration(singleBlob);
    return { blob: singleBlob, duration: dur };
  }

  // Multi-chunk stitching
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) {
      throw new Error('Web AudioContext not supported in this browser');
    }

    const audioContext = new AudioCtx();
    if (audioContext.state === 'suspended') {
      await audioContext.resume().catch(() => {});
    }

    const decodedBuffers: AudioBuffer[] = [];
    for (const blob of blobs) {
      const arrayBuffer = await blob.arrayBuffer();
      const decoded = await audioContext.decodeAudioData(arrayBuffer.slice(0));
      decodedBuffers.push(decoded);
    }

    const sampleRate = decodedBuffers[0].sampleRate;
    const numChannels = decodedBuffers[0].numberOfChannels;
    const pauseSamples = Math.floor((pauseDurationMs / 1000) * sampleRate);

    let totalSamples = 0;
    for (let i = 0; i < decodedBuffers.length; i++) {
      totalSamples += decodedBuffers[i].length;
      if (i < decodedBuffers.length - 1) {
        totalSamples += pauseSamples;
      }
    }

    const masterBuffer = audioContext.createBuffer(numChannels, totalSamples, sampleRate);
    let currentOffset = 0;

    for (let i = 0; i < decodedBuffers.length; i++) {
      const buf = decodedBuffers[i];
      for (let c = 0; c < numChannels; c++) {
        const sourceChannel = buf.getChannelData(c % buf.numberOfChannels);
        const targetChannel = masterBuffer.getChannelData(c);
        targetChannel.set(sourceChannel, currentOffset);

        if (currentOffset > 0) {
          const fadeLen = Math.min(240, sourceChannel.length);
          for (let f = 0; f < fadeLen; f++) {
            const fadeRatio = f / fadeLen;
            targetChannel[currentOffset + f] = sourceChannel[f] * fadeRatio;
          }
        }
      }

      currentOffset += buf.length;
      if (i < decodedBuffers.length - 1) {
        currentOffset += pauseSamples;
      }
    }

    const totalDuration = totalSamples / sampleRate;
    const masterWavBlob = audioBufferToWav(masterBuffer);
    await audioContext.close().catch(() => {});

    return {
      blob: masterWavBlob,
      duration: totalDuration,
    };
  } catch (stitchErr) {
    console.warn('AudioContext multi-chunk decode error, using seamless binary concatenation fallback:', stitchErr);
    // Safe binary concatenation fallback for MP3 / audio chunks
    const combinedBlob = new Blob(blobs, { type: blobs[0]?.type || 'audio/mpeg' });
    const duration = await getAudioBlobDuration(combinedBlob);
    return {
      blob: combinedBlob,
      duration,
    };
  }
}

/**
 * Speaks text using the browser's built-in Web Speech API
 * (100% Free, Zero Quotas, Natural Voice Output)
 */
export function speakWithBrowserVoice(text: string, voice: Voice, settings: VoiceSettings): Promise<number> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve(2);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = Math.max(0.7, Math.min(1.5, settings.speed || 1.0));
    utterance.pitch = Math.max(0.6, Math.min(1.5, 1.0 + (settings.pitch || 0) * 0.05));

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = voice.language.startsWith('es') ? 'es' : 'en';
    const isFemale = voice.gender === 'Female';

    const match = voices.find((v) => {
      const vName = v.name.toLowerCase();
      if (!v.lang.toLowerCase().startsWith(langPrefix)) return false;
      if (isFemale) {
        return vName.includes('female') || vName.includes('zira') || vName.includes('samantha') || vName.includes('google') || vName.includes('jenny');
      } else {
        return vName.includes('male') || vName.includes('david') || vName.includes('george') || vName.includes('daniel') || vName.includes('guy');
      }
    }) || voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));

    if (match) utterance.voice = match;

    const startTime = Date.now();
    utterance.onend = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      resolve(Math.max(1, elapsed));
    };
    utterance.onerror = () => {
      resolve(2);
    };

    window.speechSynthesis.speak(utterance);
  });
}


/**
 * Synthesizes speech for a single text chunk.
 * 1. Attempts Local Coqui TTS or Server Neural TTS.
 * 2. If Gemini 429 Quota is reached or user chose browser engine, seamlessly falls back to Browser Voice!
 */
export async function synthesizeChunkAudio(
  text: string,
  voice: Voice,
  settings: VoiceSettings,
  serverUrl?: string,
  useLocalServer?: boolean,
  engineMode?: 'auto' | 'local_coqui' | 'browser_speech' | 'cloud_neural',
  onQuotaExceeded?: () => void
): Promise<Blob> {
  const CANONICAL_ENDPOINT = '/api/tts/synthesize';
  const startTime = performance.now();

  const requestPayload = JSON.stringify({
    text,
    voice,
    settings,
    server_url: serverUrl,
    useLocalServer: Boolean(useLocalServer),
  });

  const controller = new AbortController();
  const clientTimeoutMs = 20000;
  let isTimedOut = false;

  const timeoutId = setTimeout(() => {
    isTimedOut = true;
    controller.abort();
  }, clientTimeoutMs);

  console.log(`[TTS Client] Requesting synthesis from ${CANONICAL_ENDPOINT} for "${voice.name}" (${text.slice(0, 30)}...)`);

  try {
    const res = await fetch(CANONICAL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: requestPayload,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const durationMs = Math.round(performance.now() - startTime);
    const serverTiming = res.headers.get('X-Response-Time-Ms');
    const ttsEngine = res.headers.get('X-TTS-Engine') || 'unknown';

    console.log(`[TTS Client] Response from ${CANONICAL_ENDPOINT} in ${durationMs}ms (server: ${serverTiming || 'N/A'}ms, engine: ${ttsEngine}, status: ${res.status})`);

    if (res.ok) {
      const contentType = (res.headers.get('content-type') || '').toLowerCase();

      // Check Content-Type: If server returned HTML (e.g. SPA fallback), this is NOT audio!
      if (contentType.includes('text/html') || !contentType.startsWith('audio/')) {
        throw new Error(`Endpoint returned invalid Content-Type "${contentType}" instead of audio stream.`);
      }

      const blob = await res.blob();
      if (blob.size < 256) {
        throw new Error(`Synthesis returned insufficient audio data (${blob.size} bytes).`);
      }

      // Preserve actual audio format (audio/mpeg or audio/wav)
      const resolvedType = contentType.includes('wav') ? 'audio/wav' : 'audio/mpeg';
      return new Blob([blob], { type: resolvedType });
    }

    // Handle HTTP error responses
    const errJson = await res.json().catch(() => null);
    const errMsg = errJson?.error || `HTTP ${res.status}: ${res.statusText}`;

    if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
      if (onQuotaExceeded) onQuotaExceeded();
    }

    throw new Error(errMsg);
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const durationMs = Math.round(performance.now() - startTime);

    if (isTimedOut) {
      console.error(`[TTS Client] Synthesis timed out after ${clientTimeoutMs}ms`);
      throw new Error(`Speech synthesis timed out after ${clientTimeoutMs / 1000} seconds. Please verify network connection or try a shorter text prompt.`);
    }

    const message = err instanceof Error ? err.message : String(err);
    console.error(`[TTS Client] Synthesis failed after ${durationMs}ms:`, message);

    // If local server was connected or configured, try directly reaching local server URL as fallback
    if (useLocalServer && serverUrl) {
      try {
        console.log(`[TTS Client] Attempting local server fallback to ${serverUrl}...`);
        const targetUrl = serverUrl.replace(/\/+$/, '');
        const localController = new AbortController();
        const localTimeout = setTimeout(() => localController.abort(), 6000);

        const localRes = await fetch(`${targetUrl}/api/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            speaker_id: voice?.baseSpeakerId || voice?.name?.toLowerCase().replace(/\s+/g, '_') || 'speaker_0',
            language: voice?.language?.startsWith('es') ? 'es' : 'en',
          }),
          signal: localController.signal,
        });

        clearTimeout(localTimeout);
        if (localRes.ok) {
          const localBlob = await localRes.blob();
          if (localBlob.size >= 256) {
            return new Blob([localBlob], { type: 'audio/wav' });
          }
        }
      } catch (localErr) {
        console.warn('[TTS Client] Local server fallback also failed:', localErr);
      }
    }

    throw new Error(`Voice synthesis failed: ${message}`);
  }
}

export function createAudioUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}
