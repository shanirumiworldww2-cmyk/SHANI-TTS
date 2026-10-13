import React from 'react';
import { Volume2, Sparkles, Layers, Sliders, Server, History, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { ServerConfig } from '../../types/tts';

interface HeaderProps {
  activeTab: 'studio' | 'voices' | 'batch' | 'hosting' | 'history';
  setActiveTab: (tab: 'studio' | 'voices' | 'batch' | 'hosting' | 'history') => void;
  serverConfig: ServerConfig;
  onOpenServerConfig: () => void;
  generationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  serverConfig,
  onOpenServerConfig,
  generationsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#0c0d12]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-black">
            <Volume2 className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-sans">TOOL BY SHANI</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                VOIVER TTS
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Open-Source Neural Voice Studio · 130+ Realistic Voices
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#14161f] p-1 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'studio'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('batch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'batch'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Batch Processor</span>
          </button>

          <button
            onClick={() => setActiveTab('voices')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'voices'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Voice Lab & Models</span>
          </button>

          <button
            onClick={() => setActiveTab('hosting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'hosting'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Local Host</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all relative ${
              activeTab === 'history'
                ? 'bg-amber-500 text-black font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>History</span>
            {generationsCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === 'history' ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-300'
              }`}>
                {generationsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Server Connection Status & Download ZIP */}
        <div className="flex items-center gap-2">
          <a
            href="/api/download-zip"
            download="voiver-tts-studio.zip"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all shadow-sm shadow-amber-500/20 active:scale-95"
            title="Download complete standalone project ZIP to execute locally on your PC"
          >
            <Download className="h-3.5 w-3.5 stroke-[2.4]" />
            <span className="hidden sm:inline">Download ZIP</span>
            <span className="sm:hidden">ZIP</span>
          </a>

          <button
            onClick={onOpenServerConfig}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#14161f] border border-white/[0.08] hover:border-amber-500/40 text-xs transition-colors group"
            title="Configure Local Coqui TTS Connection"
          >
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  serverConfig.connected
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                    : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                }`}
              />
              <span className="text-zinc-300 group-hover:text-white text-[11px] font-medium hidden sm:inline">
                {serverConfig.connected ? 'Coqui (Port 5002)' : 'Local Host Ready'}
              </span>
            </div>
            {serverConfig.latency ? (
              <span className="text-[10px] text-zinc-500 font-mono">
                {serverConfig.latency}ms
              </span>
            ) : (
              <span className="text-[10px] text-amber-400/90 font-mono">
                Embedded
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
