'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import {
  WorkloadPresetId,
  BottleneckScenarioId,
  VramCalculatorState,
  ComputedSimulationTelemetry,
  DEFAULT_VRAM_CONFIG,
  getBytesPerParam,
  computeVramAndTelemetry,
} from '../data/bottleneck-scenarios.ts';

export type {
  WorkloadPresetId,
  BottleneckScenarioId,
  VramCalculatorState,
  ComputedSimulationTelemetry,
};
export {
  DEFAULT_VRAM_CONFIG,
  getBytesPerParam,
  computeVramAndTelemetry,
};

export interface SimulationContextValue {
  activeWorkload: WorkloadPresetId;
  setActiveWorkload: (id: WorkloadPresetId) => void;
  activeBottleneck: BottleneckScenarioId;
  setActiveBottleneck: (id: BottleneckScenarioId) => void;
  isBlueprintMode: boolean;
  setIsBlueprintMode: (val: boolean) => void;
  toggleBlueprintMode: () => void;
  vramConfig: VramCalculatorState;
  updateVramConfig: (partial: Partial<VramCalculatorState>) => void;
  computedTelemetry: ComputedSimulationTelemetry;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export const SimulationProvider: React.FC<{
  children: React.ReactNode;
  masteryRatio?: number;
}> = ({ children, masteryRatio = 0 }) => {
  const [activeWorkload, setActiveWorkload] =
    useState<WorkloadPresetId>('multimodal-vision');
  const [activeBottleneck, setActiveBottleneck] =
    useState<BottleneckScenarioId>('none');
  const [isBlueprintMode, setIsBlueprintMode] = useState<boolean>(false);
  const [vramConfig, setVramConfig] =
    useState<VramCalculatorState>(DEFAULT_VRAM_CONFIG);

  const toggleBlueprintMode = useCallback(() => {
    setIsBlueprintMode((prev) => !prev);
  }, []);

  const updateVramConfig = useCallback(
    (partial: Partial<VramCalculatorState>) => {
      setVramConfig((prev) => {
        const next = { ...prev, ...partial };
        const bytes = getBytesPerParam(next.quantization);
        const weights = next.parameterCountBillion * bytes * 1.1;
        const kv =
          next.batchSize *
          next.contextLength *
          0.00015 *
          (next.parameterCountBillion / 7) *
          (bytes / 2);
        const total = weights + kv;

        if (total > next.gpuMemoryBudgetGb) {
          setActiveBottleneck('kv-cache-oom');
        } else {
          setActiveBottleneck((curr) =>
            curr === 'kv-cache-oom' ? 'none' : curr
          );
        }
        return next;
      });
    },
    []
  );

  const computedTelemetry = useMemo(
    () =>
      computeVramAndTelemetry(
        vramConfig,
        activeWorkload,
        activeBottleneck,
        masteryRatio
      ),
    [vramConfig, activeWorkload, activeBottleneck, masteryRatio]
  );

  const value = useMemo<SimulationContextValue>(
    () => ({
      activeWorkload,
      setActiveWorkload,
      activeBottleneck,
      setActiveBottleneck,
      isBlueprintMode,
      setIsBlueprintMode,
      toggleBlueprintMode,
      vramConfig,
      updateVramConfig,
      computedTelemetry,
    }),
    [
      activeWorkload,
      activeBottleneck,
      isBlueprintMode,
      toggleBlueprintMode,
      vramConfig,
      updateVramConfig,
      computedTelemetry,
    ]
  );

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

export function useSimulation(): SimulationContextValue {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return ctx;
}
