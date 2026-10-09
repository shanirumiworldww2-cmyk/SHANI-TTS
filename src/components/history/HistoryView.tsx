import React, { useState } from 'react';
import { History, Play, Pause, Download, Trash2, Search, Copy, Check, Volume2, Sparkles } from 'lucide-react';
import { GenerationRecord } from '../../types/tts';
import { formatDuration } from '../../utils/textChunker';

interface HistoryViewProps {
  generations: GenerationRecord[];
  onDeleteGeneration: (id: string) => void;
  onClearAll: () => void;
  onLoadIntoStudio: (record: GenerationRecord) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  generations,
  onDeleteGeneration,
  onClearAll,
  onLoadIntoStudio,
}) => {
  const [search, setSearch] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = generations.filter(
    (gen) =>
      gen.text.toLowerCase().includes(search.toLowerCase()) ||
      gen.voiceName.toLowerCase().includes(search.toLowerCase()) ||
      gen.modelName.toLowerCase().includes(search.toLowerCase())
  );

  const handlePlay = (gen: GenerationRecord) => {
    if (playingId === gen.id) {
      if (audioObj) {
        audioObj.pause();
        setAudioObj(null);
      }
      setPlayingId(null);
      return;
    }

    if (audioObj) {
      audioObj.pause();
    }

    const audio = new Audio(gen.audioUrl);
    setAudioObj(audio);
    setPlayingId(gen.id);

    audio.onended = () => {
      setPlayingId(null);
      setAudioObj(null);
    };

    audio.play();
  };

  const handleDownload = (gen: GenerationRecord) => {
    const a = document.createElement('a');
    a.href = gen.audioUrl;
    a.download = `voiver_${gen.voiceName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyText = (gen: GenerationRecord) => {
    navigator.clipboard.writeText(gen.text);
    setCopiedId(gen.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const totalChars = generations.reduce((acc, g) => acc + g.charCount, 0);
  const totalSeconds = generations.reduce((acc, g) => acc + g.duration, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Header & Stats */}
      <div className="bg-[#12141e] border border-white/[0.08] p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Generation Archive</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Access previous audio generations, listen back, inspect chunk metrics, and export WAV stems.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-300">
          <div className="px-3 py-1.5 bg-[#171926] border border-white/[0.06] rounded-xl">
            <span className="text-zinc-500 block text-[10px]">TOTAL SYNTHESIZED</span>
            <span className="font-semibold text-amber-400">{formatDuration(totalSeconds)}</span>
          </div>

          <div className="px-3 py-1.5 bg-[#171926] border border-white/[0.06] rounded-xl">
            <span className="text-zinc-500 block text-[10px]">TOTAL CHARACTERS</span>
            <span className="font-semibold text-zinc-200">{totalChars.toLocaleString()}</span>
          </div>

          {generations.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-zinc-500 hover:text-rose-400 p-2 rounded-lg hover:bg-white/[0.04] transition-colors"
              title="Clear all history"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by prompt text, voice name, or model..."
          className="w-full bg-[#10121b] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
        />
      </div>

      {/* Generations List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-[#10121b] border border-white/[0.06] rounded-2xl">
          <Volume2 className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-xs text-zinc-400">No generations recorded yet.</p>
          <p className="text-[11px] text-zinc-500 mt-1">
            Synthesize text in the Studio to automatically save your audio here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((gen) => {
            const isPlaying = playingId === gen.id;

            return (
              <div
                key={gen.id}
                className="p-4 bg-[#10121b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl transition-all shadow-md space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{gen.voiceName}</span>
                    <span className="text-zinc-500">·</span>
                    <span className="text-zinc-400">{gen.modelName}</span>
                    <span className="text-zinc-500">·</span>
                    <span className="text-amber-400/90 font-mono text-[11px]">
                      {gen.chunkCount} {gen.chunkCount === 1 ? 'chunk' : 'chunks'}
                    </span>
                  </div>

                  <div className="text-[11px] text-zinc-500 font-mono">
                    {new Date(gen.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans line-clamp-3">
                  "{gen.text}"
                </p>

                {/* Bottom Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.04] text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlay(gen)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isPlaying
                          ? 'bg-amber-500 text-black shadow-md'
                          : 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-3.5 w-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Play ({formatDuration(gen.duration)})</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onLoadIntoStudio(gen)}
                      className="px-2.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors text-[11px]"
                      title="Load text & voice into Studio"
                    >
                      Load into Studio
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyText(gen)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                      title="Copy Prompt Text"
                    >
                      {copiedId === gen.id ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDownload(gen)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                      title="Download WAV"
                    >
                      <Download className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onDeleteGeneration(gen.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/[0.06] transition-colors"
                      title="Delete Record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
