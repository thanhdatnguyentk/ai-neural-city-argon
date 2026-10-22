'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  GitBranch,
  CheckCircle2,
  Lock,
  Sparkles,
  Cpu,
  AlertTriangle,
} from 'lucide-react';
import { DISTRICTS } from '../../data/districts';
import {
  TYCOON_TECH_TREE,
  HARDWARE_CLUSTER_TIERS,
} from '../../data/tycoon-tech-tree';
import type {
  HardwareClusterTier,
  ComputedTycoonTelemetry,
} from '../../types/tycoon-strategy';
import { DISTRICT_SLUG_TO_NUMBER } from '../../types/tycoon-strategy';
import { useLanguage } from '../../context/LanguageContext';

export interface TechTreeModalProps {
  isOpen: boolean;
  isNight: boolean;
  credits: number;
  rp: number;
  hardwareTierIndex: number;
  unlockedNodeIds: string[];
  telemetry: ComputedTycoonTelemetry;
  canResearchNode: (nodeId: string) => { allowed: boolean; reason?: string };
  onResearchNode: (nodeId: string) => boolean;
  onUpgradeHardware: () => boolean;
  onClose: () => void;
}

export const TechTreeModal: React.FC<TechTreeModalProps> = ({
  isOpen,
  isNight,
  credits,
  rp,
  hardwareTierIndex,
  unlockedNodeIds,
  telemetry,
  canResearchNode,
  onResearchNode,
  onUpgradeHardware,
  onClose,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const nextHardware: HardwareClusterTier | null =
    hardwareTierIndex + 1 < HARDWARE_CLUSTER_TIERS.length
      ? HARDWARE_CLUSTER_TIERS[hardwareTierIndex + 1]
      : null;

  return (
    <AnimatePresence>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="8-District AI Architecture Tech Tree"
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 sm:p-6 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className={`flex max-h-[92vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border shadow-2xl ${
            isNight
              ? 'border-amber-400/50 bg-[#050B1A] text-slate-100'
              : 'border-slate-300 bg-white text-slate-900'
          }`}
        >
          {/* Modal Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/85 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-500/15 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300">
                  <GitBranch aria-hidden="true" className="h-3 w-3" />
                  <span>24-NODE SOTA ENGINEERING TECH TREE</span>
                </span>
                <span className="font-mono text-xs text-slate-400">
                  Researched: {unlockedNodeIds.length} / 24
                </span>
              </div>
              <h2 className="mt-1 text-lg sm:text-xl font-bold text-white">
                {t.tycoon.techTreeLabel} · Chief AI Architect R&amp;D Matrix
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <div className="rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-1.5 text-amber-300 font-bold">
                💰 ${credits.toLocaleString()} CC
              </div>
              <div className="rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-cyan-300 font-bold">
                🧬 {rp.toFixed(0)} RP (+{telemetry.rpPerSec}/s)
              </div>
              {nextHardware && (
                <button
                  type="button"
                  onClick={onUpgradeHardware}
                  disabled={credits < nextHardware.unlockCostCredits}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-bold transition-colors ${
                    credits >= nextHardware.unlockCostCredits
                      ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 cursor-pointer'
                      : 'border border-slate-800 bg-slate-900 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Cpu aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>
                    Upgrade to {nextHardware.maxVramGb}GB ($
                    {nextHardware.unlockCostCredits})
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Tech Tree"
                className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:border-rose-400 hover:text-white cursor-pointer"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 8-District × 3-Tier Strategic Grid */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {DISTRICTS.map((district) => {
              const dNum = DISTRICT_SLUG_TO_NUMBER[district.id];
              const dNodes = TYCOON_TECH_TREE.filter(
                (n) => n.districtSlug === district.id
              ).sort((a, b) => a.tier - b.tier);
              const dMetric = telemetry.districtMetrics[district.id];
              const isBottleneck = dMetric?.isPrimaryBottleneck;

              return (
                <div
                  key={district.id}
                  className={`rounded-2xl border p-3.5 transition-colors ${
                    isBottleneck
                      ? 'border-rose-500/80 bg-rose-950/20'
                      : 'border-slate-800/90 bg-slate-900/50'
                  }`}
                >
                  <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: district.accentColor }}
                      />
                      <span className="font-mono text-xs font-bold uppercase text-white">
                        D{dNum} · {t.districts[district.id]?.name || district.name}
                      </span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                        Tier {dMetric?.unlockedTier ?? 0}/3
                      </span>
                      {isBottleneck && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-rose-500 bg-rose-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300 animate-pulse">
                          <AlertTriangle
                            aria-hidden="true"
                            className="h-3 w-3"
                          />
                          CENTER OF GRAVITY BOTTLENECK ({dMetric.saturationPercent}
                          % LOAD)
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      District Capacity:{' '}
                      <strong className="text-slate-200">
                        {dMetric?.capacityReqPerSec.toLocaleString()} req/s
                      </strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {dNodes.map((node) => {
                      const isResearched = unlockedNodeIds.includes(node.id);
                      const check = canResearchNode(node.id);

                      return (
                        <div
                          key={node.id}
                          className={`flex flex-col justify-between rounded-xl border p-3 transition-all ${
                            isResearched
                              ? 'border-emerald-500/60 bg-emerald-950/25'
                              : check.allowed
                              ? 'border-amber-400/70 bg-slate-950/90 shadow-md shadow-amber-500/10'
                              : 'border-slate-800 bg-slate-950/50 opacity-75'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 font-mono text-[10px]">
                              <span className="rounded bg-slate-800 px-1.5 py-0.5 font-bold text-cyan-300">
                                TIER {node.tier}
                              </span>
                              {isResearched ? (
                                <span className="inline-flex items-center gap-1 font-bold text-emerald-400">
                                  <CheckCircle2
                                    aria-hidden="true"
                                    className="h-3.5 w-3.5"
                                  />
                                  DEPLOYED
                                </span>
                              ) : (
                                <span className="font-bold text-amber-300">
                                  ${node.costCredits} CC · {node.costRp} RP
                                </span>
                              )}
                            </div>

                            <h3 className="mt-1.5 text-sm font-bold text-white">
                              {node.name}
                            </h3>
                            <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
                              {node.description}
                            </p>

                            {/* Stat Badges */}
                            <div className="mt-2.5 flex flex-wrap gap-1 font-mono text-[9px]">
                              <span className="rounded bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 text-cyan-300 font-semibold">
                                +{node.throughputBonusPct}% Cap
                              </span>
                              <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-emerald-300 font-semibold">
                                -{node.latencyReductionMs}ms P99
                              </span>
                              {node.vramDeltaGb !== 0 && (
                                <span
                                  className={`rounded px-1.5 py-0.5 font-semibold border ${
                                    node.vramDeltaGb < 0
                                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                                      : 'bg-amber-500/15 border-amber-400/30 text-amber-300'
                                  }`}
                                >
                                  {node.vramDeltaGb > 0 ? '+' : ''}
                                  {node.vramDeltaGb} GB VRAM
                                </span>
                              )}
                              {node.rpPerSecondBonus && (
                                <span className="rounded bg-violet-500/20 border border-violet-400/40 px-1.5 py-0.5 text-violet-300 font-semibold">
                                  +{node.rpPerSecondBonus} RP/s
                                </span>
                              )}
                              {node.defenseBonusPct && (
                                <span className="rounded bg-amber-500/20 border border-amber-400/40 px-1.5 py-0.5 text-amber-200 font-semibold">
                                  +{node.defenseBonusPct}% Shield
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-800/80">
                            {isResearched ? (
                              <div className="w-full rounded-lg bg-emerald-500/15 py-1.5 text-center font-mono text-[10px] font-bold text-emerald-300">
                                ★ Active in 3D City
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => onResearchNode(node.id)}
                                disabled={!check.allowed}
                                className={`w-full inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 font-mono text-[10px] font-bold transition-colors ${
                                  check.allowed
                                    ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 cursor-pointer'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                              >
                                {check.allowed ? (
                                  <>
                                    <Sparkles
                                      aria-hidden="true"
                                      className="h-3 w-3"
                                    />
                                    <span>Research &amp; Deploy</span>
                                  </>
                                ) : (
                                  <>
                                    <Lock
                                      aria-hidden="true"
                                      className="h-3 w-3"
                                    />
                                    <span>{check.reason}</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
