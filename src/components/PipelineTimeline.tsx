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
  BookOpen,
} from 'lucide-react';
import {
  PIPELINE_STEPS,
  DISTRICTS,
  DistrictId,
  PipelineStageId,
} from '@/data/districts';

interface PipelineTimelineProps {
  activeStage: PipelineStageId;
  selectedDistrict: DistrictId | null;
  isNight: boolean;
  onSelectStage: (stageId: PipelineStageId, districtId: DistrictId) => void;
  onSelectDistrictAndScroll: (districtId: DistrictId) => void;
}

const DISTRICT_ICONS: Record<DistrictId, React.ReactNode> = {
  'input-gateway': <Radio className="h-4 w-4" />,
  'data-lake': <Database className="h-4 w-4" />,
  'computer-vision': <Eye className="h-4 w-4" />,
  'nlp-district': <MessageSquare className="h-4 w-4" />,
  'training-cluster': <Cpu className="h-4 w-4" />,
  'model-core': <Network className="h-4 w-4" />,
  'inference-center': <Sparkles className="h-4 w-4" />,
  'output-terminal': <Terminal className="h-4 w-4" />,
};

export const PipelineTimeline: React.FC<PipelineTimelineProps> = ({
  activeStage,
  selectedDistrict,
  isNight,
  onSelectStage,
  onSelectDistrictAndScroll,
}) => {
  const currentStep =
    PIPELINE_STEPS.find((s) => s.id === activeStage) || PIPELINE_STEPS[0];

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
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest text-cyan-400">
              AI Architecture Walkthrough
            </span>
            <h2
              id="pipeline-heading"
              className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight"
            >
              How Information Becomes Intelligence
            </h2>
            <p
              className={`mt-1.5 max-w-2xl text-sm ${
                isNight ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Select any stage in the pipeline below to highlight its matching district in the 3D city and see how raw data is transformed into a finished response.
            </p>
          </div>
          <div className="font-mono text-xs text-cyan-400">
            Input → Data Lake → Training → Model Core → Inference → Output
          </div>
        </div>

        {/* Interactive 6-Stage Pipeline Bar */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PIPELINE_STEPS.map((step, idx) => {
            const isActive = activeStage === step.id;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onSelectStage(step.id, step.districtId)}
                aria-pressed={isActive}
                className={`group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                  isActive
                    ? isNight
                      ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/15'
                      : 'border-cyan-600 bg-cyan-50 shadow-md'
                    : isNight
                    ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.stepNumber}
                  </span>
                  {idx < PIPELINE_STEPS.length - 1 && (
                    <ArrowRight
                      className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${
                        isActive ? 'text-cyan-400' : 'text-slate-500'
                      }`}
                    />
                  )}
                </div>

                <div className="mt-3">
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                    {step.label}
                  </div>
                  <p
                    className={`mt-1 text-xs line-clamp-2 ${
                      isNight ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {step.summary}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Pipeline Stage Explanation Card */}
        <div
          className={`mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 rounded-2xl border p-6 ${
            isNight
              ? 'border-slate-800 bg-[#081126]/90'
              : 'border-slate-200 bg-white shadow-sm'
          }`}
        >
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs uppercase text-cyan-400">
              <span>Stage {currentStep.stepNumber} of 6</span>
              <span>•</span>
              <span>Active City District Highlighted</span>
            </div>
            <h3 className="text-xl font-bold">{currentStep.title}</h3>
            <p
              className={`text-sm leading-relaxed ${
                isNight ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              {currentStep.plainExplanation}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectDistrictAndScroll(currentStep.districtId)}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2 font-mono text-xs font-semibold text-slate-950 hover:bg-cyan-300 transition-colors cursor-pointer"
              >
                <span>Inspect in 3D City</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div
            className={`lg:col-span-5 flex flex-col justify-between rounded-xl border p-4 ${
              isNight
                ? 'border-violet-500/30 bg-violet-950/20'
                : 'border-violet-200 bg-violet-50/70'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-violet-400">
                <BookOpen className="h-4 w-4" />
                Plain-Language Glossary
              </div>
              <h4 className="mt-2 font-mono text-sm font-bold text-white">
                {currentStep.keyConcept}
              </h4>
              <p
                className={`mt-1 text-xs leading-relaxed ${
                  isNight ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {currentStep.keyConceptDefinition}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between font-mono text-[11px] text-slate-400">
              <span>Visual Signal Color:</span>
              <span className="text-cyan-400">
                {currentStep.id === 'input' || currentStep.id === 'data-lake'
                  ? 'Cyan / Electric Blue (Data Flow)'
                  : currentStep.id === 'output'
                  ? 'Cyan + Warm Amber (Output)'
                  : 'Violet / Magenta (Neural Activity)'}
              </span>
            </div>
          </div>
        </div>

        {/* Complete 8-District Directory Grid */}
        <div className="mt-10">
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            All 8 Neural City Districts (Click any district to focus camera)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {DISTRICTS.map((district) => {
              const isSelected = selectedDistrict === district.id;
              return (
                <button
                  key={district.id}
                  type="button"
                  onClick={() => onSelectDistrictAndScroll(district.id)}
                  className={`group flex flex-col justify-between rounded-xl border p-4 text-left transition-all cursor-pointer ${
                    isSelected
                      ? isNight
                        ? 'border-cyan-400 bg-cyan-500/15 shadow-lg shadow-cyan-500/10'
                        : 'border-cyan-600 bg-cyan-50'
                      : isNight
                      ? 'border-slate-800/90 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-slate-900'
                      : 'border-slate-200 bg-white hover:border-cyan-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="inline-flex items-center justify-center rounded-lg p-2"
                        style={{
                          backgroundColor: `${district.accentColor}18`,
                          color: district.accentColor,
                        }}
                      >
                        {DISTRICT_ICONS[district.id]}
                      </span>
                      <span className="font-mono text-[10px] uppercase text-amber-400">
                        {district.metrics.throughput}
                      </span>
                    </div>
                    <h4 className="mt-3 font-semibold text-sm group-hover:text-cyan-400 transition-colors">
                      {district.name}
                    </h4>
                    <p
                      className={`mt-1 text-xs leading-relaxed ${
                        isNight ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {district.tagline}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between font-mono text-[10px] text-cyan-400">
                    <span>{district.metrics.activeUnits}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      Explore →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
