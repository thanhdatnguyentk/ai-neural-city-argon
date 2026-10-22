'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pause,
  Play,
  FastForward,
  SkipForward,
  Cpu,
  ShieldAlert,
  Trophy,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  GitBranch,
  X,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import type { DistrictId } from '../../data/districts';
import { DISTRICT_MAP } from '../../data/districts';
import type {
  TycoonSpeedMode,
  TycoonCampaignStatus,
  HardwareClusterTier,
  BossWorkloadWave,
  ComputedTycoonTelemetry,
  TycoonSaveData,
} from '../../types/tycoon-strategy';
import { getDistrictTechNodes } from '../../data/tycoon-tech-tree';
import { useLanguage } from '../../context/LanguageContext';

export interface TycoonCommandHUDProps {
  isActive: boolean;
  isNight: boolean;
  speedMode: TycoonSpeedMode;
  credits: number;
  rp: number;
  slaStability: number;
  currentHardware: HardwareClusterTier;
  nextHardware: HardwareClusterTier | null;
  unlockedNodeIds: string[];
  currentWave: BossWorkloadWave;
  waveElapsedSec: number;
  campaignStatus: TycoonCampaignStatus;
  saveData: TycoonSaveData;
  telemetry: ComputedTycoonTelemetry;
  selectedDistrict: DistrictId | null;
  canResearchNode: (nodeId: string) => { allowed: boolean; reason?: string };
  onResearchNode: (nodeId: string) => boolean;
  onUpgradeHardware: () => boolean;
  onSetSpeedMode: (mode: TycoonSpeedMode) => void;
  onCallNextWaveEarly: () => void;
  onOpenTechTree: () => void;
  onFocusDistrict: (districtId: DistrictId) => void;
  onResetCampaign: () => void;
  onCloseTycoonMode: () => void;
}

export const TycoonCommandHUD: React.FC<TycoonCommandHUDProps> = ({
  isActive,
  isNight,
  speedMode,
  credits,
  rp,
  slaStability,
  currentHardware,
  nextHardware,
  unlockedNodeIds,
  currentWave,
  waveElapsedSec,
  campaignStatus,
  saveData,
  telemetry,
  selectedDistrict,
  canResearchNode,
  onResearchNode,
  onUpgradeHardware,
  onSetSpeedMode,
  onCallNextWaveEarly,
  onOpenTechTree,
  onFocusDistrict,
  onResetCampaign,
  onCloseTycoonMode,
}) => {
  const { t } = useLanguage();

  if (!isActive) return null;

  const waveProgressPct = Math.min(
    100,
    Math.round((waveElapsedSec / Math.max(1, currentWave.durationSeconds)) * 100)
  );
  const bottleneckDistrict = telemetry.primaryBottleneckDistrict;
  const bottleneckDistrictData = DISTRICT_MAP[bottleneckDistrict.districtSlug];

  const selectedDistrictNodes = selectedDistrict
    ? getDistrictTechNodes(selectedDistrict)
    : [];
  const selectedDistrictData = selectedDistrict
    ? DISTRICT_MAP[selectedDistrict]
    : null;
  const selectedDistrictMetric = selectedDistrict
    ? telemetry.districtMetrics[selectedDistrict]
    : null;

  const slaColorClass =
    slaStability > 80
      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
      : slaStability >= 40
      ? 'text-amber-300 border-amber-500/50 bg-amber-500/15'
      : 'text-rose-300 border-rose-500/70 bg-rose-500/20 animate-pulse';

  return (
    <>
      {/* ==================== TOP TACTICAL COMMAND HUD ==================== */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -14 }}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className={`pointer-events-auto mb-2.5 w-full rounded-2xl border p-3 sm:p-3.5 shadow-2xl backdrop-blur-xl transition-colors ${
          isNight
            ? 'border-amber-400/50 bg-slate-950/95 text-slate-100 shadow-amber-500/10'
            : 'border-amber-500/60 bg-white/95 text-slate-900'
        }`}
      >
        {/* Row 1: Title + Speed Controls + Tech Tree Trigger + Exit */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
              <Sparkles aria-hidden="true" className="h-3 w-3" />
              <span>🎮 {t.tycoon.modeLabel} [G]</span>
            </span>

            {/* Tactical Speed Controls */}
            <div
              role="group"
              aria-label="Simulation Speed Controls"
              className="inline-flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/90 p-0.5 font-mono text-[10px]"
            >
              <button
                type="button"
                onClick={() => onSetSpeedMode(0)}
                aria-pressed={speedMode === 0}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-bold transition-colors cursor-pointer ${
                  speedMode === 0
                    ? 'bg-amber-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Pause aria-hidden="true" className="h-3 w-3" />
                <span>Pause</span>
              </button>
              <button
                type="button"
                onClick={() => onSetSpeedMode(1)}
                aria-pressed={speedMode === 1}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-bold transition-colors cursor-pointer ${
                  speedMode === 1
                    ? 'bg-cyan-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Play aria-hidden="true" className="h-3 w-3" />
                <span>1x</span>
              </button>
              <button
                type="button"
                onClick={() => onSetSpeedMode(2)}
                aria-pressed={speedMode === 2}
                className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 font-bold transition-colors cursor-pointer ${
                  speedMode === 2
                    ? 'bg-emerald-400 text-slate-950'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FastForward aria-hidden="true" className="h-3 w-3" />
                <span>2x</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onCallNextWaveEarly}
              title="Call Next Boss Wave Early (+75% Instant Wave Bonus)"
              className="inline-flex items-center gap-1 rounded-xl border border-violet-400/50 bg-violet-500/15 px-2.5 py-1 font-mono text-[10px] font-bold text-violet-300 hover:bg-violet-400 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <SkipForward aria-hidden="true" className="h-3 w-3" />
              <span>Next Wave Early</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenTechTree}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-1.5 font-mono text-[11px] font-bold text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300 transition-colors cursor-pointer"
            >
              <GitBranch aria-hidden="true" className="h-3.5 w-3.5" />
              <span>
                🌳 {t.tycoon.techTreeLabel} ({unlockedNodeIds.length}/24) [T]
              </span>
            </button>

            <button
              type="button"
              onClick={onResetCampaign}
              title="Reset Tycoon Campaign"
              className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1.5 font-mono text-[10px] text-slate-300 hover:border-cyan-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={onCloseTycoonMode}
              title="Exit Tycoon Strategy Mode [G]"
              className="rounded-xl border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:border-rose-400 hover:text-white transition-colors cursor-pointer"
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Row 2: 4 Core Strategic Resources */}
        <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 font-mono">
          {/* 1. Compute Credits ($CC) */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-2.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>💰 {t.tycoon.computeCreditsLabel}</span>
              <span
                className={
                  telemetry.netCreditsPerSec >= 0
                    ? 'text-emerald-400 font-bold'
                    : 'text-rose-400 font-bold'
                }
              >
                {telemetry.netCreditsPerSec >= 0 ? '+' : ''}
                ${telemetry.netCreditsPerSec}/s
              </span>
            </div>
            <div className="mt-0.5 text-base font-bold text-amber-300">
              ${credits.toLocaleString()} CC
            </div>
            <div className="text-[9px] text-slate-400">
              Gross +${telemetry.grossCreditsPerSec}/s · Upkeep -$
              {telemetry.upkeepPerSec}/s
            </div>
          </div>

          {/* 2. Research Points (RP) + Roadmap Synergy */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-2.5">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>🧬 {t.tycoon.researchPointsLabel}</span>
              <span className="text-cyan-300 font-bold">
                +{telemetry.rpPerSec} RP/s
              </span>
            </div>
            <div className="mt-0.5 text-base font-bold text-cyan-300">
              {rp.toFixed(0)} RP
            </div>
            <div className="text-[9px] text-emerald-400">
              Includes +{telemetry.roadmapBonusMultiplierPct}% Roadmap Mastery
              Bonus
            </div>
          </div>

          {/* 3. Cluster VRAM Capacity + Hardware Upgrade */}
          <div
            className={`rounded-xl border p-2.5 ${
              telemetry.isVramOom
                ? 'border-rose-500 bg-rose-950/50 animate-pulse'
                : 'border-slate-800 bg-slate-900/90'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>🖥️ {t.tycoon.clusterVramLabel}</span>
              <span className="truncate max-w-[140px] text-slate-300">
                {currentHardware.name}
              </span>
            </div>
            <div className="mt-0.5 flex items-center justify-between gap-2">
              <span
                className={`text-sm font-bold ${
                  telemetry.isVramOom ? 'text-rose-300' : 'text-white'
                }`}
              >
                {telemetry.usedVramGb} / {telemetry.maxVramGb} GB
                {telemetry.isVramOom && ' (OOM!)'}
              </span>
              {nextHardware ? (
                <button
                  type="button"
                  onClick={onUpgradeHardware}
                  disabled={credits < nextHardware.unlockCostCredits}
                  className={`rounded-lg px-2 py-0.5 text-[9px] font-bold transition-colors ${
                    credits >= nextHardware.unlockCostCredits
                      ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 cursor-pointer'
                      : 'border border-slate-700 bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  + Upgrade (${nextHardware.unlockCostCredits})
                </button>
              ) : (
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300">
                  MAX CLUSTER
                </span>
              )}
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  telemetry.isVramOom ? 'bg-rose-500' : 'bg-cyan-400'
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    (telemetry.usedVramGb / telemetry.maxVramGb) * 100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* 4. SLA Stability */}
          <div className={`rounded-xl border p-2.5 ${slaColorClass}`}>
            <div className="flex items-center justify-between text-[10px]">
              <span>🛡️ {t.tycoon.slaStabilityLabel}</span>
              <span className="font-bold">
                {telemetry.slaDeltaPerSec >= 0 ? '+' : ''}
                {telemetry.slaDeltaPerSec}%/s
              </span>
            </div>
            <div className="mt-0.5 text-base font-bold">
              {slaStability.toFixed(1)}%
            </div>
            <div className="text-[9px] opacity-85">
              P99: {telemetry.currentP99LatencyMs}ms (Target &lt;{' '}
              {currentWave.maxAllowedLatencyMs}ms) · Shield:{' '}
              {telemetry.threatBlockPercent}%
            </div>
          </div>
        </div>

        {/* Row 3: Active Boss Wave Banner + Center of Gravity Bottleneck */}
        <div className="mt-2.5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5 rounded-xl border border-slate-800 bg-slate-900/75 p-2.5">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="rounded bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                BOSS WAVE {currentWave.waveNumber}/5
              </span>
              <span className="font-bold text-white truncate">
                {currentWave.title}
              </span>
              <span className="text-[10px] text-slate-400">
                ({waveElapsedSec}s / {currentWave.durationSeconds}s)
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-300 line-clamp-1">
              {currentWave.tacticalBriefing}
            </p>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${waveProgressPct}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 font-mono text-[10px]">
            <div className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5">
              <span className="block text-[9px] text-slate-400 uppercase">
                Incoming vs Capacity
              </span>
              <span
                className={`font-bold ${
                  telemetry.cityCapacityReqPerSec >= currentWave.incomingReqPerSec
                    ? 'text-emerald-400'
                    : 'text-amber-300'
                }`}
              >
                {currentWave.incomingReqPerSec.toLocaleString()} /{' '}
                {telemetry.cityCapacityReqPerSec.toLocaleString()} req/s
              </span>
            </div>

            {/* Center of Gravity Bottleneck Button */}
            <button
              type="button"
              onClick={() => onFocusDistrict(bottleneckDistrict.districtSlug)}
              title="Click to focus 3D Camera on Center of Gravity Bottleneck"
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-bold transition-colors cursor-pointer ${
                bottleneckDistrict.saturationPercent > 100
                  ? 'border-rose-500 bg-rose-500/20 text-rose-200 animate-pulse'
                  : 'border-amber-400/50 bg-amber-500/15 text-amber-200'
              }`}
            >
              <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" />
              <span>
                {t.tycoon.bottleneckCenterLabel}: D
                {bottleneckDistrict.districtNumber}{' '}
                {bottleneckDistrictData?.shortName} (
                {bottleneckDistrict.saturationPercent}% LOAD)
              </span>
            </button>
          </div>
        </div>

        {/* Row 4: Selected 3D Building Quick Tactical Upgrade Bar */}
        {selectedDistrict && selectedDistrictData && selectedDistrictMetric && (
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/25 px-3 py-2 font-mono text-[10px]">
            <div className="flex items-center gap-2">
              <Cpu aria-hidden="true" className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-bold text-cyan-300">
                D{selectedDistrictMetric.districtNumber} ·{' '}
                {selectedDistrictData.name} (Tier{' '}
                {selectedDistrictMetric.unlockedTier}/3 · Load{' '}
                {selectedDistrictMetric.saturationPercent}%)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedDistrictNodes.map((node) => {
                const isUnlocked = unlockedNodeIds.includes(node.id);
                const check = canResearchNode(node.id);
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => onResearchNode(node.id)}
                    disabled={!check.allowed}
                    className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 font-bold transition-colors ${
                      isUnlocked
                        ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 cursor-default'
                        : check.allowed
                        ? 'border-amber-400 bg-amber-400 text-slate-950 hover:bg-amber-300 cursor-pointer'
                        : 'border-slate-800 bg-slate-900/80 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {isUnlocked ? (
                      <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
                    ) : !check.allowed ? (
                      <Lock aria-hidden="true" className="h-3 w-3" />
                    ) : null}
                    <span>
                      T{node.tier}: {node.name}
                    </span>
                    {!isUnlocked && (
                      <span className="opacity-80">
                        (${node.costCredits} · {node.costRp}RP)
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* ==================== GRAND ARCHITECT VICTORY / SLA BREACH DEFEAT MODAL ==================== */}
      <AnimatePresence>
        {campaignStatus !== 'active' && (
          <div
            role="dialog"
            aria-modal="true"
            onWheel={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl ${
                campaignStatus === 'victory'
                  ? 'border-amber-400 bg-slate-950 text-slate-100'
                  : 'border-rose-500 bg-slate-950 text-slate-100'
              }`}
            >
              {campaignStatus === 'victory' ? (
                <>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-500/20 px-3 py-1 font-mono text-xs font-bold text-amber-300">
                    <Trophy aria-hidden="true" className="h-4 w-4" />
                    <span>🏆 GRAND ARCHITECT VICTORY · WAVE 5 CLEARED</span>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-white">
                    Global Singularity Traffic Event Survived!
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    Your 8-District AI Architecture sustained 18,000 req/s of
                    multimodal, agentic, and red-team adversarial load while
                    maintaining strict P99 SLA targets.
                  </p>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono">
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                      <span className="text-[10px] text-slate-400">
                        Peak Capacity
                      </span>
                      <div className="mt-1 text-sm font-bold text-cyan-300">
                        {Math.max(
                          saveData.peakThroughputRps,
                          telemetry.cityCapacityReqPerSec
                        ).toLocaleString()}{' '}
                        req/s
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                      <span className="text-[10px] text-slate-400">
                        Best P99 Latency
                      </span>
                      <div className="mt-1 text-sm font-bold text-emerald-400">
                        {Math.min(
                          saveData.lowestP99LatencyMs,
                          telemetry.currentP99LatencyMs
                        )}{' '}
                        ms
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                      <span className="text-[10px] text-slate-400">
                        Tech Nodes
                      </span>
                      <div className="mt-1 text-sm font-bold text-amber-300">
                        {unlockedNodeIds.length} / 24
                      </div>
                    </div>
                    <div className="rounded-xl border border-amber-400/50 bg-amber-500/15 p-3">
                      <span className="text-[10px] text-amber-200">
                        Architect Rank
                      </span>
                      <div className="mt-1 text-lg font-extrabold text-amber-300">
                        RANK S+
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/60 bg-rose-500/20 px-3 py-1 font-mono text-xs font-bold text-rose-300">
                    <ShieldAlert aria-hidden="true" className="h-4 w-4" />
                    <span>⚠️ SLA BREACH POST-MORTEM · WAVE {currentWave.waveNumber}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold text-white">
                    Production SLA Dropped to 0%
                  </h2>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                    Diagnostic Root Cause Analysis during{' '}
                    <strong>{currentWave.title}</strong>:
                  </p>
                  <ul className="mt-3 space-y-2 rounded-xl border border-rose-500/40 bg-rose-950/30 p-3.5 font-mono text-xs text-rose-200">
                    <li>
                      • Primary Center of Gravity Bottleneck:{' '}
                      <strong>
                        D{bottleneckDistrict.districtNumber} (
                        {bottleneckDistrictData?.name}) at{' '}
                        {bottleneckDistrict.saturationPercent}% Load
                      </strong>
                      .
                    </li>
                    {telemetry.isVramOom && (
                      <li>
                        • Catastrophic GPU VRAM OOM ({telemetry.usedVramGb} GB /{' '}
                        {telemetry.maxVramGb} GB). Research QLoRA (D3),
                        FlashAttention-2 (D4), or ONNX/vLLM (D5) to compress
                        VRAM!
                      </li>
                    )}
                    {telemetry.unblockedThreatRatio > 0.05 && (
                      <li>
                        • Unblocked Adversarial / Hallucination Payloads leaked
                        through District 7. Research RAGAS Faithfulness &amp;
                        NeMo Guardrails (D7 Tier 2/3)!
                      </li>
                    )}
                  </ul>
                </>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-end gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={onOpenTechTree}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 font-semibold text-slate-200 hover:border-cyan-400 hover:text-white cursor-pointer"
                >
                  Inspect Tech Tree
                </button>
                <button
                  type="button"
                  onClick={onResetCampaign}
                  className="rounded-xl bg-amber-400 px-4 py-2 font-bold text-slate-950 hover:bg-amber-300 cursor-pointer"
                >
                  🔄 Play Again
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
