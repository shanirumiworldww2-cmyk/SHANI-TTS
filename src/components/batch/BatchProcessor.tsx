import React, { useState, useRef } from 'react';
import {
  Layers,
  Play,
  Pause,
  Download,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  Combine,
  Sparkles,
} from 'lucide-react';
import { Voice, VoiceSettings, BatchItem, ServerConfig } from '../../types/tts';
import { synthesizeChunkAudio, stitchWavBlobs, createAudioUrl } from '../../utils/audioSynthesis';
import { formatDuration } from '../../utils/textChunker';

interface BatchProcessorProps {
  voices: Voice[];
  voiceSettings: VoiceSettings;
  serverConfig: ServerConfig;
}

export const BatchProcessor: React.FC<BatchProcessorProps> = ({
  voices,
  voiceSettings,
  serverConfig,
}) => {
  const [batchItems, setBatchItems] = useState<BatchItem[]>([
    {
      id: 'batch-1',
      text: 'Good morning everyone, welcome to episode 42 of the VOIVER Tech Breakdown.',
      voiceId: voices[1]?.id || 'voice-rachel',
      speed: 1.0,
      filename: '01_intro_rachel.wav',
      status: 'pending',
      progress: 0,
    },
    {
      id: 'batch-2',
      text: 'Today we are diving into local weights hosting, fine-tuning checkpoints, and eliminating character caps.',
      voiceId: voices[0]?.id || 'voice-adam',
      speed: 1.0,
      filename: '02_topic_adam.wav',
      status: 'pending',
      progress: 0,
    },
    {
      id: 'batch-3',
      text: 'Having complete control over your model latency means zero cloud rate-limits when generating long audiobooks.',
      voiceId: voices[2]?.id || 'voice-antoni',
      speed: 1.0,
      filename: '03_insight_antoni.wav',
      status: 'pending',
      progress: 0,
    },
    {
      id: 'batch-4',
      text: 'Let us start by reviewing how the chunking pipeline seamlessly stitches adjacent sentences.',
      voiceId: voices[3]?.id || 'voice-george',
      speed: 1.0,
      filename: '04_demo_george.wav',
      status: 'pending',
      progress: 0,
    },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProcessingIndex, setCurrentProcessingIndex] = useState<number | null>(null);
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);
  const [audioObj, setAudioObj] = useState<HTMLAudioElement | null>(null);
  const [mergedAudioUrl, setMergedAudioUrl] = useState<string | null>(null);
  const [isMerging, setIsMerging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cancelRef = useRef<boolean>(false);

  const handleAddRow = () => {
    const newItem: BatchItem = {
      id: `batch-${Date.now()}`,
      text: 'New batch dialogue segment...',
      voiceId: voices[0]?.id || 'voice-adam',
      speed: 1.0,
      filename: `segment_${batchItems.length + 1}.wav`,
      status: 'pending',
      progress: 0,
    };
    setBatchItems([...batchItems, newItem]);
  };

  const handleRemoveRow = (id: string) => {
    setBatchItems(batchItems.filter((i) => i.id !== id));
  };

  const handleUpdateItem = <K extends keyof BatchItem>(id: string, key: K, value: BatchItem[K]) => {
    setBatchItems(
      batchItems.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const handlePlayItem = (item: BatchItem) => {
    if (!item.audioBlob) return;

    if (playingItemId === item.id) {
      if (audioObj) {
        audioObj.pause();
        setAudioObj(null);
      }
      setPlayingItemId(null);
      return;
    }

    if (audioObj) {
      audioObj.pause();
    }

    const url = URL.createObjectURL(item.audioBlob);
    const audio = new Audio(url);
    setAudioObj(audio);
    setPlayingItemId(item.id);

    audio.onended = () => {
      setPlayingItemId(null);
      setAudioObj(null);
    };

    audio.play();
  };

  const handleDownloadItem = (item: BatchItem) => {
    if (!item.audioBlob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(item.audioBlob);
    a.download = item.filename || `batch_${item.id}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Process all items in batch
  const handleProcessAll = async () => {
    setIsProcessing(true);
    cancelRef.current = false;

    const items = [...batchItems];

    for (let i = 0; i < items.length; i++) {
      if (cancelRef.current) break;

      setCurrentProcessingIndex(i);
      items[i].status = 'processing';
      items[i].progress = 25;
      setBatchItems([...items]);

      try {
        const voice = voices.find((v) => v.id === items[i].voiceId) || voices[0];
        const itemSettings: VoiceSettings = {
          ...voiceSettings,
          speed: items[i].speed || 1.0,
        };

        items[i].progress = 60;
        setBatchItems([...items]);

        const blob = await synthesizeChunkAudio(
          items[i].text,
          voice,
          itemSettings,
          serverConfig.localServerUrl,
          serverConfig.connected
        );

        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const arrayBuf = await blob.arrayBuffer();
        const decoded = await audioCtx.decodeAudioData(arrayBuf.slice(0));
        await audioCtx.close();

        items[i].status = 'completed';
        items[i].progress = 100;
        items[i].audioBlob = blob;
        items[i].duration = decoded.duration;
        setBatchItems([...items]);
      } catch (err: unknown) {
        items[i].status = 'failed';
        items[i].error = err instanceof Error ? err.message : String(err);
        setBatchItems([...items]);
      }
    }

    setIsProcessing(false);
    setCurrentProcessingIndex(null);
  };

  // Merge all completed batch items into one master continuous file
  const handleMergeAll = async () => {
    const completedItems = batchItems.filter((i) => i.audioBlob);
    if (completedItems.length === 0) return;

    setIsMerging(true);
    try {
      const blobs = completedItems.map((i) => i.audioBlob as Blob);
      const { blob } = await stitchWavBlobs(blobs, voiceSettings.pauseDurationMs);
      const url = createAudioUrl(blob);
      setMergedAudioUrl(url);

      const a = document.createElement('a');
      a.href = url;
      a.download = `voiver_master_dialogue_${Date.now()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('Merge error:', err);
    } finally {
      setIsMerging(false);
    }
  };

  // Import batch CSV or TXT
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = content.split('\n').filter((l) => l.trim().length > 0);
      const newRows: BatchItem[] = [];

      lines.forEach((line, index) => {
        // Check for CSV comma format or plain line
        const parts = line.split(',');
        const text = parts[0]?.replace(/^"|"$/g, '').trim() || line.trim();
        const voiceId = voices[index % voices.length]?.id || voices[0].id;

        newRows.push({
          id: `batch-${Date.now()}-${index}`,
          text,
          voiceId,
          speed: 1.0,
          filename: `batch_line_${index + 1}.wav`,
          status: 'pending',
          progress: 0,
        });
      });

      if (newRows.length > 0) {
        setBatchItems(newRows);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const completedCount = batchItems.filter((i) => i.status === 'completed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Header Card */}
      <div className="bg-[#12141e] border border-white/[0.08] p-5 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Batch Audio Processing</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Bulk-synthesize multi-speaker scripts, podcasts, character dialogues, or import CSV text files.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 text-xs font-medium transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Import CSV / TXT</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt,.json"
            onChange={handleImportCSV}
            className="hidden"
          />

          <button
            onClick={handleAddRow}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-200 text-xs font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Row</span>
          </button>

          {completedCount > 0 && (
            <button
              onClick={handleMergeAll}
              disabled={isMerging}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-md shadow-purple-600/20"
            >
              {isMerging ? <Loader2 className="h-4 w-4 animate-spin" /> : <Combine className="h-4 w-4" />}
              <span>Merge Master Audio ({completedCount})</span>
            </button>
          )}

          <button
            onClick={isProcessing ? () => { cancelRef.current = true; } : handleProcessAll}
            disabled={batchItems.length === 0}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all ${
              isProcessing
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Stop Batch</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 stroke-[2.2]" />
                <span>Process All ({batchItems.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Batch Table Container */}
      <div className="bg-[#10121b] border border-white/[0.08] rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#0c0d14] text-[11px] text-zinc-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 min-w-[280px]">Script Dialogue / Text</th>
                <th className="py-3 px-4 w-44">Speaker Voice</th>
                <th className="py-3 px-4 w-28">Speed</th>
                <th className="py-3 px-4 w-36">Output File</th>
                <th className="py-3 px-4 w-28 text-center">Status</th>
                <th className="py-3 px-4 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {batchItems.map((item, idx) => {
                const isPlaying = playingItemId === item.id;
                const isCurrent = currentProcessingIndex === idx;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-white/[0.02] transition-colors ${
                      isCurrent ? 'bg-amber-500/[0.04]' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-zinc-500">
                      {idx + 1}
                    </td>

                    <td className="py-3 px-4">
                      <textarea
                        value={item.text}
                        onChange={(e) => handleUpdateItem(item.id, 'text', e.target.value)}
                        rows={2}
                        className="w-full bg-[#161824] border border-white/[0.06] rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500/50 resize-y"
                      />
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={item.voiceId}
                        onChange={(e) => handleUpdateItem(item.id, 'voiceId', e.target.value)}
                        className="w-full bg-[#161824] border border-white/[0.06] rounded-lg py-1.5 px-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                      >
                        {voices.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.category})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min={0.7}
                          max={1.5}
                          step={0.05}
                          value={item.speed}
                          onChange={(e) =>
                            handleUpdateItem(item.id, 'speed', Number(e.target.value))
                          }
                          className="w-16 accent-amber-500 bg-white/[0.1] h-1 rounded"
                        />
                        <span className="font-mono text-[10px] text-zinc-400">
                          {item.speed.toFixed(1)}x
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={item.filename}
                        onChange={(e) => handleUpdateItem(item.id, 'filename', e.target.value)}
                        className="w-full bg-[#161824] border border-white/[0.06] rounded-lg py-1 px-2 text-xs text-zinc-300 font-mono text-[11px] focus:outline-none focus:border-amber-500/50"
                      />
                    </td>

                    <td className="py-3 px-4 text-center">
                      {item.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{formatDuration(item.duration || 0)}</span>
                        </span>
                      )}
                      {item.status === 'processing' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          <span>{item.progress}%</span>
                        </span>
                      )}
                      {item.status === 'pending' && (
                        <span className="text-[11px] text-zinc-500">Queued</span>
                      )}
                      {item.status === 'failed' && (
                        <span className="text-[11px] text-rose-400 font-medium">Error</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.audioBlob && (
                          <>
                            <button
                              onClick={() => handlePlayItem(item)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isPlaying
                                  ? 'bg-amber-500 text-black'
                                  : 'bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.1]'
                              }`}
                              title="Play preview"
                            >
                              {isPlaying ? (
                                <Pause className="h-3.5 w-3.5 fill-current" />
                              ) : (
                                <Play className="h-3.5 w-3.5 fill-current" />
                              )}
                            </button>

                            <button
                              onClick={() => handleDownloadItem(item)}
                              className="p-1.5 rounded-lg bg-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.1] transition-colors"
                              title="Download WAV"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => handleRemoveRow(item.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-white/[0.04] transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/[0.06] bg-[#0c0d14] flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          <span>
            {batchItems.length} items in batch queue · {completedCount} completed
          </span>
          <span className="text-[11px] text-zinc-500">
            Tip: Export multi-character dialogue seamlessly into games, films, or audio dramas.
          </span>
        </div>
      </div>
    </div>
  );
};
