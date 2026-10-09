/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { StudioView } from './components/studio/StudioView';
import { BatchProcessor } from './components/batch/BatchProcessor';
import { VoiceLabView } from './components/voices/VoiceLabView';
import { LocalHostGuide } from './components/hosting/LocalHostGuide';
import { HistoryView } from './components/history/HistoryView';
import {
  Voice,
  CoquiModel,
  VoiceSettings,
  GenerationRecord,
  ServerConfig,
} from './types/tts';
import {
  PRESET_VOICES,
  PRESET_MODELS,
  DEFAULT_VOICE_SETTINGS,
} from './data/presetVoices';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'voices' | 'batch' | 'hosting' | 'history'>('studio');

  // Voices state
  const [voices, setVoices] = useState<Voice[]>(() => {
    try {
      const saved = localStorage.getItem('voiver_voices');
      if (saved) {
        const parsed = JSON.parse(saved);
        const existingIds = new Set(parsed.map((v: Voice) => v.id));
        const missingPresets = PRESET_VOICES.filter((p) => !existingIds.has(p.id));
        return [...missingPresets, ...parsed];
      }
    } catch {}
    return PRESET_VOICES;
  });

  const [selectedVoice, setSelectedVoice] = useState<Voice>(voices[0] || PRESET_VOICES[0]);

  // Models state
  const [models, setModels] = useState<CoquiModel[]>(() => {
    try {
      const saved = localStorage.getItem('voiver_models');
      if (saved) return JSON.parse(saved);
    } catch {}
    return PRESET_MODELS;
  });

  const [selectedModel, setSelectedModel] = useState<CoquiModel>(models[0] || PRESET_MODELS[0]);

  // Voice Settings state
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    try {
      const saved = localStorage.getItem('voiver_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_VOICE_SETTINGS;
  });

  // Server & Local Coqui connection state
  const [serverConfig, setServerConfig] = useState<ServerConfig>({
    mode: 'auto',
    localServerUrl: 'http://localhost:5002',
    connected: false,
    latency: null,
    lastTested: null,
    activeDevice: 'cuda:0',
    threads: 4,
  });

  // History state
  const [generations, setGenerations] = useState<GenerationRecord[]>([]);

  // Persist voices and settings
  useEffect(() => {
    try {
      localStorage.setItem('voiver_voices', JSON.stringify(voices));
    } catch {}
  }, [voices]);

  useEffect(() => {
    try {
      localStorage.setItem('voiver_models', JSON.stringify(models));
    } catch {}
  }, [models]);

  useEffect(() => {
    try {
      localStorage.setItem('voiver_settings', JSON.stringify(voiceSettings));
    } catch {}
  }, [voiceSettings]);

  // Auto-ping local Coqui server on startup
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch('/api/coqui/ping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: serverConfig.localServerUrl }),
        });
        const data = await res.json();
        setServerConfig((prev) => ({
          ...prev,
          connected: data.connected,
          latency: data.latency,
          lastTested: new Date().toISOString(),
        }));
      } catch {
        // Fallback to built-in acoustic neural engine
      }
    };

    checkServer();
  }, []);

  // Voice lab handlers
  const handleAddVoice = (newVoice: Voice) => {
    setVoices((prev) => [newVoice, ...prev]);
    setSelectedVoice(newVoice);
    setActiveTab('studio');
  };

  const handleRegisterCustomModel = (newModel: CoquiModel) => {
    setModels((prev) => [newModel, ...prev]);
    setSelectedModel(newModel);
  };

  const handleDeleteCustomModel = (modelId: string) => {
    setModels((prev) => prev.filter((m) => m.id !== modelId));
    if (selectedModel.id === modelId) {
      setSelectedModel(models[0] || PRESET_MODELS[0]);
    }
    // Delete on backend
    fetch(`/api/models/${modelId}`, { method: 'DELETE' }).catch(() => {});
  };

  const handleSaveGeneration = (record: GenerationRecord) => {
    setGenerations((prev) => [record, ...prev]);
  };

  const handleDeleteGeneration = (id: string) => {
    setGenerations((prev) => prev.filter((g) => g.id !== id));
  };

  const handleClearAllGenerations = () => {
    setGenerations([]);
  };

  const handleLoadIntoStudio = (record: GenerationRecord) => {
    const foundVoice = voices.find((v) => v.id === record.voiceId);
    if (foundVoice) setSelectedVoice(foundVoice);
    const foundModel = models.find((m) => m.id === record.modelId);
    if (foundModel) setSelectedModel(foundModel);
    if (record.settings) setVoiceSettings(record.settings);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-amber-500/25 selection:text-amber-300">
      {/* Studio Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverConfig={serverConfig}
        onOpenServerConfig={() => setActiveTab('hosting')}
        generationsCount={generations.length}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 w-full">
        {activeTab === 'studio' && (
          <StudioView
            voices={voices}
            models={models}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            voiceSettings={voiceSettings}
            setVoiceSettings={setVoiceSettings}
            serverConfig={serverConfig}
            onUpdateServerConfig={setServerConfig}
            onOpenVoiceLab={() => setActiveTab('voices')}
            onSaveGeneration={handleSaveGeneration}
          />
        )}

        {activeTab === 'batch' && (
          <BatchProcessor
            voices={voices}
            voiceSettings={voiceSettings}
            serverConfig={serverConfig}
          />
        )}

        {activeTab === 'voices' && (
          <VoiceLabView
            voices={voices}
            onAddVoice={handleAddVoice}
            models={models}
            onRegisterCustomModel={handleRegisterCustomModel}
            onDeleteCustomModel={handleDeleteCustomModel}
          />
        )}

        {activeTab === 'hosting' && (
          <LocalHostGuide
            serverConfig={serverConfig}
            onUpdateServerConfig={setServerConfig}
            models={models}
          />
        )}

        {activeTab === 'history' && (
          <HistoryView
            generations={generations}
            onDeleteGeneration={handleDeleteGeneration}
            onClearAll={handleClearAllGenerations}
            onLoadIntoStudio={handleLoadIntoStudio}
          />
        )}
      </main>

      {/* Persistent Audio Context Notice / Footer */}
      <footer className="border-t border-white/[0.06] bg-[#0c0d14] py-3 px-6 text-center text-xs text-zinc-400">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">VOIVER TTS Engine</span>
            <span>·</span>
            <span>Unlimited Linguistic Chunking Pipeline</span>
            <span>·</span>
            <span className="text-amber-400 font-mono text-[11px]">Coqui XTTS-v2 & VITS Architecture</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            <button
              onClick={() => setActiveTab('hosting')}
              className="hover:text-amber-400 transition-colors"
            >
              Host on Local GPU
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('voices')}
              className="hover:text-amber-400 transition-colors"
            >
              Upload Checkpoint (.pth)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
