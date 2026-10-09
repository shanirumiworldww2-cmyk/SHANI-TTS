import React, { useState } from 'react';
import { TextChunk } from '../../types/tts';
import { Play, Pause, Download, Layers, X } from 'lucide-react';
import { formatDuration } from '../../utils/textChunker';

interface ChunkInspectorProps {
  chunks: TextChunk[];
  isOpen: boolean;
  onClose: () => void;
}

export const ChunkInspector: React.FC<ChunkInspectorProps> = ({
  chunks,
  isOpen,
  onClose,
}) => {
  const [activeChunkIndex, setActiveChunkIndex] = useState<number | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const handlePlayChunk = (chunk: TextChunk) => {
    if (!chunk.audioBlob) return;

    if (activeChunkIndex === chunk.index) {
      if (audioObj) {
        audioObj.pause();
        setAudioObj(null);
      }
      setActiveChunkIndex(null);
      return;
    }

    if (audioObj) {
      audioObj.pause();
    }

    const url = URL.createObjectURL(chunk.audioBlob);
    const audio = new Audio(url);
    setAudioObj(audio);
    setActiveChunkIndex(chunk.index);

    audio.onended = () => {
      setActiveChunkIndex(null);
      setAudioObj(null);
    };

    audio.play();
  };

  const handleDownloadChunk = (chunk: TextChunk) => {
    if (!chunk.audioBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(chunk.audioBlob);
    a.download = `chunk_${chunk.index + 1}_of_${chunks.length}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="mt-4 p-4 bg-[#10121b] border border-white/[0.08] rounded-xl text-white">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-amber-400" />
          <h4 className="text-xs font-semibold text-white">
            Unlimited Character Engine Chunks ({chunks.length})
          </h4>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/[0.06]"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
        {chunks.map((chunk) => {
          const isPlaying = activeChunkIndex === chunk.index;
          return (
            <div
              key={chunk.index}
              className="p-2.5 rounded-lg bg-[#151722] border border-white/[0.04] hover:border-white/[0.1] flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded flex-shrink-0">
                  #{chunk.index + 1}
                </span>
                <p className="text-zinc-300 truncate font-sans text-xs">
                  {chunk.text}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] text-zinc-400 font-mono">
                  {chunk.charCount} chars · ~{formatDuration(chunk.estimatedDurationSec)}
                </span>

                {chunk.audioBlob && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handlePlayChunk(chunk)}
                      className={`p-1.5 rounded-md transition-colors ${
                        isPlaying
                          ? 'bg-amber-500 text-black'
                          : 'bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.1]'
                      }`}
                      title="Play Chunk Stem"
                    >
                      {isPlaying ? (
                        <Pause className="h-3 w-3 fill-current" />
                      ) : (
                        <Play className="h-3 w-3 fill-current" />
                      )}
                    </button>

                    <button
                      onClick={() => handleDownloadChunk(chunk)}
                      className="p-1.5 rounded-md bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.1]"
                      title="Download Chunk WAV"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
