import React from 'react';
import { Sliders, RotateCcw, Info, Volume2, Sparkles, Check } from 'lucide-react';
import { VoiceSettings } from '../../types/tts';
import { DEFAULT_VOICE_SETTINGS } from '../../data/presetVoices';

interface VoiceSettingsPanelProps {
  settings: VoiceSettings;
  onChange: (newSettings: VoiceSettings) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsPanel: React.FC<VoiceSettingsPanelProps> = ({
  settings,
  onChange,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const updateSetting = <K extends keyof VoiceSettings>(key: K, value: VoiceSettings[K]) => {
    onChange({
      ...settings,
      [key]: value,
    });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_VOICE_SETTINGS });
  };

  return (
    <div className="absolute right-0 top-12 z-30 w-80 sm:w-96 bg-[#12141e] border border-white/[0.12] rounded-2xl shadow-2xl p-5 text-white animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Voice & Model Settings</h3>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-amber-400 transition-colors"
          title="Reset to default settings"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Stability */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-zinc-200">Stability</span>
            <span className="font-mono text-amber-400">{settings.stability}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.stability}
            onChange={(e) => updateSetting('stability', Number(e.target.value))}
            className="w-full accent-amber-500 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
            <span>More Expressive / Dynamic</span>
            <span>More Consistent / Flat</span>
          </div>
        </div>

        {/* Similarity / Clarity */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-zinc-200">Clarity + Similarity</span>
            <span className="font-mono text-amber-400">{settings.similarity}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.similarity}
            onChange={(e) => updateSetting('similarity', Number(e.target.value))}
            className="w-full accent-amber-500 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
            <span>Loose Reference</span>
            <span>Strict High Fidelity</span>
          </div>
        </div>

        {/* Style Exaggeration */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-zinc-200">Style Exaggeration</span>
            <span className="font-mono text-amber-400">{settings.styleExaggeration}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={settings.styleExaggeration}
            onChange={(e) => updateSetting('styleExaggeration', Number(e.target.value))}
            className="w-full accent-amber-500 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
            <span>Natural Delivery</span>
            <span>Theatrical Cadence</span>
          </div>
        </div>

        {/* Speed */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-zinc-200">Speech Rate</span>
            <span className="font-mono text-amber-400">{settings.speed.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.05}
            value={settings.speed}
            onChange={(e) => updateSetting('speed', Number(e.target.value))}
            className="w-full accent-amber-500 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
            <span>0.5x Slow</span>
            <span>1.0x Normal</span>
            <span>2.0x Fast</span>
          </div>
        </div>

        {/* Pitch Shift */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-zinc-200">Pitch Tuning</span>
            <span className="font-mono text-amber-400">
              {settings.pitch > 0 ? `+${settings.pitch}` : settings.pitch} st
            </span>
          </div>
          <input
            type="range"
            min={-12}
            max={12}
            step={1}
            value={settings.pitch}
            onChange={(e) => updateSetting('pitch', Number(e.target.value))}
            className="w-full accent-amber-500 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-400 mt-0.5">
            <span>-12 Lower</span>
            <span>0 Neutral</span>
            <span>+12 Higher</span>
          </div>
        </div>

        {/* Natural Pause Timing */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-zinc-200">Breathing Pause Gap</span>
            <span className="font-mono text-amber-400">{settings.pauseDurationMs}ms</span>
          </div>
          <input
            type="range"
            min={100}
            max={800}
            step={20}
            value={settings.pauseDurationMs}
            onChange={(e) => updateSetting('pauseDurationMs', Number(e.target.value))}
            className="w-full accent-amber-500 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Natural acoustic silence inserted between stitched sentences.
          </p>
        </div>

        {/* Max Chunk Size */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-zinc-200">Max Chunk Window</span>
            <span className="font-mono text-amber-400">{settings.maxChunkChars} chars</span>
          </div>
          <input
            type="range"
            min={120}
            max={400}
            step={10}
            value={settings.maxChunkChars}
            onChange={(e) => updateSetting('maxChunkChars', Number(e.target.value))}
            className="w-full accent-amber-500 bg-white/[0.1] h-1.5 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-[10px] text-zinc-400 mt-0.5">
            Optimal boundary size for Coqui XTTS neural synthesis stability.
          </p>
        </div>

        {/* Speaker Boost Toggle */}
        <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-zinc-200">Speaker Boost</div>
            <div className="text-[10px] text-zinc-400">
              Harmonic saturation & resonance enhancement
            </div>
          </div>
          <button
            onClick={() => updateSetting('speakerBoost', !settings.speakerBoost)}
            className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
              settings.speakerBoost ? 'bg-amber-500' : 'bg-white/[0.12]'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.speakerBoost ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.08] flex justify-end">
        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors"
        >
          Apply Settings
        </button>
      </div>
    </div>
  );
};
