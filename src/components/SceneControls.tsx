'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Tag,
  Sparkles,
  Sun,
  Moon,
  Zap,
  RotateCw,
  Layers,
} from 'lucide-react';

interface SceneControlsProps {
  showLabels: boolean;
  isPaused: boolean;
  flowSpeed: number;
  trainingMode: boolean;
  isDemoRunning: boolean;
  isNight: boolean;
  forceSimplified2D: boolean;
  onToggleLabels: () => void;
  onTogglePause: () => void;
  onChangeSpeed: (speed: number) => void;
  onToggleTrainingMode: () => void;
  onRunDemo: () => void;
  onResetCamera: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onToggleNight: () => void;
  onToggle2D: () => void;
}

const SPEED_OPTIONS = [0.5, 1, 2];

export const SceneControls: React.FC<SceneControlsProps> = ({
  showLabels,
  isPaused,
  flowSpeed,
  trainingMode,
  isDemoRunning,
  isNight,
  forceSimplified2D,
  onToggleLabels,
  onTogglePause,
  onChangeSpeed,
  onToggleTrainingMode,
  onRunDemo,
  onResetCamera,
  onZoomIn,
  onZoomOut,
  onRotateLeft,
  onRotateRight,
  onToggleNight,
  onToggle2D,
}) => {
  const panelClass = isNight
    ? 'border-slate-700/80 bg-[#070E20]/90 text-slate-200 shadow-black/50'
    : 'border-slate-300 bg-white/90 text-slate-800 shadow-slate-300/50';

  const btnClass = isNight
    ? 'border-slate-700/80 bg-slate-900/80 text-slate-200 hover:border-cyan-400/70 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-400'
    : 'border-slate-300 bg-slate-100/90 text-slate-800 hover:border-cyan-600 hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-cyan-600';

  return (
    <div
      role="toolbar"
      aria-label="3D City Scene Controls"
      className={`pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-2xl border p-2 shadow-2xl backdrop-blur-xl transition-colors ${panelClass}`}
    >
      {/* Run a Demo Button */}
      <button
        type="button"
        onClick={onRunDemo}
        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 font-mono text-xs font-semibold transition-all cursor-pointer ${
          isDemoRunning
            ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
            : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md shadow-cyan-500/20'
        }`}
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>{isDemoRunning ? 'Stop Demo' : 'Run a demo'}</span>
      </button>

      <div className="h-5 w-px bg-slate-700/60 mx-0.5 hidden sm:block" />

      {/* Pause / Resume Animation */}
      <button
        type="button"
        onClick={onTogglePause}
        aria-pressed={isPaused}
        title={isPaused ? 'Resume animation' : 'Pause animation'}
        className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-2 font-mono text-xs transition-colors cursor-pointer ${
          isPaused
            ? 'border-amber-400/70 bg-amber-500/20 text-amber-300'
            : btnClass
        }`}
      >
        {isPaused ? (
          <>
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Resume</span>
          </>
        ) : (
          <>
            <Pause className="h-3.5 w-3.5" />
            <span>Pause</span>
          </>
        )}
      </button>

      {/* Data Flow Speed Control */}
      <div
        className={`inline-flex items-center rounded-xl border p-0.5 font-mono text-[11px] ${
          isNight ? 'border-slate-700/80 bg-slate-950/80' : 'border-slate-300 bg-slate-100'
        }`}
        role="group"
        aria-label="Data flow speed"
      >
        <span className="px-2 text-[10px] uppercase text-slate-400 hidden md:inline">
          Speed
        </span>
        {SPEED_OPTIONS.map((spd) => {
          const active = Math.abs(flowSpeed - spd) < 0.05;
          return (
            <button
              key={spd}
              type="button"
              onClick={() => onChangeSpeed(spd)}
              aria-pressed={active}
              className={`rounded-lg px-2 py-1 font-semibold transition-colors cursor-pointer ${
                active
                  ? 'bg-cyan-400 text-slate-950'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          );
        })}
      </div>

      {/* Training Mode Boost Toggle */}
      <button
        type="button"
        onClick={onToggleTrainingMode}
        aria-pressed={trainingMode}
        title="Boost GPU Training Cluster activity"
        className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-2 font-mono text-xs transition-colors cursor-pointer ${
          trainingMode
            ? 'border-fuchsia-400 bg-fuchsia-500/25 text-fuchsia-200 shadow-md shadow-fuchsia-500/20'
            : btnClass
        }`}
      >
        <Zap className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Training Boost</span>
      </button>

      {/* Toggle District Labels */}
      <button
        type="button"
        onClick={onToggleLabels}
        aria-pressed={showLabels}
        title="Toggle district labels"
        className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-2 font-mono text-xs transition-colors cursor-pointer ${
          showLabels
            ? 'border-cyan-400/60 bg-cyan-500/15 text-cyan-300'
            : btnClass
        }`}
      >
        <Tag className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Labels</span>
      </button>

      <div className="h-5 w-px bg-slate-700/60 mx-0.5 hidden sm:block" />

      {/* Camera Orbit / Zoom / Reset Controls */}
      <div className="inline-flex items-center gap-1" role="group" aria-label="Camera controls">
        <button
          type="button"
          onClick={onRotateLeft}
          title="Orbit camera left"
          aria-label="Orbit camera left"
          className={`rounded-xl border p-2 transition-colors cursor-pointer ${btnClass}`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onRotateRight}
          title="Orbit camera right"
          aria-label="Orbit camera right"
          className={`rounded-xl border p-2 transition-colors cursor-pointer ${btnClass}`}
        >
          <RotateCw className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom in"
          aria-label="Zoom in"
          className={`rounded-xl border p-2 transition-colors cursor-pointer ${btnClass}`}
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom out"
          aria-label="Zoom out"
          className={`rounded-xl border p-2 transition-colors cursor-pointer ${btnClass}`}
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onResetCamera}
          title="Reset camera to default isometric view"
          className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-2 font-mono text-xs transition-colors cursor-pointer ${btnClass}`}
        >
          <span>Reset View</span>
        </button>
      </div>

      {/* Day / Night Theme Toggle */}
      <button
        type="button"
        onClick={onToggleNight}
        aria-label={isNight ? 'Switch to daylight diorama mode' : 'Switch to night mode'}
        title={isNight ? 'Switch to Day mode' : 'Switch to Night mode'}
        className={`rounded-xl border p-2 transition-colors cursor-pointer ${btnClass}`}
      >
        {isNight ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5" />}
      </button>

      {/* 3D / 2D Schematic View Toggle */}
      <button
        type="button"
        onClick={onToggle2D}
        aria-pressed={forceSimplified2D}
        title="Toggle 2D Isometric Schematic View"
        className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-2 font-mono text-xs transition-colors cursor-pointer ${
          forceSimplified2D
            ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
            : btnClass
        }`}
      >
        <Layers className="h-3.5 w-3.5" />
        <span className="hidden lg:inline">{forceSimplified2D ? '3D View' : '2D Lite'}</span>
      </button>
    </div>
  );
};
