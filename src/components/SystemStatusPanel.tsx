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
  AlertTriangle,
  Wrench,
  Flame,
} from 'lucide-react';
import { DistrictId, DISTRICT_MAP } from '@/data/districts';
import {
  BottleneckScenarioId,
  BOTTLENECK_SCENARIOS,
  BOTTLENECK_SCENARIO_MAP,
  ComputedSimulationTelemetry,
} from '@/data/bottleneck-scenarios';

interface SystemStatusPanelProps {
  isPaused: boolean;
  flowSpeed: number;
  trainingMode: boolean;
  isNight: boolean;
  reducedMotion: boolean;
  masteryCompleted?: number;
  masteryTotal?: number;
  masteredDistrictsCount?: number;
  computedTelemetry?: ComputedSimulationTelemetry;
  activeBottleneck?: BottleneckScenarioId;
  onSelectBottleneck?: (id: BottleneckScenarioId) => void;
  onFixBottleneck?: (districtId: DistrictId, milestoneId: string) => void;
}

export const HeroStatusHUD: React.FC<{
  isPaused: boolean;
  flowSpeed: number;
  trainingMode: boolean;
  isNight: boolean;
  masteryCompleted?: number;
  masteryTotal?: number;
  computedTelemetry?: ComputedSimulationTelemetry;
  activeBottleneck?: BottleneckScenarioId;
}> = ({
  isPaused,
  flowSpeed,
  trainingMode,
  isNight,
  masteryCompleted = 0,
  masteryTotal = 32,
  computedTelemetry,
  activeBottleneck = 'none',
}) => {
  const masteryRatio = masteryTotal > 0 ? masteryCompleted / masteryTotal : 0;
  const isCritical =
    activeBottleneck !== 'none' ||
    computedTelemetry?.systemStatus === 'CRITICAL_BOTTLENECK';
  const isDegraded = computedTelemetry?.systemStatus === 'DEGRADED';

  const activeNodesNum = computedTelemetry
    ? computedTelemetry.activeNodes
    : trainingMode
    ? 1024
    : Math.min(1024, 896 + Math.round(masteryRatio * 128));
  const activeNodes = `${activeNodesNum.toLocaleString()} / 1,024`;

  const dataFlowRate = isPaused
    ? '0.0 GB/s (PAUSED)'
    : computedTelemetry
    ? `${(computedTelemetry.dataFlowGbPerSec * flowSpeed).toFixed(1)} GB/s`
    : `${(
        42.8 *
        flowSpeed *
        (1 + masteryRatio * 0.45) *
        (trainingMode ? 1.35 : 1)
      ).toFixed(1)} GB/s`;

  const modelLoad = isPaused
    ? '12%'
    : computedTelemetry
    ? `${computedTelemetry.modelLoadPercent}%${
        computedTelemetry.isVramOom ? ' (OOM)' : ''
      }`
    : masteryRatio === 1
    ? '100% (OVERDRIVE)'
    : trainingMode
    ? '96%'
    : `${Math.min(99, 78 + Math.round(masteryRatio * 18))}%`;

  const statusText = isPaused
    ? 'STANDBY'
    : isCritical
    ? 'CRITICAL_BOTTLENECK'
    : isDegraded
    ? 'DEGRADED'
    : 'ONLINE';

  return (
    <div
      aria-label="Simulated System Status"
      className={`pointer-events-auto rounded-2xl p-3.5 transition-colors ${
        isCritical
          ? 'border border-rose-500/70 bg-rose-950/85 text-slate-100 shadow-lg shadow-rose-500/20'
          : isNight
          ? 'hud-glass-dark text-slate-100'
          : 'hud-glass-light text-slate-900'
      }`}
    >
      <div
        className={`flex items-center justify-between gap-3 border-b pb-2 ${
          isCritical
            ? 'border-rose-500/40'
            : isNight
            ? 'border-slate-800/80'
            : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${
              isPaused
                ? 'bg-amber-400'
                : isCritical
                ? 'bg-rose-500 animate-ping'
                : isDegraded
                ? 'bg-amber-400 animate-pulse'
                : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span
            className={`font-mono text-[11px] font-bold tracking-wider uppercase ${
              isCritical
                ? 'text-rose-300'
                : isDegraded
                ? 'text-amber-300'
                : isNight
                ? 'text-emerald-400'
                : 'text-emerald-700'
            }`}
          >
            SYSTEM STATUS: {statusText}
          </span>
        </div>
        <span
          className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold ${
            isCritical
              ? 'bg-rose-500/30 text-rose-200'
              : isNight
              ? 'bg-slate-800/90 text-slate-300'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          {computedTelemetry
            ? `${computedTelemetry.inferenceLatencyMs}ms P99`
            : 'SIMULATED'}
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-2.5 font-mono">
        <div>
          <span
            className={`block text-[9px] uppercase tracking-wider ${
              isNight || isCritical ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            ACTIVE NODES
          </span>
          <span
            className={`mt-0.5 block text-xs font-bold ${
              isCritical
                ? 'text-rose-300'
                : isNight
                ? 'text-cyan-400'
                : 'text-cyan-700'
            }`}
          >
            {activeNodes}
          </span>
        </div>
        <div>
          <span
            className={`block text-[9px] uppercase tracking-wider ${
              isNight || isCritical ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            DATA FLOW
          </span>
          <span
            className={`mt-0.5 block text-xs font-bold ${
              isCritical
                ? 'text-amber-300'
                : isNight
                ? 'text-sky-300'
                : 'text-sky-700'
            }`}
          >
            {dataFlowRate}
          </span>
        </div>
        <div>
          <span
            className={`block text-[9px] uppercase tracking-wider ${
              isNight || isCritical ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            MODEL LOAD
          </span>
          <span
            className={`mt-0.5 block text-xs font-bold ${
              isCritical
                ? 'text-rose-300'
                : isNight
                ? 'text-amber-400'
                : 'text-amber-700'
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
  computedTelemetry,
  activeBottleneck = 'none',
  onSelectBottleneck,
  onFixBottleneck,
}) => {
  const [packetsProcessed, setPacketsProcessed] = useState(1482940);
  const [trainingProgress, setTrainingProgress] = useState(84.2);
  const [latencyMs, setLatencyMs] = useState(11.4);

  const masteryRatio = masteryTotal > 0 ? masteryCompleted / masteryTotal : 0;
  const isSingularity = masteryCompleted >= masteryTotal && masteryTotal > 0;
  const bottleneckObj = BOTTLENECK_SCENARIO_MAP[activeBottleneck];
  const isBottleneckActive = activeBottleneck !== 'none';

  useEffect(() => {
    if (isPaused || reducedMotion) return;

    const interval = setInterval(() => {
      const flowPenalty = isBottleneckActive ? 0.25 : 1;
      setPacketsProcessed((prev) =>
        prev +
        Math.round(
          145 *
            flowSpeed *
            flowPenalty *
            (1 + masteryRatio * 0.6) *
            (trainingMode ? 1.6 : 1)
        )
      );
      setTrainingProgress((prev) => {
        if (activeBottleneck === 'gradient-explosion') return 14.2;
        const next = prev + (trainingMode ? 0.18 : 0.05) * flowSpeed;
        return next >= 99.9 ? 72.0 : Number(next.toFixed(2));
      });
      setLatencyMs(() => {
        if (computedTelemetry) {
          return computedTelemetry.inferenceLatencyMs;
        }
        const base = trainingMode
          ? 12.8
          : Math.max(5.8, 11.2 - masteryRatio * 3.8);
        const jitter = (Math.random() - 0.5) * 0.8;
        return Number((base + jitter).toFixed(1));
      });
    }, 900);

    return () => clearInterval(interval);
  }, [
    isPaused,
    flowSpeed,
    trainingMode,
    reducedMotion,
    masteryRatio,
    isBottleneckActive,
    activeBottleneck,
    computedTelemetry,
  ]);

  const activeNodesCount = computedTelemetry
    ? computedTelemetry.activeNodes
    : trainingMode
    ? 1024
    : Math.min(1024, 896 + Math.round(masteryRatio * 128));
  const displayedLatency = computedTelemetry
    ? computedTelemetry.inferenceLatencyMs
    : latencyMs;
  const epochLossText = computedTelemetry
    ? computedTelemetry.epochLossText
    : 'Epoch Loss: 0.038 · Converging';
  const statusLabel = isPaused
    ? 'PAUSED'
    : computedTelemetry && isBottleneckActive
    ? computedTelemetry.systemStatus
    : isSingularity
    ? 'SINGULARITY'
    : computedTelemetry
    ? computedTelemetry.systemStatus
    : trainingMode
    ? 'TRAINING BOOST'
    : 'OPTIMAL';

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
                System Activity Telemetry & Chaos Suite
              </h2>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                  isBottleneckActive
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : isStaticSnapshot
                    ? isNight
                      ? 'bg-slate-800 text-slate-300'
                      : 'bg-slate-200 text-slate-700'
                    : isNight
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {isBottleneckActive
                  ? 'FAULT INJECTED'
                  : isStaticSnapshot
                  ? 'Static Snapshot'
                  : 'Updating Live'}
              </span>
            </div>
            <p
              className={`mt-1 text-xs ${
                isNight ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Real-time visualization metrics driven by the active AI workload, VRAM Sizing Lab, and Chaos Engineering Simulator.
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
            <span>Interactive Systems Sandbox — Driven by VRAM & Chaos Engine</span>
          </div>
        </div>

        {/* Chaos Engineering & Bottleneck Simulator Control Bar */}
        {onSelectBottleneck && (
          <div
            className={`mb-6 rounded-2xl border p-4 transition-colors ${
              isBottleneckActive
                ? 'border-rose-500/60 bg-rose-950/25'
                : isNight
                ? 'border-slate-800 bg-[#081126]/80'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                <Flame
                  aria-hidden="true"
                  className={`h-4 w-4 ${
                    isBottleneckActive ? 'text-rose-400 animate-bounce' : 'text-amber-400'
                  }`}
                />
                <span>Chaos Engineering & Bottleneck Simulator:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {BOTTLENECK_SCENARIOS.map((scen) => {
                  const active = activeBottleneck === scen.id;
                  return (
                    <button
                      key={scen.id}
                      type="button"
                      onClick={() => onSelectBottleneck(scen.id)}
                      aria-pressed={active}
                      className={`rounded-xl border px-3 py-1.5 font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                        active
                          ? scen.id === 'none'
                            ? 'border-emerald-400 bg-emerald-400 text-slate-950 font-bold'
                            : 'border-rose-500 bg-rose-500 text-white font-bold shadow-md shadow-rose-500/25'
                          : isNight
                          ? 'border-slate-800 bg-slate-900/90 text-slate-300 hover:border-slate-700 hover:text-white'
                          : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {scen.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {isBottleneckActive &&
              bottleneckObj.targetDistrictId &&
              bottleneckObj.fixMilestoneId && (
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-rose-500/40 bg-slate-950/90 p-3 text-slate-100">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle
                      aria-hidden="true"
                      className="h-4 w-4 text-rose-400 shrink-0 mt-0.5"
                    />
                    <div className="text-xs">
                      <span className="font-mono font-bold text-rose-300 uppercase">
                        [{bottleneckObj.title} in{' '}
                        {DISTRICT_MAP[bottleneckObj.targetDistrictId]?.name}]:
                      </span>{' '}
                      <span className="text-slate-300">
                        {bottleneckObj.diagnosticMessage}
                      </span>
                    </div>
                  </div>
                  {onFixBottleneck && (
                    <button
                      type="button"
                      onClick={() =>
                        onFixBottleneck(
                          bottleneckObj.targetDistrictId!,
                          bottleneckObj.fixMilestoneId!
                        )
                      }
                      className="inline-flex items-center gap-1.5 shrink-0 rounded-xl bg-amber-400 px-3 py-1.5 font-mono text-[11px] font-bold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                      <Wrench aria-hidden="true" className="h-3.5 w-3.5" />
                      <span>{bottleneckObj.fixButtonLabel} →</span>
                    </button>
                  )}
                </div>
              )}
          </div>
        )}

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
              {computedTelemetry
                ? `${computedTelemetry.packetsPerSec} pkts/s · ${computedTelemetry.dataFlowGbPerSec} GB/s`
                : `+${Math.round(145 * flowSpeed)} pkts/sec (${flowSpeed}x speed)`}
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
                isBottleneckActive
                  ? 'text-rose-400'
                  : isNight
                  ? 'text-violet-400'
                  : 'text-violet-700'
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
                stroke={isBottleneckActive ? '#EF4444' : '#8B5CF6'}
                strokeWidth="1.8"
                points={
                  isBottleneckActive
                    ? '0,8 24,10 48,15 72,19 96,20 120,21'
                    : '0,12 24,10 48,11 72,8 96,8 120,6'
                }
              />
            </svg>
            <div
              className={`mt-1 font-mono text-[11px] ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {computedTelemetry
                ? `VRAM: ${computedTelemetry.totalVramRequiredGb} GB Active`
                : '8 Districts Synchronized'}
            </div>
          </div>

          {/* 3. Training Progress */}
          <div
            className={`rounded-2xl border p-4 ${
              activeBottleneck === 'gradient-explosion'
                ? 'border-rose-500/70 bg-rose-950/30'
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
              <span>TRAINING PROGRESS</span>
              <Cpu aria-hidden="true" className="h-3.5 w-3.5 text-fuchsia-400" />
            </div>
            <div
              className={`mt-2 font-mono text-2xl font-bold ${
                activeBottleneck === 'gradient-explosion'
                  ? 'text-rose-400'
                  : isNight
                  ? 'text-fuchsia-400'
                  : 'text-fuchsia-700'
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
                className={`h-full rounded-full transition-all duration-500 ${
                  activeBottleneck === 'gradient-explosion'
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-violet-500 to-fuchsia-400'
                }`}
                style={{ width: `${trainingProgress}%` }}
              />
            </div>
            <div
              className={`mt-2 font-mono text-[11px] ${
                activeBottleneck === 'gradient-explosion'
                  ? 'text-rose-300 font-bold'
                  : isNight
                  ? 'text-slate-400'
                  : 'text-slate-600'
              }`}
            >
              {epochLossText}
            </div>
          </div>

          {/* 4. Inference Latency */}
          <div
            className={`rounded-2xl border p-4 ${
              displayedLatency > 100
                ? 'border-rose-500/70 bg-rose-950/30'
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
              <span>INFERENCE LATENCY</span>
              <Gauge aria-hidden="true" className="h-3.5 w-3.5 text-sky-400" />
            </div>
            <div
              className={`mt-2 font-mono text-2xl font-bold ${
                displayedLatency > 100
                  ? 'text-rose-400'
                  : isNight
                  ? 'text-sky-400'
                  : 'text-sky-700'
              }`}
            >
              {displayedLatency} ms
            </div>
            <svg
              aria-hidden="true"
              viewBox="0 0 120 22"
              className="mt-2 h-4 w-full overflow-visible"
            >
              <polyline
                fill="none"
                stroke={displayedLatency > 100 ? '#EF4444' : '#38BDF8'}
                strokeWidth="1.8"
                points={
                  displayedLatency > 100
                    ? '0,18 20,17 40,15 60,4 80,2 100,3 120,1'
                    : '0,11 20,13 40,9 60,12 80,10 100,11 120,10'
                }
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
              statusLabel === 'CRITICAL_BOTTLENECK'
                ? 'border-rose-500/70 bg-rose-950/30'
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
              <span>SYSTEM STATUS</span>
              <ShieldCheck
                aria-hidden="true"
                className={`h-3.5 w-3.5 ${
                  statusLabel === 'CRITICAL_BOTTLENECK'
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                }`}
              />
            </div>
            <div
              className={`mt-2 flex items-center gap-2 font-mono text-lg font-bold ${
                statusLabel === 'CRITICAL_BOTTLENECK'
                  ? 'text-rose-400'
                  : statusLabel === 'DEGRADED'
                  ? 'text-amber-400'
                  : isSingularity
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
                className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                  isPaused
                    ? 'bg-amber-400'
                    : statusLabel === 'CRITICAL_BOTTLENECK'
                    ? 'bg-rose-500 animate-ping'
                    : isSingularity
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span className="truncate">{statusLabel}</span>
            </div>
            <div
              className={`mt-3 font-mono text-[11px] ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {statusLabel === 'CRITICAL_BOTTLENECK'
                ? bottleneckObj.shortLabel
                : isSingularity
                ? 'All 8 Districts Overclocked (2.0x)'
                : 'Live Sandbox Telemetry'}
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
