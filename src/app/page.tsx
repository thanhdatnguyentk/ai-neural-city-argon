'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  GitBranch,
  Sparkles,
  MousePointerClick,
  Maximize2,
  Minimize2,
  Terminal,
  Award,
  AlertTriangle,
  Wrench,
  Layers,
  Flame,
  BookOpen,
  Code2,
  Swords,
  Microscope,
  Gamepad2,
  Trophy,
} from 'lucide-react';
import {
  DISTRICTS,
  DISTRICT_MAP,
  DEMO_JOURNEY_STEPS,
  DistrictId,
  PipelineStageId,
} from '@/data/districts';
import {
  WorkloadPresetId,
  WORKLOAD_PRESETS,
  WORKLOAD_PRESET_MAP,
  BOTTLENECK_SCENARIOS,
  BOTTLENECK_SCENARIO_MAP,
} from '@/data/bottleneck-scenarios';
import {
  SimulationProvider,
  useSimulation,
} from '@/context/SimulationContext';
import {
  LanguageProvider,
  useLanguage,
} from '@/context/LanguageContext';
import type { LanguageCode } from '@/data/locales';
import {
  DEFAULT_STACK_SELECTIONS,
  StackSelectionMap,
} from '@/data/stack-catalog';
import { CaseStudyBlueprint } from '@/data/case-studies';
import {
  useArchitectTour,
  buildTourFromCaseStudy,
} from '@/hooks/useArchitectTour';
import { DistrictInfoPanel } from '@/components/DistrictInfoPanel';
import {
  DistrictDeepDiveDrawer,
  DeepDiveTab,
} from '@/components/DistrictDeepDiveDrawer';
import { StackBuilderModal } from '@/components/StackBuilderModal';
import { ArchitectAgentDock } from '@/components/ArchitectAgentDock';
import { CaseStudiesModal } from '@/components/CaseStudiesModal';
import { DistrictMicroLabModal } from '@/components/micro-labs/DistrictMicroLabModal';
import { ArchitectureBattleModal } from '@/components/ArchitectureBattleModal';
import { TycoonCommandHUD } from '@/components/tycoon/TycoonCommandHUD';
import { TechTreeModal } from '@/components/tycoon/TechTreeModal';
import { SceneControls } from '@/components/SceneControls';
import { PipelineTimeline } from '@/components/PipelineTimeline';
import { SystemStatusPanel, HeroStatusHUD } from '@/components/SystemStatusPanel';
import { useRoadmapProgress } from '@/hooks/useRoadmapProgress';
import { useTycoonGame } from '@/hooks/useTycoonGame';
import {
  ARCHITECTURAL_PIPELINE_MODES,
  ARCHITECTURAL_MODE_MAP,
} from '@/data/pipeline-modes';
import type { ArchitecturalPipelineModeId } from '@/types/pipeline-modes';

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

const VALID_DISTRICTS = new Set<string>(DISTRICTS.map((d) => d.id));
const VALID_TABS = new Set<string>(['roadmap', 'landmarks', 'quiz', 'sandbox']);
const VALID_WORKLOADS = new Set<string>(WORKLOAD_PRESETS.map((w) => w.id));
const LANGUAGE_OPTIONS: { code: LanguageCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'vi', label: 'VI' },
  { code: 'ja', label: '日本語' },
];

function NeuralCitySandboxApp() {
  const { lang, setLang, t } = useLanguage();

  const [selectedDistrict, setSelectedDistrict] = useState<DistrictId | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictId | null>(null);
  const [activePipelineStage, setActivePipelineStage] = useState<PipelineStageId>('input');
  const [highlightedFlowDistrict, setHighlightedFlowDistrict] = useState<DistrictId | null>(null);

  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [flowSpeed, setFlowSpeed] = useState<number>(1);
  const [trainingMode, setTrainingMode] = useState<boolean>(false);
  const [activePipelineMode, setActivePipelineMode] =
    useState<ArchitecturalPipelineModeId>('online-inference');

  const handleSelectPipelineMode = useCallback(
    (mode: ArchitecturalPipelineModeId) => {
      setActivePipelineMode(mode);
      setTrainingMode(mode === 'offline-training');
    },
    []
  );
  const [isNight, setIsNight] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [forceSimplified2D, setForceSimplified2D] = useState<boolean>(false);
  const [heroMinimized, setHeroMinimized] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<DeepDiveTab>('roadmap');
  const [highlightedMilestoneId, setHighlightedMilestoneId] = useState<string | null>(null);
  const [activeKeyFlash, setActiveKeyFlash] = useState<string | null>(null);
  const [urlHydrated, setUrlHydrated] = useState<boolean>(false);

  // Phase 1 Studio State: Stack Builder & Case Studies
  const [stackSelections, setStackSelections] = useState<StackSelectionMap>(
    DEFAULT_STACK_SELECTIONS
  );
  const [isStackBuilderOpen, setIsStackBuilderOpen] = useState<boolean>(false);
  const [isCaseStudiesOpen, setIsCaseStudiesOpen] = useState<boolean>(false);
  const [activeCaseStudyId, setActiveCaseStudyId] = useState<string | null>(null);

  // Phase 2 State: Interior Algorithmic Micro-Lab & A/B Architecture Battle Arena
  const [isMicroLabOpen, setIsMicroLabOpen] = useState<boolean>(false);
  const [isBattleModalOpen, setIsBattleModalOpen] = useState<boolean>(false);
  const [isBattleRaceActive, setIsBattleRaceActive] = useState<boolean>(false);

  const {
    activeWorkload,
    activeBottleneck,
    isBlueprintMode,
    vramConfig,
    computedTelemetry,
    setActiveWorkload,
    setActiveBottleneck,
    toggleBlueprintMode,
    setIsBlueprintMode,
    updateVramConfig,
  } = useSimulation();

  const {
    lastMasteredDistrictId,
    isCompleted,
    toggleMilestone,
    resetAllProgress,
    replayAwakeningPulse,
    getDistrictProgress,
    getAllDistrictsMastery,
    getTotalCityMastery,
  } = useRoadmapProgress();

  const cityMastery = getTotalCityMastery();
  const allDistrictsMastery = getAllDistrictsMastery();
  const isSingularityMode = cityMastery.percentage === 100;
  const masteredDistrictsCount = Object.values(allDistrictsMastery).filter(
    (m) => m.isMastered
  ).length;

  // Phase 3: AI Lab Tycoon, Tech Tree & Boss Workload Defense Engine
  const {
    isTycoonActive,
    setIsTycoonActive,
    isTechTreeOpen,
    setIsTechTreeOpen,
    speedMode: tycoonSpeedMode,
    setSpeedMode: setTycoonSpeedMode,
    credits: tycoonCredits,
    rp: tycoonRp,
    slaStability: tycoonSlaStability,
    hardwareTierIndex: tycoonHardwareTierIndex,
    currentHardware: tycoonCurrentHardware,
    nextHardware: tycoonNextHardware,
    unlockedNodeIds: tycoonUnlockedNodeIds,
    currentWave: tycoonCurrentWave,
    waveElapsedSec: tycoonWaveElapsedSec,
    campaignStatus: tycoonCampaignStatus,
    saveData: tycoonSaveData,
    telemetry: tycoonTelemetry,
    canResearchNode: canResearchTycoonNode,
    researchTechNode: researchTycoonNode,
    upgradeHardwareCluster: upgradeTycoonHardware,
    callNextWaveEarly: callNextTycoonWaveEarly,
    resetCampaign: resetTycoonCampaign,
  } = useTycoonGame(cityMastery.completed);

  // Camera state adjustments
  const [cameraZoomDelta, setCameraZoomDelta] = useState<number>(0);
  const [cameraAzimuthDelta, setCameraAzimuthDelta] = useState<number>(0);
  const [cameraResetTrigger, setCameraResetTrigger] = useState<number>(0);

  // Simulated Data Journey Demo state
  const [demoStepIndex, setDemoStepIndex] = useState<number | null>(null);
  const cityViewportRef = useRef<HTMLDivElement>(null);

  const activeWorkloadObj = WORKLOAD_PRESET_MAP[activeWorkload];
  const activeBottleneckObj = BOTTLENECK_SCENARIO_MAP[activeBottleneck];

  // Module 2: AI City Architect Tour Controller
  const focusDistrictForTour = useCallback((districtId: DistrictId) => {
    setSelectedDistrict(districtId);
    setActivePipelineStage(DISTRICT_MAP[districtId].pipelineStage);
    setHeroMinimized(true);
    setIsDrawerOpen(false);
  }, []);

  const {
    activePlan,
    setActivePlan,
    isTourRunning,
    isTourPaused,
    setIsTourPaused,
    currentStepIndex,
    currentTourStep,
    startTour,
    exitTour,
    nextStep,
    prevStep,
    selectStepIndex,
  } = useArchitectTour({
    onFocusDistrict: focusDistrictForTour,
    onHighlightConduitDistrict: setHighlightedFlowDistrict,
  });

  const triggerKeyFlash = useCallback((keyLabel: string) => {
    setActiveKeyFlash(keyLabel);
  }, []);

  useEffect(() => {
    if (!activeKeyFlash) return;
    const timer = setTimeout(() => setActiveKeyFlash(null), 380);
    return () => clearTimeout(timer);
  }, [activeKeyFlash]);

  // Hydrate initial state from URL query parameters (?district=...&tab=...&workload=...&blueprint=1)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const districtParam = params.get('district');
    const tabParam = params.get('tab');
    const workloadParam = params.get('workload');
    const blueprintParam = params.get('blueprint');

    if (districtParam && VALID_DISTRICTS.has(districtParam)) {
      const dId = districtParam as DistrictId;
      setSelectedDistrict(dId);
      setActivePipelineStage(DISTRICT_MAP[dId].pipelineStage);
      setIsDrawerOpen(true);
    }
    if (tabParam && VALID_TABS.has(tabParam)) {
      setDrawerTab(tabParam as DeepDiveTab);
      if (districtParam && VALID_DISTRICTS.has(districtParam)) {
        setIsDrawerOpen(true);
      }
    }
    if (workloadParam && VALID_WORKLOADS.has(workloadParam)) {
      setActiveWorkload(workloadParam as WorkloadPresetId);
    }
    if (blueprintParam === '1' || blueprintParam === 'true') {
      setIsBlueprintMode(true);
    }
    setUrlHydrated(true);
  }, [setActiveWorkload, setIsBlueprintMode]);

  // Synchronize state changes back to URL query parameters via window.history.replaceState
  useEffect(() => {
    if (!urlHydrated || typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);

    if (selectedDistrict) {
      params.set('district', selectedDistrict);
    } else {
      params.delete('district');
    }

    if (isDrawerOpen && selectedDistrict) {
      params.set('tab', drawerTab);
    } else {
      params.delete('tab');
    }

    if (activeWorkload !== 'multimodal-vision') {
      params.set('workload', activeWorkload);
    } else {
      params.delete('workload');
    }

    if (isBlueprintMode) {
      params.set('blueprint', '1');
    } else {
      params.delete('blueprint');
    }

    const queryString = params.toString();
    const nextUrl = queryString
      ? `${window.location.pathname}?${queryString}${window.location.hash}`
      : `${window.location.pathname}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  }, [
    urlHydrated,
    selectedDistrict,
    isDrawerOpen,
    drawerTab,
    activeWorkload,
    isBlueprintMode,
  ]);

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
        setSelectedDistrict('output-terminal');
        setActivePipelineStage('output');
        setDemoStepIndex(null);
      }
    }, currentDemo.durationMs / Math.max(0.5, flowSpeed));

    return () => clearTimeout(timer);
  }, [demoStepIndex, isPaused, flowSpeed]);

  const handleSelectDistrict = useCallback((id: DistrictId | null) => {
    setSelectedDistrict(id);
    setHighlightedMilestoneId(null);
    if (id) {
      setActivePipelineStage(DISTRICT_MAP[id].pipelineStage);
      setHighlightedFlowDistrict((prev) => (prev && prev !== id ? null : prev));
      setIsDrawerOpen(true);
    } else {
      setHighlightedFlowDistrict(null);
      setIsDrawerOpen(false);
    }
  }, []);

  const handleFixBottleneck = useCallback(
    (districtId: DistrictId, milestoneId: string) => {
      setSelectedDistrict(districtId);
      setActivePipelineStage(DISTRICT_MAP[districtId].pipelineStage);
      setDrawerTab('roadmap');
      setHighlightedMilestoneId(milestoneId);
      setIsDrawerOpen(true);
      cityViewportRef.current?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [reducedMotion]
  );

  const handleSimulateCaseStudy = useCallback(
    (study: CaseStudyBlueprint) => {
      setActiveCaseStudyId(study.id);
      setActiveWorkload(study.workloadPresetId);
      setStackSelections(study.stackSelections);
      setIsCaseStudiesOpen(false);
      setIsDrawerOpen(false);
      setHeroMinimized(true);
      const tourPlan = buildTourFromCaseStudy(study, lang);
      startTour(tourPlan);
      cityViewportRef.current?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [lang, reducedMotion, setActiveWorkload, startTour]
  );

  const handleInspectCaseStudyStack = useCallback(
    (study: CaseStudyBlueprint) => {
      setActiveCaseStudyId(study.id);
      setActiveWorkload(study.workloadPresetId);
      setStackSelections(study.stackSelections);
      setIsCaseStudiesOpen(false);
      setIsStackBuilderOpen(true);
    },
    [setActiveWorkload]
  );

  const handleLoadPlanStackIntoBuilder = useCallback(
    (stackMap: StackSelectionMap) => {
      setStackSelections(stackMap);
      setIsStackBuilderOpen(true);
    },
    []
  );

  const handleToggleDataFlow = useCallback((id: DistrictId) => {
    setHighlightedFlowDistrict((prev) => (prev === id ? null : id));
  }, []);

  const handleResetCamera = useCallback(() => {
    setSelectedDistrict(null);
    setHighlightedFlowDistrict(null);
    setHighlightedMilestoneId(null);
    setDemoStepIndex(null);
    exitTour();
    setIsDrawerOpen(false);
    setCameraZoomDelta(0);
    setCameraAzimuthDelta(0);
    setCameraResetTrigger((c) => c + 1);
  }, [exitTour]);

  const handleRunDemo = useCallback(() => {
    if (demoStepIndex !== null) {
      setDemoStepIndex(null);
      setHighlightedFlowDistrict(null);
    } else {
      setIsPaused(false);
      setHeroMinimized(true);
      setIsDrawerOpen(false);
      setDemoStepIndex(0);
    }
  }, [demoStepIndex]);

  const handleExploreCityClick = () => {
    setHeroMinimized(true);
    setSelectedDistrict('model-core');
    setActivePipelineStage('model-core');
    setIsDrawerOpen(true);
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

  const handleOpenRoadmapDrawer = useCallback(
    (districtId: DistrictId) => {
      setSelectedDistrict(districtId);
      setActivePipelineStage(DISTRICT_MAP[districtId].pipelineStage);
      setHeroMinimized(true);
      setIsDrawerOpen(true);
      cityViewportRef.current?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [reducedMotion]
  );

  const handleOpenMicroLab = useCallback(
    (districtId: DistrictId) => {
      setSelectedDistrict(districtId);
      setActivePipelineStage(DISTRICT_MAP[districtId].pipelineStage);
      setCameraZoomDelta(3);
      setHeroMinimized(true);
      setIsMicroLabOpen(true);
    },
    []
  );

  // Keyboard navigation shortcuts ([1-8] for districts, [L] for Micro-Lab, [V] for A/B Battle Arena, [B] for Blueprint Mode, [R] to reset, [Esc] to close)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        triggerKeyFlash('Esc');
        if (isTechTreeOpen) {
          setIsTechTreeOpen(false);
        } else if (isMicroLabOpen) {
          setIsMicroLabOpen(false);
          setCameraZoomDelta(0);
        } else if (isBattleModalOpen) {
          setIsBattleModalOpen(false);
          setIsBattleRaceActive(false);
        } else if (isStackBuilderOpen) {
          setIsStackBuilderOpen(false);
        } else if (isCaseStudiesOpen) {
          setIsCaseStudiesOpen(false);
        } else if (isTourRunning) {
          exitTour();
        } else if (isDrawerOpen) {
          setIsDrawerOpen(false);
        } else {
          handleSelectDistrict(null);
        }
        return;
      }

      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        triggerKeyFlash('R');
        handleResetCamera();
      } else if (e.key === 'b' || e.key === 'B') {
        triggerKeyFlash('B');
        toggleBlueprintMode();
      } else if (e.key === 'g' || e.key === 'G') {
        triggerKeyFlash('G');
        setIsTycoonActive((active) => !active);
      } else if (e.key === 't' || e.key === 'T') {
        triggerKeyFlash('T');
        setIsTycoonActive(true);
        setIsTechTreeOpen((open) => !open);
      } else if (e.key === 'l' || e.key === 'L') {
        triggerKeyFlash('L');
        if (isMicroLabOpen) {
          setIsMicroLabOpen(false);
          setCameraZoomDelta(0);
        } else {
          handleOpenMicroLab(selectedDistrict || 'input-gateway');
        }
      } else if (e.key === 'v' || e.key === 'V') {
        triggerKeyFlash('V');
        setIsBattleModalOpen((open) => {
          if (open) setIsBattleRaceActive(false);
          return !open;
        });
      } else if (e.key === 'Enter' && selectedDistrict && !isDrawerOpen) {
        setIsDrawerOpen(true);
      } else if (e.key === 'ArrowLeft' && selectedDistrict && (isDrawerOpen || isMicroLabOpen)) {
        const idx = DISTRICTS.findIndex((d) => d.id === selectedDistrict);
        const prev = DISTRICTS[(idx - 1 + DISTRICTS.length) % DISTRICTS.length];
        if (prev) handleSelectDistrict(prev.id);
      } else if (e.key === 'ArrowRight' && selectedDistrict && (isDrawerOpen || isMicroLabOpen)) {
        const idx = DISTRICTS.findIndex((d) => d.id === selectedDistrict);
        const next = DISTRICTS[(idx + 1) % DISTRICTS.length];
        if (next) handleSelectDistrict(next.id);
      } else if (e.key >= '1' && e.key <= '8') {
        triggerKeyFlash(e.key);
        const idx = parseInt(e.key, 10) - 1;
        if (DISTRICTS[idx]) {
          handleSelectDistrict(DISTRICTS[idx].id);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    handleSelectDistrict,
    handleResetCamera,
    handleOpenMicroLab,
    toggleBlueprintMode,
    triggerKeyFlash,
    exitTour,
    isMicroLabOpen,
    isBattleModalOpen,
    isTechTreeOpen,
    isStackBuilderOpen,
    isCaseStudiesOpen,
    isTourRunning,
    isDrawerOpen,
    selectedDistrict,
    setIsTycoonActive,
    setIsTechTreeOpen,
  ]);

  const activeDemoStep =
    demoStepIndex !== null ? DEMO_JOURNEY_STEPS[demoStepIndex] : null;
  const activeDistrictObj = selectedDistrict
    ? DISTRICT_MAP[selectedDistrict]
    : null;
  const hoveredDistrictObj = hoveredDistrict
    ? DISTRICT_MAP[hoveredDistrict]
    : null;

  // Step 1 Guardrail: Prevent HUD overlap when DistrictDeepDiveDrawer, Tour, or Tycoon Mode is open
  const isLeftHeroCollapsed =
    heroMinimized || isDrawerOpen || isTourRunning || isTycoonActive;

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
            ? 'border-slate-800/80 bg-[#040814]/85'
            : 'border-slate-300/80 bg-white/90'
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 px-3 py-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetCamera}
              className="flex items-center gap-2.5 text-left group cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-cyan-400/50 bg-cyan-500/15 text-cyan-400 shadow-sm shadow-cyan-500/20">
                <Compass aria-hidden="true" className="h-4 w-4" />
              </span>
              <div>
                <span className="block font-mono text-xs font-bold tracking-wider uppercase">
                  {t.header.appTitle}
                </span>
                <span
                  className={`block font-mono text-[10px] ${
                    isNight ? 'text-cyan-400' : 'text-cyan-700 font-semibold'
                  }`}
                >
                  {t.header.appSubtitle}
                </span>
              </div>
            </button>
          </div>

          <nav
            aria-label="Primary Navigation"
            className="hidden xl:flex items-center gap-5 font-mono text-xs"
          >
            <a
              href="#interactive-city"
              className="rounded px-1.5 py-0.5 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {t.header.navCity}
            </a>
            <a
              href="#ai-pipeline-section"
              className="rounded px-1.5 py-0.5 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {t.header.navPipeline}
            </a>
            <a
              href="#system-activity-section"
              className="rounded px-1.5 py-0.5 hover:text-cyan-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {t.header.navTelemetry}
            </a>
          </nav>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Step 1: Trilingual Language Switcher [ EN | VI | 日本語 ] */}
            <div
              role="group"
              aria-label="Language Switcher"
              className={`inline-flex items-center rounded-xl border p-0.5 font-mono text-[10px] font-bold ${
                isNight
                  ? 'border-slate-800 bg-slate-950/90'
                  : 'border-slate-300 bg-slate-100'
              }`}
            >
              {LANGUAGE_OPTIONS.map((opt) => {
                const active = lang === opt.code;
                return (
                  <button
                    key={opt.code}
                    type="button"
                    onClick={() => setLang(opt.code)}
                    aria-pressed={active}
                    className={`rounded-lg px-2 py-1 transition-colors cursor-pointer ${
                      active
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : isNight
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Step 2: Stack Builder & Export Code Button */}
            <button
              type="button"
              onClick={() => setIsStackBuilderOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/60 bg-cyan-500/15 px-2.5 py-1.5 font-mono text-[11px] font-bold text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <Code2 aria-hidden="true" className="h-3.5 w-3.5" />
              <span>⚡ {t.header.btnStackBuilder}</span>
            </button>

            {/* Step 4: Applied Engineering Case Studies Button */}
            <button
              type="button"
              onClick={() => setIsCaseStudiesOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-amber-400/60 bg-amber-500/15 px-2.5 py-1.5 font-mono text-[11px] font-bold text-amber-300 hover:bg-amber-400 hover:text-slate-950 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
              <span>📐 {t.header.btnCaseStudies}</span>
            </button>

            {/* Phase 2 Module 2: A/B Architecture Battle Arena Button */}
            <button
              type="button"
              onClick={() => setIsBattleModalOpen(true)}
              title="Open A/B Architecture Battle Arena [V]"
              className={`inline-flex items-center gap-1.5 rounded-xl border border-violet-400/60 bg-violet-500/15 px-2.5 py-1.5 font-mono text-[11px] font-bold text-violet-300 hover:bg-violet-400 hover:text-slate-950 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                activeKeyFlash === 'V' ? 'ring-2 ring-cyan-400 scale-105' : ''
              }`}
            >
              <Swords aria-hidden="true" className="h-3.5 w-3.5" />
              <span>⚔️ {t.header.btnBattleArena}</span>
            </button>

            {/* Phase 2 Module 1: Enter District Micro-Lab Quick Button */}
            <button
              type="button"
              onClick={() => handleOpenMicroLab(selectedDistrict || 'input-gateway')}
              title="Enter District Algorithmic Micro-Lab [L]"
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-emerald-400/60 bg-emerald-500/15 px-2.5 py-1.5 font-mono text-[11px] font-bold text-emerald-300 hover:bg-emerald-400 hover:text-slate-950 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                activeKeyFlash === 'L' ? 'ring-2 ring-cyan-400 scale-105' : ''
              }`}
            >
              <Microscope aria-hidden="true" className="h-3.5 w-3.5" />
              <span>🔬 {t.header.btnEnterLab}</span>
            </button>

            {/* Phase 3: Tycoon Strategy Mode Toggle Button */}
            <button
              type="button"
              onClick={() => setIsTycoonActive((a) => !a)}
              aria-pressed={isTycoonActive}
              title="Toggle AI Lab Tycoon, Tech Tree & Boss Workload Defense Mode [G]"
              className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-mono text-[11px] font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                activeKeyFlash === 'G' ? 'ring-2 ring-amber-400 scale-105' : ''
              } ${
                isTycoonActive
                  ? 'border-amber-400 bg-amber-400 text-slate-950 shadow-md shadow-amber-500/25'
                  : 'border-amber-400/60 bg-amber-500/15 text-amber-300 hover:bg-amber-400 hover:text-slate-950'
              }`}
            >
              <Gamepad2 aria-hidden="true" className="h-3.5 w-3.5" />
              <span>🎮 {t.header.btnTycoonMode} [G]</span>
            </button>

            {/* Persistent Golden Chief AI Architect Campaign Victory Badge */}
            {tycoonSaveData.wave5Cleared && (
              <span
                title="Grand Architect Campaign Cleared (Survived Wave 5 Singularity Event)"
                className="hidden xl:inline-flex items-center gap-1.5 rounded-xl border border-amber-400 bg-amber-500/20 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-200 shadow-lg shadow-amber-500/20"
              >
                <Trophy aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" />
                <span>🏆 Chief AI Architect — Wave 5 Cleared</span>
              </span>
            )}

            {/* Blueprint / X-Ray Quick Toggle in Header */}
            <button
              type="button"
              onClick={toggleBlueprintMode}
              aria-pressed={isBlueprintMode}
              title="Toggle Blueprint / X-Ray Architecture Schematic Mode [B]"
              className={`hidden md:inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                activeKeyFlash === 'B' ? 'ring-2 ring-cyan-400 scale-105' : ''
              } ${
                isBlueprintMode
                  ? 'border-cyan-400 bg-cyan-400 text-slate-950 font-bold shadow-sm shadow-cyan-500/25'
                  : isNight
                  ? 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
                  : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Layers aria-hidden="true" className="h-3.5 w-3.5" />
              <span>{t.header.btnBlueprint}</span>
            </button>

            {/* Singularity Mode 100% City Mastery Banner & Controls */}
            {isSingularityMode && (
              <div className="hidden 2xl:flex items-center gap-1.5 rounded-xl border border-amber-400/70 bg-amber-500/15 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-300 shadow-lg shadow-amber-500/20">
                <span>⚡ 100% MASTERY</span>
                <button
                  type="button"
                  onClick={() =>
                    replayAwakeningPulse(selectedDistrict || 'model-core')
                  }
                  className="ml-1 rounded-md border border-amber-400/50 bg-amber-400/20 px-1.5 py-0.5 text-[9px] text-white hover:bg-amber-400 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Pulse
                </button>
                <button
                  type="button"
                  onClick={resetAllProgress}
                  className="rounded-md border border-slate-700 bg-slate-900/90 px-1.5 py-0.5 text-[9px] text-slate-300 hover:border-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Persistent Roadmap & City Mastery Toggle */}
            <button
              type="button"
              onClick={() => {
                if (!selectedDistrict) {
                  setSelectedDistrict('input-gateway');
                  setActivePipelineStage('input');
                  setIsDrawerOpen(true);
                } else {
                  setIsDrawerOpen((o) => !o);
                }
              }}
              aria-pressed={isDrawerOpen}
              title="Open Zero-to-Hero AI Engineering Roadmap, Quiz & VRAM Lab"
              className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 font-mono text-[11px] font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                isDrawerOpen
                  ? 'border-cyan-400 bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/20'
                  : isNight
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                  : 'border-cyan-600/40 bg-cyan-50 text-cyan-900 hover:bg-cyan-100'
              }`}
            >
              <Award aria-hidden="true" className="h-3.5 w-3.5" />
              <span>
                {t.header.btnRoadmap} · {cityMastery.completed}/{cityMastery.total}
              </span>
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
          className={`relative h-screen min-h-[780px] w-full overflow-hidden pt-14 ${
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
              isPaused={
                isPaused ||
                isMicroLabOpen ||
                (isTycoonActive && tycoonSpeedMode === 0)
              }
              flowSpeed={
                isTycoonActive
                  ? flowSpeed *
                    (tycoonSpeedMode === 2 ? 1.65 : 1.0) *
                    Math.min(2.4, 1 + tycoonUnlockedNodeIds.length * 0.06)
                  : flowSpeed
              }
              trainingMode={
                trainingMode || activeWorkload === 'distributed-training'
              }
              isNight={isNight}
              reducedMotion={reducedMotion}
              cameraZoomDelta={cameraZoomDelta}
              cameraAzimuthDelta={cameraAzimuthDelta}
              cameraResetTrigger={cameraResetTrigger}
              forceSimplified2D={forceSimplified2D}
              heroMinimized={isLeftHeroCollapsed}
              allDistrictsMastery={allDistrictsMastery}
              lastMasteredDistrictId={lastMasteredDistrictId}
              isSingularityMode={isSingularityMode}
              activeWorkload={activeWorkload}
              activeBottleneck={activeBottleneck}
              activePipelineMode={activePipelineMode}
              isBlueprintMode={isBlueprintMode}
              isBattleRaceActive={isBattleRaceActive}
              tycoonDistrictMetrics={
                isTycoonActive ? tycoonTelemetry.districtMetrics : undefined
              }
              onSelectDistrict={handleSelectDistrict}
              onDoubleClickDistrict={handleOpenMicroLab}
              onHoverDistrict={setHoveredDistrict}
            />
          </div>

          {/* Foreground HUD Layer */}
          <div className="pointer-events-none relative z-20 mx-auto flex h-full max-w-[1600px] flex-col justify-between p-4 sm:p-6">
            <div>
              {/* Phase 3: Top Tactical Tycoon Resource & Boss Wave Command Bar */}
              <TycoonCommandHUD
                isActive={isTycoonActive}
                isNight={isNight}
                speedMode={tycoonSpeedMode}
                credits={tycoonCredits}
                rp={tycoonRp}
                slaStability={tycoonSlaStability}
                currentHardware={tycoonCurrentHardware}
                nextHardware={tycoonNextHardware}
                unlockedNodeIds={tycoonUnlockedNodeIds}
                currentWave={tycoonCurrentWave}
                waveElapsedSec={tycoonWaveElapsedSec}
                campaignStatus={tycoonCampaignStatus}
                saveData={tycoonSaveData}
                telemetry={tycoonTelemetry}
                selectedDistrict={selectedDistrict}
                canResearchNode={canResearchTycoonNode}
                onResearchNode={researchTycoonNode}
                onUpgradeHardware={upgradeTycoonHardware}
                onSetSpeedMode={setTycoonSpeedMode}
                onCallNextWaveEarly={callNextTycoonWaveEarly}
                onOpenTechTree={() => setIsTechTreeOpen(true)}
                onFocusDistrict={(id) => {
                  setSelectedDistrict(id);
                  setActivePipelineStage(DISTRICT_MAP[id].pipelineStage);
                }}
                onResetCampaign={resetTycoonCampaign}
                onCloseTycoonMode={() => setIsTycoonActive(false)}
              />

              {/* TOP ROW: Compact Hero Overlay Card (Left) + District Detail Panel (Right) */}
              <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
              {/* Left Column: Compact Hero Panel, Packet Tracer, Chaos Simulator, AI Architect Dock & Live Telemetry */}
              <div
                className={`flex flex-col gap-2.5 w-full transition-all duration-300 ${
                  isDrawerOpen ? 'max-w-[330px]' : 'max-w-[385px]'
                }`}
              >
                {!isLeftHeroCollapsed ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    onWheel={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`pointer-events-auto relative rounded-2xl p-4 sm:p-5 transition-colors ${
                      isNight
                        ? 'hud-glass-dark text-slate-100'
                        : 'hud-glass-light text-slate-900'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setHeroMinimized(true)}
                      title="Minimize intro card for full-screen city view"
                      aria-label="Minimize intro card"
                      className={`absolute top-3.5 right-3.5 rounded-lg border p-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        isNight
                          ? 'border-slate-700/70 bg-slate-900/60 text-slate-400 hover:text-white'
                          : 'border-slate-300 bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Minimize2 aria-hidden="true" className="h-3.5 w-3.5" />
                    </button>

                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-widest uppercase ${
                        isNight
                          ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                          : 'border-cyan-600/40 bg-cyan-50 text-cyan-800'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"
                      />
                      {t.hero.badge}
                    </div>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight">
                      {t.hero.title}
                    </h1>

                    <p
                      className={`mt-1 text-xs leading-relaxed ${
                        isNight ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {t.hero.subtitle}
                    </p>

                    {/* 3-Mode Architectural Pipeline Switcher */}
                    <div
                      className={`mt-3 rounded-xl border p-2.5 ${
                        isNight
                          ? 'border-cyan-500/35 bg-slate-950/85'
                          : 'border-cyan-600/30 bg-cyan-50/70'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase">
                        <span className="font-bold text-cyan-400">
                          {t.ui.pipelineModeTitle}
                        </span>
                        <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300">
                          {t.ui.canonicalBadge}
                        </span>
                      </div>
                      <div
                        role="tablist"
                        aria-label="3D HUD Pipeline Mode Switcher"
                        className="mt-1.5 grid grid-cols-3 gap-1"
                      >
                        {ARCHITECTURAL_PIPELINE_MODES.map((m) => {
                          const isSelectedMode = m.id === activePipelineMode;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              role="tab"
                              aria-selected={isSelectedMode}
                              onClick={() => handleSelectPipelineMode(m.id)}
                              className={`rounded-lg px-2 py-1 text-center font-mono text-[10px] transition-colors cursor-pointer truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                                isSelectedMode
                                  ? m.id === 'online-inference'
                                    ? 'bg-cyan-400 text-slate-950 font-bold'
                                    : m.id === 'offline-indexing'
                                    ? 'bg-emerald-400 text-slate-950 font-bold'
                                    : 'bg-fuchsia-400 text-slate-950 font-bold'
                                  : isNight
                                  ? 'bg-slate-900 text-slate-300 hover:text-white'
                                  : 'bg-white text-slate-700 hover:text-slate-950'
                              }`}
                            >
                              {t.pipelineModes[m.id]?.shortLabel || m.shortLabel}
                            </button>
                          );
                        })}
                      </div>
                      <p
                        className={`mt-1.5 font-mono text-[9px] truncate ${
                          isNight ? 'text-cyan-300/90' : 'text-cyan-900'
                        }`}
                        title={
                          ARCHITECTURAL_MODE_MAP[activePipelineMode]
                            .directedFlowSummary
                        }
                      >
                        {
                          ARCHITECTURAL_MODE_MAP[activePipelineMode]
                            .directedFlowSummary
                        }
                      </p>
                    </div>

                    {/* Step 2: Interactive Workload Simulator ("Packet Tracer") */}
                    <div
                      className={`mt-3 rounded-xl border p-2.5 ${
                        isNight
                          ? 'border-slate-800 bg-slate-950/75'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase text-cyan-400">
                        <span className="flex items-center gap-1 font-bold">
                          <Terminal aria-hidden="true" className="h-3 w-3" />
                          {t.hero.workloadLabel}
                        </span>
                        <span
                          className="rounded px-1.5 py-0.5 text-[9px] font-bold"
                          style={{
                            backgroundColor: `${activeWorkloadObj.particleColorHex}22`,
                            color: activeWorkloadObj.particleColorHex,
                          }}
                        >
                          {t.workloads[activeWorkloadObj.id]?.shortBadge ||
                            activeWorkloadObj.shortBadge}
                        </span>
                      </div>
                      <div className="mt-1.5 grid grid-cols-2 gap-1">
                        {WORKLOAD_PRESETS.map((preset) => {
                          const isCurrent = preset.id === activeWorkload;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setActiveWorkload(preset.id)}
                              aria-pressed={isCurrent}
                              className={`rounded-lg px-2 py-1 text-left font-mono text-[10px] transition-colors cursor-pointer truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                                isCurrent
                                  ? 'bg-cyan-400 text-slate-950 font-bold'
                                  : isNight
                                  ? 'bg-slate-900 text-slate-300 hover:text-white'
                                  : 'bg-slate-200 text-slate-700 hover:text-slate-950'
                              }`}
                            >
                              {t.workloads[preset.id]?.shortBadge || preset.shortBadge}
                            </button>
                          );
                        })}
                      </div>
                      <p
                        className={`mt-1.5 font-mono text-[10px] truncate ${
                          isNight ? 'text-slate-300' : 'text-slate-700'
                        }`}
                        title={activeWorkloadObj.payloadPreview}
                      >
                        {activeWorkloadObj.payloadPreview}
                      </p>
                    </div>

                    {/* Step 3: Compact Chaos & Bottleneck Simulator */}
                    <div
                      className={`mt-2.5 rounded-xl border p-2.5 ${
                        activeBottleneck !== 'none'
                          ? 'border-rose-500/60 bg-rose-950/35'
                          : isNight
                          ? 'border-slate-800 bg-slate-950/75'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] uppercase">
                        <span
                          className={`flex items-center gap-1 font-bold ${
                            activeBottleneck !== 'none'
                              ? 'text-rose-400'
                              : 'text-amber-400'
                          }`}
                        >
                          <Flame aria-hidden="true" className="h-3 w-3" />
                          {t.hero.chaosLabel}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          {t.bottlenecks[activeBottleneckObj.id]?.shortLabel ||
                            activeBottleneckObj.shortLabel}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {BOTTLENECK_SCENARIOS.map((scen) => {
                          const active = scen.id === activeBottleneck;
                          return (
                            <button
                              key={scen.id}
                              type="button"
                              onClick={() => setActiveBottleneck(scen.id)}
                              aria-pressed={active}
                              className={`rounded-lg px-2 py-1 font-mono text-[9px] transition-colors cursor-pointer ${
                                active
                                  ? scen.id === 'none'
                                    ? 'bg-emerald-400 text-slate-950 font-bold'
                                    : 'bg-rose-500 text-white font-bold'
                                  : isNight
                                  ? 'bg-slate-900 text-slate-300 hover:text-white'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {t.bottlenecks[scen.id]?.shortLabel || scen.shortLabel}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-3.5 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleExploreCityClick}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-400 px-3.5 py-2 font-mono text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-300 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                      >
                        <Compass aria-hidden="true" className="h-3.5 w-3.5" />
                        <span>{t.hero.exploreBtn}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleViewPipelineClick}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                          isNight
                            ? 'border-slate-700 bg-slate-900/90 text-slate-200 hover:border-cyan-400 hover:text-white'
                            : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
                        }`}
                      >
                        <GitBranch aria-hidden="true" className="h-3.5 w-3.5 text-cyan-400" />
                        <span>{t.hero.pipelineBtn}</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="pointer-events-auto flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setHeroMinimized(false);
                        setIsDrawerOpen(false);
                      }}
                      className={`inline-flex items-center gap-2 rounded-2xl px-3.5 py-2 font-mono text-xs font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        isNight
                          ? 'hud-glass-dark text-slate-200 hover:border-cyan-400'
                          : 'hud-glass-light text-slate-900'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"
                      />
                      <span>{t.hero.minimizedPill}</span>
                      <Maximize2 aria-hidden="true" className="h-3.5 w-3.5 text-cyan-400" />
                    </button>
                  </div>
                )}

                {/* Active Chaos Bottleneck Diagnostic Alert Banner + 1-Click Fix */}
                <AnimatePresence>
                  {activeBottleneck !== 'none' &&
                    activeBottleneckObj.targetDistrictId &&
                    activeBottleneckObj.fixMilestoneId && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        onWheel={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="pointer-events-auto rounded-2xl border border-rose-500/80 bg-rose-950/95 p-3.5 text-slate-100 shadow-2xl shadow-rose-500/20 backdrop-blur-xl"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-rose-300">
                            <AlertTriangle
                              aria-hidden="true"
                              className="h-3.5 w-3.5 text-rose-400 shrink-0"
                            />
                            {t.bottlenecks[activeBottleneckObj.id]?.title ||
                              activeBottleneckObj.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveBottleneck('none')}
                            className="font-mono text-[10px] text-rose-300 hover:text-white cursor-pointer"
                          >
                            {t.ui.clearBtn}
                          </button>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-rose-100/90">
                          {t.bottlenecks[activeBottleneckObj.id]?.diagnosticMessage ||
                            activeBottleneckObj.diagnosticMessage}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            handleFixBottleneck(
                              activeBottleneckObj.targetDistrictId!,
                              activeBottleneckObj.fixMilestoneId!
                            )
                          }
                          className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-3 py-1.5 font-mono text-[11px] font-bold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
                        >
                          <Wrench aria-hidden="true" className="h-3.5 w-3.5" />
                          <span>
                            [
                            {t.bottlenecks[activeBottleneckObj.id]?.fixButtonLabel ||
                              activeBottleneckObj.fixButtonLabel}{' '}
                            →]
                          </span>
                        </button>
                      </motion.div>
                    )}
                </AnimatePresence>

                {/* Hero Status Panel (SYSTEM STATUS | ACTIVE NODES | DATA FLOW | MODEL LOAD) */}
                <HeroStatusHUD
                  isPaused={isPaused}
                  flowSpeed={flowSpeed}
                  trainingMode={
                    trainingMode || activeWorkload === 'distributed-training'
                  }
                  isNight={isNight}
                  masteryCompleted={cityMastery.completed}
                  masteryTotal={cityMastery.total}
                  computedTelemetry={computedTelemetry}
                  activeBottleneck={activeBottleneck}
                  activePipelineMode={activePipelineMode}
                />

                {/* Step 3.2: AI City Architect Agent Trigger & Command Bar */}
                <ArchitectAgentDock
                  isNight={isNight}
                  activePlan={activePlan}
                  isTourRunning={isTourRunning}
                  isTourPaused={isTourPaused}
                  currentStepIndex={currentStepIndex}
                  currentTourStep={currentTourStep}
                  onSelectPlan={setActivePlan}
                  onStartTour={startTour}
                  onToggleTourPause={() => setIsTourPaused((p) => !p)}
                  onNextStep={nextStep}
                  onPrevStep={prevStep}
                  onSelectStepIndex={selectStepIndex}
                  onExitTour={exitTour}
                  onLoadStackIntoBuilder={handleLoadPlanStackIntoBuilder}
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
                          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                          {activeDemoStep.headline}
                        </span>
                        <button
                          type="button"
                          onClick={() => setDemoStepIndex(null)}
                          className="font-mono text-[10px] text-slate-400 hover:text-white cursor-pointer"
                        >
                          {t.ui.stopBtn}
                        </button>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-200">
                        {activeDemoStep.narration}
                      </p>
                      <div className="mt-2 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 font-mono text-[10px] text-cyan-300">
                        {activeDemoStep.packetSample}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Deep-Dive Roadmap Drawer OR Selected District Info Panel OR Hover Preview Hint */}
              <div className="w-full lg:w-auto flex flex-col items-end">
                {activeDistrictObj && isDrawerOpen ? (
                  <DistrictDeepDiveDrawer
                    districtId={activeDistrictObj.id}
                    isOpen={isDrawerOpen}
                    isNight={isNight}
                    isFlowHighlighted={highlightedFlowDistrict === activeDistrictObj.id}
                    activeTab={drawerTab}
                    onTabChange={setDrawerTab}
                    highlightedMilestoneId={highlightedMilestoneId}
                    isCompleted={isCompleted}
                    onToggleMilestone={toggleMilestone}
                    onTriggerMilestonePulse={(dId) => replayAwakeningPulse(dId)}
                    getDistrictProgress={getDistrictProgress}
                    getTotalCityMastery={getTotalCityMastery}
                    vramConfig={vramConfig}
                    computedTelemetry={computedTelemetry}
                    onUpdateVramConfig={updateVramConfig}
                    onClose={() => setIsDrawerOpen(false)}
                    onMinimizeToCompactHud={() => setIsDrawerOpen(false)}
                    onSelectDistrict={(id) => handleSelectDistrict(id)}
                    onToggleDataFlow={handleToggleDataFlow}
                    onOpenStackBuilder={() => setIsStackBuilderOpen(true)}
                    onOpenCaseStudies={() => setIsCaseStudiesOpen(true)}
                    onOpenMicroLab={handleOpenMicroLab}
                  />
                ) : activeDistrictObj ? (
                  <DistrictInfoPanel
                    district={activeDistrictObj}
                    isFlowHighlighted={highlightedFlowDistrict === activeDistrictObj.id}
                    isNight={isNight}
                    districtProgress={getDistrictProgress(activeDistrictObj.id)}
                    onClose={() => handleSelectDistrict(null)}
                    onToggleDataFlow={handleToggleDataFlow}
                    onSelectDistrict={(id) => handleSelectDistrict(id)}
                    onOpenDeepDiveDrawer={() => setIsDrawerOpen(true)}
                  />
                ) : (
                  <div
                    className={`pointer-events-auto hidden sm:flex items-center gap-2.5 rounded-2xl px-4 py-2.5 ${
                      isNight
                        ? 'hud-glass-dark text-slate-200'
                        : 'hud-glass-light text-slate-800'
                    }`}
                  >
                    <MousePointerClick
                      aria-hidden="true"
                      className="h-4 w-4 text-cyan-400 shrink-0"
                    />
                    <div className="text-xs">
                      {hoveredDistrictObj ? (
                        <span>
                          <strong
                            className={`font-mono ${
                              isNight ? 'text-cyan-400' : 'text-cyan-700'
                            }`}
                          >
                            {t.districts[hoveredDistrictObj.id]?.name ||
                              hoveredDistrictObj.name}
                            :
                          </strong>{' '}
                          {t.districts[hoveredDistrictObj.id]?.tagline ||
                            hoveredDistrictObj.tagline}
                        </span>
                      ) : (
                        <span className="font-mono">{t.hero.orbitHint}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>

            {/* BOTTOM ROW: Quick District Selector Bar + Scene Controls Toolbar */}
            <div className="flex flex-col gap-2 items-center justify-end w-full">
              {/* Touch-Friendly & Keyboard-Accessible District Quick Bar */}
              <div
                role="navigation"
                aria-label="City Districts Quick Selector"
                onWheel={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className={`pointer-events-auto flex items-center gap-1.5 overflow-x-auto max-w-full rounded-2xl p-1.5 ${
                  isNight ? 'hud-glass-dark' : 'hud-glass-light'
                }`}
              >
                <span
                  className={`px-2.5 font-mono text-[10px] uppercase tracking-wider shrink-0 hidden md:inline ${
                    isNight ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {t.hero.selectDistrictPrompt}
                </span>
                {DISTRICTS.map((d, idx) => {
                  const active = selectedDistrict === d.id;
                  const mastery = allDistrictsMastery[d.id];
                  const isMastered = mastery?.isMastered ?? false;
                  const completedCount = mastery?.completedCount ?? 0;
                  const keyNum = String(idx + 1);
                  const isKeyFlashed = activeKeyFlash === keyNum;
                  const isBottleneckTarget =
                    activeBottleneckObj.targetDistrictId === d.id;
                  const locDistrict = t.districts[d.id];

                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleSelectDistrict(active ? null : d.id)}
                      onMouseEnter={() => setHoveredDistrict(d.id)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      aria-pressed={active}
                      className={`relative overflow-hidden inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-mono text-[11px] font-medium whitespace-nowrap transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        isKeyFlashed ? 'ring-2 ring-cyan-400 scale-105' : ''
                      } ${
                        isBottleneckTarget
                          ? 'border border-rose-500 bg-rose-500/20 text-rose-200 font-bold animate-pulse'
                          : active
                          ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                          : isMastered
                          ? isNight
                            ? 'border border-amber-400/50 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20'
                            : 'border border-amber-500/50 bg-amber-50 text-amber-900'
                          : isNight
                          ? 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: isBottleneckTarget
                            ? '#EF4444'
                            : active
                            ? '#040814'
                            : d.accentColor,
                        }}
                      />
                      <span className="opacity-65 text-[9px]">0{idx + 1}</span>
                      <span>{locDistrict?.shortName || d.shortName}</span>
                      {isBottleneckTarget ? (
                        <span className="ml-0.5 text-[10px] text-rose-400 font-bold">
                          ⚠
                        </span>
                      ) : isMastered ? (
                        <span
                          title="District Mastered (4/4)"
                          className={`ml-0.5 text-[10px] font-bold ${
                            active ? 'text-slate-950' : 'text-amber-400'
                          }`}
                        >
                          ★
                        </span>
                      ) : completedCount > 0 ? (
                        <span
                          className={`ml-0.5 rounded px-1 text-[9px] font-bold ${
                            active
                              ? 'bg-slate-950/20 text-slate-950'
                              : isNight
                              ? 'bg-slate-800 text-cyan-300'
                              : 'bg-slate-200 text-cyan-800'
                          }`}
                        >
                          {completedCount}/4
                        </span>
                      ) : null}

                      {/* Bottom mini progress bar */}
                      {completedCount > 0 && (
                        <span
                          aria-hidden="true"
                          className="absolute bottom-0 left-0 h-0.5 transition-all duration-300"
                          style={{
                            width: `${(completedCount / 4) * 100}%`,
                            backgroundColor: active
                              ? '#040814'
                              : isMastered
                              ? '#F59E0B'
                              : d.accentColor,
                          }}
                        />
                      )}
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
                isBlueprintMode={isBlueprintMode}
                activeKeyFlash={activeKeyFlash}
                onToggleLabels={() => setShowLabels((s) => !s)}
                onTogglePause={() => setIsPaused((p) => !p)}
                onChangeSpeed={(spd) => setFlowSpeed(spd)}
                onToggleTrainingMode={() => {
                  setTrainingMode((prev) => {
                    const next = !prev;
                    setActivePipelineMode(
                      next ? 'offline-training' : 'online-inference'
                    );
                    return next;
                  });
                }}
                onToggleBlueprintMode={toggleBlueprintMode}
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
          activePipelineMode={activePipelineMode}
          isNight={isNight}
          getDistrictProgress={getDistrictProgress}
          onSelectStage={handleSelectStageFromTimeline}
          onSelectPipelineMode={handleSelectPipelineMode}
          onSelectDistrictAndScroll={handleSelectDistrictAndScrollToCity}
          onOpenRoadmapDrawer={handleOpenRoadmapDrawer}
        />

        {/* ==================== SYSTEM ACTIVITY TELEMETRY SECTION ==================== */}
        <SystemStatusPanel
          isPaused={isPaused}
          flowSpeed={flowSpeed}
          trainingMode={
            trainingMode || activeWorkload === 'distributed-training'
          }
          isNight={isNight}
          reducedMotion={reducedMotion}
          masteryCompleted={cityMastery.completed}
          masteryTotal={cityMastery.total}
          masteredDistrictsCount={masteredDistrictsCount}
          computedTelemetry={computedTelemetry}
          activeBottleneck={activeBottleneck}
          activePipelineMode={activePipelineMode}
          onSelectPipelineMode={handleSelectPipelineMode}
          onSelectBottleneck={setActiveBottleneck}
          onFixBottleneck={handleFixBottleneck}
        />
      </main>

      {/* ==================== PHASE 1 STUDIO MODALS ==================== */}
      <StackBuilderModal
        isOpen={isStackBuilderOpen}
        isNight={isNight}
        selections={stackSelections}
        onUpdateSelection={(districtId, optionId) =>
          setStackSelections((prev) => ({ ...prev, [districtId]: optionId }))
        }
        onResetDefaults={() => setStackSelections(DEFAULT_STACK_SELECTIONS)}
        onClose={() => setIsStackBuilderOpen(false)}
      />

      <CaseStudiesModal
        isOpen={isCaseStudiesOpen}
        isNight={isNight}
        activeCaseStudyId={activeCaseStudyId}
        onSimulateCaseStudy={handleSimulateCaseStudy}
        onInspectInStackBuilder={handleInspectCaseStudyStack}
        onClose={() => setIsCaseStudiesOpen(false)}
      />

      {/* ==================== PHASE 2 MODALS: MICRO-LABS & BATTLE ARENA ==================== */}
      <DistrictMicroLabModal
        districtId={selectedDistrict || 'input-gateway'}
        isOpen={isMicroLabOpen}
        isNight={isNight}
        onSelectDistrict={(id) => {
          setSelectedDistrict(id);
          setActivePipelineStage(DISTRICT_MAP[id].pipelineStage);
        }}
        onClose={() => {
          setIsMicroLabOpen(false);
          setCameraZoomDelta(0);
        }}
      />

      <ArchitectureBattleModal
        isOpen={isBattleModalOpen}
        isNight={isNight}
        customStackSelections={stackSelections}
        onBattleRaceStateChange={setIsBattleRaceActive}
        onClose={() => {
          setIsBattleModalOpen(false);
          setIsBattleRaceActive(false);
        }}
      />

      {/* ==================== PHASE 3 MODAL: 24-NODE TECH TREE ==================== */}
      <TechTreeModal
        isOpen={isTechTreeOpen}
        isNight={isNight}
        credits={tycoonCredits}
        rp={tycoonRp}
        hardwareTierIndex={tycoonHardwareTierIndex}
        unlockedNodeIds={tycoonUnlockedNodeIds}
        telemetry={tycoonTelemetry}
        canResearchNode={canResearchTycoonNode}
        onResearchNode={researchTycoonNode}
        onUpgradeHardware={upgradeTycoonHardware}
        onClose={() => setIsTechTreeOpen(false)}
      />

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
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-cyan-400" />
            <span
              className={`font-bold ${
                isNight ? 'text-slate-200' : 'text-slate-900'
              }`}
            >
              AI NEURAL CITY
            </span>
            <span>— {t.header.appSubtitle}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span
              className={`rounded px-1.5 py-0.5 transition-all ${
                activeKeyFlash && activeKeyFlash >= '1' && activeKeyFlash <= '8'
                  ? 'ring-2 ring-cyan-400 scale-105 bg-cyan-500/20 text-cyan-300'
                  : ''
              }`}
            >
              {t.ui.footer.shortcutDistrict}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 transition-all ${
                activeKeyFlash === 'G' || activeKeyFlash === 'T'
                  ? 'ring-2 ring-amber-400 scale-105 bg-amber-500/20 text-amber-300'
                  : ''
              }`}
            >
              {t.ui.footer.shortcutTycoon}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 transition-all ${
                activeKeyFlash === 'L'
                  ? 'ring-2 ring-cyan-400 scale-105 bg-cyan-500/20 text-cyan-300'
                  : ''
              }`}
            >
              {t.ui.footer.shortcutLab}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 transition-all ${
                activeKeyFlash === 'V'
                  ? 'ring-2 ring-cyan-400 scale-105 bg-cyan-500/20 text-cyan-300'
                  : ''
              }`}
            >
              {t.ui.footer.shortcutBattle}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 transition-all ${
                activeKeyFlash === 'B'
                  ? 'ring-2 ring-cyan-400 scale-105 bg-cyan-500/20 text-cyan-300'
                  : ''
              }`}
            >
              {t.ui.footer.shortcutBlueprint}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 transition-all ${
                activeKeyFlash === 'R'
                  ? 'ring-2 ring-cyan-400 scale-105 bg-cyan-500/20 text-cyan-300'
                  : ''
              }`}
            >
              {t.ui.footer.shortcutReset}
            </span>
            <span
              className={`rounded px-1.5 py-0.5 transition-all ${
                activeKeyFlash === 'Esc'
                  ? 'ring-2 ring-cyan-400 scale-105 bg-cyan-500/20 text-cyan-300'
                  : ''
              }`}
            >
              {t.ui.footer.shortcutClose}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <LanguageProvider>
      <SimulationProvider>
        <NeuralCitySandboxApp />
      </SimulationProvider>
    </LanguageProvider>
  );
}
