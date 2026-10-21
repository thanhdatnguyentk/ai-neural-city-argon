import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { DISTRICTS } from '../data/districts.ts';
import {
  DISTRICT_ROADMAPS,
  DISTRICT_ROADMAP_MAP,
  getDistrictDeepDive,
} from '../data/district-roadmaps.ts';
import {
  ROADMAP_STORAGE_KEY,
  readStoredMilestones,
  writeStoredMilestones,
  toggleMilestoneInList,
  computeDistrictProgress,
  computeTotalCityMastery,
  computeDistrictMasteryMetrics,
  computeAllDistrictsMastery,
  computeDistrictParticleSpeedMultiplier,
  computeDistrictTargetEmissive,
  didDistrictTransitionToMastered,
} from '../hooks/useRoadmapProgress.ts';
import {
  WORKLOAD_PRESETS,
  BOTTLENECK_SCENARIOS,
  BOTTLENECK_SCENARIO_MAP,
  computeVramAndTelemetry,
  DEFAULT_VRAM_CONFIG,
} from '../data/bottleneck-scenarios.ts';
import {
  DISTRICT_QUIZZES,
  getDistrictQuizzes,
} from '../data/district-quizzes.ts';

describe('District Zero-to-Hero Roadmap & Landmarks Dataset', () => {
  it('maps all 8 existing Neural City DistrictIds with exact accent colors', () => {
    assert.equal(DISTRICT_ROADMAPS.length, 8);
    for (let i = 0; i < DISTRICTS.length; i++) {
      const cityDistrict = DISTRICTS[i];
      const deepDive = getDistrictDeepDive(cityDistrict.id);
      assert.ok(deepDive, `Missing deep dive for ${cityDistrict.id}`);
      assert.equal(deepDive.districtId, cityDistrict.id);
      assert.equal(deepDive.districtCode, `DIST-0${i + 1}`);
      assert.equal(deepDive.accentColorHex, cityDistrict.accentColor);
      assert.equal(DISTRICT_ROADMAP_MAP[cityDistrict.id].districtId, cityDistrict.id);
    }
  });

  it('provides exactly 4 progressive mastery levels per district with non-empty fields', () => {
    const expectedLevels = ['level-1', 'level-2', 'level-3', 'level-4'] as const;
    const expectedTiers = [
      '01 · Foundations (Zero)',
      '02 · Core Engineering',
      '03 · Production & Scale',
      '04 · Frontier & SOTA (Hero)',
    ] as const;

    for (const deepDive of DISTRICT_ROADMAPS) {
      assert.equal(deepDive.roadmap.length, 4);
      deepDive.roadmap.forEach((milestone, idx) => {
        assert.equal(milestone.levelId, expectedLevels[idx]);
        assert.equal(milestone.tierLabel, expectedTiers[idx]);
        assert.ok(milestone.id.length > 0);
        assert.ok(milestone.title.length > 0);
        assert.ok(milestone.summary.length > 0);
        assert.ok(milestone.coreConcepts.length >= 3);
        assert.ok(milestone.techStack.length >= 3);
        assert.ok(milestone.capstoneDeliverable.length > 10);
      });
    }
  });

  it('includes chronologically ordered landmarks with valid URLs for every district', () => {
    for (const deepDive of DISTRICT_ROADMAPS) {
      assert.ok(
        deepDive.landmarks.length >= 3,
        `${deepDive.districtId} should have at least 3 landmarks`
      );
      for (let i = 0; i < deepDive.landmarks.length; i++) {
        const lm = deepDive.landmarks[i];
        assert.ok(lm.year >= 2010 && lm.year <= 2026);
        assert.ok(lm.title.length > 0);
        assert.ok(lm.authorsOrOrg.length > 0);
        assert.ok(lm.keyContribution.length > 0);
        assert.ok(lm.impactMetricOrNote.length > 0);
        assert.ok(lm.url.startsWith('https://'));
        if (i > 0) {
          assert.ok(
            lm.year >= deepDive.landmarks[i - 1].year,
            `Landmarks in ${deepDive.districtId} must be sorted chronologically`
          );
        }
      }
    }
  });
});

describe('Roadmap Progress & localStorage Persistence Logic', () => {
  const mockStorage = new Map<string, string>();
  const storageAdapter = {
    getItem: (key: string) => mockStorage.get(key) ?? null,
    setItem: (key: string, val: string) => {
      mockStorage.set(key, val);
    },
  };

  beforeEach(() => {
    mockStorage.clear();
  });

  it('uses key neural_city_roadmap_progress_v1 and handles empty or corrupted storage safely', () => {
    assert.equal(ROADMAP_STORAGE_KEY, 'neural_city_roadmap_progress_v1');
    assert.deepEqual(readStoredMilestones(storageAdapter), []);

    mockStorage.set(ROADMAP_STORAGE_KEY, '{corrupted-json');
    assert.deepEqual(readStoredMilestones(storageAdapter), []);
  });

  it('toggles milestone completion and persists across reads', () => {
    let list = readStoredMilestones(storageAdapter);
    list = toggleMilestoneInList(list, 'd1-level-1');
    writeStoredMilestones(list, storageAdapter);
    assert.deepEqual(readStoredMilestones(storageAdapter), ['d1-level-1']);

    // Toggling again removes it
    list = toggleMilestoneInList(list, 'd1-level-1');
    writeStoredMilestones(list, storageAdapter);
    assert.deepEqual(readStoredMilestones(storageAdapter), []);
  });

  it('calculates district progress and total city mastery accurately', () => {
    const d1Milestones = DISTRICT_ROADMAP_MAP['input-gateway'].roadmap.map((m) => m.id);
    const completed = [d1Milestones[0], d1Milestones[1]];

    const d1Progress = computeDistrictProgress('input-gateway', completed);
    assert.deepEqual(d1Progress, {
      completed: 2,
      total: 4,
      percentage: 50,
    });

    const cityMastery = computeTotalCityMastery(completed);
    assert.equal(cityMastery.completed, 2);
    assert.equal(cityMastery.total, 32);
    assert.equal(cityMastery.percentage, Math.round((2 / 32) * 100));
  });

  it('computes 4-tier DistrictMasteryMetrics, emissive boost, and particle overdrive multipliers', () => {
    const d1Ids = DISTRICT_ROADMAP_MAP['input-gateway'].roadmap.map((m) => m.id);

    // Tier 0: 0/4 (0%)
    const m0 = computeDistrictMasteryMetrics('input-gateway', []);
    assert.equal(m0.completedCount, 0);
    assert.equal(m0.percentage, 0);
    assert.equal(m0.isMastered, false);
    assert.equal(computeDistrictParticleSpeedMultiplier(m0), 1.0);
    assert.equal(computeDistrictTargetEmissive(1.0, m0), 1.0);

    // Tier 2: 2/4 (50%)
    const m2 = computeDistrictMasteryMetrics('input-gateway', [d1Ids[0], d1Ids[1]]);
    assert.equal(m2.completedCount, 2);
    assert.equal(m2.percentage, 50);
    assert.equal(m2.isMastered, false);
    assert.ok(Math.abs(computeDistrictParticleSpeedMultiplier(m2) - 1.3) < 1e-6);
    assert.ok(Math.abs(computeDistrictTargetEmissive(1.0, m2) - (1.0 + 0.5 * 1.15)) < 1e-6);

    // Tier 4: 4/4 (100% Mastered Overdrive)
    const m4 = computeDistrictMasteryMetrics('input-gateway', d1Ids);
    assert.equal(m4.completedCount, 4);
    assert.equal(m4.percentage, 100);
    assert.equal(m4.isMastered, true);
    assert.equal(computeDistrictParticleSpeedMultiplier(m4), 2.0);
    assert.ok(Math.abs(computeDistrictTargetEmissive(1.0, m4) - 2.15) < 1e-6);

    // Transition detection for level-up shockwave
    assert.equal(
      didDistrictTransitionToMastered(
        'input-gateway',
        [d1Ids[0], d1Ids[1], d1Ids[2]],
        d1Ids
      ),
      true
    );
    assert.equal(
      didDistrictTransitionToMastered('input-gateway', d1Ids, d1Ids),
      false
    );

    const allMap = computeAllDistrictsMastery(d1Ids);
    assert.equal(allMap['input-gateway'].isMastered, true);
    assert.equal(allMap['model-core'].isMastered, false);
  });
});

describe('Interactive Systems Sandbox: Workloads, Chaos Bottlenecks, Quizzes & VRAM Math', () => {
  it('defines all 4 Workload Presets and 5 Bottleneck States with valid deep-link fixes', () => {
    assert.equal(WORKLOAD_PRESETS.length, 4);
    assert.equal(BOTTLENECK_SCENARIOS.length, 5);

    const kvOom = BOTTLENECK_SCENARIO_MAP['kv-cache-oom'];
    assert.equal(kvOom.targetDistrictId, 'inference-center');
    assert.equal(kvOom.fixMilestoneId, 'd7-level-3');
    assert.equal(kvOom.telemetryOverride.systemStatus, 'CRITICAL_BOTTLENECK');
  });

  it('provides 32 technical verification quiz questions (4 per district) linked to roadmap milestones', () => {
    assert.equal(DISTRICT_QUIZZES.length, 32);
    for (const d of DISTRICTS) {
      const qs = getDistrictQuizzes(d.id);
      assert.equal(qs.length, 4, `Expected 4 quiz questions for ${d.id}`);
      const roadmapIds = DISTRICT_ROADMAP_MAP[d.id].roadmap.map((m) => m.id);
      qs.forEach((q, idx) => {
        assert.equal(q.milestoneId, roadmapIds[idx]);
        assert.equal(q.options.length, 4);
        assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3);
        assert.ok(q.technicalExplanation.length > 20);
      });
    }
  });

  it('calculates Weights VRAM, KV-Cache VRAM, and OOM state accurately', () => {
    // Default 7B FP16, 4096 ctx, batch 8 on 80GB GPU
    const baseTelemetry = computeVramAndTelemetry(
      DEFAULT_VRAM_CONFIG,
      'multimodal-vision',
      'none',
      0
    );
    // Weights = 7 * 2 * 1.10 = 15.4 GB
    assert.equal(baseTelemetry.weightsVramGb, 15.4);
    // KV-Cache = 8 * 4096 * 0.00015 * (7/7) * (2/2) = 4.92 GB
    assert.equal(baseTelemetry.kvCacheVramGb, 4.92);
    assert.equal(baseTelemetry.totalVramRequiredGb, 20.32);
    assert.equal(baseTelemetry.isVramOom, false);
    assert.equal(baseTelemetry.systemStatus, 'OPTIMAL');

    // Trigger OOM: 70B FP16 on 80GB GPU with 32K context and batch 16
    const oomTelemetry = computeVramAndTelemetry(
      {
        parameterCountBillion: 70,
        quantization: 'FP16',
        contextLength: 32768,
        batchSize: 16,
        gpuMemoryBudgetGb: 80,
      },
      'multimodal-vision',
      'none',
      0
    );
    assert.equal(oomTelemetry.isVramOom, true);
    assert.equal(oomTelemetry.systemStatus, 'CRITICAL_BOTTLENECK');
    assert.equal(oomTelemetry.inferenceLatencyMs, 642.8);

    // Resolving OOM by switching to INT4_AWQ on 80GB GPU with 4K context and batch 4
    const resolvedTelemetry = computeVramAndTelemetry(
      {
        parameterCountBillion: 70,
        quantization: 'INT4_AWQ',
        contextLength: 4096,
        batchSize: 4,
        gpuMemoryBudgetGb: 80,
      },
      'multimodal-vision',
      'none',
      0
    );
    assert.equal(resolvedTelemetry.isVramOom, false);
    assert.equal(resolvedTelemetry.systemStatus, 'OPTIMAL');
  });
});
