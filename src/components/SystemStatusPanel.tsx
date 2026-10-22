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
import { ARCHITECTURAL_PIPELINE_MODES } from '@/data/pipeline-modes';
import { computeModeGroundedTelemetry } from '@/lib/telemetry-physics';
import type {
  ArchitecturalPipelineModeId,
  TelemetryPhysicsCard,
} from '@/types/pipeline-modes';

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
  activePipelineMode?: ArchitecturalPipelineModeId;
  onSelectPipelineMode?: (mode: ArchitecturalPipelineModeId) => void;
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
  activePipelineMode?: ArchitecturalPipelineModeId;
}> = ({
  isPaused,
  flowSpeed,
  isNight,
  masteryCompleted = 0,
  masteryTotal = 32,
  computedTelemetry,
  activeBottleneck = 'none',
  activePipelineMode = 'online-inference',
}) => {
  const groundedReport = computeModeGroundedTelemetry(activePipelineMode, {
    flowSpeed,
    computedTelemetry,
    activeBottleneck,
  });

  const isCritical =
    activeBottleneck !== 'none' ||
    computedTelemetry?.systemStatus === 'CRITICAL_BOTTLENECK';
  const isDegraded = computedTelemetry?.systemStatus === 'DEGRADED';

  const { heroSummary } = groundedReport;
  const statusText = isPaused ? 'STANDBY' : heroSummary.statusText;

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
            {statusText}
          </span>
        </div>
        <span
          className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold ${
            isCritical
              ? 'bg-rose-500/30 text-rose-200'
              : isNight
              ? 'bg-slate-800/90 text-cyan-300'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          {heroSummary.badgeText}
        </span>
      </div>

      <div className="mt-2.5 grid grid-cols-3 gap-2.5 font-mono">
        <div>
          <span
            className={`block text-[9px] uppercase tracking-wider ${
              isNight || isCritical ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {heroSummary.activePoolLabel}
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
            {heroSummary.activePoolValue}
          </span>
        </div>
        <div>
          <span
            className={`block text-[9px] uppercase tracking-wider ${
              isNight || isCritical ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {heroSummary.throughputLabel}
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
            {heroSummary.throughputValue}
          </span>
        </div>
        <div>
          <span
            className={`block text-[9px] uppercase tracking-wider ${
              isNight || isCritical ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {heroSummary.loadLabel}
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
            {heroSummary.loadValue}
          </span>
        </div>
      </div>
    </div>
  );
};

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({
  isPaused,
  flowSpeed,
  isNight,
  reducedMotion,
  masteryCompleted = 0,
  masteryTotal = 32,
  masteredDistrictsCount = 0,
  computedTelemetry,
  activeBottleneck = 'none',
  activePipelineMode = 'online-inference',
  onSelectPipelineMode,
  onSelectBottleneck,
  onFixBottleneck,
}) => {
  const [jitterOffset, setJitterOffset] = useState(0);

  const masteryRatio = masteryTotal > 0 ? masteryCompleted / masteryTotal : 0;
  const isSingularity = masteryCompleted >= masteryTotal && masteryTotal > 0;
  const bottleneckObj = BOTTLENECK_SCENARIO_MAP[activeBottleneck];
  const isBottleneckActive = activeBottleneck !== 'none';

  useEffect(() => {
    if (isPaused || reducedMotion) return;
    const interval = setInterval(() => {
      setJitterOffset(Number(((Math.random() - 0.5) * 0.4).toFixed(2)));
    }, 1100);
    return () => clearInterval(interval);
  }, [isPaused, reducedMotion]);

  const groundedReport = computeModeGroundedTelemetry(activePipelineMode, {
    flowSpeed: Math.max(0.2, flowSpeed + jitterOffset * 0.05),
    computedTelemetry,
    activeBottleneck,
  });

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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
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
                Physically Grounded Telemetry &amp; Chaos Suite ({groundedReport.modeLabel})
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
                  : 'Roofline Physics Active'}
              </span>
            </div>
            <p
              className={`mt-1 text-xs ${
                isNight ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Metrics dynamically isolate by Pipeline Mode — Online Inference (TTFT, TPOT, E2E P99, KV-Cache) never conflates with Offline Indexing or Distributed Training (MFU, ZeRO-3, Step Loss).
            </p>
          </div>

          {/* 3-Mode Telemetry Switcher */}
          {onSelectPipelineMode ? (
            <div
              role="tablist"
              aria-label="Telemetry Pipeline Mode Switcher"
              className={`inline-flex flex-wrap items-center gap-1 rounded-xl border p-1 ${
                isNight
                  ? 'border-slate-800 bg-slate-950/90'
                  : 'border-slate-300 bg-white'
              }`}
            >
              {ARCHITECTURAL_PIPELINE_MODES.map((m) => {
                const active = m.id === activePipelineMode;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onSelectPipelineMode(m.id)}
                    className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition-colors cursor-pointer ${
                      active
                        ? 'bg-cyan-400 text-slate-950'
                        : isNight
                        ? 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {m.shortLabel}
                  </button>
                );
              })}
            </div>
          ) : (
            <div
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs ${
                isNight
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                  : 'border-amber-600/30 bg-amber-50 text-amber-900'
              }`}
            >
              <Info aria-hidden="true" className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Mode-Isolated Roofline Telemetry</span>
            </div>
          )}
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
                    isBottleneckActive
                      ? 'text-rose-400 animate-bounce'
                      : 'text-amber-400'
                  }`}
                />
                <span>Chaos Engineering &amp; Bottleneck Simulator:</span>
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

        {/* 5 Physically Grounded Telemetry Cards + 6th Architect Mastery Index Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {groundedReport.cards.map((card, idx) => {
            const isRose = Boolean(card.isAlert);
            return (
              <div
                key={card.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between ${
                  isRose
                    ? 'border-rose-500/70 bg-rose-950/30'
                    : isNight
                    ? 'border-slate-800 bg-[#081126]/80'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div
                    className={`flex items-center justify-between text-[11px] font-mono font-bold uppercase ${
                      isNight ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    <span className="truncate pr-1">{card.label}</span>
                    {idx === 0 ? (
                      <Sparkles
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-cyan-400"
                      />
                    ) : idx === 1 ? (
                      <Gauge
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-violet-400"
                      />
                    ) : idx === 2 ? (
                      <Cpu
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-fuchsia-400"
                      />
                    ) : idx === 3 ? (
                      <Network
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-emerald-400"
                      />
                    ) : (
                      <ShieldCheck
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-amber-400"
                      />
                    )}
                  </div>
                  <div
                    className="mt-2 font-mono text-lg font-bold leading-snug"
                    style={{
                      color: isRose
                        ? '#F87171'
                        : isNight
                        ? card.accentColorHex
                        : '#0F172A',
                    }}
                  >
                    {card.primaryValue}
                  </div>
                </div>

                <div>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 120 22"
                    className="mt-2 h-4 w-full overflow-visible"
                  >
                    <polyline
                      fill="none"
                      stroke={isRose ? '#EF4444' : card.accentColorHex}
                      strokeWidth="1.8"
                      points={
                        isRose
                          ? '0,18 20,17 40,14 60,5 80,3 100,4 120,2'
                          : '0,15 20,12 40,13 60,9 80,10 100,6 120,5'
                      }
                    />
                  </svg>
                  <div
                    className={`mt-1 font-mono text-[10px] leading-relaxed ${
                      isRose
                        ? 'text-rose-200 font-semibold'
                        : isNight
                        ? 'text-slate-400'
                        : 'text-slate-600'
                    }`}
                  >
                    {card.breakdownNote}
                  </div>
                  <div
                    className={`mt-1 font-mono text-[9px] font-bold uppercase ${
                      isNight ? 'text-cyan-400/90' : 'text-cyan-800'
                    }`}
                  >
                    [{card.hardwareNote}]
                  </div>
                </div>
              </div>
            );
          })}

          {/* 6. Architect Mastery Index */}
          <div
            className={`rounded-2xl border p-4 flex flex-col justify-between transition-colors ${
              isSingularity
                ? isNight
                  ? 'border-amber-400/70 bg-amber-950/20 shadow-lg shadow-amber-500/10'
                  : 'border-amber-500 bg-amber-50'
                : isNight
                ? 'border-slate-800 bg-[#081126]/80'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div>
              <div
                className={`flex items-center justify-between text-[11px] font-mono font-bold uppercase ${
                  isNight ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <span>ARCHITECT MASTERY INDEX</span>
                <Award
                  aria-hidden="true"
                  className={`h-3.5 w-3.5 shrink-0 ${
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
            </div>

            <div>
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
                className={`mt-2 font-mono text-[10px] ${
                  isNight ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {masteryCompleted}/{masteryTotal} Milestones · {masteredDistrictsCount}/8 Districts Overclocked
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
