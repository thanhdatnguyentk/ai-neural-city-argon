'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { DistrictId } from '../data/districts';
import {
  DISTRICT_ROADMAPS,
  DISTRICT_ROADMAP_MAP,
} from '../data/district-roadmaps.ts';

export const ROADMAP_STORAGE_KEY = 'neural_city_roadmap_progress_v1';
export const ROADMAP_SYNC_EVENT = 'neural-city-roadmap-sync';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface ProgressStats {
  completed: number;
  total: number;
  percentage: number;
}

export interface DistrictMasteryMetrics {
  districtId: DistrictId;
  completedCount: number; // 0 to 4
  totalCount: number; // 4
  percentage: number; // 0, 25, 50, 75, 100
  isMastered: boolean; // completedCount === 4
}

interface RoadmapSyncDetail {
  lastMasteredDistrictId?: DistrictId | null;
  singularityPulse?: boolean;
}

export function readStoredMilestones(storage?: StorageLike | null): string[] {
  const targetStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined'
      ? window.localStorage
      : null;

  if (!targetStorage) return [];

  try {
    const raw = targetStorage.getItem(ROADMAP_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return Array.from(
      new Set(parsed.filter((item): item is string => typeof item === 'string'))
    );
  } catch {
    return [];
  }
}

export function writeStoredMilestones(
  milestoneIds: string[],
  storage?: StorageLike | null
): void {
  const targetStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined'
      ? window.localStorage
      : null;

  if (!targetStorage) return;

  try {
    const deduplicated = Array.from(new Set(milestoneIds));
    targetStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(deduplicated));
  } catch {
    // Ignore quota or private-browsing storage errors gracefully
  }
}

export function toggleMilestoneInList(
  currentIds: string[],
  milestoneId: string
): string[] {
  const exists = currentIds.includes(milestoneId);
  if (exists) {
    return currentIds.filter((id) => id !== milestoneId);
  }
  return [...currentIds, milestoneId];
}

export function computeDistrictProgress(
  districtId: DistrictId | string | number,
  completedIds: string[]
): ProgressStats {
  const deepDive =
    DISTRICT_ROADMAP_MAP[districtId as DistrictId] ??
    DISTRICT_ROADMAPS.find(
      (d) =>
        d.districtId === districtId ||
        d.districtCode === districtId ||
        `0${DISTRICT_ROADMAPS.indexOf(d) + 1}` === String(districtId)
    );

  if (!deepDive) {
    return { completed: 0, total: 4, percentage: 0 };
  }

  const total = deepDive.roadmap.length;
  const completed = deepDive.roadmap.filter((m) =>
    completedIds.includes(m.id)
  ).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

export function computeDistrictMasteryMetrics(
  districtId: DistrictId,
  completedIds: string[]
): DistrictMasteryMetrics {
  const stats = computeDistrictProgress(districtId, completedIds);
  return {
    districtId,
    completedCount: stats.completed,
    totalCount: stats.total,
    percentage: stats.percentage,
    isMastered: stats.completed === stats.total && stats.total > 0,
  };
}

export function computeAllDistrictsMastery(
  completedIds: string[]
): Record<DistrictId, DistrictMasteryMetrics> {
  const result = {} as Record<DistrictId, DistrictMasteryMetrics>;
  for (const d of DISTRICT_ROADMAPS) {
    result[d.districtId] = computeDistrictMasteryMetrics(
      d.districtId,
      completedIds
    );
  }
  return result;
}

/**
 * Proportional Data Stream Acceleration & Overdrive:
 * - 0% (p = 0): 1.0x
 * - 25%..75% (0 < p < 1): 1 + p * 0.6
 * - 100% (isMastered): 2.0x Particle Overdrive
 */
export function computeDistrictParticleSpeedMultiplier(
  metrics: DistrictMasteryMetrics
): number {
  if (metrics.isMastered) return 2.0;
  const p = metrics.totalCount > 0 ? metrics.completedCount / metrics.totalCount : 0;
  return 1 + p * 0.6;
}

/**
 * Progressive Emissive Boost:
 * I_target = I_0 + p * 1.15
 */
export function computeDistrictTargetEmissive(
  baseEmissive: number,
  metrics: DistrictMasteryMetrics
): number {
  const p = metrics.totalCount > 0 ? metrics.completedCount / metrics.totalCount : 0;
  return baseEmissive + p * 1.15;
}

/**
 * Detects whether a district transitioned from <100% to 100%
 */
export function didDistrictTransitionToMastered(
  districtId: DistrictId,
  prevCompletedIds: string[],
  nextCompletedIds: string[]
): boolean {
  const prevMetrics = computeDistrictMasteryMetrics(districtId, prevCompletedIds);
  const nextMetrics = computeDistrictMasteryMetrics(districtId, nextCompletedIds);
  return !prevMetrics.isMastered && nextMetrics.isMastered;
}

export function findDistrictForMilestone(milestoneId: string): DistrictId | null {
  for (const d of DISTRICT_ROADMAPS) {
    if (d.roadmap.some((m) => m.id === milestoneId)) {
      return d.districtId;
    }
  }
  return null;
}

export function computeTotalCityMastery(completedIds: string[]): ProgressStats {
  const total = DISTRICT_ROADMAPS.reduce(
    (sum, d) => sum + d.roadmap.length,
    0
  );
  const validMilestoneSet = new Set(
    DISTRICT_ROADMAPS.flatMap((d) => d.roadmap.map((m) => m.id))
  );
  const completed = completedIds.filter((id) => validMilestoneSet.has(id)).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

export function useRoadmapProgress() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [lastMasteredDistrictId, setLastMasteredDistrictId] =
    useState<DistrictId | null>(null);
  const [singularityPulseCount, setSingularityPulseCount] = useState<number>(0);
  const shockwaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerDistrictShockwave = useCallback((districtId: DistrictId) => {
    setLastMasteredDistrictId(districtId);
    if (shockwaveTimerRef.current) {
      clearTimeout(shockwaveTimerRef.current);
    }
    shockwaveTimerRef.current = setTimeout(() => {
      setLastMasteredDistrictId(null);
    }, 2500);
  }, []);

  useEffect(() => {
    setCompletedIds(readStoredMilestones());
    setIsHydrated(true);
    return () => {
      if (shockwaveTimerRef.current) {
        clearTimeout(shockwaveTimerRef.current);
      }
    };
  }, []);

  // Listen for cross-tab or same-tab custom storage sync events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ROADMAP_STORAGE_KEY) {
        setCompletedIds(readStoredMilestones());
      }
    };
    const handleCustomSync = (e: Event) => {
      setCompletedIds(readStoredMilestones());
      const customEvent = e as CustomEvent<RoadmapSyncDetail>;
      if (customEvent.detail?.lastMasteredDistrictId) {
        triggerDistrictShockwave(customEvent.detail.lastMasteredDistrictId);
      }
      if (customEvent.detail?.singularityPulse) {
        setSingularityPulseCount((c) => c + 1);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener(ROADMAP_SYNC_EVENT, handleCustomSync);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(ROADMAP_SYNC_EVENT, handleCustomSync);
    };
  }, [triggerDistrictShockwave]);

  const isCompleted = useCallback(
    (milestoneId: string): boolean => {
      if (!isHydrated) return false;
      return completedIds.includes(milestoneId);
    },
    [completedIds, isHydrated]
  );

  const toggleMilestone = useCallback(
    (milestoneId: string): void => {
      const prev = readStoredMilestones();
      const next = toggleMilestoneInList(prev, milestoneId);
      writeStoredMilestones(next);
      setCompletedIds(next);

      const affectedDistrict = findDistrictForMilestone(milestoneId);
      let newlyMastered: DistrictId | null = null;
      if (
        affectedDistrict &&
        didDistrictTransitionToMastered(affectedDistrict, prev, next)
      ) {
        newlyMastered = affectedDistrict;
        triggerDistrictShockwave(affectedDistrict);
      }

      const nextCity = computeTotalCityMastery(next);
      const prevCity = computeTotalCityMastery(prev);
      const unlockedSingularity =
        prevCity.percentage < 100 && nextCity.percentage === 100;
      if (unlockedSingularity) {
        setSingularityPulseCount((c) => c + 1);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent<RoadmapSyncDetail>(ROADMAP_SYNC_EVENT, {
            detail: {
              lastMasteredDistrictId: newlyMastered,
              singularityPulse: unlockedSingularity,
            },
          })
        );
      }
    },
    [triggerDistrictShockwave]
  );

  const resetAllProgress = useCallback((): void => {
    writeStoredMilestones([]);
    setCompletedIds([]);
    setLastMasteredDistrictId(null);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent<RoadmapSyncDetail>(ROADMAP_SYNC_EVENT, {
          detail: { lastMasteredDistrictId: null },
        })
      );
    }
  }, []);

  const replayAwakeningPulse = useCallback(
    (targetDistrictId?: DistrictId): void => {
      const target = targetDistrictId || 'model-core';
      triggerDistrictShockwave(target);
      setSingularityPulseCount((c) => c + 1);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent<RoadmapSyncDetail>(ROADMAP_SYNC_EVENT, {
            detail: {
              lastMasteredDistrictId: target,
              singularityPulse: true,
            },
          })
        );
      }
    },
    [triggerDistrictShockwave]
  );

  const getDistrictProgress = useCallback(
    (districtId: DistrictId | string | number): ProgressStats => {
      if (!isHydrated) {
        return { completed: 0, total: 4, percentage: 0 };
      }
      return computeDistrictProgress(districtId, completedIds);
    },
    [completedIds, isHydrated]
  );

  const getAllDistrictsMastery = useCallback((): Record<
    DistrictId,
    DistrictMasteryMetrics
  > => {
    if (!isHydrated) {
      return computeAllDistrictsMastery([]);
    }
    return computeAllDistrictsMastery(completedIds);
  }, [completedIds, isHydrated]);

  const getTotalCityMastery = useCallback((): ProgressStats => {
    if (!isHydrated) {
      return { completed: 0, total: 32, percentage: 0 };
    }
    return computeTotalCityMastery(completedIds);
  }, [completedIds, isHydrated]);

  return {
    completedIds,
    isHydrated,
    lastMasteredDistrictId,
    singularityPulseCount,
    isCompleted,
    toggleMilestone,
    resetAllProgress,
    replayAwakeningPulse,
    getDistrictProgress,
    getAllDistrictsMastery,
    getTotalCityMastery,
  };
}
