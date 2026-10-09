import React, { useState, useRef } from 'react';
import {
  Mic,
  Upload,
  FileCode,
  Sliders,
  CheckCircle2,
  Trash2,
  Cpu,
  Layers,
  Sparkles,
  Play,
  Pause,
  AlertCircle,
  FileUp,
  Server,
} from 'lucide-react';
import { Voice, CoquiModel } from '../../types/tts';

interface VoiceLabViewProps {
  voices: Voice[];
  onAddVoice: (voice: Voice) => void;
  models: CoquiModel[];
  onRegisterCustomModel: (model: CoquiModel) => void;
  onDeleteCustomModel: (modelId: string) => void;
}

export const VoiceLabView: React.FC<VoiceLabViewProps> = ({
  voices,
  onAddVoice,
  models,
  onRegisterCustomModel,
  onDeleteCustomModel,
}) => {
  const [activeTab, setActiveTab] = useState<'cloning' | 'custom_model'>('cloning');

  // Voice cloning state
  const [cloneName, setCloneName] = useState('');
  const [cloneDescription, setCloneDescription] = useState('');
  const [cloneGender, setCloneGender] = useState<'Male' | 'Female' | 'Neutral'>('Neutral');
  const [cloneAccent, setCloneAccent] = useState('American (Custom)');
  const [referenceAudioFile, setReferenceAudioFile] = useState<File | null>(null);
  const [referenceAudioUrl, setReferenceAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cloneSuccess, setCloneSuccess] = useState(false);

  // Custom Fine-Tuned Model Upload state
  const [customModelName, setCustomModelName] = useState('');
  const [customArchitecture, setCustomArchitecture] = useState<'XTTS-v2' | 'VITS' | 'YourTTS' | 'Custom-Checkpoint'>('XTTS-v2');
  const [customSampleRate, setCustomSampleRate] = useState<number>(24000);
  const [customDevice, setCustomDevice] = useState('cuda:0');
  const [checkpointFile, setCheckpointFile] = useState<File | null>(null);
  const [configFile, setConfigFile] = useState<File | null>(null);
  const [speakersFile, setSpeakersFile] = useState<File | null>(null);
  const [referenceSampleFile, setReferenceSampleFile] = useState<File | null>(null);
  const [isUploadingModel, setIsUploadingModel] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Audio recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Reference file selection
  const handleSelectReferenceAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReferenceAudioFile(file);
    const url = URL.createObjectURL(file);
    setReferenceAudioUrl(url);
  };

  // Microphone recording
  const handleToggleRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        recorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const url = URL.createObjectURL(blob);
          setReferenceAudioUrl(url);
          const file = new File([blob], `mic_recording_${Date.now()}.wav`, { type: 'audio/wav' });
          setReferenceAudioFile(file);
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (err) {
        alert('Could not access microphone. Please check browser permissions.');
      }
    }
  };

  // Submit voice clone
  const handleSaveClonedVoice = () => {
    if (!cloneName.trim()) {
      alert('Please enter a voice name.');
      return;
    }

    const newVoice: Voice = {
      id: `voice-cloned-${Date.now()}`,
      name: cloneName.trim(),
      category: 'Custom Cloned',
      gender: cloneGender,
      accent: cloneAccent,
      language: 'English (US)',
      description: cloneDescription.trim() || 'Zero-shot cloned speaker trained via Coqui XTTS-v2 reference latents.',
      tags: ['Zero-Shot Clone', 'Custom Audio', 'XTTS Latents'],
      isCloned: true,
      avatarColor: '#8b5cf6',
      previewSampleText: `Hello, this is my cloned voice: ${cloneName.trim()}. I was created using Coqui XTTS latent embeddings.`,
      referenceAudioUrl: referenceAudioUrl || undefined,
      baseSpeakerId: `cloned_${cloneName.toLowerCase().replace(/\s+/g, '_')}`,
    };

    onAddVoice(newVoice);
    setCloneSuccess(true);
    setTimeout(() => {
      setCloneSuccess(false);
      setCloneName('');
      setCloneDescription('');
      setReferenceAudioFile(null);
      setReferenceAudioUrl(null);
    }, 2500);
  };

  // Submit custom fine-tuned model checkpoint
  const handleUploadFineTunedModel = async () => {
    if (!customModelName.trim()) {
      alert('Please specify a model name.');
      return;
    }
    if (!checkpointFile) {
      alert('Please select a PyTorch model checkpoint (.pth / .pt file).');
      return;
    }

    setIsUploadingModel(true);

    try {
      // Send registration to server backend
      const res = await fetch('/api/models/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: customModelName.trim(),
          architecture: customArchitecture,
          checkpointFileName: checkpointFile.name,
          configFileName: configFile ? configFile.name : 'config.json',
          speakersFileName: speakersFile ? speakersFile.name : undefined,
          sampleRate: customSampleRate,
          device: customDevice,
        }),
      });

      const data = await res.json();
      const registered = data.model;

      const newCoquiModel: CoquiModel = {
        id: registered?.id || `custom-${Date.now()}`,
        name: customModelName.trim(),
        architecture: customArchitecture,
        description: `Custom fine-tuned checkpoint (${checkpointFile.name}) running on ${customDevice}.`,
        sampleRate: customSampleRate,
        isCustom: true,
        status: 'ready',
        checkpointFileName: checkpointFile.name,
        configFileName: configFile?.name,
        speakersFileName: speakersFile?.name,
        device: customDevice,
        vramFootprint: '~2.2 GB VRAM',
        multiSpeaker: Boolean(speakersFile),
        languages: ['en'],
      };

      onRegisterCustomModel(newCoquiModel);
      setUploadSuccess(true);

      setTimeout(() => {
        setUploadSuccess(false);
        setCustomModelName('');
        setCheckpointFile(null);
        setConfigFile(null);
        setSpeakersFile(null);
        setReferenceSampleFile(null);
      }, 2500);
    } catch (err) {
      console.error('Model registration error:', err);
    } finally {
      setIsUploadingModel(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Top Navigation between Clone and Model Upload */}
      <div className="flex items-center gap-2 p-1 bg-[#12141e] border border-white/[0.08] rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('cloning')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'cloning'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Mic className="h-4 w-4" />
          <span>Instant Voice Cloning</span>
        </button>

        <button
          onClick={() => setActiveTab('custom_model')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'custom_model'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <FileCode className="h-4 w-4" />
          <span>Custom Fine-Tuned Model Upload (.pth)</span>
        </button>
      </div>

      {/* SUB-TAB 1: Instant Voice Cloning */}
      {activeTab === 'cloning' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form */}
          <div className="lg:col-span-7 bg-[#10121b] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Coqui XTTS Zero-Shot Voice Clone
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Clone any voice from a 3–10 second clean audio clip without hours of fine-tuning.
                Extracted latent speaker embeddings are automatically registered into your voice library.
              </p>
            </div>

            {/* Reference Audio Upload / Record Box */}
            <div className="border border-dashed border-white/[0.15] rounded-xl p-5 bg-[#141622]/50 text-center space-y-3">
              <div className="flex justify-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.12] text-white rounded-xl text-xs font-medium cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Upload Audio (.wav, .mp3)</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleSelectReferenceAudio}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleToggleRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-white/[0.08] hover:bg-white/[0.12] text-white'
                  }`}
                >
                  <Mic className="h-4 w-4" />
                  <span>{isRecording ? 'Stop Recording' : 'Record Mic'}</span>
                </button>
              </div>

              {referenceAudioFile ? (
                <div className="p-3 bg-[#0d0e15] rounded-xl border border-white/[0.06] text-left text-xs text-zinc-300 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">{referenceAudioFile.name}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {(referenceAudioFile.size / 1024).toFixed(1)} KB · Ready for Latent Conditioning
                    </span>
                  </div>
                  {referenceAudioUrl && (
                    <audio src={referenceAudioUrl} controls className="h-8 max-w-[200px]" />
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500">
                  Provide 3–10 seconds of clear, unclipped speech with minimal background noise.
                </p>
              )}
            </div>

            {/* Voice Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Voice Name</label>
                <input
                  type="text"
                  value={cloneName}
                  onChange={(e) => setCloneName(e.target.value)}
                  placeholder="e.g. Professor Sarah, Cyber Narrator, John Solo..."
                  className="w-full bg-[#161824] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Gender</label>
                  <select
                    value={cloneGender}
                    onChange={(e) => setCloneGender(e.target.value as 'Male' | 'Female' | 'Neutral')}
                    className="w-full bg-[#161824] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Neutral">Neutral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Accent / Style</label>
                  <input
                    type="text"
                    value={cloneAccent}
                    onChange={(e) => setCloneAccent(e.target.value)}
                    placeholder="e.g. British Northern, Californian, French Accent"
                    className="w-full bg-[#161824] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Description (Optional)</label>
                <textarea
                  value={cloneDescription}
                  onChange={(e) => setCloneDescription(e.target.value)}
                  rows={2}
                  placeholder="Warm storytelling cadence with intimate close-mic presence..."
                  className="w-full bg-[#161824] border border-white/[0.08] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500/60 resize-y"
                />
              </div>
            </div>

            {cloneSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Voice clone created! It is now available in your Studio voice selector.</span>
              </div>
            )}

            <button
              onClick={handleSaveClonedVoice}
              disabled={!cloneName.trim()}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                cloneName.trim()
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Clone Voice & Add to Studio Library</span>
            </button>
          </div>

          {/* Right Info & Tips */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#10121b] border border-white/[0.08] rounded-2xl p-5 shadow-xl space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider text-amber-400">
                Coqui XTTS-v2 Latent Conditioning Guide
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Coqui XTTS-v2 does not require retraining weights to clone a speaker. It uses an audio
                encoder network (hugging face / mel-spectrogram projection) that extracts a 512-dimensional
                speaker latent vector in &lt;100 milliseconds.
              </p>
              <ul className="text-xs text-zinc-400 space-y-1.5 list-disc pl-4">
                <li>Best audio length: 5 to 10 seconds of clear speech.</li>
                <li>Avoid clips with music, reverb, or multiple people talking.</li>
                <li>XTTS-v2 can synthesize 17 languages using the same English voice clone!</li>
              </ul>
            </div>

            {/* Currently Cloned Voices */}
            <div className="bg-[#10121b] border border-white/[0.08] rounded-2xl p-5 shadow-xl">
              <h4 className="text-xs font-semibold text-white mb-3">Custom Cloned Voices ({voices.filter(v => v.isCloned).length})</h4>
              <div className="space-y-2">
                {voices.filter(v => v.isCloned).map((voice) => (
                  <div
                    key={voice.id}
                    className="p-3 bg-[#151722] rounded-xl border border-white/[0.06] flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{voice.name}</div>
                      <div className="text-[11px] text-zinc-400">{voice.accent} · {voice.gender}</div>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono">
                      XTTS Latent
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Custom Fine-Tuned Model Upload (.pth / PyTorch Checkpoint) */}
      {activeTab === 'custom_model' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#10121b] border border-white/[0.08] rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Upload Custom Fine-Tuned Coqui TTS Checkpoints
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Deploy your own PyTorch fine-tuned weights (<code className="text-amber-300">best_model.pth</code>), training configuration, and multi-speaker embeddings into VOIVER.
              </p>
            </div>

            {/* Model Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Model Name</label>
                <input
                  type="text"
                  value={customModelName}
                  onChange={(e) => setCustomModelName(e.target.value)}
                  placeholder="e.g. My_Custom_Audiobook_VITS"
                  className="w-full bg-[#161824] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Architecture</label>
                <select
                  value={customArchitecture}
                  onChange={(e) => setCustomArchitecture(e.target.value as 'XTTS-v2' | 'VITS' | 'YourTTS')}
                  className="w-full bg-[#161824] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60"
                >
                  <option value="XTTS-v2">XTTS-v2 (Autoregressive & DVAE)</option>
                  <option value="VITS">VITS (Variational Inference End-to-End)</option>
                  <option value="YourTTS">YourTTS (Zero-shot multi-speaker)</option>
                  <option value="Custom-Checkpoint">Custom PyTorch Checkpoint</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Sample Rate</label>
                <select
                  value={customSampleRate}
                  onChange={(e) => setCustomSampleRate(Number(e.target.value))}
                  className="w-full bg-[#161824] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60"
                >
                  <option value={24000}>24,000 Hz (High Fidelity / XTTS Default)</option>
                  <option value={22050}>22,050 Hz (VITS Standard)</option>
                  <option value={44100}>44,100 Hz (Studio CD Quality)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Host Hardware Target</label>
                <select
                  value={customDevice}
                  onChange={(e) => setCustomDevice(e.target.value)}
                  className="w-full bg-[#161824] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/60"
                >
                  <option value="cuda:0">CUDA:0 (NVIDIA GPU Tensor Cores)</option>
                  <option value="mps">Apple MPS (Metal Acceleration)</option>
                  <option value="cpu">CPU (Multi-threaded AVX2)</option>
                </select>
              </div>
            </div>

            {/* Checkpoint File Upload Pickers */}
            <div className="space-y-3 pt-2 border-t border-white/[0.06]">
              {/* Model Weights */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  1. Model Weights (<code className="text-amber-400">*.pth</code>, <code className="text-amber-400">*.pt</code>, <code className="text-amber-400">*.bin</code>) *Required
                </label>
                <label className="flex items-center justify-between p-3 bg-[#161824] border border-white/[0.08] hover:border-amber-500/40 rounded-xl cursor-pointer text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <FileUp className="h-4 w-4 text-amber-400" />
                    <span className="text-zinc-200">
                      {checkpointFile ? checkpointFile.name : 'Choose model checkpoint weights file...'}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {checkpointFile ? `${(checkpointFile.size / (1024 * 1024)).toFixed(1)} MB` : 'Browse'}
                  </span>
                  <input
                    type="file"
                    accept=".pth,.pt,.bin,.onnx"
                    onChange={(e) => setCheckpointFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Config JSON */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  2. Configuration File (<code className="text-amber-400">config.json</code>)
                </label>
                <label className="flex items-center justify-between p-3 bg-[#161824] border border-white/[0.08] hover:border-amber-500/40 rounded-xl cursor-pointer text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-blue-400" />
                    <span className="text-zinc-200">
                      {configFile ? configFile.name : 'Choose training config.json file...'}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {configFile ? `${(configFile.size / 1024).toFixed(1)} KB` : 'Browse'}
                  </span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => setConfigFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Speaker Embeddings */}
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  3. Speaker Embeddings (<code className="text-amber-400">speakers.pth</code> / <code className="text-amber-400">speakers.json</code>) - Optional
                </label>
                <label className="flex items-center justify-between p-3 bg-[#161824] border border-white/[0.08] hover:border-amber-500/40 rounded-xl cursor-pointer text-xs transition-colors">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-400" />
                    <span className="text-zinc-200">
                      {speakersFile ? speakersFile.name : 'Multi-speaker embedding tensor...'}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {speakersFile ? `${(speakersFile.size / 1024).toFixed(1)} KB` : 'Browse'}
                  </span>
                  <input
                    type="file"
                    accept=".pth,.json,.pt"
                    onChange={(e) => setSpeakersFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {uploadSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>Custom fine-tuned checkpoint registered successfully into VOIVER Studio!</span>
              </div>
            )}

            <button
              onClick={handleUploadFineTunedModel}
              disabled={!customModelName.trim() || !checkpointFile || isUploadingModel}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                customModelName.trim() && checkpointFile
                  ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              <Cpu className="h-4 w-4" />
              <span>{isUploadingModel ? 'Registering Checkpoint...' : 'Register Custom Model'}</span>
            </button>
          </div>

          {/* Model Registry List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#10121b] border border-white/[0.08] rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-white">Active Model Registry ({models.length})</h4>
                <span className="text-[11px] text-zinc-400 font-mono">Local Host Ready</span>
              </div>

              <div className="space-y-3">
                {models.map((model) => (
                  <div
                    key={model.id}
                    className="p-3.5 bg-[#151722] rounded-xl border border-white/[0.06] text-xs space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          {model.name}
                          {model.isCustom && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono">
                              Custom Checkpoint
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {model.architecture} · {model.sampleRate} Hz · {model.device || 'CUDA/CPU'}
                        </div>
                      </div>

                      {model.isCustom && (
                        <button
                          onClick={() => onDeleteCustomModel(model.id)}
                          className="p-1 text-zinc-500 hover:text-rose-400 rounded transition-colors"
                          title="Remove custom model"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-400 line-clamp-2">
                      {model.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
