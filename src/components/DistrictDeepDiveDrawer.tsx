'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Terminal,
  BookOpen,
  ExternalLink,
  Award,
  Layers,
  Sparkles,
  Cpu,
  Share2,
  HelpCircle,
  Sliders,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import {
  DISTRICTS,
  DISTRICT_MAP,
  DistrictId,
} from '../data/districts';
import { getDistrictDeepDive } from '../data/district-roadmaps.ts';
import {
  getDistrictQuizzes,
  DistrictQuizQuestion,
} from '../data/district-quizzes.ts';
import type {
  LandmarkCategory,
  RoadmapMilestone,
  LandmarkWork,
} from '../types/district-roadmap';
import type { ProgressStats } from '../hooks/useRoadmapProgress.ts';
import type {
  VramCalculatorState,
  ComputedSimulationTelemetry,
} from '../data/bottleneck-scenarios.ts';

export type DeepDiveTab = 'roadmap' | 'landmarks' | 'quiz' | 'sandbox';

export interface DistrictDeepDiveDrawerProps {
  districtId: DistrictId | null;
  isOpen: boolean;
  isNight: boolean;
  isFlowHighlighted: boolean;
  activeTab?: DeepDiveTab;
  onTabChange?: (tab: DeepDiveTab) => void;
  highlightedMilestoneId?: string | null;
  vramConfig: VramCalculatorState;
  onUpdateVramConfig: (partial: Partial<VramCalculatorState>) => void;
  computedTelemetry: ComputedSimulationTelemetry;
  isCompleted: (milestoneId: string) => boolean;
  onToggleMilestone: (milestoneId: string) => void;
  onTriggerMilestonePulse?: (districtId: DistrictId) => void;
  getDistrictProgress: (districtId: DistrictId) => ProgressStats;
  getTotalCityMastery: () => ProgressStats;
  onClose: () => void;
  onMinimizeToCompactHud: () => void;
  onSelectDistrict: (districtId: DistrictId) => void;
  onToggleDataFlow: (districtId: DistrictId) => void;
}

const CATEGORY_BADGE_STYLES: Record<
  LandmarkCategory,
  { dark: string; light: string }
> = {
  'Seminal Paper': {
    dark: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300',
    light: 'border-cyan-600/40 bg-cyan-50 text-cyan-900',
  },
  'Architecture Breakthrough': {
    dark: 'border-violet-500/40 bg-violet-500/15 text-violet-300',
    light: 'border-violet-600/40 bg-violet-50 text-violet-900',
  },
  'Open-Source / System Milestone': {
    dark: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
    light: 'border-emerald-600/40 bg-emerald-50 text-emerald-900',
  },
};

const PARAM_OPTIONS: VramCalculatorState['parameterCountBillion'][] = [
  7, 14, 32, 70, 405,
];
const QUANT_OPTIONS: {
  id: VramCalculatorState['quantization'];
  label: string;
  sub: string;
}[] = [
  { id: 'FP16', label: 'FP16 / BF16', sub: '2.0 B/param' },
  { id: 'FP8_INT8', label: 'FP8 / INT8', sub: '1.0 B/param' },
  { id: 'INT4_AWQ', label: 'INT4 AWQ', sub: '0.5 B/param' },
];
const CONTEXT_OPTIONS: {
  value: VramCalculatorState['contextLength'];
  label: string;
}[] = [
  { value: 4096, label: '4K' },
  { value: 16384, label: '16K' },
  { value: 32768, label: '32K' },
  { value: 131072, label: '128K' },
];
const GPU_CLUSTER_OPTIONS: {
  value: VramCalculatorState['gpuMemoryBudgetGb'];
  label: string;
}[] = [
  { value: 24, label: '1x RTX 4090 (24 GB)' },
  { value: 40, label: '1x A100 (40 GB)' },
  { value: 80, label: '1x H100 (80 GB)' },
  { value: 160, label: '2x H100 NVLink (160 GB)' },
  { value: 640, label: '8x H100 Node (640 GB)' },
];

export const DistrictDeepDiveDrawer: React.FC<DistrictDeepDiveDrawerProps> = ({
  districtId,
  isOpen,
  isNight,
  isFlowHighlighted,
  activeTab: controlledTab,
  onTabChange,
  highlightedMilestoneId = null,
  vramConfig,
  onUpdateVramConfig,
  computedTelemetry,
  isCompleted,
  onToggleMilestone,
  onTriggerMilestonePulse,
  getDistrictProgress,
  getTotalCityMastery,
  onClose,
  onMinimizeToCompactHud,
  onSelectDistrict,
  onToggleDataFlow,
}) => {
  const [internalTab, setInternalTab] = useState<DeepDiveTab>('roadmap');
  const currentTab = controlledTab ?? internalTab;

  const setActiveTab = (tab: DeepDiveTab) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  // Track selected quiz answers per question ID: { [questionId]: selectedOptionIndex }
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});
  const [focusedQuizMilestoneId, setFocusedQuizMilestoneId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (highlightedMilestoneId) {
      const el = document.getElementById(`milestone-card-${highlightedMilestoneId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedMilestoneId, currentTab]);

  useEffect(() => {
    if (focusedQuizMilestoneId && currentTab === 'quiz') {
      const el = document.getElementById(`quiz-card-${focusedQuizMilestoneId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusedQuizMilestoneId, currentTab]);

  if (!districtId || !isOpen) return null;

  const deepDive = getDistrictDeepDive(districtId);
  const cityDistrict = DISTRICT_MAP[districtId];
  if (!deepDive || !cityDistrict) return null;

  const currentIndex = DISTRICTS.findIndex((d) => d.id === districtId);
  const prevDistrict =
    DISTRICTS[(currentIndex - 1 + DISTRICTS.length) % DISTRICTS.length];
  const nextDistrict = DISTRICTS[(currentIndex + 1) % DISTRICTS.length];

  const districtProgress = getDistrictProgress(districtId);
  const cityMastery = getTotalCityMastery();

  const sortedLandmarks: LandmarkWork[] = [...deepDive.landmarks].sort(
    (a, b) => a.year - b.year
  );
  const districtQuizzes: DistrictQuizQuestion[] =
    getDistrictQuizzes(districtId);

  const handleSelectQuizOption = (
    q: DistrictQuizQuestion,
    optionIndex: number
  ) => {
    setSelectedAnswers((prev) => ({ ...prev, [q.id]: optionIndex }));
    if (optionIndex === q.correctIndex) {
      if (!isCompleted(q.milestoneId)) {
        onToggleMilestone(q.milestoneId);
      }
      onTriggerMilestonePulse?.(districtId);
    }
  };

  const weightsRatio = Math.min(
    100,
    (computedTelemetry.weightsVramGb / vramConfig.gpuMemoryBudgetGb) * 100
  );
  const kvRatio = Math.min(
    100 - weightsRatio,
    (computedTelemetry.kvCacheVramGb / vramConfig.gpuMemoryBudgetGb) * 100
  );

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={`deep-dive-${deepDive.districtId}`}
        initial={{ opacity: 0, x: 36 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 36 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        role="dialog"
        aria-modal="false"
        aria-label={`${deepDive.districtName} Engineering Sandbox and Roadmap`}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className={`pointer-events-auto flex flex-col w-full max-w-xl max-h-[calc(100vh-11.5rem)] rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
          isNight
            ? 'hud-glass-dark border-slate-700/80 text-slate-100'
            : 'hud-glass-light border-slate-300 text-slate-900'
        }`}
      >
        {/* ==================== DRAWER HEADER ==================== */}
        <div
          className={`shrink-0 border-b p-4 sm:p-4 ${
            isNight
              ? 'border-slate-800/90 bg-slate-950/65'
              : 'border-slate-200 bg-slate-50/90'
          }`}
        >
          {/* Top Bar: District Code + Navigation + Close */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider"
                style={{
                  borderColor: `${deepDive.accentColorHex}66`,
                  backgroundColor: `${deepDive.accentColorHex}1A`,
                  color: isNight ? deepDive.accentColorHex : '#0F172A',
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: deepDive.accentColorHex }}
                />
                {deepDive.districtCode}
              </span>
              <span
                className={`font-mono text-[10px] uppercase tracking-wider truncate max-w-[210px] sm:max-w-xs ${
                  isNight ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {deepDive.pipelineStageName}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelectDistrict(prevDistrict.id)}
                title={`Previous District: ${prevDistrict.name} [←]`}
                aria-label={`Previous District: ${prevDistrict.name}`}
                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 font-mono text-[10px] font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isNight
                    ? 'border-slate-700/80 bg-slate-900/90 text-slate-300 hover:border-cyan-400 hover:text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectDistrict(nextDistrict.id)}
                title={`Next District: ${nextDistrict.name} [→]`}
                aria-label={`Next District: ${nextDistrict.name}`}
                className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 font-mono text-[10px] font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isNight
                    ? 'border-slate-700/80 bg-slate-900/90 text-slate-300 hover:border-cyan-400 hover:text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={onMinimizeToCompactHud}
                title="Switch to Compact District HUD"
                className={`rounded-lg border px-2 py-1 font-mono text-[10px] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isNight
                    ? 'border-slate-700/80 bg-slate-900/90 text-slate-300 hover:border-cyan-400 hover:text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                HUD
              </button>

              <button
                type="button"
                onClick={onClose}
                title="Close Deep-Dive Drawer [Esc]"
                aria-label="Close Deep-Dive Drawer"
                className={`rounded-lg border p-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isNight
                    ? 'border-slate-700/80 bg-slate-900/90 text-slate-300 hover:border-rose-400 hover:text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="mt-2 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block h-3 w-3 rounded-full shrink-0"
                  style={{
                    backgroundColor: deepDive.accentColorHex,
                    boxShadow: `0 0 12px ${deepDive.accentColorHex}`,
                  }}
                />
                {deepDive.districtName}
              </h2>
              <p
                className={`mt-0.5 text-xs leading-relaxed line-clamp-2 ${
                  isNight ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {deepDive.tagline}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onToggleDataFlow(districtId)}
              aria-pressed={isFlowHighlighted}
              title="Highlight 3D Data Flow Pathways"
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-mono text-[10px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isFlowHighlighted
                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/25'
                  : isNight
                  ? 'border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                  : 'border border-cyan-600/40 bg-cyan-50 text-cyan-900 hover:bg-cyan-100'
              }`}
            >
              <Share2 aria-hidden="true" className="h-3 w-3" />
              <span>{isFlowHighlighted ? 'Flow Active' : 'Data Flow'}</span>
            </button>
          </div>

          {/* District Mastery Progress Bar */}
          <div
            className={`mt-2.5 rounded-xl border p-2 ${
              isNight
                ? 'border-slate-800 bg-slate-900/75'
                : 'border-slate-200 bg-white'
            }`}
          >
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Award
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                  style={{ color: deepDive.accentColorHex }}
                />
                <span>
                  District Mastery: {districtProgress.completed}/
                  {districtProgress.total} ({districtProgress.percentage}%)
                </span>
              </span>
              <span className={isNight ? 'text-slate-400' : 'text-slate-600'}>
                City Total: {cityMastery.completed}/{cityMastery.total} (
                {cityMastery.percentage}%)
              </span>
            </div>
            <div
              className={`mt-1.5 h-1.5 w-full overflow-hidden rounded-full ${
                isNight ? 'bg-slate-800' : 'bg-slate-200'
              }`}
              role="progressbar"
              aria-valuenow={districtProgress.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${deepDive.districtName} mastery progress`}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${districtProgress.percentage}%`,
                  backgroundColor: deepDive.accentColorHex,
                  boxShadow:
                    districtProgress.percentage > 0
                      ? `0 0 10px ${deepDive.accentColorHex}`
                      : 'none',
                }}
              />
            </div>
          </div>

          {/* 4-Tab Interactive Navigation Bar */}
          <div
            role="tablist"
            aria-label="District Deep-Dive Views"
            className={`mt-2.5 grid grid-cols-2 sm:grid-cols-4 gap-1 rounded-xl p-1 font-mono text-[10px] ${
              isNight ? 'bg-slate-900/90' : 'bg-slate-200/80'
            }`}
          >
            <button
              type="button"
              role="tab"
              aria-selected={currentTab === 'roadmap'}
              onClick={() => setActiveTab('roadmap')}
              className={`inline-flex items-center justify-center gap-1 rounded-lg py-1.5 px-2 font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                currentTab === 'roadmap'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : isNight
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Layers aria-hidden="true" className="h-3 w-3 shrink-0" />
              <span className="truncate">01 · Roadmap</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={currentTab === 'landmarks'}
              onClick={() => setActiveTab('landmarks')}
              className={`inline-flex items-center justify-center gap-1 rounded-lg py-1.5 px-2 font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                currentTab === 'landmarks'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : isNight
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Sparkles aria-hidden="true" className="h-3 w-3 shrink-0" />
              <span className="truncate">
                02 · Landmarks ({sortedLandmarks.length})
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={currentTab === 'quiz'}
              onClick={() => setActiveTab('quiz')}
              className={`inline-flex items-center justify-center gap-1 rounded-lg py-1.5 px-2 font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                currentTab === 'quiz'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : isNight
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <HelpCircle aria-hidden="true" className="h-3 w-3 shrink-0" />
              <span className="truncate">03 · Verify Quiz</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={currentTab === 'sandbox'}
              onClick={() => setActiveTab('sandbox')}
              className={`inline-flex items-center justify-center gap-1 rounded-lg py-1.5 px-2 font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                currentTab === 'sandbox'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : computedTelemetry.isVramOom
                  ? 'text-rose-400 animate-pulse font-bold'
                  : isNight
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Sliders aria-hidden="true" className="h-3 w-3 shrink-0" />
              <span className="truncate">04 · VRAM Lab</span>
            </button>
          </div>
        </div>

        {/* ==================== SCROLLABLE BODY ==================== */}
        <div
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
        >
          {/* ==================== TAB 1: ZERO-TO-HERO ROADMAP ==================== */}
          {currentTab === 'roadmap' && (
            <div className="relative space-y-4">
              {deepDive.roadmap.map(
                (milestone: RoadmapMilestone, idx: number) => {
                  const completed = isCompleted(milestone.id);
                  const isHighlightedFix =
                    highlightedMilestoneId === milestone.id;
                  return (
                    <div
                      id={`milestone-card-${milestone.id}`}
                      key={milestone.id}
                      className={`relative rounded-2xl border p-4 transition-all ${
                        isHighlightedFix
                          ? 'border-amber-400 ring-2 ring-amber-400/60 bg-amber-950/25 shadow-xl shadow-amber-500/20'
                          : completed
                          ? isNight
                            ? 'border-emerald-400/70 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                            : 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                          : isNight
                          ? 'border-slate-800 bg-slate-950/75 hover:border-slate-700'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {isHighlightedFix && (
                        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-400/60 bg-amber-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-300">
                          <Zap aria-hidden="true" className="h-3 w-3" />
                          <span>Recommended Bottleneck Remediation</span>
                        </div>
                      )}

                      {idx < deepDive.roadmap.length - 1 && (
                        <div
                          aria-hidden="true"
                          className={`hidden sm:block absolute left-6 -bottom-4 h-4 w-0.5 ${
                            completed
                              ? 'bg-emerald-400/70'
                              : isNight
                              ? 'bg-slate-800'
                              : 'bg-slate-300'
                          }`}
                        />
                      )}

                      {/* Top Row: Tier Badge + Quiz Verify + Completion Checkbox */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            completed
                              ? isNight
                                ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300'
                                : 'border-emerald-600/40 bg-emerald-100 text-emerald-900'
                              : isNight
                              ? 'border-cyan-500/35 bg-cyan-500/10 text-cyan-300'
                              : 'border-cyan-600/35 bg-cyan-50 text-cyan-900'
                          }`}
                        >
                          {milestone.tierLabel}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setFocusedQuizMilestoneId(milestone.id);
                              setActiveTab('quiz');
                            }}
                            className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 font-mono text-[10px] font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                              isNight
                                ? 'border-violet-500/40 bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 hover:text-white'
                                : 'border-violet-600/40 bg-violet-50 text-violet-900 hover:bg-violet-100'
                            }`}
                          >
                            <HelpCircle
                              aria-hidden="true"
                              className="h-3 w-3"
                            />
                            <span>Take Quiz to Verify</span>
                          </button>

                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={completed}
                            onClick={() => onToggleMilestone(milestone.id)}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1 font-mono text-[10px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                              completed
                                ? 'border-emerald-400 bg-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/30'
                                : isNight
                                ? 'border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400 hover:text-white'
                                : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {completed ? (
                              <CheckCircle2
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                              />
                            ) : (
                              <Circle
                                aria-hidden="true"
                                className="h-3.5 w-3.5"
                              />
                            )}
                            <span>
                              {completed ? 'Completed' : 'Mark Completed'}
                            </span>
                          </button>
                        </div>
                      </div>

                      <h3 className="mt-2.5 text-sm sm:text-base font-bold tracking-tight">
                        {milestone.title}
                      </h3>
                      <p
                        className={`mt-1 text-xs leading-relaxed ${
                          isNight ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {milestone.summary}
                      </p>

                      {/* Core Concepts Pills */}
                      <div className="mt-3">
                        <span
                          className={`block font-mono text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${
                            isNight ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          Core Engineering Concepts
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {milestone.coreConcepts.map((concept) => (
                            <span
                              key={concept}
                              className={`rounded-md border px-2 py-0.5 font-mono text-[10px] ${
                                isNight
                                  ? 'border-slate-800 bg-slate-900/90 text-slate-200'
                                  : 'border-slate-200 bg-slate-100 text-slate-800'
                              }`}
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tech Stack Badges */}
                      <div className="mt-3">
                        <span
                          className={`block font-mono text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${
                            isNight ? 'text-cyan-400' : 'text-cyan-800'
                          }`}
                        >
                          Production Tech Stack
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {milestone.techStack.map((tech) => (
                            <span
                              key={tech}
                              className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                                isNight
                                  ? 'border-cyan-500/35 bg-cyan-500/10 text-cyan-300'
                                  : 'border-cyan-600/35 bg-cyan-50 text-cyan-900'
                              }`}
                            >
                              <Cpu aria-hidden="true" className="h-2.5 w-2.5" />
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Capstone Deliverable Callout */}
                      <div
                        className={`mt-3.5 rounded-xl border p-3 ${
                          isNight
                            ? 'border-violet-500/30 bg-violet-950/25 text-slate-200'
                            : 'border-violet-300 bg-violet-50/80 text-slate-800'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isNight ? 'text-violet-300' : 'text-violet-900'
                          }`}
                        >
                          <Terminal
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                          <span>Capstone Deliverable</span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed font-medium">
                          {milestone.capstoneDeliverable}
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}

          {/* ==================== TAB 2: HALL OF BREAKTHROUGHS ==================== */}
          {currentTab === 'landmarks' && (
            <div className="space-y-3.5">
              {sortedLandmarks.map((landmark) => {
                const badgeStyle =
                  CATEGORY_BADGE_STYLES[landmark.category] ||
                  CATEGORY_BADGE_STYLES['Seminal Paper'];

                return (
                  <article
                    key={landmark.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      isNight
                        ? 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-lg px-2.5 py-0.5 font-mono text-xs font-bold ${
                            isNight
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-amber-100 text-amber-900 border border-amber-400'
                          }`}
                        >
                          {landmark.year}
                        </span>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                            isNight ? badgeStyle.dark : badgeStyle.light
                          }`}
                        >
                          {landmark.category}
                        </span>
                      </div>

                      <a
                        href={landmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 font-mono text-[11px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                          isNight
                            ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/25 hover:text-white'
                            : 'border-cyan-600/40 bg-cyan-50 text-cyan-900 hover:bg-cyan-100'
                        }`}
                      >
                        <span>View Paper / Spec</span>
                        <ExternalLink
                          aria-hidden="true"
                          className="h-3 w-3"
                        />
                      </a>
                    </div>

                    <h3 className="mt-2.5 text-sm sm:text-base font-bold tracking-tight">
                      {landmark.title}
                    </h3>

                    <p
                      className={`mt-0.5 font-mono text-[11px] ${
                        isNight
                          ? 'text-cyan-400'
                          : 'text-cyan-800 font-semibold'
                      }`}
                    >
                      {landmark.authorsOrOrg}
                    </p>

                    <p
                      className={`mt-2 text-xs leading-relaxed ${
                        isNight ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      {landmark.keyContribution}
                    </p>

                    <div
                      className={`mt-3 rounded-xl border px-3 py-2 font-mono text-[11px] flex items-start gap-2 ${
                        isNight
                          ? 'border-slate-800/90 bg-slate-900/70 text-slate-300'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <BookOpen
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-400"
                      />
                      <span>
                        <strong className="uppercase text-[10px] tracking-wider mr-1.5">
                          Impact:
                        </strong>
                        {landmark.impactMetricOrNote}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* ==================== TAB 3: MASTERY VERIFICATION QUIZ ENGINE ==================== */}
          {currentTab === 'quiz' && (
            <div className="space-y-4">
              <div
                className={`rounded-xl border p-3 font-mono text-xs ${
                  isNight
                    ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-200'
                    : 'border-cyan-600/30 bg-cyan-50 text-cyan-900'
                }`}
              >
                Answer each level&apos;s engineering verification question
                correctly to automatically unlock that Roadmap milestone and
                evolve the 3D District architecture.
              </div>

              {districtQuizzes.map((q, qIdx) => {
                const selectedOpt = selectedAnswers[q.id];
                const isAnswered = selectedOpt !== undefined;
                const isCorrect = selectedOpt === q.correctIndex;
                const milestoneCompleted = isCompleted(q.milestoneId);

                return (
                  <div
                    id={`quiz-card-${q.milestoneId}`}
                    key={q.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      isCorrect || milestoneCompleted
                        ? isNight
                          ? 'border-emerald-400/70 bg-emerald-950/20'
                          : 'border-emerald-600 bg-emerald-50/70'
                        : isNight
                        ? 'border-slate-800 bg-slate-950/80'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-lg border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${
                          isCorrect || milestoneCompleted
                            ? isNight
                              ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300'
                              : 'border-emerald-600/40 bg-emerald-100 text-emerald-900'
                            : isNight
                            ? 'border-violet-500/40 bg-violet-500/15 text-violet-300'
                            : 'border-violet-600/40 bg-violet-50 text-violet-900'
                        }`}
                      >
                        Level 0{qIdx + 1} Verification Challenge
                      </span>
                      {(isCorrect || milestoneCompleted) && (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-400">
                          <CheckCircle2
                            aria-hidden="true"
                            className="h-3.5 w-3.5"
                          />
                          <span>Milestone Verified</span>
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2.5 text-xs sm:text-sm font-bold leading-snug">
                      {q.question}
                    </h3>

                    <div className="mt-3 space-y-2">
                      {q.options.map((optText, optIdx) => {
                        const isThisSelected = selectedOpt === optIdx;
                        const isThisCorrect = optIdx === q.correctIndex;

                        let optionClasses = isNight
                          ? 'border-slate-800 bg-slate-900/80 text-slate-200 hover:border-cyan-400/60'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-cyan-600';

                        if (isAnswered) {
                          if (isThisCorrect) {
                            optionClasses = isNight
                              ? 'border-emerald-400 bg-emerald-500/20 text-emerald-200 font-semibold'
                              : 'border-emerald-600 bg-emerald-100 text-emerald-950 font-semibold';
                          } else if (isThisSelected && !isThisCorrect) {
                            optionClasses = isNight
                              ? 'border-rose-500 bg-rose-500/20 text-rose-200'
                              : 'border-rose-600 bg-rose-100 text-rose-950';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectQuizOption(q, optIdx)}
                            className={`w-full text-left rounded-xl border p-2.5 text-xs leading-relaxed transition-all cursor-pointer flex items-start gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${optionClasses}`}
                          >
                            <span className="font-mono text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-950/30 shrink-0 mt-0.5">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{optText}</span>
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div
                        className={`mt-3 rounded-xl border p-3 text-xs leading-relaxed ${
                          isCorrect
                            ? isNight
                              ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-200'
                              : 'border-emerald-500 bg-emerald-50 text-emerald-900'
                            : isNight
                            ? 'border-amber-500/40 bg-amber-950/40 text-amber-200'
                            : 'border-amber-500 bg-amber-50 text-amber-900'
                        }`}
                      >
                        <div className="font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
                          {isCorrect
                            ? '✓ Correct — Milestone Unlocked & 3D Pulse Triggered!'
                            : '✕ Architectural Insight — Try Again:'}
                        </div>
                        <p>{q.technicalExplanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ==================== TAB 4: AI ARCHITECT VRAM & THROUGHPUT SANDBOX ==================== */}
          {currentTab === 'sandbox' && (
            <div className="space-y-4">
              <div
                className={`rounded-xl border p-3 font-mono text-xs ${
                  isNight
                    ? 'border-violet-500/35 bg-violet-950/25 text-violet-200'
                    : 'border-violet-300 bg-violet-50 text-violet-900'
                }`}
              >
                Configure LLM parameter scale, quantization precision, context
                window, and batch size. Exceeding target GPU memory
                automatically triggers a live <strong>KV-Cache OOM</strong>{' '}
                bottleneck in the 3D city!
              </div>

              {/* OOM Alert Callout with 1-Click Auto-Fix */}
              {computedTelemetry.isVramOom && (
                <div className="rounded-2xl border border-rose-500/80 bg-rose-950/40 p-3.5 text-rose-100 shadow-lg shadow-rose-500/15">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-rose-400">
                    <AlertTriangle
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 animate-bounce"
                    />
                    <span>
                      GPU HBM OOM: {computedTelemetry.totalVramRequiredGb} GB
                      Required &gt; {vramConfig.gpuMemoryBudgetGb} GB Budget
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-rose-200">
                    District 7 (Inference Engine) is thrashing HBM memory
                    (Latency: {computedTelemetry.inferenceLatencyMs} ms). Apply
                    an architectural fix below:
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {vramConfig.quantization !== 'INT4_AWQ' && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateVramConfig({ quantization: 'INT4_AWQ' })
                        }
                        className="rounded-lg bg-cyan-400 px-2.5 py-1 font-mono text-[10px] font-bold text-slate-950 hover:bg-cyan-300 cursor-pointer"
                      >
                        Switch to INT4 AWQ (4x Compression)
                      </button>
                    )}
                    {vramConfig.contextLength > 4096 && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateVramConfig({ contextLength: 4096 })
                        }
                        className="rounded-lg border border-cyan-400/50 bg-cyan-500/20 px-2.5 py-1 font-mono text-[10px] font-semibold text-cyan-200 hover:bg-cyan-500/30 cursor-pointer"
                      >
                        Reduce Context to 4K
                      </button>
                    )}
                    {vramConfig.gpuMemoryBudgetGb < 640 && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateVramConfig({ gpuMemoryBudgetGb: 640 })
                        }
                        className="rounded-lg border border-violet-400/50 bg-violet-500/20 px-2.5 py-1 font-mono text-[10px] font-semibold text-violet-200 hover:bg-violet-500/30 cursor-pointer"
                      >
                        Scale to 8x H100 Node (640 GB)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Live VRAM Breakdown Meter */}
              <div
                className={`rounded-2xl border p-4 ${
                  isNight
                    ? 'border-slate-800 bg-slate-950/85'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold uppercase tracking-wider">
                    Total VRAM Footprint
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      computedTelemetry.isVramOom
                        ? 'text-rose-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    {computedTelemetry.totalVramRequiredGb} GB /{' '}
                    {vramConfig.gpuMemoryBudgetGb} GB (
                    {Math.round(
                      (computedTelemetry.totalVramRequiredGb /
                        vramConfig.gpuMemoryBudgetGb) *
                        100
                    )}
                    %)
                  </span>
                </div>

                {/* Segmented Bar: Weights + KV Cache */}
                <div
                  className={`mt-2.5 h-3 w-full overflow-hidden rounded-full flex ${
                    isNight ? 'bg-slate-800' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${weightsRatio}%` }}
                    title={`Model Weights: ${computedTelemetry.weightsVramGb} GB`}
                  />
                  <div
                    className={`h-full transition-all duration-300 ${
                      computedTelemetry.isVramOom
                        ? 'bg-rose-500'
                        : 'bg-violet-500'
                    }`}
                    style={{ width: `${kvRatio}%` }}
                    title={`KV-Cache: ${computedTelemetry.kvCacheVramGb} GB`}
                  />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 font-mono text-[11px]">
                  <div
                    className={`rounded-xl border p-2 ${
                      isNight
                        ? 'border-slate-800 bg-slate-900/70'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="block text-[9px] uppercase text-cyan-400">
                      Weights VRAM
                    </span>
                    <span className="font-bold">
                      {computedTelemetry.weightsVramGb} GB
                    </span>
                  </div>
                  <div
                    className={`rounded-xl border p-2 ${
                      isNight
                        ? 'border-slate-800 bg-slate-900/70'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="block text-[9px] uppercase text-violet-400">
                      KV-Cache VRAM
                    </span>
                    <span className="font-bold">
                      {computedTelemetry.kvCacheVramGb} GB
                    </span>
                  </div>
                  <div
                    className={`rounded-xl border p-2 ${
                      isNight
                        ? 'border-slate-800 bg-slate-900/70'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="block text-[9px] uppercase text-amber-400">
                      Decode Latency
                    </span>
                    <span className="font-bold">
                      {computedTelemetry.inferenceLatencyMs} ms
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. Model Parameter Scale */}
              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight
                    ? 'border-slate-800 bg-slate-950/75'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <span className="block font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                  1. Foundation Model Scale (Parameters)
                </span>
                <div className="grid grid-cols-5 gap-1.5">
                  {PARAM_OPTIONS.map((p) => {
                    const active = vramConfig.parameterCountBillion === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() =>
                          onUpdateVramConfig({ parameterCountBillion: p })
                        }
                        className={`rounded-xl border py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                          active
                            ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-sm'
                            : isNight
                            ? 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {p}B
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Quantization Precision */}
              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight
                    ? 'border-slate-800 bg-slate-950/75'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <span className="block font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                  2. Weight &amp; KV Quantization Precision
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {QUANT_OPTIONS.map((q) => {
                    const active = vramConfig.quantization === q.id;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => onUpdateVramConfig({ quantization: q.id })}
                        className={`rounded-xl border p-2 text-left font-mono transition-all cursor-pointer ${
                          active
                            ? 'border-cyan-400 bg-cyan-400 text-slate-950 font-bold'
                            : isNight
                            ? 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="text-xs font-bold">{q.label}</div>
                        <div
                          className={`text-[10px] ${
                            active ? 'text-slate-900' : 'opacity-70'
                          }`}
                        >
                          {q.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Context Window & 4. Batch Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className={`rounded-2xl border p-3.5 ${
                    isNight
                      ? 'border-slate-800 bg-slate-950/75'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                    3. Context Window Length
                  </span>
                  <div className="grid grid-cols-4 gap-1">
                    {CONTEXT_OPTIONS.map((c) => {
                      const active = vramConfig.contextLength === c.value;
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() =>
                            onUpdateVramConfig({ contextLength: c.value })
                          }
                          className={`rounded-lg border py-1.5 font-mono text-xs font-bold transition-all cursor-pointer ${
                            active
                              ? 'border-violet-400 bg-violet-400 text-slate-950'
                              : isNight
                              ? 'border-slate-800 bg-slate-900 text-slate-300'
                              : 'border-slate-200 bg-slate-50 text-slate-700'
                          }`}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className={`rounded-2xl border p-3.5 ${
                    isNight
                      ? 'border-slate-800 bg-slate-950/75'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span>4. Concurrent Batch Size</span>
                    <span className="text-cyan-400">
                      {vramConfig.batchSize} seqs
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={64}
                    value={vramConfig.batchSize}
                    onChange={(e) =>
                      onUpdateVramConfig({
                        batchSize: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    aria-label="Concurrent Batch Size"
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[9px] opacity-65">
                    <span>1</span>
                    <span>16</span>
                    <span>32</span>
                    <span>64</span>
                  </div>
                </div>
              </div>

              {/* 5. Target GPU Cluster */}
              <div
                className={`rounded-2xl border p-3.5 ${
                  isNight
                    ? 'border-slate-800 bg-slate-950/75'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <span className="block font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                  5. Target GPU Cluster Hardware Budget
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {GPU_CLUSTER_OPTIONS.map((gpu) => {
                    const active = vramConfig.gpuMemoryBudgetGb === gpu.value;
                    return (
                      <button
                        key={gpu.value}
                        type="button"
                        onClick={() =>
                          onUpdateVramConfig({ gpuMemoryBudgetGb: gpu.value })
                        }
                        className={`rounded-xl border px-3 py-1.5 text-left font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                          active
                            ? 'border-cyan-400 bg-cyan-400 text-slate-950 font-bold'
                            : isNight
                            ? 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        {gpu.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================== DRAWER FOOTER ==================== */}
        <div
          className={`shrink-0 border-t px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] ${
            isNight
              ? 'border-slate-800/90 bg-slate-950/80 text-slate-400'
              : 'border-slate-200 bg-slate-100 text-slate-600'
          }`}
        >
          <span>
            Shortcuts: [1–8] District · [B] Blueprint · [←/→] Nav · [Esc] Close
          </span>
          <span>
            VRAM: {computedTelemetry.totalVramRequiredGb}/
            {vramConfig.gpuMemoryBudgetGb} GB · {cityDistrict.metrics.throughput}
          </span>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
