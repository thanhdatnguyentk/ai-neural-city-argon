'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  Cpu,
  Gauge,
  Network,
  ShieldCheck,
  Sparkles,
  Info,
} from 'lucide-react';

interface SystemStatusPanelProps {
  isPaused: boolean;
  flowSpeed: number;
  trainingMode: boolean;
  isNight: boolean;
  reducedMotion: boolean;
}

export const HeroStatusHUD: React.FC<{
  isPaused: boolean;
  flowSpeed: number;
  trainingMode: boolean;
  isNight: boolean;
}> = ({ isPaused, flowSpeed, trainingMode, isNight }) => {
  const activeNodes = trainingMode ? '1,024 / 1,024' : '896 / 1,024';
  const dataFlowRate = isPaused
    ? '0.0 GB/s (PAUSED)'
    : `${(42.8 * flowSpeed * (trainingMode ? 1.35 : 1)).toFixed(1)} GB/s`;
  const modelLoad = isPaused ? '12%' : trainingMode ? '96%' : '78%';

  return (
    <div
      aria-label="Simulated System Status"
      className={`pointer-events-auto rounded-2xl border p-3.5 backdrop-blur-xl shadow-2xl transition-colors ${
        isNight
          ? 'border-slate-700/80 bg-[#070E20]/85 text-slate-100'
          : 'border-slate-300 bg-white/90 text-slate-900'
      }`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span className="font-mono text-[11px] font-bold tracking-wider uppercase text-emerald-400">
            SYSTEM STATUS: {isPaused ? 'STANDBY' : 'ONLINE'}
          </span>
        </div>
        <span className="rounded bg-slate-800/90 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-slate-400">
          SIMULATED
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-3 font-mono">
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-slate-400">
            ACTIVE NODES
          </span>
          <span className="mt-0.5 block text-xs font-semibold text-cyan-400">
            {activeNodes}
          </span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-slate-400">
            DATA FLOW
          </span>
          <span className="mt-0.5 block text-xs font-semibold text-sky-300">
            {dataFlowRate}
          </span>
        </div>
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-slate-400">
            MODEL LOAD
          </span>
          <span className="mt-0.5 block text-xs font-semibold text-amber-400">
            {modelLoad}
          </span>
        </div>
      </div>
    </div>
  );
};

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({
  isPaused,
  flowSpeed,
  trainingMode,
  isNight,
  reducedMotion,
}) => {
  const [packetsProcessed, setPacketsProcessed] = useState(1482940);
  const [trainingProgress, setTrainingProgress] = useState(84.2);
  const [latencyMs, setLatencyMs] = useState(11.4);

  useEffect(() => {
    if (isPaused || reducedMotion) return;

    const interval = setInterval(() => {
      setPacketsProcessed((prev) =>
        prev + Math.round(145 * flowSpeed * (trainingMode ? 1.6 : 1))
      );
      setTrainingProgress((prev) => {
        const next = prev + (trainingMode ? 0.18 : 0.05) * flowSpeed;
        return next >= 99.9 ? 72.0 : Number(next.toFixed(2));
      });
      setLatencyMs(() => {
        const base = trainingMode ? 12.8 : 11.2;
        const jitter = (Math.random() - 0.5) * 0.8;
        return Number((base + jitter).toFixed(1));
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isPaused, flowSpeed, trainingMode, reducedMotion]);

  const activeNodesCount = trainingMode ? 1024 : 896;

  return (
    <section
      id="system-activity-section"
      aria-labelledby="system-activity-heading"
      className={`border-t py-14 px-4 sm:px-6 lg:px-10 transition-colors ${
        isNight
          ? 'border-slate-800/80 bg-[#040814] text-slate-100'
          : 'border-slate-200 bg-slate-100 text-slate-900'
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <h2
                id="system-activity-heading"
                className="font-mono text-sm font-bold uppercase tracking-wider text-cyan-400"
              >
                System Activity Telemetry
              </h2>
            </div>
            <p
              className={`mt-1 text-xs ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Real-time visualization metrics reflecting the current speed, mode, and pipeline state of the miniature city.
            </p>
          </div>

          {/* Explicit Simulated Demonstration Notice */}
          <div
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs ${
              isNight
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                : 'border-amber-600/30 bg-amber-50 text-amber-900'
            }`}
          >
            <Info className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Simulated demonstration values — educational visualization</span>
          </div>
        </div>

        {/* 5 Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Data Packets Processed */}
          <div
            className={`rounded-2xl border p-4 ${
              isNight
                ? 'border-slate-800 bg-[#081126]/80'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>DATA PACKETS PROCESSED</span>
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-cyan-400">
              {packetsProcessed.toLocaleString()}
            </div>
            <div className="mt-1 font-mono text-[11px] text-slate-400">
              +{Math.round(145 * flowSpeed)} pkts/sec ({flowSpeed}x speed)
            </div>
          </div>

          {/* 2. Active Model Nodes */}
          <div
            className={`rounded-2xl border p-4 ${
              isNight
                ? 'border-slate-800 bg-[#081126]/80'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>ACTIVE MODEL NODES</span>
              <Network className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-violet-400">
              {activeNodesCount} <span className="text-sm font-normal text-slate-400">/ 1,024</span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-slate-400">
              8 Districts Synchronized
            </div>
          </div>

          {/* 3. Training Progress */}
          <div
            className={`rounded-2xl border p-4 ${
              isNight
                ? 'border-slate-800 bg-[#081126]/80'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>TRAINING PROGRESS</span>
              <Cpu className="h-3.5 w-3.5 text-fuchsia-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-fuchsia-400">
              {trainingProgress.toFixed(1)}%
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-500"
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
          </div>

          {/* 4. Inference Latency */}
          <div
            className={`rounded-2xl border p-4 ${
              isNight
                ? 'border-slate-800 bg-[#081126]/80'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>INFERENCE LATENCY</span>
              <Gauge className="h-3.5 w-3.5 text-sky-400" />
            </div>
            <div className="mt-2 font-mono text-2xl font-bold text-sky-400">
              {latencyMs} ms
            </div>
            <div className="mt-1 font-mono text-[11px] text-slate-400">
              P99 Forward-Pass Decode
            </div>
          </div>

          {/* 5. System Status */}
          <div
            className={`rounded-2xl border p-4 ${
              isNight
                ? 'border-slate-800 bg-[#081126]/80'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>SYSTEM STATUS</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-center gap-2 font-mono text-xl font-bold text-emerald-400">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              {isPaused ? 'PAUSED' : trainingMode ? 'TRAINING BOOST' : 'OPTIMAL'}
            </div>
            <div className="mt-1 font-mono text-[11px] text-slate-400">
              Simulated Demo Telemetry
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
