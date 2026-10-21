'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import {
  DISTRICTS,
  DISTRICT_MAP,
  DistrictId,
} from '../data/districts';
import { getDistrictDeepDive } from '../data/district-roadmaps.ts';
import type {
  LandmarkCategory,
  RoadmapMilestone,
  LandmarkWork,
} from '../types/district-roadmap';
import type { ProgressStats } from '../hooks/useRoadmapProgress.ts';

export type DeepDiveTab = 'roadmap' | 'landmarks';

export interface DistrictDeepDiveDrawerProps {
  districtId: DistrictId | null;
  isOpen: boolean;
  isNight: boolean;
  isFlowHighlighted: boolean;
  isCompleted: (milestoneId: string) => boolean;
  onToggleMilestone: (milestoneId: string) => void;
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

export const DistrictDeepDiveDrawer: React.FC<DistrictDeepDiveDrawerProps> = ({
  districtId,
  isOpen,
  isNight,
  isFlowHighlighted,
  isCompleted,
  onToggleMilestone,
  getDistrictProgress,
  getTotalCityMastery,
  onClose,
  onMinimizeToCompactHud,
  onSelectDistrict,
  onToggleDataFlow,
}) => {
  const [activeTab, setActiveTab] = useState<DeepDiveTab>('roadmap');

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
        aria-label={`${deepDive.districtName} Zero-to-Hero Roadmap and Landmarks`}
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
          className={`shrink-0 border-b p-4 sm:p-5 ${
            isNight
              ? 'border-slate-800/90 bg-slate-950/60'
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
                className={`font-mono text-[10px] uppercase tracking-wider ${
                  isNight ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {deepDive.pipelineStageName}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
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
          <div className="mt-2.5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
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
                className={`mt-0.5 text-xs leading-relaxed ${
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
            className={`mt-3 rounded-xl border p-2.5 ${
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
              <span
                className={`${
                  isNight ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                City Total: {cityMastery.completed}/{cityMastery.total} (
                {cityMastery.percentage}%)
              </span>
            </div>
            <div
              className={`mt-1.5 h-2 w-full overflow-hidden rounded-full ${
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

          {/* Interactive Tab Switcher */}
          <div
            role="tablist"
            aria-label="District Deep-Dive Views"
            className={`mt-3 grid grid-cols-2 gap-1.5 rounded-xl p-1 font-mono text-xs ${
              isNight ? 'bg-slate-900/90' : 'bg-slate-200/80'
            }`}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'roadmap'}
              onClick={() => setActiveTab('roadmap')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                activeTab === 'roadmap'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : isNight
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Layers aria-hidden="true" className="h-3.5 w-3.5" />
              <span>01 · Zero-to-Hero Roadmap</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'landmarks'}
              onClick={() => setActiveTab('landmarks')}
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                activeTab === 'landmarks'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : isNight
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-700 hover:text-slate-950'
              }`}
            >
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              <span>02 · Hall of Breakthroughs ({sortedLandmarks.length})</span>
            </button>
          </div>
        </div>

        {/* ==================== SCROLLABLE BODY ==================== */}
        <div
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4"
        >
          {activeTab === 'roadmap' ? (
            <div className="relative space-y-4">
              {deepDive.roadmap.map((milestone: RoadmapMilestone, idx: number) => {
                const completed = isCompleted(milestone.id);
                return (
                  <div
                    key={milestone.id}
                    className={`relative rounded-2xl border p-4 transition-all ${
                      completed
                        ? isNight
                          ? 'border-emerald-400/70 bg-emerald-950/20 shadow-lg shadow-emerald-500/10'
                          : 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                        : isNight
                        ? 'border-slate-800 bg-slate-950/75 hover:border-slate-700'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {/* Vertical timeline connector line */}
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

                    {/* Top Row: Tier Badge + Interactive Completion Checkbox */}
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

                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={completed}
                        onClick={() => onToggleMilestone(milestone.id)}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 font-mono text-[11px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
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
                          <Circle aria-hidden="true" className="h-3.5 w-3.5" />
                        )}
                        <span>{completed ? 'Completed' : 'Mark Completed'}</span>
                      </button>
                    </div>

                    {/* Milestone Title & Summary */}
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
                        <Terminal aria-hidden="true" className="h-3.5 w-3.5" />
                        <span>Capstone Deliverable</span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed font-medium">
                        {milestone.capstoneDeliverable}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ==================== TAB 2: HALL OF BREAKTHROUGHS ==================== */
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
                        isNight ? 'text-cyan-400' : 'text-cyan-800 font-semibold'
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
            Shortcuts: [1–8] Switch District · [←/→] Prev/Next · [Esc] Close
          </span>
          <span>
            Throughput: {cityDistrict.metrics.throughput} ·{' '}
            {cityDistrict.metrics.activeUnits}
          </span>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
