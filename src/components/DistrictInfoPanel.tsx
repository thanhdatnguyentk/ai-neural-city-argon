'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  Cpu,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Share2,
  Layers,
} from 'lucide-react';
import {
  DISTRICTS,
  DISTRICT_MAP,
  DistrictData,
  DistrictId,
} from '@/data/districts';
import type { ProgressStats } from '@/hooks/useRoadmapProgress';
import { useLanguage } from '@/context/LanguageContext';

interface DistrictInfoPanelProps {
  district: DistrictData | null;
  isFlowHighlighted: boolean;
  isNight: boolean;
  districtProgress?: ProgressStats;
  onClose: () => void;
  onToggleDataFlow: (id: DistrictId) => void;
  onSelectDistrict: (id: DistrictId) => void;
  onOpenDeepDiveDrawer?: () => void;
}

export const DistrictInfoPanel: React.FC<DistrictInfoPanelProps> = ({
  district,
  isFlowHighlighted,
  isNight,
  districtProgress,
  onClose,
  onToggleDataFlow,
  onSelectDistrict,
  onOpenDeepDiveDrawer,
}) => {
  const { t } = useLanguage();
  if (!district) return null;

  const locDistrict = t.districts[district.id];
  const currentIndex = DISTRICTS.findIndex((d) => d.id === district.id);
  const prevDistrict =
    DISTRICTS[(currentIndex - 1 + DISTRICTS.length) % DISTRICTS.length];
  const nextDistrict = DISTRICTS[(currentIndex + 1) % DISTRICTS.length];

  return (
    <AnimatePresence mode="wait">
      <motion.aside
        key={district.id}
        initial={{ opacity: 0, x: 24, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 24, scale: 0.98 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        aria-label={`${locDistrict?.name || district.name} details`}
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className={`pointer-events-auto w-full max-w-[390px] rounded-2xl p-4 sm:p-5 transition-colors ${
          isNight
            ? 'hud-glass-dark text-slate-100'
            : 'hud-glass-light text-slate-900'
        }`}
      >
        {/* Top Header: Status Indicator + Close */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider uppercase ${
                  isNight
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                    : 'border-amber-600/40 bg-amber-100 text-amber-900'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"
                />
                {district.statusText}
              </span>
              <span
                className={`font-mono text-[10px] ${
                  isNight ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                D{currentIndex + 1}/D{DISTRICTS.length}
              </span>
            </div>
            <h2 className="mt-2 text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
              <span
                aria-hidden="true"
                className="inline-block h-3 w-3 rounded-full shrink-0"
                style={{
                  backgroundColor: district.accentColor,
                  boxShadow: `0 0 10px ${district.accentColor}`,
                }}
              />
              {locDistrict?.name || district.name}
            </h2>
            <p
              className={`mt-0.5 text-xs ${
                isNight ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {locDistrict?.tagline || district.tagline}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close district details"
            className={`rounded-lg border p-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              isNight
                ? 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-cyan-400 hover:text-white'
                : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {/* Metrics Row */}
        <div
          className={`mt-3.5 grid grid-cols-3 gap-2 rounded-xl border p-2.5 font-mono text-xs ${
            isNight
              ? 'border-slate-800 bg-slate-950/75'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div>
            <span
              className={`block text-[10px] uppercase ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {t.ui.districtPanel.throughput}
            </span>
            <span
              className={`font-semibold ${
                isNight ? 'text-cyan-400' : 'text-cyan-700'
              }`}
            >
              {district.metrics.throughput}
            </span>
          </div>
          <div>
            <span
              className={`block text-[10px] uppercase ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {t.ui.districtPanel.capacity}
            </span>
            <span className="font-semibold">{district.metrics.activeUnits}</span>
          </div>
          <div>
            <span
              className={`block text-[10px] uppercase ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {t.ui.districtPanel.load}
            </span>
            <span
              className={`font-semibold ${
                isNight ? 'text-amber-400' : 'text-amber-700'
              }`}
            >
              {district.metrics.utilization}%
            </span>
          </div>
        </div>

        {/* Role in the AI Pipeline & Plain Language Explanation */}
        <div className="mt-3.5 space-y-2.5 text-xs leading-relaxed">
          <div>
            <h3
              className={`font-mono text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                isNight ? 'text-cyan-400' : 'text-cyan-700'
              }`}
            >
              <Cpu aria-hidden="true" className="h-3.5 w-3.5" />
              {t.ui.districtPanel.roleHeading}
            </h3>
            <p
              className={`mt-1 ${
                isNight ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              {locDistrict?.roleInPipeline || district.roleInPipeline}
            </p>
          </div>

          <div
            className={`rounded-xl border p-2.5 ${
              isNight
                ? 'border-violet-500/25 bg-violet-950/25 text-slate-200'
                : 'border-violet-300 bg-violet-50 text-slate-800'
            }`}
          >
            <div
              className={`flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                isNight ? 'text-violet-300' : 'text-violet-800'
              }`}
            >
              <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
              {t.ui.districtPanel.plainLanguageHeading} · {district.technicalTerm.term}
            </div>
            <p className="mt-1 text-[11px] leading-relaxed">
              {locDistrict?.plainLanguageExplanation ||
                district.plainLanguageExplanation}
            </p>
          </div>
        </div>

        {/* Example Input & Output */}
        <div className="mt-3.5 space-y-2">
          <div
            className={`rounded-xl border p-2.5 ${
              isNight
                ? 'border-slate-800 bg-slate-950/85'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <span
              className={`font-mono text-[10px] font-semibold uppercase tracking-wider ${
                isNight ? 'text-cyan-400' : 'text-cyan-700'
              }`}
            >
              {t.ui.districtPanel.exampleInput}
            </span>
            <p
              className={`mt-0.5 font-mono text-[11px] break-words ${
                isNight ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              {district.exampleInput}
            </p>
          </div>

          <div
            className={`rounded-xl border p-2.5 ${
              isNight
                ? 'border-slate-800 bg-slate-950/85'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <span
              className={`font-mono text-[10px] font-semibold uppercase tracking-wider ${
                isNight ? 'text-violet-400' : 'text-violet-700'
              }`}
            >
              {t.ui.districtPanel.exampleOutput}
            </span>
            <p
              className={`mt-0.5 font-mono text-[11px] break-words ${
                isNight ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              {district.exampleOutput}
            </p>
          </div>
        </div>

        {/* Connected Pathways Quick Links */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span
            className={`font-mono text-[10px] uppercase mr-1 ${
              isNight ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {t.ui.districtPanel.routesTo}
          </span>
          {district.connectsTo.length > 0 ? (
            district.connectsTo.map((targetId) => {
              const target = DISTRICT_MAP[targetId];
              const locTarget = t.districts[targetId];
              return (
                <button
                  key={targetId}
                  type="button"
                  onClick={() => onSelectDistrict(targetId)}
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isNight
                      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                      : 'border-cyan-600/30 bg-cyan-50 text-cyan-800 hover:bg-cyan-100'
                  }`}
                >
                  {locTarget?.shortName || target.shortName}
                  <ArrowRight aria-hidden="true" className="h-2.5 w-2.5" />
                </button>
              );
            })
          ) : (
            <span
              className={`font-mono text-[10px] font-semibold ${
                isNight ? 'text-amber-400' : 'text-amber-700'
              }`}
            >
              {t.ui.districtPanel.finalDelivery}
            </span>
          )}
        </div>

        {/* Deep-Dive Zero-to-Hero Roadmap & Landmarks CTA */}
        {onOpenDeepDiveDrawer && (
          <div className="mt-3.5">
            <button
              type="button"
              onClick={onOpenDeepDiveDrawer}
              className="w-full inline-flex items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400 px-3.5 py-2.5 font-mono text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:brightness-110 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <span className="inline-flex items-center gap-1.5">
                <Layers aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span>{t.ui.districtPanel.exploreRoadmapBtn}</span>
              </span>
              {districtProgress && (
                <span className="rounded-md bg-slate-950/20 px-1.5 py-0.5 text-[10px]">
                  {districtProgress.completed}/{districtProgress.total}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Action Row: Show Data Flow + Prev/Next */}
        <div
          className={`mt-3 flex items-center justify-between gap-2 pt-3 border-t ${
            isNight ? 'border-slate-800/80' : 'border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={() => onToggleDataFlow(district.id)}
            aria-pressed={isFlowHighlighted}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              isFlowHighlighted
                ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/30'
                : isNight
                ? 'border border-cyan-400/50 bg-cyan-500/15 text-cyan-300 hover:bg-cyan-500/25'
                : 'border border-cyan-600/40 bg-cyan-50 text-cyan-900 hover:bg-cyan-100'
            }`}
          >
            <Share2 aria-hidden="true" className="h-3.5 w-3.5" />
            {isFlowHighlighted
              ? t.ui.districtPanel.showingDataFlow
              : t.ui.districtPanel.showDataFlow}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelectDistrict(prevDistrict.id)}
              title={`${t.ui.districtPanel.prev}: ${t.districts[prevDistrict.id]?.name || prevDistrict.name}`}
              aria-label={`Select previous district: ${prevDistrict.name}`}
              className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-2 font-mono text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isNight
                  ? 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-cyan-400 hover:text-white'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">
                {t.ui.districtPanel.prev}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectDistrict(nextDistrict.id)}
              title={`${t.ui.districtPanel.next}: ${t.districts[nextDistrict.id]?.name || nextDistrict.name}`}
              aria-label={`Select next district: ${nextDistrict.name}`}
              className={`inline-flex items-center gap-1 rounded-xl border px-2.5 py-2 font-mono text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isNight
                  ? 'border-slate-700 bg-slate-900/80 text-slate-300 hover:border-cyan-400 hover:text-white'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span className="sr-only sm:not-sr-only">
                {t.ui.districtPanel.next}
              </span>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
