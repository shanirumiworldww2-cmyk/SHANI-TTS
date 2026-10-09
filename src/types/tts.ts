export interface Voice {
  id: string;
  name: string;
  category: 'Narrative' | 'Conversational' | 'Cinematic' | 'Character' | 'News' | 'Custom Cloned' | 'Fine-Tuned';
  gender: 'Male' | 'Female' | 'Neutral';
  accent: string;
  language: string;
  description: string;
  tags: string[];
  isCloned?: boolean;
  isCustom?: boolean;
  avatarColor: string;
  previewSampleText: string;
  baseSpeakerId?: string;
  referenceAudioUrl?: string;
}

export interface CoquiModel {
  id: string;
  name: string;
  architecture: 'XTTS-v2' | 'VITS' | 'YourTTS' | 'VCTK' | 'Pocket-TTS' | 'Custom-Checkpoint';
  description: string;
  sampleRate: number;
  isCustom: boolean;
  status: 'ready' | 'downloading' | 'unloaded';
  checkpointFileName?: string;
  configFileName?: string;
  speakersFileName?: string;
  device?: string;
  vramFootprint?: string;
  multiSpeaker: boolean;
  languages: string[];
}

export interface VoiceSettings {
  stability: number; // 0 - 100
  similarity: number; // 0 - 100
  styleExaggeration: number; // 0 - 100
  speakerBoost: boolean;
  speed: number; // 0.5 - 2.0
  pitch: number; // -12 to +12
  pauseDurationMs: number; // 100 - 1200
  maxChunkChars: number; // 120 - 500
  audioFormat: 'wav' | 'mp3';
  sampleRate: 22050 | 24000 | 44100;
}

export interface TextChunk {
  index: number;
  text: string;
  charCount: number;
  wordCount: number;
  estimatedDurationSec: number;
  status: 'idle' | 'generating' | 'done' | 'error';
  audioBlob?: Blob;
  audioUrl?: string;
}

export interface GenerationRecord {
  id: string;
  text: string;
  voiceId: string;
  voiceName: string;
  voiceCategory: string;
  modelId: string;
  modelName: string;
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
  charCount: number;
  chunkCount: number;
  createdAt: string;
  settings: VoiceSettings;
}

export interface BatchItem {
  id: string;
  text: string;
  voiceId: string;
  speed: number;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  audioBlob?: Blob;
  audioUrl?: string;
  duration?: number;
  error?: string;
}

export interface ServerConfig {
  mode: 'auto' | 'local_coqui' | 'browser_speech' | 'cloud_neural';
  localServerUrl: string;
  connected: boolean;
  latency: number | null;
  lastTested: string | null;
  activeDevice: 'cuda:0' | 'cpu' | 'mps';
  threads: number;
}
