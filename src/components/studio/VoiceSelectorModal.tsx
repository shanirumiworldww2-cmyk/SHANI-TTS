import React, { useState } from 'react';
import { Search, Play, Pause, X, Plus, Sparkles, Check, Mic, RotateCcw } from 'lucide-react';
import { Voice, VoiceSettings } from '../../types/tts';
import { synthesizeChunkAudio } from '../../utils/audioSynthesis';

interface VoiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  voices: Voice[];
  selectedVoice: Voice;
  onSelectVoice: (voice: Voice) => void;
  onOpenVoiceLab: () => void;
  voiceSettings: VoiceSettings;
  onResetVoices?: () => void;
}

export const VoiceSelectorModal: React.FC<VoiceSelectorModalProps> = ({
  isOpen,
  onClose,
  voices,
  selectedVoice,
  onSelectVoice,
  onOpenVoiceLab,
  voiceSettings,
  onResetVoices,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);
  const [previewAudioObj, setPreviewAudioObj] = useState<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const categories = [
    'All',
    'Urdu & Regional',
    'Narrative',
    'Conversational',
    'Cinematic',
    'Audiobook',
    'News',
    'Commercial',
    'Character',
  ];

  const filteredVoices = voices.filter((voice) => {
    const matchesSearch =
      voice.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.accent.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voice.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategory === 'All' ||
      voice.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const handlePreviewVoice = async (voice: Voice, e: React.MouseEvent) => {
    e.stopPropagation();

    if (previewingVoiceId === voice.id) {
      if (previewAudioObj) {
        previewAudioObj.pause();
        setPreviewAudioObj(null);
      }
      setPreviewingVoiceId(null);
      return;
    }

    if (previewAudioObj) {
      previewAudioObj.pause();
    }

    setPreviewingVoiceId(voice.id);

    try {
      // Synthesize short preview sample
      const blob = await synthesizeChunkAudio(
        voice.previewSampleText || `Hello, this is ${voice.name} using the open-source Coqui voice synthesis engine.`,
        voice,
        voiceSettings
      );
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      setPreviewAudioObj(audio);

      audio.onended = () => {
        setPreviewingVoiceId(null);
        setPreviewAudioObj(null);
      };

      await audio.play();
    } catch {
      setPreviewingVoiceId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl max-h-[88vh] bg-[#10121a] border border-white/[0.1] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white tracking-tight">Voice Library</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono font-medium border border-amber-500/30">
                {filteredVoices.length} of {voices.length} Voices
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              130+ realistic open-source & neural voices across Urdu, Hindi, English, Spanish, Arabic, French, and more.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onResetVoices && (
              <button
                onClick={onResetVoices}
                title="Reload and sync all 132 neural voices"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-zinc-200 border border-white/10 font-medium text-xs transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden sm:inline">Sync 132 Voices</span>
                <span className="sm:hidden">Sync</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onOpenVoiceLab();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors"
            >
              <Mic className="h-3.5 w-3.5" />
              <span>Clone Voice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="p-4 border-b border-white/[0.06] bg-[#0c0d14] flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by voice name, accent, tag, or style..."
              className="w-full bg-[#161822] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-white/[0.12] text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Voice Cards List */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[58vh]">
          {filteredVoices.map((voice) => {
            const isSelected = selectedVoice.id === voice.id;
            const isPreviewing = previewingVoiceId === voice.id;

            return (
              <div
                key={voice.id}
                onClick={() => {
                  onSelectVoice(voice);
                  onClose();
                }}
                className={`group relative p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/[0.08] border-amber-500/50 shadow-md shadow-amber-500/5'
                    : 'bg-[#151722]/70 border-white/[0.06] hover:bg-[#1a1d2b] hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {/* Voice avatar */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-inner flex-shrink-0"
                      style={{
                        backgroundColor: voice.avatarColor || '#d97706',
                      }}
                    >
                      {voice.name.charAt(0)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                          {voice.name}
                        </h3>
                        {voice.isCloned && (
                          <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded">
                            Cloned
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded flex items-center gap-1">
                            <Check className="h-3 w-3" /> Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
                        <span>{voice.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{voice.gender}</span>
                        <span aria-hidden="true">·</span>
                        <span>{voice.accent}</span>
                      </div>
                    </div>
                  </div>

                  {/* Audition Preview Button */}
                  <button
                    onClick={(e) => handlePreviewVoice(voice, e)}
                    className={`p-2 rounded-lg transition-all ${
                      isPreviewing
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 animate-pulse'
                        : 'bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.12]'
                    }`}
                    title="Audition Voice Sample"
                  >
                    {isPreviewing ? (
                      <Pause className="h-3.5 w-3.5 fill-current" />
                    ) : (
                      <Play className="h-3.5 w-3.5 fill-current" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-zinc-300/80 mt-2 line-clamp-2 leading-relaxed">
                  {voice.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-white/[0.04]">
                  {voice.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {voice.tags.length > 3 && (
                    <span className="text-[10px] text-zinc-500">+{voice.tags.length - 3}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0c0d14] flex items-center justify-between text-xs text-zinc-400">
          <span>Showing {filteredVoices.length} voices</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-white font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
