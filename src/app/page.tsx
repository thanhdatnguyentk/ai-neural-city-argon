'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  GitBranch,
  Sparkles,
  MousePointerClick,
  ChevronRight,
  Eye,
  VolumeX,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  DISTRICTS,
  DISTRICT_MAP,
  DEMO_JOURNEY_STEPS,
  DistrictId,
  PipelineStageId,
} from '@/data/districts';
import { DistrictInfoPanel } from '@/components/DistrictInfoPanel';
import { SceneControls } from '@/components/SceneControls';
import { PipelineTimeline } from '@/components/PipelineTimeline';
import { SystemStatusPanel, HeroStatusHUD } from '@/components/SystemStatusPanel';

const NeuralCityScene = dynamic(
  () => import('@/components/NeuralCityScene').then((mod) => mod.NeuralCityScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#040814] text-cyan-300">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        <p className="mt-3 font-mono text-xs uppercase tracking-widest">
          Loading 3D Isometric City...
        </p>
      </div>
    ),
  }
);

export default function HomePage() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictId | null>(null);
  const [activePipelineStage, setActivePipelineStage] = useState<PipelineStageId>('input');
  const [highlightedFlowDistrict, setHighlightedFlowDistrict] = useState<DistrictId | null>(null);

  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [flowSpeed, setFlowSpeed] = useState<number>(1);
  const [trainingMode, setTrainingMode] = useState<boolean>(false);
  const [isNight, setIsNight] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [forceSimplified2D, setForceSimplified2D] = useState<boolean>(false);
  const [heroMinimized, setHeroMinimized] = useState<boolean>(false);

  // Camera state adjustments
  const [cameraZoomDelta, setCameraZoomDelta] = useState<number>(0);
  const [cameraAzimuthDelta, setCameraAzimuthDelta] = useState<number>(0);
  const [cameraResetTrigger, setCameraResetTrigger] = useState<number>(0);

  // Simulated Data Journey Demo state
  const [demoStepIndex, setDemoStepIndex] = useState<number | null>(null);
  const cityViewportRef = useRef<HTMLDivElement>(null);

  // Detect OS prefers-reduced-motion on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
    }
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Advance Demo Journey automatically when running
  useEffect(() => {
    if (demoStepIndex === null || isPaused) return;
    const currentDemo = DEMO_JOURNEY_STEPS[demoStepIndex];
    if (!currentDemo) {
      setDemoStepIndex(null);
      return;
    }

    setSelectedDistrict(currentDemo.districtId);
    setActivePipelineStage(DISTRICT_MAP[currentDemo.districtId].pipelineStage);
    if (currentDemo.districtId === 'training-cluster') {
      setTrainingMode(true);
    }

    const timer = setTimeout(() => {
      if (demoStepIndex + 1 < DEMO_JOURNEY_STEPS.length) {
        setDemoStepIndex(demoStepIndex + 1);
      } else {
        // End on Output Terminal
        setSelectedDistrict('output-terminal');
        setActivePipelineStage('output');
        setDemoStepIndex(null);
      }
    }, currentDemo.durationMs / Math.max(0.5, flowSpeed));

    return () => clearTimeout(timer);
  }, [demoStepIndex, isPaused, flowSpeed]);

  const handleSelectDistrict = useCallback((id: DistrictId | null) => {
    setSelectedDistrict(id);
    if (id) {
      setActivePipelineStage(DISTRICT_MAP[id].pipelineStage);
      setHighlightedFlowDistrict((prev) => (prev && prev !== id ? null : prev));
    } else {
      setHighlightedFlowDistrict(null);
    }
  }, []);

  const handleToggleDataFlow = useCallback((id: DistrictId) => {
    setHighlightedFlowDistrict((prev) => (prev === id ? null : id));
  }, []);

  const handleResetCamera = useCallback(() => {
    setSelectedDistrict(null);
    setHighlightedFlowDistrict(null);
    setDemoStepIndex(null);
    setCameraZoomDelta(0);
    setCameraAzimuthDelta(0);
    setCameraResetTrigger((c) => c + 1);
  }, []);

  const handleRunDemo = useCallback(() => {
    if (demoStepIndex !== null) {
      setDemoStepIndex(null);
      setHighlightedFlowDistrict(null);
    } else {
      setIsPaused(false);
      setHeroMinimized(true);
      setDemoStepIndex(0);
    }
  }, [demoStepIndex]);

  const handleExploreCityClick = () => {
    setHeroMinimized(true);
    setSelectedDistrict('model-core');
    setActivePipelineStage('model-core');
    cityViewportRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleViewPipelineClick = () => {
    const el = document.getElementById('ai-pipeline-section');
    el?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const handleSelectStageFromTimeline = (
    stageId: PipelineStageId,
    districtId: DistrictId
  ) => {
    setActivePipelineStage(stageId);
    setSelectedDistrict(districtId);
  };

  const handleSelectDistrictAndScrollToCity = (districtId: DistrictId) => {
    setSelectedDistrict(districtId);
    setActivePipelineStage(DISTRICT_MAP[districtId].pipelineStage);
    setHeroMinimized(true);
    cityViewportRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  // Keyboard navigation shortcuts (1-8 for districts, Escape to deselect, R to reset)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'BUTTON'
      ) {
        if (e.key === 'Escape') {
          handleSelectDistrict(null);
        }
        return;
      }

      if (e.key === 'Escape') {
        handleSelectDistrict(null);
      } else if (e.key === 'r' || e.key === 'R') {
        handleResetCamera();
      } else if (e.key >= '1' && e.key <= '8') {
        const idx = parseInt(e.key, 10) - 1;
        if (DISTRICTS[idx]) {
          handleSelectDistrict(DISTRICTS[idx].id);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleSelectDistrict, handleResetCamera]);

  const activeDemoStep =
    demoStepIndex !== null ? DEMO_JOURNEY_STEPS[demoStepIndex] : null;
  const activeDistrictObj = selectedDistrict
    ? DISTRICT_MAP[selectedDistrict]
    : null;
  const hoveredDistrictObj = hoveredDistrict
    ? DISTRICT_MAP[hoveredDistrict]
    : null;

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        isNight
          ? 'bg-[#040814] text-slate-100'
          : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* ==================== TOP NAVIGATION HEADER ==================== */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-md transition-colors ${
          isNight
            ? 'border-slate-800/80 bg-[#040814]/80'
            : 'border-slate-300/80 bg-white/85'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetCamera}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/50 bg-cyan-500/15 text-cyan-400 shadow-sm shadow-cyan-500/20">
                <Compass className="h-4 w-4" />
              </span>
              <div>
                <span className="block font-mono text-xs font-bold tracking-wider uppercase">
                  AI Neural City
                </span>
                <span className="block font-mono text-[10px] text-cyan-400">
                  Isometric System Visualizer
                </span>
              </div>
            </button>
          </div>

          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 font-mono text-xs"
          >
            <a
              href="#interactive-city"
              className="hover:text-cyan-400 transition-colors"
            >
              01. Interactive City
            </a>
            <a
              href="#ai-pipeline-section"
              className="hover:text-cyan-400 transition-colors"
            >
              02. AI Pipeline
            </a>
            <a
              href="#system-activity-section"
              className="hover:text-cyan-400 transition-colors"
            >
              03. System Activity
            </a>
          </nav>

          <div className="flex items-center gap-2">
            {/* Color Legend Pills on Desktop */}
            <div className="hidden xl:flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-1 font-mono text-[10px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#00F0FF]" />
                Data Flow
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
                Neural Activity
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#F59E0B]" />
                Status
              </span>
            </div>

            {/* Reduced Motion Toggle */}
            <button
              type="button"
              onClick={() => setReducedMotion((r) => !r)}
              aria-pressed={reducedMotion}
              title="Toggle Reduced Motion"
              className={`rounded-xl border px-2.5 py-1.5 font-mono text-[11px] transition-colors cursor-pointer ${
                reducedMotion
                  ? 'border-amber-400/60 bg-amber-500/20 text-amber-300'
                  : isNight
                  ? 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700'
                  : 'border-slate-300 bg-slate-100 text-slate-700'
              }`}
            >
              {reducedMotion ? 'Reduced Motion: ON' : 'Motion: Standard'}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== HERO & INTERACTIVE 3D CITY SECTION ==================== */}
      <main>
        <section
          id="interactive-city"
          ref={cityViewportRef}
          aria-label="Interactive 3D AI Neural City"
          className={`relative h-screen min-h-[740px] w-full overflow-hidden pt-14 ${
            isNight ? 'bg-radial-city' : 'bg-radial-city-day'
          }`}
        >
          {/* 3D Isometric City Canvas (Full-bleed interactive centerpiece) */}
          <div className="absolute inset-0 z-0">
            <NeuralCityScene
              selectedDistrict={selectedDistrict}
              hoveredDistrict={hoveredDistrict}
              activePipelineStage={activePipelineStage}
              highlightedFlowDistrict={highlightedFlowDistrict}
              activeDemoPathIds={activeDemoStep ? activeDemoStep.activePathIds : []}
              showLabels={showLabels}
              isPaused={isPaused}
              flowSpeed={flowSpeed}
              trainingMode={trainingMode}
              isNight={isNight}
              reducedMotion={reducedMotion}
              cameraZoomDelta={cameraZoomDelta}
              cameraAzimuthDelta={cameraAzimuthDelta}
              cameraResetTrigger={cameraResetTrigger}
              forceSimplified2D={forceSimplified2D}
              onSelectDistrict={handleSelectDistrict}
              onHoverDistrict={setHoveredDistrict}
            />
          </div>

          {/* Foreground HUD Layer (pointer-events-none wrapper so 3D canvas stays draggable/clickable) */}
          <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-between p-4 sm:p-6 lg:p-8">
            {/* TOP ROW: Hero Overlay Card (Left) + System Status HUD / District Detail Panel (Right) */}
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              {/* Left Column: Hero Panel & Live Demo Narration */}
              <div className="flex flex-col gap-3 w-full max-w-md">
                {!heroMinimized ? (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`pointer-events-auto relative rounded-2xl border p-5 backdrop-blur-xl shadow-2xl ${
                      isNight
                        ? 'border-slate-700/80 bg-[#070E20]/88 text-slate-100 shadow-black/60'
                        : 'border-slate-300 bg-white/92 text-slate-900 shadow-slate-400/30'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setHeroMinimized(true)}
                      title="Minimize intro card for full-screen city view"
                      aria-label="Minimize intro card"
                      className="absolute top-3.5 right-3.5 rounded-lg border border-slate-700/70 bg-slate-900/60 p-1.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Minimize2 className="h-3.5 w-3.5" />
                    </button>

                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase text-cyan-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      AN INTERACTIVE AI SYSTEM
                    </div>

                    <h1 className="mt-2.5 text-2xl sm:text-3xl font-bold tracking-tight">
                      Inside the Neural City
                    </h1>

                    <p
                      className={`mt-1.5 text-sm leading-relaxed ${
                        isNight ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      Explore how data becomes intelligence. Each architectural district represents one stage of an artificial intelligence pipeline.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleExploreCityClick}
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 font-mono text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-300 transition-all cursor-pointer"
                      >
                        <Compass className="h-4 w-4" />
                        <span>Explore the city</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleViewPipelineClick}
                        className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 font-mono text-xs font-semibold transition-colors cursor-pointer ${
                          isNight
                            ? 'border-slate-700 bg-slate-900/90 text-slate-200 hover:border-cyan-400 hover:text-white'
                            : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        <GitBranch className="h-4 w-4 text-cyan-400" />
                        <span>View the AI pipeline</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="pointer-events-auto inline-flex">
                    <button
                      type="button"
                      onClick={() => setHeroMinimized(false)}
                      className={`inline-flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 font-mono text-xs font-semibold shadow-xl backdrop-blur-xl transition-all cursor-pointer ${
                        isNight
                          ? 'border-slate-700/80 bg-[#070E20]/90 text-slate-200 hover:border-cyan-400'
                          : 'border-slate-300 bg-white/90 text-slate-900'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>Inside the Neural City</span>
                      <Maximize2 className="h-3.5 w-3.5 text-cyan-400" />
                    </button>
                  </div>
                )}

                {/* Hero Status Panel (SYSTEM STATUS: ONLINE | ACTIVE NODES | DATA FLOW | MODEL LOAD) */}
                <HeroStatusHUD
                  isPaused={isPaused}
                  flowSpeed={flowSpeed}
                  trainingMode={trainingMode}
                  isNight={isNight}
                />

                {/* Live Demo Journey Stepper Banner */}
                <AnimatePresence>
                  {activeDemoStep && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="pointer-events-auto rounded-2xl border border-amber-400/50 bg-slate-950/95 p-4 text-slate-100 shadow-2xl backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-amber-400">
                          <Sparkles className="h-3.5 w-3.5" />
                          {activeDemoStep.headline}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDemoStepIndex(null)}
                          className="font-mono text-[10px] text-slate-400 hover:text-white cursor-pointer"
                        >
                          Stop
                        </button>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-200">
                        {activeDemoStep.narration}
                      </p>
                      <div className="mt-2 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 font-mono text-[10px] text-cyan-300">
                        {activeDemoStep.packetSample}
                      </div>
                      {/* Step Progress Dots */}
                      <div className="mt-2.5 flex items-center gap-1.5">
                        {DEMO_JOURNEY_STEPS.map((st) => (
                          <button
                            key={st.stepIndex}
                            type="button"
                            onClick={() => setDemoStepIndex(st.stepIndex)}
                            aria-label={`Jump to demo step ${st.stepIndex + 1}`}
                            className={`h-1.5 flex-1 rounded-full transition-all cursor-pointer ${
                              st.stepIndex === demoStepIndex
                                ? 'bg-amber-400'
                                : st.stepIndex < (demoStepIndex ?? 0)
                                ? 'bg-cyan-400/70'
                                : 'bg-slate-800'
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Selected District Info Panel OR Hover Preview Hint */}
              <div className="w-full lg:w-auto flex flex-col items-end">
                {activeDistrictObj ? (
                  <DistrictInfoPanel
                    district={activeDistrictObj}
                    isFlowHighlighted={highlightedFlowDistrict === activeDistrictObj.id}
                    isNight={isNight}
                    onClose={() => handleSelectDistrict(null)}
                    onToggleDataFlow={handleToggleDataFlow}
                    onSelectDistrict={(id) => handleSelectDistrict(id)}
                  />
                ) : (
                  <div
                    className={`pointer-events-auto hidden sm:flex items-center gap-2.5 rounded-2xl border px-4 py-2.5 backdrop-blur-xl shadow-lg ${
                      isNight
                        ? 'border-slate-700/80 bg-[#070E20]/85 text-slate-200'
                        : 'border-slate-300 bg-white/90 text-slate-800'
                    }`}
                  >
                    <MousePointerClick className="h-4 w-4 text-cyan-400 shrink-0" />
                    <div className="text-xs">
                      {hoveredDistrictObj ? (
                        <span>
                          <strong className="font-mono text-cyan-400">
                            {hoveredDistrictObj.name}:
                          </strong>{' '}
                          {hoveredDistrictObj.tagline}
                        </span>
                      ) : (
                        <span className="font-mono">
                          Select a district to explore · Drag to orbit · Scroll to zoom
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* BOTTOM ROW: Quick District Selector Bar + Scene Controls Toolbar */}
            <div className="flex flex-col gap-2.5 items-center justify-end w-full">
              {/* Touch-Friendly & Keyboard-Accessible District Quick Bar */}
              <div
                role="navigation"
                aria-label="City Districts Quick Selector"
                className={`pointer-events-auto flex items-center gap-1.5 overflow-x-auto max-w-full rounded-2xl border p-1.5 backdrop-blur-xl shadow-xl ${
                  isNight
                    ? 'border-slate-800/90 bg-[#070E20]/85'
                    : 'border-slate-300 bg-white/90'
                }`}
              >
                <span className="px-2.5 font-mono text-[10px] uppercase tracking-wider text-slate-400 shrink-0 hidden md:inline">
                  Select a district to explore:
                </span>
                {DISTRICTS.map((d, idx) => {
                  const active = selectedDistrict === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelectDistrict(active ? null : d.id)}
                      onMouseEnter={() => setHoveredDistrict(d.id)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-mono text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                        active
                          ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                          : isNight
                          ? 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: active ? '#040814' : d.accentColor,
                        }}
                      />
                      <span className="opacity-60 text-[9px]">{idx + 1}.</span>
                      <span>{d.shortName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Scene Controls Toolbar */}
              <SceneControls
                showLabels={showLabels}
                isPaused={isPaused}
                flowSpeed={flowSpeed}
                trainingMode={trainingMode}
                isDemoRunning={demoStepIndex !== null}
                isNight={isNight}
                forceSimplified2D={forceSimplified2D}
                onToggleLabels={() => setShowLabels((s) => !s)}
                onTogglePause={() => setIsPaused((p) => !p)}
                onChangeSpeed={(spd) => setFlowSpeed(spd)}
                onToggleTrainingMode={() => setTrainingMode((t) => !t)}
                onRunDemo={handleRunDemo}
                onResetCamera={handleResetCamera}
                onZoomIn={() => setCameraZoomDelta((z) => Math.min(z + 1, 4))}
                onZoomOut={() => setCameraZoomDelta((z) => Math.max(z - 1, -3))}
                onRotateLeft={() => setCameraAzimuthDelta((a) => a - 1)}
                onRotateRight={() => setCameraAzimuthDelta((a) => a + 1)}
                onToggleNight={() => setIsNight((n) => !n)}
                onToggle2D={() => setForceSimplified2D((f) => !f)}
              />
            </div>
          </div>
        </section>

        {/* ==================== AI PIPELINE TIMELINE SECTION ==================== */}
        <PipelineTimeline
          activeStage={activePipelineStage}
          selectedDistrict={selectedDistrict}
          isNight={isNight}
          onSelectStage={handleSelectStageFromTimeline}
          onSelectDistrictAndScroll={handleSelectDistrictAndScrollToCity}
        />

        {/* ==================== SYSTEM ACTIVITY TELEMETRY SECTION ==================== */}
        <SystemStatusPanel
          isPaused={isPaused}
          flowSpeed={flowSpeed}
          trainingMode={trainingMode}
          isNight={isNight}
          reducedMotion={reducedMotion}
        />
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer
        className={`border-t py-8 px-4 sm:px-6 lg:px-10 font-mono text-xs transition-colors ${
          isNight
            ? 'border-slate-800/80 bg-[#030611] text-slate-400'
            : 'border-slate-200 bg-slate-200/60 text-slate-600'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            <span className="font-bold text-slate-200">AI NEURAL CITY</span>
            <span>— Interactive 3D Isometric AI System Architecture</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span>Shortcuts: [1–8] Select District</span>
            <span>[R] Reset Camera</span>
            <span>[Esc] Close Panel</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
