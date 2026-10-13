import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Sliders,
  ChevronDown,
  Volume2,
  FileText,
  Wand2,
  Trash2,
  Upload,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { Voice, CoquiModel, VoiceSettings, TextChunk, GenerationRecord, ServerConfig } from '../../types/tts';
import { VoiceSelectorModal } from './VoiceSelectorModal';
import { VoiceSettingsPanel } from './VoiceSettingsPanel';
import { WaveformPlayer } from './WaveformPlayer';
import { ChunkInspector } from './ChunkInspector';
import { splitTextIntoChunks, preprocessText, estimateSpeechDuration } from '../../utils/textChunker';
import { synthesizeChunkAudio, stitchWavBlobs, createAudioUrl } from '../../utils/audioSynthesis';
import { SAMPLE_TEXT_SCRIPTS } from '../../data/presetVoices';

interface StudioViewProps {
  voices: Voice[];
  models: CoquiModel[];
  selectedVoice: Voice;
  setSelectedVoice: (voice: Voice) => void;
  selectedModel: CoquiModel;
  setSelectedModel: (model: CoquiModel) => void;
  voiceSettings: VoiceSettings;
  setVoiceSettings: (settings: VoiceSettings) => void;
  serverConfig: ServerConfig;
  onUpdateServerConfig?: (config: ServerConfig) => void;
  onOpenVoiceLab: () => void;
  onSaveGeneration: (gen: GenerationRecord) => void;
  onResetVoices?: () => void;
}

export const StudioView: React.FC<StudioViewProps> = ({
  voices,
  models,
  selectedVoice,
  setSelectedVoice,
  selectedModel,
  setSelectedModel,
  voiceSettings,
  setVoiceSettings,
  serverConfig,
  onUpdateServerConfig,
  onOpenVoiceLab,
  onSaveGeneration,
  onResetVoices,
}) => {
  const [text, setText] = useState<string>(
    SAMPLE_TEXT_SCRIPTS[0].text
  );

  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [showChunkInspector, setShowChunkInspector] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [chunks, setChunks] = useState<TextChunk[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // Current active audio output
  const [currentGeneration, setCurrentGeneration] = useState<GenerationRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quotaWarning, setQuotaWarning] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const abortControllerRef = useRef<boolean>(false);

  // Update chunks dynamically as text changes
  useEffect(() => {
    const calculatedChunks = splitTextIntoChunks(text, voiceSettings.maxChunkChars);
    setChunks(calculatedChunks);
  }, [text, voiceSettings.maxChunkChars]);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedSeconds = estimateSpeechDuration(text, voiceSettings.speed);

  // Synthesis Execution
  const handleGenerate = async () => {
    if (!text.trim()) {
      setErrorMessage('Please enter text to synthesize.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);
    setProgressPercent(0);
    setCurrentChunkIndex(0);
    abortControllerRef.current = false;

    try {
      const activeChunks = splitTextIntoChunks(text, voiceSettings.maxChunkChars);
      if (activeChunks.length === 0) {
        throw new Error('No valid text chunks found to synthesize.');
      }

      setChunks(activeChunks);

      const generatedBlobs: Blob[] = [];

      for (let i = 0; i < activeChunks.length; i++) {
        if (abortControllerRef.current) {
          throw new Error('Synthesis cancelled by user.');
        }

        setCurrentChunkIndex(i + 1);
        activeChunks[i].status = 'generating';
        setChunks([...activeChunks]);

        const chunkBlob = await synthesizeChunkAudio(
          activeChunks[i].text,
          selectedVoice,
          voiceSettings,
          serverConfig.localServerUrl,
          serverConfig.connected,
          serverConfig.mode,
          () => setQuotaWarning(true)
        );

        activeChunks[i].status = 'done';
        activeChunks[i].audioBlob = chunkBlob;
        generatedBlobs.push(chunkBlob);

        const currentProg = Math.round(((i + 1) / activeChunks.length) * 100);
        setProgressPercent(currentProg);
        setChunks([...activeChunks]);
      }

      // Stitch all chunks into master audio
      const { blob: masterBlob, duration: totalDuration } = await stitchWavBlobs(
        generatedBlobs,
        voiceSettings.pauseDurationMs
      );

      const masterAudioUrl = createAudioUrl(masterBlob);

      const record: GenerationRecord = {
        id: `gen-${Date.now()}`,
        text,
        voiceId: selectedVoice.id,
        voiceName: selectedVoice.name,
        voiceCategory: selectedVoice.category,
        modelId: selectedModel.id,
        modelName: selectedModel.name,
        audioBlob: masterBlob,
        audioUrl: masterAudioUrl,
        duration: totalDuration,
        charCount,
        chunkCount: activeChunks.length,
        createdAt: new Date().toISOString(),
        settings: { ...voiceSettings },
      };

      setCurrentGeneration(record);
      onSaveGeneration(record);
    } catch (err: unknown) {
      if (!abortControllerRef.current) {
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(msg);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCancel = () => {
    abortControllerRef.current = true;
    setIsGenerating(false);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setText(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePreprocess = () => {
    const cleaned = preprocessText(text);
    setText(cleaned);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#12141e] border border-white/[0.08] p-3 rounded-2xl shadow-lg">
        {/* Voice Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center gap-3 px-3 py-2 bg-[#181b28] hover:bg-[#1f2233] border border-white/[0.08] hover:border-amber-500/40 rounded-xl transition-all group"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-inner flex-shrink-0"
              style={{ backgroundColor: selectedVoice.avatarColor || '#d97706' }}
            >
              {selectedVoice.name.charAt(0)}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                  {selectedVoice.name}
                </span>
                <span className="text-[10px] text-zinc-400 font-normal">
                  ({selectedVoice.category})
                </span>
              </div>
              <div className="text-[10px] text-zinc-400">
                {selectedVoice.accent} · {selectedVoice.gender}
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-zinc-400 group-hover:text-white ml-1" />
          </button>

          {/* Model Selector */}
          <div className="relative">
            <select
              value={selectedModel.id}
              onChange={(e) => {
                const found = models.find((m) => m.id === e.target.value);
                if (found) setSelectedModel(found);
              }}
              className="appearance-none bg-[#181b28] border border-white/[0.08] hover:border-white/[0.15] text-xs text-zinc-200 rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:border-amber-500/60 font-sans cursor-pointer"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} {model.isCustom ? '★ (Custom Checkpoint)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          </div>

          {/* Synthesis Engine Mode Selector */}
          <div className="relative">
            <select
              value={serverConfig.mode}
              onChange={(e) => {
                if (onUpdateServerConfig) {
                  onUpdateServerConfig({
                    ...serverConfig,
                    mode: e.target.value as any,
                  });
                }
              }}
              className="appearance-none bg-[#181b28] border border-white/[0.08] hover:border-white/[0.15] text-xs text-amber-300 rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:border-amber-500/60 font-sans cursor-pointer"
            >
              <option value="auto">⚡ Auto Engine (Coqui / Zero-Quota Fallback)</option>
              <option value="browser_speech">🎙️ Browser Voices (100% Free · Unlimited · No Quota)</option>
              <option value="local_coqui">💻 Local Coqui TTS (Port 5002)</option>
              <option value="cloud_neural">☁️ Cloud Neural Engine (Gemini TTS)</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* Right Settings Toggle */}
        <div className="relative flex items-center gap-2">
          <button
            onClick={() => setIsSettingsPanelOpen(!isSettingsPanelOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              isSettingsPanelOpen
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-[#181b28] text-zinc-300 hover:text-white border-white/[0.08] hover:bg-[#1f2233]'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Voice Parameters</span>
            <span className="text-[10px] font-mono opacity-80">
              {voiceSettings.stability}% / {voiceSettings.similarity}%
            </span>
          </button>

          {/* Voice Settings Flyout */}
          <VoiceSettingsPanel
            isOpen={isSettingsPanelOpen}
            onClose={() => setIsSettingsPanelOpen(false)}
            settings={voiceSettings}
            onChange={setVoiceSettings}
          />
        </div>
      </div>

      {/* Main Text Editor Canvas */}
      <div className="relative bg-[#10121b] border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden focus-within:border-amber-500/40 transition-colors">
        {/* Editor Toolbar */}
        <div className="px-4 py-2.5 border-b border-white/[0.06] bg-[#0c0d14] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Sample Scripts Selector */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-[11px] hidden sm:inline">Templates:</span>
            <div className="flex items-center gap-1">
              {SAMPLE_TEXT_SCRIPTS.map((script) => (
                <button
                  key={script.id}
                  onClick={() => setText(script.text)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors"
                >
                  {script.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreprocess}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors text-[11px]"
              title="Expand symbols ($ -> dollars, % -> percent) and normalize whitespace"
            >
              <Wand2 className="h-3 w-3 text-amber-400" />
              <span>Format Symbols</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-colors text-[11px]"
              title="Import .txt, .md, or script file"
            >
              <Upload className="h-3 w-3" />
              <span>Import Script</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.csv,.json"
              onChange={handleImportFile}
              className="hidden"
            />

            <button
              onClick={() => setText('')}
              className="p-1 text-zinc-400 hover:text-rose-400 rounded hover:bg-white/[0.04] transition-colors"
              title="Clear editor"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Textarea */}
        <div className="p-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste any text without length restrictions. VOIVER automatically partitions chapters, books, and long-form scripts into natural sentence chunks..."
            className="w-full min-h-[220px] bg-transparent text-zinc-100 placeholder-zinc-500 text-sm leading-relaxed focus:outline-none resize-y font-sans selection:bg-amber-500/25 selection:text-amber-200"
          />
        </div>

        {/* Bottom Metadata & Unlimited Indicator */}
        <div className="px-5 py-3 border-t border-white/[0.06] bg-[#0c0d14] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Unlimited Character Badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
              <Sparkles className="h-3 w-3" />
              Unlimited Chars Enabled
            </span>
            <span className="text-zinc-500 text-[11px] hidden sm:inline">
              · Zero Token Quota Limit
            </span>
          </div>

          {/* Counts */}
          <div className="flex items-center gap-3 text-zinc-400 font-mono text-[11px]">
            <span>{charCount.toLocaleString()} chars</span>
            <span>·</span>
            <span>{wordCount.toLocaleString()} words</span>
            <span>·</span>
            <button
              onClick={() => setShowChunkInspector(!showChunkInspector)}
              className="text-amber-400/90 hover:underline flex items-center gap-1"
            >
              <Layers className="h-3 w-3" />
              {chunks.length} {chunks.length === 1 ? 'chunk' : 'chunks'}
            </button>
            <span>·</span>
            <span>~{Math.ceil(estimatedSeconds)}s est.</span>
          </div>
        </div>
      </div>

      {/* Chunks breakdown drawer */}
      {showChunkInspector && (
        <ChunkInspector
          chunks={chunks}
          isOpen={showChunkInspector}
          onClose={() => setShowChunkInspector(false)}
        />
      )}

      {/* Quota Notice Banner */}
      {quotaWarning && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-semibold">
                Google Gemini Free Tier Limit (10 req/day) Reached
              </strong>
              <p className="text-amber-300/90 text-[11px] mt-0.5 leading-relaxed">
                VOIVER automatically transitioned to the <strong>Unlimited On-Device Natural Voice Engine</strong> so your audio generation continues with zero character or quota restrictions! To use neural Coqui models, connect your local server on port 5002.
              </p>
            </div>
          </div>
          <button
            onClick={() => setQuotaWarning(false)}
            className="px-2.5 py-1 text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg transition-colors flex-shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Error display */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white text-xs underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Action / Generation Dock */}
      <div className="bg-[#12141f] border border-white/[0.08] rounded-2xl p-4 shadow-2xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-300">
            {isGenerating ? (
              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>
                  Synthesizing chunk {currentChunkIndex} of {chunks.length} ({progressPercent}%)...
                </span>
              </div>
            ) : (
              <span className="text-zinc-400">
                Ready to synthesize using <strong className="text-zinc-200">{selectedVoice.name}</strong> on{' '}
                <strong className="text-zinc-200">{selectedModel.name}</strong>.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isGenerating ? (
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={!text.trim()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-lg ${
                  text.trim()
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Sparkles className="h-4 w-4 stroke-[2.2]" />
                <span>Generate Speech</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress bar during synthesis */}
        {isGenerating && (
          <div className="w-full bg-[#0d0e15] rounded-full h-2 overflow-hidden border border-white/[0.06]">
            <div
              className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        {/* Master Output Waveform Player */}
        {currentGeneration && (
          <div className="pt-2">
            <WaveformPlayer
              audioBlob={currentGeneration.audioBlob}
              audioUrl={currentGeneration.audioUrl}
              duration={currentGeneration.duration}
              voiceName={currentGeneration.voiceName}
              modelName={currentGeneration.modelName}
              chunkCount={currentGeneration.chunkCount}
              showChunkInspector={showChunkInspector}
              onToggleChunkInspector={() => setShowChunkInspector(!showChunkInspector)}
            />
          </div>
        )}
      </div>

      {/* Voice Selector Modal */}
      <VoiceSelectorModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        voices={voices}
        selectedVoice={selectedVoice}
        onSelectVoice={setSelectedVoice}
        onOpenVoiceLab={onOpenVoiceLab}
        voiceSettings={voiceSettings}
        onResetVoices={onResetVoices}
      />
    </div>
  );
};
