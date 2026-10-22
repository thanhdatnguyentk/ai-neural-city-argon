'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Sparkles,
  Layers,
  Send,
  Compass,
} from 'lucide-react';
import {
  ArchitectActionPlan,
  TourStep,
  ARCHITECT_PROMPT_PRESETS,
  synthesizeArchitectPlanFromPrompt,
} from '../hooks/useArchitectTour';
import { useLanguage } from '../context/LanguageContext';
import { DISTRICT_MAP } from '../data/districts';
import type { StackSelectionMap } from '../data/stack-catalog';

export interface ArchitectAgentDockProps {
  isNight: boolean;
  activePlan: ArchitectActionPlan | null;
  isTourRunning: boolean;
  isTourPaused: boolean;
  currentStepIndex: number;
  currentTourStep: TourStep | null;
  onSelectPlan: (plan: ArchitectActionPlan) => void;
  onStartTour: (plan?: ArchitectActionPlan) => void;
  onToggleTourPause: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onSelectStepIndex: (idx: number) => void;
  onExitTour: () => void;
  onLoadStackIntoBuilder: (stackMap: StackSelectionMap) => void;
}

export const ArchitectAgentDock: React.FC<ArchitectAgentDockProps> = ({
  isNight,
  activePlan,
  isTourRunning,
  isTourPaused,
  currentStepIndex,
  currentTourStep,
  onSelectPlan,
  onStartTour,
  onToggleTourPause,
  onNextStep,
  onPrevStep,
  onSelectStepIndex,
  onExitTour,
  onLoadStackIntoBuilder,
}) => {
  const { t } = useLanguage();
  const [isDockOpen, setIsDockOpen] = useState<boolean>(false);
  const [promptInput, setPromptInput] = useState<string>('');

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = promptInput.trim();
    if (!query) return;
    const plan = synthesizeArchitectPlanFromPrompt(query);
    onSelectPlan(plan);
    onStartTour(plan);
  };

  const handlePresetClick = (presetPrompt: string) => {
    setPromptInput(presetPrompt);
    const plan = synthesizeArchitectPlanFromPrompt(presetPrompt);
    onSelectPlan(plan);
    onStartTour(plan);
  };

  return (
    <>
      {/* 1. Bottom-Left Floating Command Trigger + Expandable Architect Copilot Panel */}
      <div
        onWheel={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        className="pointer-events-auto relative z-30"
      >
        {!isDockOpen ? (
          <button
            type="button"
            onClick={() => setIsDockOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/70 bg-slate-950/90 px-4 py-2.5 font-mono text-xs font-bold text-cyan-300 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 hover:text-slate-950 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Bot aria-hidden="true" className="h-4 w-4" />
            <span>🤖 {t.architectAgent.triggerLabel}</span>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            className={`w-[360px] sm:w-[440px] rounded-3xl border p-4 shadow-2xl backdrop-blur-xl ${
              isNight
                ? 'border-cyan-500/50 bg-[#050C1D]/95 text-slate-100'
                : 'border-slate-300 bg-white/95 text-slate-900'
            }`}
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/50 bg-cyan-500/15 text-cyan-400">
                  <Bot aria-hidden="true" className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
                    {t.architectAgent.dockTitle}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {t.architectAgent.dockSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDockOpen(false)}
                aria-label="Close AI City Architect Dock"
                className="rounded-lg border border-slate-700/80 bg-slate-900 p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handlePromptSubmit} className="mt-3 flex gap-1.5">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder={t.architectAgent.inputPlaceholder}
                className={`flex-1 rounded-xl border px-3 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  isNight
                    ? 'border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-500'
                    : 'border-slate-300 bg-slate-50 text-slate-900'
                }`}
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-xl bg-cyan-400 px-3 py-2 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-300 transition-colors cursor-pointer shrink-0"
              >
                <Send aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.architectAgent.askBtn}</span>
              </button>
            </form>

            {/* Quick Prompt Chips */}
            <div className="mt-2.5 space-y-1">
              <span className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                1-Click System Design Prompts:
              </span>
              <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-1">
                {ARCHITECT_PROMPT_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handlePresetClick(preset.prompt)}
                    className={`rounded-xl border px-2.5 py-1.5 text-left font-mono text-[10px] transition-colors cursor-pointer ${
                      isNight
                        ? 'border-slate-800 bg-slate-900/80 text-slate-200 hover:border-cyan-400/60 hover:text-cyan-300'
                        : 'border-slate-200 bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Action Plan Preview */}
            {activePlan && (
              <div className="mt-3 rounded-2xl border border-cyan-500/30 bg-slate-950/90 p-3 text-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase text-amber-400">
                    <Sparkles aria-hidden="true" className="h-3 w-3" />
                    {activePlan.planTitle}
                  </span>
                  <span className="font-mono text-[9px] text-cyan-400">
                    {activePlan.tourSteps.length} 3D Steps
                  </span>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
                  {activePlan.architectSummary}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => onStartTour(activePlan)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-cyan-400 px-3 py-1.5 font-mono text-[11px] font-bold text-slate-950 hover:bg-cyan-300 transition-colors cursor-pointer"
                  >
                    <Play aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{t.architectAgent.runTourBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onLoadStackIntoBuilder(activePlan.stackSelectionMap)
                    }
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-amber-400/60 bg-amber-500/15 px-3 py-1.5 font-mono text-[11px] font-bold text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-colors cursor-pointer"
                  >
                    <Layers aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{t.architectAgent.loadStackBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 2. Floating Narrator HUD Banner at Bottom-Center during Active 3D Tour */}
      <AnimatePresence>
        {isTourRunning && activePlan && currentTourStep && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            onWheel={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="pointer-events-auto fixed bottom-28 left-1/2 z-40 w-[92vw] max-w-[680px] -translate-x-1/2 rounded-3xl border border-cyan-400/70 bg-[#040917]/95 p-4 text-slate-100 shadow-2xl shadow-cyan-500/25 backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase text-slate-950">
                  <Compass aria-hidden="true" className="h-3 w-3" />
                  {t.architectAgent.tourPlayingBadge} ({currentStepIndex + 1}/
                  {activePlan.tourSteps.length})
                </span>
                <span className="rounded-lg border border-amber-400/50 bg-amber-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300">
                  {currentTourStep.protocolBadge}
                </span>
              </div>

              <div className="flex items-center gap-1 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={onPrevStep}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 hover:text-white cursor-pointer"
                  title={t.architectAgent.prevStepBtn}
                >
                  <SkipBack aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onToggleTourPause}
                  className="rounded-lg border border-cyan-500/40 bg-cyan-500/15 px-2.5 py-1 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 cursor-pointer"
                >
                  {isTourPaused ? (
                    <Play aria-hidden="true" className="h-3.5 w-3.5" />
                  ) : (
                    <Pause aria-hidden="true" className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onNextStep}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 hover:text-white cursor-pointer"
                  title={t.architectAgent.nextStepBtn}
                >
                  <SkipForward aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onExitTour}
                  className="ml-1 rounded-lg border border-rose-500/50 bg-rose-500/15 px-2.5 py-1 text-[10px] font-bold text-rose-300 hover:bg-rose-500 hover:text-white cursor-pointer"
                >
                  {t.architectAgent.exitTourBtn}
                </button>
              </div>
            </div>

            <div className="mt-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-sm font-bold text-cyan-300">
                  {currentTourStep.title}
                </h4>
                <span className="font-mono text-[10px] text-slate-400">
                  Target: {DISTRICT_MAP[currentTourStep.districtSlug]?.name}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-200">
                {currentTourStep.narration}
              </p>
            </div>

            {/* Step Progress Bar */}
            <div className="mt-3 flex items-center gap-1.5">
              {activePlan.tourSteps.map((step, idx) => (
                <button
                  key={`${step.districtSlug}-${idx}`}
                  type="button"
                  onClick={() => onSelectStepIndex(idx)}
                  aria-label={`Jump to tour step ${idx + 1}`}
                  className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'bg-cyan-400'
                      : idx < currentStepIndex
                      ? 'bg-amber-400/80'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
