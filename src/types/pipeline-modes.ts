import type { DistrictId } from '../data/districts';

export type ArchitecturalPipelineModeId =
  | 'online-inference'
  | 'offline-indexing'
  | 'offline-training';

export type HardwareBottleneckClass =
  | 'COMPUTE-BOUND (TFLOPs)'
  | 'MEMORY-BANDWIDTH-BOUND (HBM GB/s)'
  | 'NETWORK / IOPS-BOUND';

export interface DistrictTechnicalSpec {
  districtId: DistrictId;
  code: string; // D1..D8
  stepNumber: number; // 1..8
  canonicalName: string;
  shortName: string;
  coreResponsibility: string;
  dominantHardwareBound: string;
  hardwareBottleneckBadge: HardwareBottleneckClass;
  primaryProductionStack: string[];
  wireProtocolAndTensorSpec: string;
  modeRoleSummary: Record<ArchitecturalPipelineModeId, string>;
}

export interface ArchitecturalPipelineModeSpec {
  id: ArchitecturalPipelineModeId;
  code: string;
  shortLabel: string;
  title: string;
  subtitle: string;
  workloadExample: string;
  directedSequence: DistrictId[];
  directedFlowSummary: string;
  activeDistricts: DistrictId[];
  standbyDistricts: DistrictId[];
  standbyBadgeText: string;
  activePathIds: string[];
  particleColorHex: string;
  secondaryParticleColorHex: string;
}

export interface TelemetryPhysicsCard {
  id: string;
  label: string;
  primaryValue: string;
  breakdownNote: string;
  hardwareNote: string;
  accentColorHex: string;
  isAlert?: boolean;
}

export interface GroundedModeTelemetryReport {
  modeId: ArchitecturalPipelineModeId;
  modeLabel: string;
  heroSummary: {
    statusText: string;
    badgeText: string;
    activePoolLabel: string;
    activePoolValue: string;
    throughputLabel: string;
    throughputValue: string;
    loadLabel: string;
    loadValue: string;
  };
  cards: [
    TelemetryPhysicsCard,
    TelemetryPhysicsCard,
    TelemetryPhysicsCard,
    TelemetryPhysicsCard,
    TelemetryPhysicsCard
  ];
}
