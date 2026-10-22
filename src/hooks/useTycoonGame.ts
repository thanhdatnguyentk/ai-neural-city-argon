'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { DISTRICTS } from '../data/districts.ts';
import type { DistrictId } from '../data/districts.ts';
import {
  TYCOON_STORAGE_KEY,
  DISTRICT_SLUG_TO_NUMBER,
} from '../types/tycoon-strategy.ts';
import type {
  TechTier,
  TycoonSpeedMode,
  TycoonCampaignStatus,
  DistrictSaturationMetric,
  ComputedTycoonTelemetry,
  TycoonSaveData,
} from '../types/tycoon-strategy.ts';
import {
  HARDWARE_CLUSTER_TIERS,
  TYCOON_TECH_TREE,
  TECH_NODE_MAP,
} from '../data/tycoon-tech-tree.ts';
import { TYCOON_BOSS_WAVES } from '../data/tycoon-waves.ts';

const DEFAULT_SAVE_DATA: TycoonSaveData = {
  wave5Cleared: false,
  highestWaveCleared: 0,
  peakThroughputRps: 120,
  lowestP99LatencyMs: 185,
  totalCreditsEarned: 600,
};

export function readTycoonSaveData(
  storage?: Pick<Storage, 'getItem'> | null
): TycoonSaveData {
  const target =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined'
      ? window.localStorage
      : null;
  if (!target) return DEFAULT_SAVE_DATA;
  try {
    const raw = target.getItem(TYCOON_STORAGE_KEY);
    if (!raw) return DEFAULT_SAVE_DATA;
    const parsed = JSON.parse(raw);
    return {
      wave5Cleared: Boolean(parsed.wave5Cleared),
      highestWaveCleared: Number(parsed.highestWaveCleared) || 0,
      peakThroughputRps: Number(parsed.peakThroughputRps) || 120,
      lowestP99LatencyMs: Number(parsed.lowestP99LatencyMs) || 185,
      totalCreditsEarned: Number(parsed.totalCreditsEarned) || 600,
    };
  } catch {
    return DEFAULT_SAVE_DATA;
  }
}

export function writeTycoonSaveData(
  data: TycoonSaveData,
  storage?: Pick<Storage, 'setItem'> | null
): void {
  const target =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined'
      ? window.localStorage
      : null;
  if (!target) return;
  try {
    target.setItem(TYCOON_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Every completed milestone in useRoadmapProgress grants +5% RP generation multiplier.
 */
export function computeRoadmapRpMultiplier(completedMilestonesCount: number): {
  bonusPercent: number;
  multiplier: number;
} {
  const safeCount = Math.max(0, Math.min(32, completedMilestonesCount));
  const bonusPercent = safeCount * 5;
  return {
    bonusPercent,
    multiplier: Number((1 + bonusPercent / 100).toFixed(2)),
  };
}

/**
 * Pure simulation calculator for AI Lab Tycoon mode.
 */
export function computeTycoonSystemMetrics(params: {
  unlockedNodeIds: string[];
  hardwareTierIndex: number;
  waveNumber: 1 | 2 | 3 | 4 | 5;
  completedRoadmapMilestones: number;
}): ComputedTycoonTelemetry {
  const {
    unlockedNodeIds,
    hardwareTierIndex,
    waveNumber,
    completedRoadmapMilestones,
  } = params;

  const unlockedSet = new Set(unlockedNodeIds);
  const hardware =
    HARDWARE_CLUSTER_TIERS[
      Math.max(0, Math.min(HARDWARE_CLUSTER_TIERS.length - 1, hardwareTierIndex))
    ];
  const wave =
    TYCOON_BOSS_WAVES.find((w) => w.waveNumber === waveNumber) ||
    TYCOON_BOSS_WAVES[0];

  const unlockedNodes = TYCOON_TECH_TREE.filter((n) => unlockedSet.has(n.id));

  // Aggregate global modifiers
  const totalVramDeltaGb = unlockedNodes.reduce(
    (sum, n) => sum + n.vramDeltaGb,
    0
  );
  const totalLatencyReductionMs = unlockedNodes.reduce(
    (sum, n) => sum + n.latencyReductionMs,
    0
  );
  const totalDefenseBonusPct = Math.min(
    98,
    unlockedNodes.reduce((sum, n) => sum + (n.defenseBonusPct ?? 0), 0)
  );
  const totalRpBonus = unlockedNodes.reduce(
    (sum, n) => sum + (n.rpPerSecondBonus ?? 0),
    0
  );
  const totalCreditYieldBonusPct = unlockedNodes.reduce(
    (sum, n) => sum + (n.creditYieldBonusPct ?? 0),
    0
  );
  const totalSlaRecoveryPerSec = unlockedNodes.reduce(
    (sum, n) => sum + (n.slaRecoveryPerSec ?? 0),
    0
  );

  // Per-district capacity & saturation (Center of Gravity identification)
  const rawMetrics: DistrictSaturationMetric[] = DISTRICTS.map((d) => {
    const dNum = DISTRICT_SLUG_TO_NUMBER[d.id];
    const dNodes = unlockedNodes.filter((n) => n.districtSlug === d.id);
    const unlockedTier = dNodes.reduce<0 | TechTier>(
      (maxT, n) => (n.tier > maxT ? n.tier : maxT),
      0
    );
    const districtBonusPct = dNodes.reduce(
      (sum, n) => sum + n.throughputBonusPct,
      0
    );
    // Global synergy from Model Core (D4) and Output Cache (D8) also lifts overall pipeline capacity
    const globalLiftPct = unlockedNodes.reduce(
      (sum, n) => sum + n.throughputBonusPct * 0.14,
      0
    );

    const capacityReqPerSec = Math.round(
      hardware.baseCapacityReqPerSec *
        (1 + (districtBonusPct + globalLiftPct) / 100)
    );

    const isStressed = wave.primaryStressDistricts.includes(dNum);
    // Stress multiplier per district so specific waves pressure specific districts
    const stressFactor = isStressed ? 1.18 + (dNum % 3) * 0.04 : 0.78;
    const incomingLoadReqPerSec = Math.round(
      wave.incomingReqPerSec * stressFactor
    );
    const saturationRatio = Number(
      (incomingLoadReqPerSec / Math.max(1, capacityReqPerSec)).toFixed(2)
    );

    return {
      districtNumber: dNum,
      districtSlug: d.id,
      unlockedTier,
      incomingLoadReqPerSec,
      capacityReqPerSec,
      saturationRatio,
      saturationPercent: Math.round(saturationRatio * 100),
      isPrimaryBottleneck: false,
    };
  });

  // Identify Center of Gravity (Primary Bottleneck = highest saturationRatio)
  let bottleneckIdx = 0;
  for (let i = 1; i < rawMetrics.length; i++) {
    if (rawMetrics[i].saturationRatio > rawMetrics[bottleneckIdx].saturationRatio) {
      bottleneckIdx = i;
    }
  }
  rawMetrics[bottleneckIdx].isPrimaryBottleneck = true;
  const primaryBottleneckDistrict = rawMetrics[bottleneckIdx];

  const districtMetrics = Object.fromEntries(
    rawMetrics.map((m) => [m.districtSlug, m])
  ) as Record<DistrictId, DistrictSaturationMetric>;

  // City effective capacity is governed by the bottleneck district and average district capacity
  const avgCapacity =
    rawMetrics.reduce((s, m) => s + m.capacityReqPerSec, 0) / rawMetrics.length;
  const cityCapacityReqPerSec = Math.round(
    Math.min(avgCapacity, primaryBottleneckDistrict.capacityReqPerSec * 1.12)
  );

  // VRAM Footprint calculation (can be reduced by quantization/PagedAttention/ZeRO)
  const usedVramGb = Math.max(
    6.0,
    Number((wave.baseVramPressureGb + totalVramDeltaGb).toFixed(1))
  );
  const isVramOom = usedVramGb > hardware.maxVramGb;

  // Latency calculation
  const baseLatencyMs = 215 - totalLatencyReductionMs;
  const congestionPenaltyMs =
    primaryBottleneckDistrict.saturationRatio > 1.0
      ? Math.round((primaryBottleneckDistrict.saturationRatio - 1.0) * 145)
      : 0;
  const oomPenaltyMs = isVramOom ? 160 : 0;
  const currentP99LatencyMs = Math.max(
    8,
    Math.round(baseLatencyMs + congestionPenaltyMs + oomPenaltyMs)
  );

  // Adversarial threat defense (District 7)
  const unblockedThreatRatio = Math.max(
    0,
    Number(
      (
        wave.adversarialThreatRatio *
        (1 - totalDefenseBonusPct / 100)
      ).toFixed(3)
    )
  );

  // Credits & RP generation per second
  const effectiveServedReqPerSec = Math.min(
    wave.incomingReqPerSec,
    cityCapacityReqPerSec
  );
  const baseCreditRate = 0.24 * (1 + totalCreditYieldBonusPct / 100);
  const grossCreditsPerSec = Math.round(
    Math.max(28, Math.pow(effectiveServedReqPerSec, 0.72) * baseCreditRate * 8)
  );
  const netCreditsPerSec = grossCreditsPerSec - hardware.upkeepPerSec;

  const roadmapBonus = computeRoadmapRpMultiplier(completedRoadmapMilestones);
  const rpPerSec = Number(
    ((6 + totalRpBonus) * roadmapBonus.multiplier).toFixed(1)
  );

  // SLA Stability Delta per second
  let slaDrain = 0;
  if (currentP99LatencyMs > wave.maxAllowedLatencyMs) {
    slaDrain += Math.min(
      4.5,
      (currentP99LatencyMs - wave.maxAllowedLatencyMs) / 35
    );
  }
  if (isVramOom) {
    slaDrain += 3.2;
  }
  if (unblockedThreatRatio > 0.04) {
    slaDrain += unblockedThreatRatio * 14;
  }

  const naturalRecovery =
    slaDrain === 0 ? 0.8 + totalSlaRecoveryPerSec : totalSlaRecoveryPerSec * 0.5;
  const slaDeltaPerSec = Number((naturalRecovery - slaDrain).toFixed(2));

  return {
    cityCapacityReqPerSec,
    effectiveServedReqPerSec,
    currentP99LatencyMs,
    usedVramGb,
    maxVramGb: hardware.maxVramGb,
    isVramOom,
    threatBlockPercent: totalDefenseBonusPct,
    unblockedThreatRatio,
    netCreditsPerSec,
    grossCreditsPerSec,
    upkeepPerSec: hardware.upkeepPerSec,
    rpPerSec,
    roadmapBonusMultiplierPct: roadmapBonus.bonusPercent,
    slaDeltaPerSec,
    primaryBottleneckDistrict,
    districtMetrics,
  };
}

export function useTycoonGame(completedRoadmapMilestones: number) {
  const [isTycoonActive, setIsTycoonActive] = useState<boolean>(false);
  const [isTechTreeOpen, setIsTechTreeOpen] = useState<boolean>(false);
  const [speedMode, setSpeedMode] = useState<TycoonSpeedMode>(1);

  const [credits, setCredits] = useState<number>(600);
  const [rp, setRp] = useState<number>(110);
  const [slaStability, setSlaStability] = useState<number>(100);
  const [hardwareTierIndex, setHardwareTierIndex] = useState<number>(0);
  const [unlockedNodeIds, setUnlockedNodeIds] = useState<string[]>([]);

  const [currentWaveNumber, setCurrentWaveNumber] = useState<1 | 2 | 3 | 4 | 5>(
    1
  );
  const [waveElapsedSec, setWaveElapsedSec] = useState<number>(0);
  const [campaignStatus, setCampaignStatus] =
    useState<TycoonCampaignStatus>('active');
  const [saveData, setSaveData] = useState<TycoonSaveData>(DEFAULT_SAVE_DATA);

  useEffect(() => {
    setSaveData(readTycoonSaveData());
  }, []);

  const currentWave = useMemo(
    () =>
      TYCOON_BOSS_WAVES.find((w) => w.waveNumber === currentWaveNumber) ||
      TYCOON_BOSS_WAVES[0],
    [currentWaveNumber]
  );

  const currentHardware = HARDWARE_CLUSTER_TIERS[hardwareTierIndex];
  const nextHardware =
    hardwareTierIndex + 1 < HARDWARE_CLUSTER_TIERS.length
      ? HARDWARE_CLUSTER_TIERS[hardwareTierIndex + 1]
      : null;

  const telemetry = useMemo(
    () =>
      computeTycoonSystemMetrics({
        unlockedNodeIds,
        hardwareTierIndex,
        waveNumber: currentWaveNumber,
        completedRoadmapMilestones,
      }),
    [
      unlockedNodeIds,
      hardwareTierIndex,
      currentWaveNumber,
      completedRoadmapMilestones,
    ]
  );

  // Real-time simulation tick loop (1 tick = 1000ms at 1x, 500ms at 2x)
  useEffect(() => {
    if (!isTycoonActive || speedMode === 0 || campaignStatus !== 'active') {
      return;
    }

    const intervalMs = speedMode === 2 ? 500 : 1000;
    const timer = setInterval(() => {
      setCredits((prev) => Math.max(0, Math.round(prev + telemetry.netCreditsPerSec)));
      setRp((prev) => Number((prev + telemetry.rpPerSec).toFixed(1)));

      setSlaStability((prev) => {
        const next = Math.max(
          0,
          Math.min(100, Number((prev + telemetry.slaDeltaPerSec).toFixed(1)))
        );
        if (next <= 0) {
          setCampaignStatus('defeat');
        }
        return next;
      });

      setWaveElapsedSec((prev) => {
        const nextSec = prev + 1;
        if (nextSec >= currentWave.durationSeconds) {
          // Wave cleared! Grant wave boss rewards
          setCredits((c) => c + currentWave.bossVictoryRewardCredits);
          setRp((r) => Number((r + currentWave.bossVictoryRewardRp).toFixed(1)));

          if (currentWaveNumber === 5) {
            setCampaignStatus('victory');
            setSaveData((oldSave) => {
              const updated: TycoonSaveData = {
                wave5Cleared: true,
                highestWaveCleared: 5,
                peakThroughputRps: Math.max(
                  oldSave.peakThroughputRps,
                  telemetry.cityCapacityReqPerSec
                ),
                lowestP99LatencyMs: Math.min(
                  oldSave.lowestP99LatencyMs,
                  telemetry.currentP99LatencyMs
                ),
                totalCreditsEarned:
                  oldSave.totalCreditsEarned +
                  currentWave.bossVictoryRewardCredits,
              };
              writeTycoonSaveData(updated);
              return updated;
            });
            return currentWave.durationSeconds;
          } else {
            const nextW = (currentWaveNumber + 1) as 1 | 2 | 3 | 4 | 5;
            setCurrentWaveNumber(nextW);
            setSaveData((oldSave) => {
              const updated: TycoonSaveData = {
                ...oldSave,
                highestWaveCleared: Math.max(
                  oldSave.highestWaveCleared,
                  currentWaveNumber
                ),
                peakThroughputRps: Math.max(
                  oldSave.peakThroughputRps,
                  telemetry.cityCapacityReqPerSec
                ),
                lowestP99LatencyMs: Math.min(
                  oldSave.lowestP99LatencyMs,
                  telemetry.currentP99LatencyMs
                ),
              };
              writeTycoonSaveData(updated);
              return updated;
            });
            return 0;
          }
        }
        return nextSec;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [
    isTycoonActive,
    speedMode,
    campaignStatus,
    currentWave,
    currentWaveNumber,
    telemetry,
  ]);

  const canResearchNode = useCallback(
    (nodeId: string): { allowed: boolean; reason?: string } => {
      const node = TECH_NODE_MAP[nodeId];
      if (!node) return { allowed: false, reason: 'Invalid node' };
      if (unlockedNodeIds.includes(nodeId)) {
        return { allowed: false, reason: 'Already researched' };
      }
      if (
        node.prerequisiteNodeId &&
        !unlockedNodeIds.includes(node.prerequisiteNodeId)
      ) {
        return { allowed: false, reason: 'Requires Tier ' + (node.tier - 1) };
      }
      if (credits < node.costCredits) {
        return { allowed: false, reason: 'Insufficient $CC' };
      }
      if (rp < node.costRp) {
        return { allowed: false, reason: 'Insufficient RP' };
      }
      return { allowed: true };
    },
    [unlockedNodeIds, credits, rp]
  );

  const researchTechNode = useCallback(
    (nodeId: string): boolean => {
      const check = canResearchNode(nodeId);
      if (!check.allowed) return false;
      const node = TECH_NODE_MAP[nodeId];
      setCredits((prev) => prev - node.costCredits);
      setRp((prev) => Number((prev - node.costRp).toFixed(1)));
      setUnlockedNodeIds((prev) => [...prev, nodeId]);
      return true;
    },
    [canResearchNode]
  );

  const upgradeHardwareCluster = useCallback((): boolean => {
    if (!nextHardware) return false;
    if (credits < nextHardware.unlockCostCredits) return false;
    setCredits((prev) => prev - nextHardware.unlockCostCredits);
    setHardwareTierIndex((prev) => prev + 1);
    return true;
  }, [nextHardware, credits]);

  const callNextWaveEarly = useCallback(() => {
    if (campaignStatus !== 'active') return;
    // Grant early wave bonus
    setCredits((c) => c + Math.round(currentWave.bossVictoryRewardCredits * 0.75));
    setRp((r) =>
      Number((r + currentWave.bossVictoryRewardRp * 0.75).toFixed(1))
    );
    if (currentWaveNumber < 5) {
      setCurrentWaveNumber((w) => (w + 1) as 1 | 2 | 3 | 4 | 5);
      setWaveElapsedSec(0);
    } else {
      setCampaignStatus('victory');
      setSaveData((oldSave) => {
        const updated: TycoonSaveData = {
          ...oldSave,
          wave5Cleared: true,
          highestWaveCleared: 5,
        };
        writeTycoonSaveData(updated);
        return updated;
      });
    }
  }, [campaignStatus, currentWave, currentWaveNumber]);

  const resetCampaign = useCallback(() => {
    setCredits(600);
    setRp(110);
    setSlaStability(100);
    setHardwareTierIndex(0);
    setUnlockedNodeIds([]);
    setCurrentWaveNumber(1);
    setWaveElapsedSec(0);
    setCampaignStatus('active');
    setSpeedMode(1);
  }, []);

  return {
    isTycoonActive,
    setIsTycoonActive,
    isTechTreeOpen,
    setIsTechTreeOpen,
    speedMode,
    setSpeedMode,
    credits,
    rp,
    slaStability,
    hardwareTierIndex,
    currentHardware,
    nextHardware,
    unlockedNodeIds,
    currentWaveNumber,
    currentWave,
    waveElapsedSec,
    campaignStatus,
    saveData,
    telemetry,
    canResearchNode,
    researchTechNode,
    upgradeHardwareCluster,
    callNextWaveEarly,
    resetCampaign,
  };
}
