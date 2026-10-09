import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Share2,
  ListCollapse,
  Check,
  FastForward,
} from 'lucide-react';
import { formatDuration } from '../../utils/textChunker';

interface WaveformPlayerProps {
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
  voiceName: string;
  modelName: string;
  chunkCount: number;
  onToggleChunkInspector?: () => void;
  showChunkInspector?: boolean;
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({
  audioBlob,
  audioUrl,
  duration,
  voiceName,
  modelName,
  chunkCount,
  onToggleChunkInspector,
  showChunkInspector,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [copied, setCopied] = useState(false);

  // Generate pseudo-random deterministic waveform peak bars
  const [peaks, setPeaks] = useState<number[]>([]);

  useEffect(() => {
    // Generate 64 peak amplitudes for visual aesthetic
    const newPeaks: number[] = [];
    let prev = 0.4;
    for (let i = 0; i < 72; i++) {
      // Natural speech envelope peaks
      const envelope = Math.sin((i / 72) * Math.PI) * 0.7 + 0.2;
      const variation = (Math.random() - 0.5) * 0.4;
      const val = Math.max(0.12, Math.min(0.98, envelope + variation * 0.5));
      prev = prev * 0.4 + val * 0.6;
      newPeaks.push(prev);
    }
    setPeaks(newPeaks);
  }, [audioUrl]);

  // Audio setup & Web Audio analyser
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  // Handle play/pause with Web Audio API connection
  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else {
      // Initialize Web Audio Context if not yet created
      if (!audioContextRef.current) {
        try {
          const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          const ctx = new AudioContextClass();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.8;

          // Connect source node to analyser and destination
          const source = ctx.createMediaElementSource(audio);
          source.connect(analyser);
          analyser.connect(ctx.destination);

          audioContextRef.current = ctx;
          analyserRef.current = analyser;
          sourceNodeRef.current = source;
        } catch {
          // If media element source already connected or restricted, continue playback
        }
      }

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      try {
        await audio.play();
        setIsPlaying(true);
        startVisualizer();
      } catch (err) {
        console.error('Playback error:', err);
      }
    }
  };

  // Real-time canvas drawing
  const startVisualizer = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyser ? analyser.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / 36;

      for (let i = 0; i < 36; i++) {
        const val = analyser ? dataArray[i % bufferLength] / 255 : Math.sin(i + Date.now() / 200) * 0.3 + 0.3;
        const barHeight = Math.max(4, val * height * 0.85);
        const x = i * barWidth;
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(1, '#d97706');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x + 1.5, y, barWidth - 3, barHeight, 2);
        ctx.fill();
      }
    };

    draw();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * (duration || audio.duration || 1);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = audioUrl;
    const cleanVoice = voiceName.toLowerCase().replace(/\s+/g, '_');
    a.download = `voiver_${cleanVoice}_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(audioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full bg-[#12141f] border border-white/[0.1] rounded-2xl p-4 shadow-xl text-white">
      <audio ref={audioRef} src={audioUrl} preload="auto" />

      {/* Top Details */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-tight">{voiceName}</span>
          <span className="text-[11px] text-zinc-400 font-mono">
            {modelName} · {chunkCount} {chunkCount === 1 ? 'chunk' : 'chunks stitched'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleChunkInspector && (
            <button
              onClick={onToggleChunkInspector}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                showChunkInspector
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-white/[0.05] text-zinc-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <ListCollapse className="h-3.5 w-3.5" />
              <span>Chunks ({chunkCount})</span>
            </button>
          )}

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs shadow-sm transition-colors"
          >
            <Download className="h-3.5 w-3.5 stroke-[2.2]" />
            <span>Download WAV</span>
          </button>
        </div>
      </div>

      {/* Waveform Timeline / Scrubber */}
      <div
        onClick={handleSeek}
        className="group relative h-16 w-full bg-[#0a0b10] rounded-xl border border-white/[0.06] p-2 flex items-center cursor-pointer select-none overflow-hidden"
      >
        {/* Background Peak Waveform */}
        <div className="absolute inset-x-2 inset-y-1 flex items-center justify-between gap-[2px] opacity-40">
          {peaks.map((val, idx) => {
            const barProgress = (idx / peaks.length) * 100;
            const isPlayed = barProgress <= progressPercent;
            return (
              <div
                key={idx}
                className="flex-1 rounded-full transition-colors"
                style={{
                  height: `${Math.max(15, val * 100)}%`,
                  backgroundColor: isPlayed ? '#f59e0b' : '#3f3f46',
                }}
              />
            );
          })}
        </div>

        {/* Real-time reactive visualizer overlay when playing */}
        {isPlaying && (
          <canvas
            ref={canvasRef}
            width={720}
            height={60}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
          />
        )}

        {/* Playhead Scrubber Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] z-10 transition-all pointer-events-none"
          style={{ left: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 -ml-1 -mt-0.5 shadow-md" />
        </div>
      </div>

      {/* Control Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Play / Pause & Timestamps */}
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
              }
            }}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
            title="Rewind 5 seconds"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <div className="font-mono text-xs text-zinc-300">
            <span className="text-white font-medium">{formatDuration(currentTime)}</span>
            <span className="text-zinc-600 mx-1">/</span>
            <span className="text-zinc-400">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Playback Rate & Volume */}
        <div className="flex items-center gap-3">
          {/* Rate Selector */}
          <div className="flex items-center bg-[#0d0e15] border border-white/[0.08] rounded-lg p-0.5 text-[11px] font-mono">
            {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                onClick={() => handleSpeedChange(rate)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  playbackRate === rate
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-1.5 text-zinc-400">
            <button
              onClick={toggleMute}
              className="p-1 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                const val = Number(e.target.value);
                setVolume(val);
                setIsMuted(val === 0);
                if (audioRef.current) {
                  audioRef.current.volume = val;
                  audioRef.current.muted = val === 0;
                }
              }}
              className="w-16 h-1 accent-amber-500 bg-white/[0.1] rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleCopyLink}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
            title="Copy Audio Object URL"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
