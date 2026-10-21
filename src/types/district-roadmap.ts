import type { DistrictId } from '../data/districts';

export type MasteryLevelId = 'level-1' | 'level-2' | 'level-3' | 'level-4';

export type MasteryTierLabel =
  | '01 · Foundations (Zero)'
  | '02 · Core Engineering'
  | '03 · Production & Scale'
  | '04 · Frontier & SOTA (Hero)';

export interface RoadmapMilestone {
  id: string; // e.g., "d1-level-1"
  levelId: MasteryLevelId;
  tierLabel: MasteryTierLabel;
  title: string;
  summary: string;
  coreConcepts: string[];
  techStack: string[];
  capstoneDeliverable: string;
}

export type LandmarkCategory =
  | 'Seminal Paper'
  | 'Architecture Breakthrough'
  | 'Open-Source / System Milestone';

export interface LandmarkWork {
  id: string;
  year: number;
  title: string;
  authorsOrOrg: string;
  category: LandmarkCategory;
  keyContribution: string;
  impactMetricOrNote: string;
  url: string; // arXiv, GitHub, or official documentation URL
}

export interface DistrictDeepDive {
  districtId: DistrictId; // Matches existing DistrictId in src/data/districts.ts
  districtCode: string; // e.g., "DIST-01"
  districtName: string;
  pipelineStageName: string;
  accentColorHex: string;
  tagline: string;
  roadmap: [RoadmapMilestone, RoadmapMilestone, RoadmapMilestone, RoadmapMilestone];
  landmarks: LandmarkWork[];
}
