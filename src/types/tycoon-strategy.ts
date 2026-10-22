import type { DistrictId } from '../data/districts';

export type TechTier = 1 | 2 | 3;

export type TycoonSpeedMode = 0 | 1 | 2;

export type TycoonCampaignStatus = 'active' | 'victory' | 'defeat';

export const TYCOON_STORAGE_KEY = 'neural_city_tycoon_save_v1';

export const DISTRICT_NUMBER_TO_SLUG: Record<number, DistrictId> = {
  1: 'input-gateway',
  2: 'data-lake',
  3: 'training-cluster',
  4: 'model-core',
  5: 'inference-center',
  6: 'nlp-district',
  7: 'computer-vision',
  8: 'output-terminal',
};

export const DISTRICT_SLUG_TO_NUMBER: Record<DistrictId, number> = {
  'input-gateway': 1,
  'data-lake': 2,
  'training-cluster': 3,
  'model-core': 4,
  'inference-center': 5,
  'nlp-district': 6,
  'computer-vision': 7,
  'output-terminal': 8,
};

export interface TechNode {
  id: string;                 // e.g., "d5-tier-3"
  districtId: number;         // 1 to 8
  districtSlug: DistrictId;   // e.g., "inference-center"
  tier: TechTier;
  name: string;
  costCredits: number;
  costRp: number;
  vramDeltaGb: number;        // Can be negative if quantization/compression! (e.g., -12 GB for INT4 AWQ)
  throughputBonusPct: number; // e.g., +65%
  latencyReductionMs: number; // e.g., -25 ms
  defenseBonusPct?: number;   // For Guardrails / Hallucination / Injection defense
  rpPerSecondBonus?: number;  // For R&D districts
  creditYieldBonusPct?: number; // For Output & MLOps streaming conversion
  slaRecoveryPerSec?: number; // Autonomous self-healing SLA recovery
  description: string;
  prerequisiteNodeId?: string;
}

export interface HardwareClusterTier {
  id: string;
  tierIndex: number;
  name: string;
  maxVramGb: number;
  baseCapacityReqPerSec: number;
  unlockCostCredits: number;
  upkeepPerSec: number;
}

export interface BossWorkloadWave {
  waveNumber: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
  durationSeconds: number;
  incomingReqPerSec: number;
  maxAllowedLatencyMs: number;      // SLA target
  baseVramPressureGb: number;       // Base memory demand before optimizations
  adversarialThreatRatio: number;   // 0.0 to 1.0 (tests District 7 Guardrails)
  primaryStressDistricts: number[]; // Districts hit hardest by this wave
  bossVictoryRewardCredits: number;
  bossVictoryRewardRp: number;
  tacticalBriefing: string;
}

export interface DistrictSaturationMetric {
  districtNumber: number;
  districtSlug: DistrictId;
  unlockedTier: 0 | TechTier;
  incomingLoadReqPerSec: number;
  capacityReqPerSec: number;
  saturationRatio: number;
  saturationPercent: number;
  isPrimaryBottleneck: boolean;
}

export interface ComputedTycoonTelemetry {
  cityCapacityReqPerSec: number;
  effectiveServedReqPerSec: number;
  currentP99LatencyMs: number;
  usedVramGb: number;
  maxVramGb: number;
  isVramOom: boolean;
  threatBlockPercent: number;
  unblockedThreatRatio: number;
  netCreditsPerSec: number;
  grossCreditsPerSec: number;
  upkeepPerSec: number;
  rpPerSec: number;
  roadmapBonusMultiplierPct: number;
  slaDeltaPerSec: number;
  primaryBottleneckDistrict: DistrictSaturationMetric;
  districtMetrics: Record<DistrictId, DistrictSaturationMetric>;
}

export interface TycoonSaveData {
  wave5Cleared: boolean;
  highestWaveCleared: number;
  peakThroughputRps: number;
  lowestP99LatencyMs: number;
  totalCreditsEarned: number;
}
