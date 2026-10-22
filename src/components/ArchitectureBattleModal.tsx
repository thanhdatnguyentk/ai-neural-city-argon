'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Swords,
  Play,
  RotateCcw,
  Zap,
  Trophy,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  BATTLE_PRESETS,
  BattlePreset,
  buildCustomStackBattlePreset,
} from '../data/battle-presets';
import { DISTRICTS } from '../data/districts';
import type { StackSelectionMap } from '../data/stack-catalog';
import { useLanguage } from '../context/LanguageContext';

export interface ArchitectureBattleModalProps {
  isOpen: boolean;
  isNight: boolean;
  customStackSelections: StackSelectionMap;
  onBattleRaceStateChange?: (isRacing: boolean) => void;
  onClose: () => void;
}

export const ArchitectureBattleModal: React.FC<
  ArchitectureBattleModalProps
> = ({
  isOpen,
  isNight,
  customStackSelections,
  onBattleRaceStateChange,
  onClose,
}) => {
  const { lang, t } = useLanguage();
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    BATTLE_PRESETS[0].id
  );
  const [isRacing, setIsRacing] = useState<boolean>(false);
  const [progressA, setProgressA] = useState<number>(100);
  const [progressB, setProgressB] = useState<number>(100);

  const allPresets = useMemo<BattlePreset[]>(() => {
    const customPreset = buildCustomStackBattlePreset(customStackSelections);
    return [...BATTLE_PRESETS, customPreset];
  }, [customStackSelections]);

  const activeBattle =
    allPresets.find((p) => p.id === selectedPresetId) || allPresets[0];

  useEffect(() => {
    if (!isRacing) return;
    const interval = setInterval(() => {
      setProgressB((prev) => Math.min(100, prev + 8.5));
      setProgressA((prev) => {
        const next = prev + 1.8;
        if (next >= 100) {
          setIsRacing(false);
          onBattleRaceStateChange?.(false);
          return 100;
        }
        return next;
      });
    }, 85);

    return () => clearInterval(interval);
  }, [isRacing, onBattleRaceStateChange]);

  if (!isOpen) return null;

  const handleRunRace = () => {
    setProgressA(0);
    setProgressB(0);
    setIsRacing(true);
    onBattleRaceStateChange?.(true);
  };

  const ttftSpeedup = (
    activeBattle.contenderA.ttftMs /
    Math.max(1, activeBattle.contenderB.ttftMs)
  ).toFixed(1);
  const throughputGain = (
    activeBattle.contenderB.throughputRps /
    Math.max(1, activeBattle.contenderA.throughputRps)
  ).toFixed(1);
  const vramSavedPercent = Math.round(
    ((activeBattle.contenderA.peakVramGb -
      activeBattle.contenderB.peakVramGb) /
      activeBattle.contenderA.peakVramGb) *
      100
  );
  const costSavedPercent = Math.round(
    ((activeBattle.contenderA.unitCostPer1M -
      activeBattle.contenderB.unitCostPer1M) /
      activeBattle.contenderA.unitCostPer1M) *
      100
  );

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.header.btnBattleArena}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 14 }}
          transition={{ duration: 0.22 }}
          className={`relative flex max-h-[92vh] w-full max-w-[1420px] flex-col overflow-hidden rounded-3xl border shadow-2xl ${
            isNight
              ? 'border-cyan-500/40 bg-[#040917] text-slate-100'
              : 'border-slate-300 bg-white text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 ${
              isNight ? 'border-slate-800 bg-slate-950/90' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/50 bg-amber-500/15 text-amber-400">
                <Swords aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-amber-400">
                  ⚔️ {t.header.btnBattleArena} — Comparative Systems Benchmark
                </h2>
                <p className="text-xs text-slate-400">
                  Stress Workload: <strong className="text-cyan-300">{activeBattle.stressWorkload}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunRace}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-4 py-2 font-mono text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-300 transition-all cursor-pointer"
              >
                <Play aria-hidden="true" className="h-3.5 w-3.5" />
                <span>▶ Run Benchmark Race</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRacing(false);
                  setProgressA(100);
                  setProgressB(100);
                  onBattleRaceStateChange?.(false);
                  onClose();
                }}
                aria-label="Close A/B Architecture Battle Arena"
                className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:border-rose-400 hover:text-rose-300 cursor-pointer"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Preset Selector Bar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-950/60 px-5 py-3">
            {allPresets.map((preset) => {
              const active = preset.id === activeBattle.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setSelectedPresetId(preset.id);
                    setProgressA(100);
                    setProgressB(100);
                  }}
                  className={`rounded-xl border px-3 py-1.5 font-mono text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'border-cyan-400 bg-cyan-400 text-slate-950 font-bold'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {preset.numberBadge}: {preset.title[lang]}
                </button>
              );
            })}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* 1. Dual-Progress 8-Stage Pipeline Race Track */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Lane A: Naive Baseline */}
              <div className="rounded-2xl border border-amber-500/40 bg-amber-950/15 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-amber-400">
                      {activeBattle.contenderA.name}
                    </span>
                    <p className="font-mono text-[11px] text-slate-300 mt-0.5">
                      {activeBattle.contenderA.stackSummary}
                    </p>
                  </div>
                  <span className="rounded-lg bg-rose-500/20 px-2.5 py-1 font-mono text-xs font-bold text-rose-300">
                    P99: {activeBattle.contenderA.p99LatencyMs} ms
                  </span>
                </div>

                <div className="mt-3 h-3 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 transition-all duration-100"
                    style={{ width: `${progressA}%` }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-4 sm:grid-cols-8 gap-1 font-mono text-[10px]">
                  {DISTRICTS.map((d, idx) => {
                    const stageMs =
                      activeBattle.contenderA.stageLatenciesMs[d.id];
                    const isBottleneck = stageMs >= 90;
                    return (
                      <div
                        key={d.id}
                        className={`rounded-lg border p-1.5 text-center ${
                          isBottleneck
                            ? 'border-rose-500/70 bg-rose-950/50 text-rose-200 font-bold'
                            : 'border-slate-800 bg-slate-900/70 text-slate-300'
                        }`}
                      >
                        <div>D{idx + 1}</div>
                        <div className="text-[9px]">{stageMs}ms</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lane B: Optimized Production / Custom Stack */}
              <div className="rounded-2xl border border-cyan-400/50 bg-cyan-950/15 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase text-cyan-300">
                      <Trophy aria-hidden="true" className="h-3.5 w-3.5 text-emerald-400" />
                      {activeBattle.contenderB.name}
                    </span>
                    <p className="font-mono text-[11px] text-slate-300 mt-0.5">
                      {activeBattle.contenderB.stackSummary}
                    </p>
                  </div>
                  <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 font-mono text-xs font-bold text-emerald-300">
                    P99: {activeBattle.contenderB.p99LatencyMs} ms
                  </span>
                </div>

                <div className="mt-3 h-3 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-100"
                    style={{ width: `${progressB}%` }}
                  />
                </div>

                <div className="mt-3 grid grid-cols-4 sm:grid-cols-8 gap-1 font-mono text-[10px]">
                  {DISTRICTS.map((d, idx) => {
                    const stageMs =
                      activeBattle.contenderB.stageLatenciesMs[d.id];
                    return (
                      <div
                        key={d.id}
                        className="rounded-lg border border-cyan-500/30 bg-slate-900/90 p-1.5 text-center text-cyan-200"
                      >
                        <div>D{idx + 1}</div>
                        <div className="text-[9px] text-emerald-400 font-bold">
                          {stageMs}ms
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. Head-to-Head Scorecard */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <span className="block text-[10px] text-slate-400">
                  TTFT (TIME-TO-FIRST-TOKEN)
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-bold text-cyan-400">
                    {activeBattle.contenderB.ttftMs} ms
                  </span>
                  <span className="text-xs line-through text-rose-400">
                    {activeBattle.contenderA.ttftMs} ms
                  </span>
                </div>
                <span className="mt-2 inline-block rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                  ⚡ {ttftSpeedup}x Faster
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <span className="block text-[10px] text-slate-400">
                  SUSTAINED THROUGHPUT
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-bold text-emerald-400">
                    {activeBattle.contenderB.throughputRps} req/s
                  </span>
                  <span className="text-xs line-through text-rose-400">
                    {activeBattle.contenderA.throughputRps} req/s
                  </span>
                </div>
                <span className="mt-2 inline-block rounded bg-cyan-500/20 px-2 py-0.5 text-[11px] font-bold text-cyan-300">
                  🚀 {throughputGain}x Higher
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <span className="block text-[10px] text-slate-400">
                  PEAK GPU VRAM FOOTPRINT
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-bold text-violet-400">
                    {activeBattle.contenderB.peakVramGb} GB
                  </span>
                  <span className="text-xs line-through text-rose-400">
                    {activeBattle.contenderA.peakVramGb} GB
                  </span>
                </div>
                <span className="mt-2 inline-block rounded bg-violet-500/20 px-2 py-0.5 text-[11px] font-bold text-violet-300">
                  -{vramSavedPercent}% Memory
                </span>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <span className="block text-[10px] text-slate-400">
                  UNIT COST ($ / 1M QUERIES)
                </span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-bold text-amber-400">
                    ${activeBattle.contenderB.unitCostPer1M}
                  </span>
                  <span className="text-xs line-through text-rose-400">
                    ${activeBattle.contenderA.unitCostPer1M}
                  </span>
                </div>
                <span className="mt-2 inline-block rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                  -{costSavedPercent}% Cloud Cost
                </span>
              </div>
            </div>

            {/* 3. Engineering Breakdown: Why Contender B Won */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
                Engineering Post-Mortem: Why Contender B Won
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activeBattle.engineeringPostMortem.map((item, idx) => (
                  <div
                    key={`${item.districtId}-${idx}`}
                    className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5"
                  >
                    <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                      <span className="font-bold text-cyan-300">
                        {item.code}
                      </span>
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                        {item.speedupFactor}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.bottleneckEliminated}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
