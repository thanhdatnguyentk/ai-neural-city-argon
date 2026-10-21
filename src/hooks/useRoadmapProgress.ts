'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DistrictId } from '../data/districts';
import {
  DISTRICT_ROADMAPS,
  DISTRICT_ROADMAP_MAP,
} from '../data/district-roadmaps.ts';

export const ROADMAP_STORAGE_KEY = 'neural_city_roadmap_progress_v1';

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface ProgressStats {
  completed: number;
  total: number;
  percentage: number;
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

  useEffect(() => {
    setCompletedIds(readStoredMilestones());
    setIsHydrated(true);
  }, []);

  // Listen for cross-tab or custom storage sync events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleStorage = (e: StorageEvent) => {
      if (e.key === ROADMAP_STORAGE_KEY) {
        setCompletedIds(readStoredMilestones());
      }
    };
    const handleCustomSync = () => {
      setCompletedIds(readStoredMilestones());
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('neural-city-roadmap-sync', handleCustomSync);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('neural-city-roadmap-sync', handleCustomSync);
    };
  }, []);

  const isCompleted = useCallback(
    (milestoneId: string): boolean => {
      if (!isHydrated) return false;
      return completedIds.includes(milestoneId);
    },
    [completedIds, isHydrated]
  );

  const toggleMilestone = useCallback((milestoneId: string): void => {
    setCompletedIds((prev) => {
      const next = toggleMilestoneInList(prev, milestoneId);
      writeStoredMilestones(next);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('neural-city-roadmap-sync'));
      }
      return next;
    });
  }, []);

  const getDistrictProgress = useCallback(
    (districtId: DistrictId | string | number): ProgressStats => {
      if (!isHydrated) {
        return { completed: 0, total: 4, percentage: 0 };
      }
      return computeDistrictProgress(districtId, completedIds);
    },
    [completedIds, isHydrated]
  );

  const getTotalCityMastery = useCallback((): ProgressStats => {
    if (!isHydrated) {
      return { completed: 0, total: 32, percentage: 0 };
    }
    return computeTotalCityMastery(completedIds);
  }, [completedIds, isHydrated]);

  return {
    completedIds,
    isHydrated,
    isCompleted,
    toggleMilestone,
    getDistrictProgress,
    getTotalCityMastery,
  };
}
