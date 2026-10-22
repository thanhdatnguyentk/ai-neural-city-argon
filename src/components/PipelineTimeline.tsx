'use client';

import React from 'react';
import {
  ArrowRight,
  Cpu,
  Database,
  Eye,
  MessageSquare,
  Network,
  Radio,
  Sparkles,
  Terminal,
  Layers,
  Activity,
  Gauge,
} from 'lucide-react';
import {
  PIPELINE_STEPS,
  DISTRICTS,
  DistrictId,
  PipelineStageId,
} from '@/data/districts';
import {
  CANONICAL_DISTRICT_SPECS,
  ARCHITECTURAL_PIPELINE_MODES,
  ARCHITECTURAL_MODE_MAP,
} from '@/data/pipeline-modes';
import type {
  ArchitecturalPipelineModeId,
  HardwareBottleneckClass,
} from '@/types/pipeline-modes';
import type { ProgressStats } from '@/hooks/useRoadmapProgress';
import { useLanguage } from '@/context/LanguageContext';

interface PipelineTimelineProps {
  activeStage: PipelineStageId;
  selectedDistrict: DistrictId | null;
  activePipelineMode?: ArchitecturalPipelineModeId;
  isNight: boolean;
  getDistrictProgress?: (districtId: DistrictId) => ProgressStats;
  onSelectStage: (stageId: PipelineStageId, districtId: DistrictId) => void;
  onSelectPipelineMode?: (mode: ArchitecturalPipelineModeId) => void;
  onSelectDistrictAndScroll: (districtId: DistrictId) => void;
  onOpenRoadmapDrawer?: (districtId: DistrictId) => void;
}

const DISTRICT_ICONS: Record<DistrictId, React.ReactNode> = {
  'input-gateway': <Radio aria-hidden="true" className="h-4 w-4" />,
  'data-lake': <Database aria-hidden="true" className="h-4 w-4" />,
  'training-cluster': <Cpu aria-hidden="true" className="h-4 w-4" />,
  'model-core': <Network aria-hidden="true" className="h-4 w-4" />,
  'inference-center': <Sparkles aria-hidden="true" className="h-4 w-4" />,
  'nlp-district': <MessageSquare aria-hidden="true" className="h-4 w-4" />,
  'computer-vision': <Eye aria-hidden="true" className="h-4 w-4" />,
  'output-terminal': <Terminal aria-hidden="true" className="h-4 w-4" />,
};

function getBottleneckBadgeStyle(
  bottleneckClass: HardwareBottleneckClass,
  isNight: boolean
): string {
  if (bottleneckClass === 'COMPUTE-BOUND (TFLOPs)') {
    return isNight
      ? 'border-fuchsia-400/60 bg-fuchsia-500/20 text-fuchsia-200'
      : 'border-fuchsia-600/40 bg-fuchsia-100 text-fuchsia-950';
  }
  if (bottleneckClass === 'MEMORY-BANDWIDTH-BOUND (HBM GB/s)') {
    return isNight
      ? 'border-amber-400/60 bg-amber-500/20 text-amber-200'
      : 'border-amber-600/40 bg-amber-100 text-amber-950';
  }
  return isNight
    ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-200'
    : 'border-cyan-600/40 bg-cyan-100 text-cyan-950';
}

export const PipelineTimeline: React.FC<PipelineTimelineProps> = ({
  activeStage,
  selectedDistrict,
  activePipelineMode = 'online-inference',
  isNight,
  getDistrictProgress,
  onSelectStage,
  onSelectPipelineMode,
  onSelectDistrictAndScroll,
  onOpenRoadmapDrawer,
}) => {
  const { t } = useLanguage();
  const wt = t.ui.walkthrough;
  const currentStep =
    PIPELINE_STEPS.find((s) => s.id === activeStage) || PIPELINE_STEPS[0];
  const currentLocalizedStage = t.pipelineStages[currentStep.id];
  const currentLocalizedDistrict = t.districts[currentStep.districtId];
  const currentTechSpec = CANONICAL_DISTRICT_SPECS[currentStep.districtId];
  const modeSpec =
    ARCHITECTURAL_MODE_MAP[activePipelineMode] ||
    ARCHITECTURAL_MODE_MAP['online-inference'];
  const locModeSpec = t.pipelineModes[activePipelineMode];
  const isCurrentStandby = modeSpec.standbyDistricts.includes(
    currentStep.districtId
  );

  return (
    <section
      id="ai-pipeline-section"
      aria-labelledby="pipeline-heading"
      className={`relative border-t py-16 px-4 sm:px-6 lg:px-10 transition-colors ${
        isNight
          ? 'border-slate-800/80 bg-[#050A19] text-slate-100'
          : 'border-slate-200 bg-slate-50 text-slate-900'
      }`}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header + 3-Mode Architectural Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest ${
                isNight
                  ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                  : 'border-cyan-600/30 bg-cyan-50 text-cyan-800'
              }`}
            >
              {wt.sectionBadge} ({t.nativeLabel})
            </span>
            <h2
              id="pipeline-heading"
              className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight"
            >
              {t.hero.title} — {t.header.navPipeline} (D1–D8)
            </h2>
            <p
              className={`mt-1.5 max-w-2xl text-sm ${
                isNight ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {wt.sectionSubtitle}
            </p>
          </div>

          {/* 3-Mode Architectural Switcher */}
          <div className="flex flex-col items-start lg:items-end gap-2">
            <span
              className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
                isNight ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {wt.selectModeLabel}
            </span>
            <div
              role="tablist"
              aria-label="Architectural Pipeline Modes"
              className={`inline-flex flex-wrap items-center gap-1.5 rounded-2xl border p-1.5 ${
                isNight
                  ? 'border-slate-800 bg-slate-950/90'
                  : 'border-slate-300 bg-white shadow-sm'
              }`}
            >
              {ARCHITECTURAL_PIPELINE_MODES.map((m) => {
                const isSelectedMode = m.id === activePipelineMode;
                const locM = t.pipelineModes[m.id];
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelectedMode}
                    onClick={() => onSelectPipelineMode?.(m.id)}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      isSelectedMode
                        ? m.id === 'online-inference'
                          ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
                          : m.id === 'offline-indexing'
                          ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-fuchsia-400 text-slate-950 shadow-md shadow-fuchsia-500/20'
                        : isNight
                        ? 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                  >
                    <Activity aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{locM?.shortLabel || m.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Mode Directed Path Banner */}
        <div
          className={`mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border px-4 py-2.5 font-mono text-xs ${
            isNight
              ? 'border-cyan-500/30 bg-slate-900/80 text-cyan-300'
              : 'border-cyan-600/30 bg-cyan-50/70 text-cyan-900'
          }`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-300">
              {locModeSpec?.title || modeSpec.title}
            </span>
            <span className="font-bold">{modeSpec.directedFlowSummary}</span>
          </div>
          <span
            className={`text-[11px] ${
              isNight ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {locModeSpec?.workloadExample || modeSpec.workloadExample}
          </span>
        </div>

        {/* Interactive 8-District Canonical Pipeline Bar (D1-D8) */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {PIPELINE_STEPS.map((step, idx) => {
            const isActive = activeStage === step.id;
            const locStage = t.pipelineStages[step.id];
            const spec = CANONICAL_DISTRICT_SPECS[step.districtId];
            const isStandby = modeSpec.standbyDistricts.includes(step.districtId);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStage(step.id, step.districtId)}
                aria-pressed={isActive}
                className={`group relative flex flex-col justify-between rounded-2xl border p-3 text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  isActive
                    ? isNight
                      ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/15'
                      : 'border-cyan-600 bg-cyan-50/90 shadow-md'
                    : isStandby
                    ? isNight
                      ? 'border-slate-800/70 bg-slate-950/50 opacity-60 hover:opacity-95'
                      : 'border-slate-200 bg-slate-100/70 opacity-65 hover:opacity-95'
                    : isNight
                    ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`inline-flex h-6 px-1.5 items-center justify-center rounded-md font-mono text-[11px] font-bold ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950'
                        : isStandby
                        ? isNight
                          ? 'bg-slate-800/80 text-slate-500'
                          : 'bg-slate-200 text-slate-500'
                        : isNight
                        ? 'bg-slate-800 text-cyan-300'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {spec.code}
                  </span>
                  {isStandby ? (
                    <span className="rounded border border-slate-600/60 px-1 py-0.2 font-mono text-[8px] uppercase text-slate-400">
                      {wt.standbyLabel}
                    </span>
                  ) : (
                    idx < PIPELINE_STEPS.length - 1 && (
                      <ArrowRight
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 ${
                          isActive
                            ? isNight
                              ? 'text-cyan-400'
                              : 'text-cyan-700'
                            : 'text-slate-500'
                        }`}
                      />
                    )
                  )}
                </div>

                <div className="mt-2.5">
                  <div
                    className={`font-mono text-[11px] font-bold uppercase tracking-wider truncate ${
                      isNight ? 'text-cyan-400' : 'text-cyan-800'
                    }`}
                  >
                    {locStage?.label || step.label}
                  </div>
                  <p
                    className={`mt-1 text-[11px] line-clamp-2 ${
                      isNight ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {locStage?.summary || step.summary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active District Dual-Layer Technical Spec Card */}
        <div
          className={`mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl border p-6 ${
            isNight
              ? 'border-slate-800 bg-[#081126]/90'
              : 'border-slate-200 bg-white shadow-sm'
          }`}
        >
          {/* Left Column: Layer 1 — Architectural Role Summary & Hardware Bottleneck Badge */}
          <div className="lg:col-span-6 space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`font-mono text-xs uppercase font-bold ${
                  isNight ? 'text-cyan-400' : 'text-cyan-700'
                }`}
              >
                {currentTechSpec.code} / D8 •{' '}
                {currentLocalizedDistrict?.name || currentTechSpec.canonicalName}
              </span>
              {isCurrentStandby ? (
                <span className="rounded-md border border-amber-400/60 bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-amber-200">
                  [{locModeSpec?.standbyBadgeText || modeSpec.standbyBadgeText}]
                </span>
              ) : (
                <span className="rounded-md border border-emerald-400/50 bg-emerald-500/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-emerald-300">
                  [{wt.activeInModePrefix}{' '}
                  {(locModeSpec?.shortLabel || modeSpec.shortLabel).toUpperCase()}]
                </span>
              )}
            </div>

            <h3 className="text-xl font-bold">
              {currentLocalizedStage?.title || currentStep.title}
            </h3>

            {/* Mode-Specific Role Box */}
            <div
              className={`rounded-xl border p-3.5 ${
                isNight
                  ? 'border-cyan-500/30 bg-slate-900/80 text-slate-200'
                  : 'border-cyan-600/30 bg-cyan-50/60 text-slate-800'
              }`}
            >
              <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                {wt.archRoleInPrefix} {locModeSpec?.title || modeSpec.title}:
              </div>
              <p className="mt-1 text-xs leading-relaxed">
                {currentLocalizedDistrict?.modeRoleSummaries?.[
                  activePipelineMode
                ] || currentTechSpec.modeRoleSummary[activePipelineMode]}
              </p>
            </div>

            <p
              className={`text-sm leading-relaxed ${
                isNight ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {currentLocalizedStage?.plainExplanation ||
                currentStep.plainExplanation}
            </p>

            {/* Hardware Bottleneck Badge */}
            <div className="pt-1 flex flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${getBottleneckBadgeStyle(
                    currentTechSpec.hardwareBottleneckBadge,
                    isNight
                  )}`}
                >
                  <Gauge aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>[{currentTechSpec.hardwareBottleneckBadge}]</span>
                </span>
              </div>
              <p
                className={`font-mono text-[11px] ${
                  isNight ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {wt.rooflineConstraint}: {currentTechSpec.dominantHardwareBound}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onSelectDistrictAndScroll(currentStep.districtId)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>
                  {wt.inspectIn3dPrefix} ({currentTechSpec.code})
                </span>
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
              {onOpenRoadmapDrawer && (
                <button
                  type="button"
                  onClick={() => onOpenRoadmapDrawer(currentStep.districtId)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isNight
                      ? 'border-violet-400/50 bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 hover:text-white'
                      : 'border-violet-600/40 bg-violet-50 text-violet-900 hover:bg-violet-100'
                  }`}
                >
                  <Layers aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>{wt.viewRoadmapBtn}</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Layer 2 — Wire Protocol & Tensor Specification (Monospace Spec Box) */}
          <div
            className={`lg:col-span-6 flex flex-col justify-between rounded-xl border p-4 font-mono ${
              isNight
                ? 'border-cyan-500/35 bg-slate-950/95 text-slate-100'
                : 'border-slate-300 bg-slate-900 text-slate-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                  <Terminal aria-hidden="true" className="h-4 w-4" />
                  <span>{wt.specBoxTitle}</span>
                </div>
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                  {currentTechSpec.code} SPEC
                </span>
              </div>

              <div className="mt-3 space-y-2.5 text-xs">
                <div className="rounded-lg border border-slate-800/90 bg-slate-900/90 p-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">
                    {wt.protocolAndTensorLabel}
                  </div>
                  <div className="mt-1 text-cyan-300 font-semibold break-words leading-relaxed">
                    {currentTechSpec.wireProtocolAndTensorSpec}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800/90 bg-slate-900/90 p-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">
                    {wt.coreResponsibilityLabel}
                  </div>
                  <div className="mt-0.5 text-emerald-300 font-semibold break-words">
                    {currentLocalizedDistrict?.domainTitle ||
                      currentTechSpec.coreResponsibility}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800/90 bg-slate-900/90 p-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">
                    {wt.productionStackLabel}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {currentTechSpec.primaryProductionStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-violet-500/40 bg-violet-500/15 px-2 py-0.5 text-[10px] font-bold text-violet-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800/90 bg-slate-900/90 p-2.5">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400">
                    {wt.hardwareBoundLabel}
                  </div>
                  <div className="mt-0.5 text-amber-300 font-semibold break-words">
                    {currentTechSpec.dominantHardwareBound} · [
                    {currentTechSpec.hardwareBottleneckBadge}]
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>{wt.canonicalStageMapping}</span>
              <span className="font-bold text-cyan-400">
                {currentTechSpec.code} ({currentStep.id})
              </span>
            </div>
          </div>
        </div>

        {/* Complete 8-District Directory Grid */}
        <div className="mt-10">
          <h3
            className={`font-mono text-xs font-semibold uppercase tracking-wider mb-4 ${
              isNight ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {wt.all8Heading}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {DISTRICTS.map((district) => {
              const isSelected = selectedDistrict === district.id;
              const locDistrict = t.districts[district.id];
              const spec = CANONICAL_DISTRICT_SPECS[district.id];
              const isStandby = modeSpec.standbyDistricts.includes(district.id);
              const progress = getDistrictProgress
                ? getDistrictProgress(district.id)
                : null;
              return (
                <div
                  key={district.id}
                  className={`group flex flex-col justify-between rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? isNight
                        ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/10'
                        : 'border-cyan-600 bg-cyan-50'
                      : isNight
                      ? 'border-slate-800/90 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-slate-900'
                      : 'border-slate-200 bg-white hover:border-cyan-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="inline-flex items-center justify-center rounded-lg p-2"
                        style={{
                          backgroundColor: `${district.accentColor}20`,
                          color: isNight ? district.accentColor : '#0F172A',
                        }}
                      >
                        {DISTRICT_ICONS[district.id]}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {isStandby && (
                          <span className="rounded border border-slate-600/80 bg-slate-800/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-400">
                            {wt.standbyLabel}
                          </span>
                        )}
                        {progress && (
                          <span
                            className={`rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                              progress.completed === progress.total
                                ? isNight
                                  ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-300'
                                  : 'border-emerald-600/40 bg-emerald-100 text-emerald-900'
                                : isNight
                                ? 'border-slate-700 bg-slate-800/80 text-slate-300'
                                : 'border-slate-300 bg-slate-100 text-slate-700'
                            }`}
                          >
                            {progress.completed}/{progress.total}
                          </span>
                        )}
                        <span
                          className={`font-mono text-[10px] uppercase font-semibold ${
                            isNight ? 'text-amber-400' : 'text-amber-700'
                          }`}
                        >
                          {spec.code} · {district.metrics.throughput}
                        </span>
                      </div>
                    </div>
                    <h4
                      className={`mt-3 font-semibold text-sm transition-colors ${
                        isNight
                          ? 'group-hover:text-cyan-400'
                          : 'group-hover:text-cyan-700'
                      }`}
                    >
                      {locDistrict?.name || district.name}
                    </h4>
                    <p
                      className={`mt-1 text-xs leading-relaxed ${
                        isNight ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {locDistrict?.tagline || district.tagline}
                    </p>
                  </div>

                  <div
                    className={`mt-3.5 pt-2.5 border-t flex flex-col gap-2 ${
                      isNight ? 'border-slate-800/60' : 'border-slate-200'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between font-mono text-[10px] ${
                        isNight ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      <span>{district.metrics.activeUnits}</span>
                      <button
                        type="button"
                        onClick={() => onSelectDistrictAndScroll(district.id)}
                        className={`font-semibold hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded px-1 ${
                          isNight ? 'text-cyan-400' : 'text-cyan-700'
                        }`}
                      >
                        {wt.focus3dBtn}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onOpenRoadmapDrawer
                          ? onOpenRoadmapDrawer(district.id)
                          : onSelectDistrictAndScroll(district.id)
                      }
                      className={`w-full inline-flex items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 font-mono text-[10px] font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        isNight
                          ? 'border-cyan-500/35 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:text-white'
                          : 'border-cyan-600/35 bg-cyan-50 text-cyan-900 hover:bg-cyan-100'
                      }`}
                    >
                      <Layers aria-hidden="true" className="h-3 w-3" />
                      <span>{t.header.btnRoadmap}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
