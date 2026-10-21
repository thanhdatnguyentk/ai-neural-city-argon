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
  Award,
} from 'lucide-react';

interface SystemStatusPanelProps {
  isPaused: boolean;
  flowSpeed: number;
  trainingMode: boolean;
  isNight: boolean;
  reducedMotion: boolean;
  masteryCompleted?: number;
  masteryTotal?: number;
  masteredDistrictsCount?: number;
}

export const HeroStatusHUD: React.FC<{
  isPaused: boolean;
  flowSpeed: number;
  trainingMode: boolean;
  isNight: boolean;
  masteryCompleted?: number;
  masteryTotal?: number;
}> = ({
  isPaused,
  flowSpeed,
  trainingMode,
  isNight,
  masteryCompleted = 0,
  masteryTotal = 32,
}) => {
  const masteryRatio = masteryTotal > 0 ? masteryCompleted / masteryTotal : 0;
  const activeNodesNum = trainingMode
    ? 1024
    : Math.min(1024, 896 + Math.round(masteryRatio * 128));
  const activeNodes = `${activeNodesNum.toLocaleString()} / 1,024`;
  const dataFlowRate = isPaused
    ? '0.0 GB/s (PAUSED)'
    : `${(
        42.8 *
        flowSpeed *
        (1 + masteryRatio * 0.45) *
        (trainingMode ? 1.35 : 1)
      ).toFixed(1)} GB/s`;
  const modelLoad = isPaused
    ? '12%'
    : masteryRatio === 1
    ? '100% (OVERDRIVE)'
    : trainingMode
    ? '96%'
    : `${Math.min(99, 78 + Math.round(masteryRatio * 18))}%`;

  return (
    <div
      aria-label="Simulated System Status"
      className={`pointer-events-auto rounded-2xl p-3.5 transition-colors ${
        isNight
          ? 'hud-glass-dark text-slate-100'
          : 'hud-glass-light text-slate-900'
      }`}
    >
      <div
        className={`flex items-center justify-between gap-3 border-b pb-2 ${
          isNight ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${
              isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span
            className={`font-mono text-[11px] font-bold tracking-wider uppercase ${
              isNight ? 'text-emerald-400' : 'text-emerald-700'
            }`}
          >
            SYSTEM STATUS: {isPaused ? 'STANDBY' : 'ONLINE'}
          </span>
        </div>
        <span
          className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold ${
            isNight
              ? 'bg-slate-800/90 text-slate-300'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          SIMULATED
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-2.5 font-mono">
        <div>
          <span
            className={`block text-[9px] uppercase tracking-wider ${
              isNight ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            ACTIVE NODES
          </span>
          <span
            className={`mt-0.5 block text-xs font-bold ${
              isNight ? 'text-cyan-400' : 'text-cyan-700'
            }`}
          >
            {activeNodes}
          </span>
        </div>
        <div>
          <span
            className={`block text-[9px] uppercase tracking-wider ${
              isNight ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            DATA FLOW
          </span>
          <span
            className={`mt-0.5 block text-xs font-bold ${
              isNight ? 'text-sky-300' : 'text-sky-700'
            }`}
          >
            {dataFlowRate}
          </span>
        </div>
        <div>
          <span
            className={`block text-[9px] uppercase tracking-wider ${
              isNight ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            MODEL LOAD
          </span>
          <span
            className={`mt-0.5 block text-xs font-bold ${
              isNight ? 'text-amber-400' : 'text-amber-700'
            }`}
          >
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
  masteryCompleted = 0,
  masteryTotal = 32,
  masteredDistrictsCount = 0,
}) => {
  const [packetsProcessed, setPacketsProcessed] = useState(1482940);
  const [trainingProgress, setTrainingProgress] = useState(84.2);
  const [latencyMs, setLatencyMs] = useState(11.4);

  const masteryRatio = masteryTotal > 0 ? masteryCompleted / masteryTotal : 0;
  const isSingularity = masteryCompleted >= masteryTotal && masteryTotal > 0;

  useEffect(() => {
    if (isPaused || reducedMotion) return;

    const interval = setInterval(() => {
      setPacketsProcessed((prev) =>
        prev +
        Math.round(
          145 *
            flowSpeed *
            (1 + masteryRatio * 0.6) *
            (trainingMode ? 1.6 : 1)
        )
      );
      setTrainingProgress((prev) => {
        const next = prev + (trainingMode ? 0.18 : 0.05) * flowSpeed;
        return next >= 99.9 ? 72.0 : Number(next.toFixed(2));
      });
      setLatencyMs(() => {
        const base = trainingMode ? 12.8 : Math.max(5.8, 11.2 - masteryRatio * 3.8);
        const jitter = (Math.random() - 0.5) * 0.8;
        return Number((base + jitter).toFixed(1));
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isPaused, flowSpeed, trainingMode, reducedMotion, masteryRatio]);

  const activeNodesCount = trainingMode
    ? 1024
    : Math.min(1024, 896 + Math.round(masteryRatio * 128));
  const isStaticSnapshot = isPaused || reducedMotion;

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
              <Activity
                aria-hidden="true"
                className={`h-4 w-4 ${isNight ? 'text-cyan-400' : 'text-cyan-700'}`}
              />
              <h2
                id="system-activity-heading"
                className={`font-mono text-sm font-bold uppercase tracking-wider ${
                  isNight ? 'text-cyan-400' : 'text-cyan-800'
                }`}
              >
                System Activity Telemetry
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                  isStaticSnapshot
                    ? isNight
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-200 text-slate-700'
                    : isNight
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isStaticSnapshot ? 'Static Snapshot' : 'Updating Live'}
              </span>
            </div>
            <p
              className={`mt-1 text-xs ${
                isNight ? 'text-slate-300' : 'text-slate-600'
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
            <Info aria-hidden="true" className="h-4 w-4 shrink-0 text-amber-400" />
            <span>Simulated demonstration values — educational visualization</span>
          </div>
        </div>

        {/* 6 Telemetry Cards (Including Architect Mastery Index) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* 1. Data Packets Processed */}
          <div
            className={`rounded-2xl border p-4 ${
              isNight
                ? 'border-slate-800 bg-[#081126]/80'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div
              className={`flex items-center justify-between text-xs font-mono ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <span>DATA PACKETS PROCESSED</span>
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div
              className={`mt-2 font-mono text-2xl font-bold ${
                isNight ? 'text-cyan-400' : 'text-cyan-700'
              }`}
            >
              {packetsProcessed.toLocaleString()}
            </div>
            <svg
              aria-hidden="true"
              viewBox="0 0 120 22"
              className="mt-2 h-4 w-full overflow-visible"
            >
              <polyline
                fill="none"
                stroke="#00F0FF"
                strokeWidth="1.8"
                points="0,18 20,14 40,16 60,9 80,11 100,5 120,3"
              />
            </svg>
            <div
              className={`mt-1 font-mono text-[11px] ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
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
            <div
              className={`flex items-center justify-between text-xs font-mono ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <span>ACTIVE MODEL NODES</span>
              <Network aria-hidden="true" className="h-3.5 w-3.5 text-violet-400" />
            </div>
            <div
              className={`mt-2 font-mono text-2xl font-bold ${
                isNight ? 'text-violet-400' : 'text-violet-700'
              }`}
            >
              {activeNodesCount}{' '}
              <span
                className={`text-sm font-normal ${
                  isNight ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                / 1,024
              </span>
            </div>
            <svg
              aria-hidden="true"
              viewBox="0 0 120 22"
              className="mt-2 h-4 w-full overflow-visible"
            >
              <polyline
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="1.8"
                points="0,12 24,10 48,11 72,8 96,8 120,6"
              />
            </svg>
            <div
              className={`mt-1 font-mono text-[11px] ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
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
            <div
              className={`flex items-center justify-between text-xs font-mono ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <span>TRAINING PROGRESS</span>
              <Cpu aria-hidden="true" className="h-3.5 w-3.5 text-fuchsia-400" />
            </div>
            <div
              className={`mt-2 font-mono text-2xl font-bold ${
                isNight ? 'text-fuchsia-400' : 'text-fuchsia-700'
              }`}
            >
              {trainingProgress.toFixed(1)}%
            </div>
            <div
              className={`mt-3 h-2 w-full overflow-hidden rounded-full ${
                isNight ? 'bg-slate-800' : 'bg-slate-200'
              }`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-400 transition-all duration-500"
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
            <div
              className={`mt-2 font-mono text-[11px] ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Epoch Loss: 0.038 · Converging
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
            <div
              className={`flex items-center justify-between text-xs font-mono ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <span>INFERENCE LATENCY</span>
              <Gauge aria-hidden="true" className="h-3.5 w-3.5 text-sky-400" />
            </div>
            <div
              className={`mt-2 font-mono text-2xl font-bold ${
                isNight ? 'text-sky-400' : 'text-sky-700'
              }`}
            >
              {latencyMs} ms
            </div>
            <svg
              aria-hidden="true"
              viewBox="0 0 120 22"
              className="mt-2 h-4 w-full overflow-visible"
            >
              <polyline
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.8"
                points="0,11 20,13 40,9 60,12 80,10 100,11 120,10"
              />
            </svg>
            <div
              className={`mt-1 font-mono text-[11px] ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
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
            <div
              className={`flex items-center justify-between text-xs font-mono ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <span>SYSTEM STATUS</span>
              <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div
              className={`mt-2 flex items-center gap-2 font-mono text-xl font-bold ${
                isSingularity
                  ? isNight
                    ? 'text-amber-300'
                    : 'text-amber-700'
                  : isNight
                  ? 'text-emerald-400'
                  : 'text-emerald-700'
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${
                  isPaused
                    ? 'bg-amber-400'
                    : isSingularity
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-emerald-400 animate-pulse'
                }`}
              />
              {isPaused
                ? 'PAUSED'
                : isSingularity
                ? 'SINGULARITY'
                : trainingMode
                ? 'TRAINING BOOST'
                : 'OPTIMAL'}
            </div>
            <div
              className={`mt-3 font-mono text-[11px] ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {isSingularity
                ? 'All 8 Districts Overclocked (2.0x)'
                : 'Simulated Demo Telemetry'}
            </div>
          </div>

          {/* 6. Architect Mastery Index */}
          <div
            className={`rounded-2xl border p-4 transition-colors ${
              isSingularity
                ? isNight
                  ? 'border-amber-400/70 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                  : 'border-amber-500 bg-amber-50'
                : isNight
                ? 'border-slate-800 bg-[#081126]/80'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div
              className={`flex items-center justify-between text-xs font-mono ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              <span>ARCHITECT MASTERY INDEX</span>
              <Award
                aria-hidden="true"
                className={`h-3.5 w-3.5 ${
                  isSingularity ? 'text-amber-400' : 'text-cyan-400'
                }`}
              />
            </div>
            <div
              className={`mt-2 font-mono text-2xl font-bold ${
                isSingularity
                  ? isNight
                    ? 'text-amber-300'
                    : 'text-amber-700'
                  : isNight
                  ? 'text-cyan-400'
                  : 'text-cyan-700'
              }`}
            >
              {Math.round(masteryRatio * 100)}%
            </div>
            <div
              className={`mt-3 h-2 w-full overflow-hidden rounded-full ${
                isNight ? 'bg-slate-800' : 'bg-slate-200'
              }`}
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isSingularity
                    ? 'bg-gradient-to-r from-amber-400 via-cyan-400 to-fuchsia-400'
                    : 'bg-gradient-to-r from-cyan-400 to-violet-500'
                }`}
                style={{ width: `${Math.round(masteryRatio * 100)}%` }}
              />
            </div>
            <div
              className={`mt-2 font-mono text-[11px] ${
                isNight ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {masteryCompleted}/{masteryTotal} Milestones · {masteredDistrictsCount}/8 Districts Overclocked
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
