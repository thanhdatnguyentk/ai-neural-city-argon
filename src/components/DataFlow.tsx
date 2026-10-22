'use client';

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { DATA_FLOW_PATHS, DistrictId } from '@/data/districts';
import {
  DistrictMasteryMetrics,
  computeDistrictParticleSpeedMultiplier,
} from '@/hooks/useRoadmapProgress';
import {
  WorkloadPresetId,
  BottleneckScenarioId,
  WORKLOAD_PRESET_MAP,
  BOTTLENECK_SCENARIO_MAP,
  CONDUIT_PROTOCOL_LABELS,
} from '@/data/bottleneck-scenarios';

interface DataFlowProps {
  selectedDistrict: DistrictId | null;
  hoveredDistrict: DistrictId | null;
  highlightedFlowDistrict: DistrictId | null;
  activeDemoPathIds: string[];
  isPaused: boolean;
  flowSpeed: number;
  trainingMode: boolean;
  isNight: boolean;
  reducedMotion: boolean;
  allDistrictsMastery?: Record<DistrictId, DistrictMasteryMetrics>;
  isSingularityMode?: boolean;
  activeWorkload?: WorkloadPresetId;
  activeBottleneck?: BottleneckScenarioId;
  isBlueprintMode?: boolean;
  isBattleRaceActive?: boolean;
}

interface CurveItem {
  id: string;
  from: DistrictId;
  to: DistrictId;
  type: 'data' | 'neural' | 'output';
  curve: THREE.CatmullRomCurve3;
  points: THREE.Vector3[];
  color: THREE.Color;
  hex: string;
}

const PARTICLES_PER_PATH = 7;

export const DataFlow: React.FC<DataFlowProps> = ({
  selectedDistrict,
  hoveredDistrict,
  highlightedFlowDistrict,
  activeDemoPathIds,
  isPaused,
  flowSpeed,
  trainingMode,
  isNight,
  reducedMotion,
  allDistrictsMastery,
  isSingularityMode = false,
  activeWorkload = 'multimodal-vision',
  activeBottleneck = 'none',
  isBlueprintMode = false,
  isBattleRaceActive = false,
}) => {
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const heroPacketRef = useRef<THREE.Group>(null);
  const progressRef = useRef<number[]>(
    Array.from(
      { length: DATA_FLOW_PATHS.length * PARTICLES_PER_PATH },
      (_, i) => (i % PARTICLES_PER_PATH) / PARTICLES_PER_PATH
    )
  );
  const heroProgressRef = useRef(0);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  const highlightColor = useMemo(() => new THREE.Color('#00F0FF'), []);
  const overdriveColor = useMemo(() => new THREE.Color('#FDE047'), []);
  const bottleneckColor = useMemo(() => new THREE.Color('#EF4444'), []);
  const battleAmberColor = useMemo(() => new THREE.Color('#F59E0B'), []);

  const workloadSpec =
    WORKLOAD_PRESET_MAP[activeWorkload] ||
    WORKLOAD_PRESET_MAP['multimodal-vision'];
  const workloadColor = useMemo(
    () => new THREE.Color(workloadSpec.particleColorHex),
    [workloadSpec.particleColorHex]
  );
  const bottleneckSpec =
    BOTTLENECK_SCENARIO_MAP[activeBottleneck] ||
    BOTTLENECK_SCENARIO_MAP['none'];

  const curves = useMemo<CurveItem[]>(() => {
    return DATA_FLOW_PATHS.map((path) => {
      const vecs = path.waypoints.map((wp) => new THREE.Vector3(wp[0], wp[1], wp[2]));
      const curve = new THREE.CatmullRomCurve3(vecs, false, 'catmullrom', 0.2);
      const sampled = curve.getPoints(36);
      const hex =
        path.type === 'data'
          ? '#00F0FF'
          : path.type === 'neural'
          ? '#A855F7'
          : '#38BDF8';
      return {
        id: path.id,
        from: path.from,
        to: path.to,
        type: path.type,
        curve,
        points: sampled,
        color: new THREE.Color(hex),
        hex,
      };
    });
  }, []);

  // Initialize instance matrices and colors before first shader compilation
  useLayoutEffect(() => {
    if (!instancedRef.current) return;
    let idx = 0;
    for (let pIdx = 0; pIdx < curves.length; pIdx++) {
      const item = curves[pIdx];
      for (let k = 0; k < PARTICLES_PER_PATH; k++) {
        const prog = progressRef.current[idx];
        item.curve.getPointAt(prog, tempPos);
        tempPos.y += Math.sin(prog * Math.PI) * 0.18;
        dummy.position.copy(tempPos);
        dummy.scale.setScalar(0.14);
        dummy.updateMatrix();
        instancedRef.current.setMatrixAt(idx, dummy.matrix);
        instancedRef.current.setColorAt(idx, item.color);
        idx++;
      }
    }
    instancedRef.current.instanceMatrix.needsUpdate = true;
    if (instancedRef.current.instanceColor) {
      instancedRef.current.instanceColor.needsUpdate = true;
    }
  }, [curves, dummy, tempPos]);

  const activeDistrict = highlightedFlowDistrict || selectedDistrict || hoveredDistrict;

  const isPathHighlighted = (c: CurveItem) => {
    if (activeDemoPathIds.length > 0) {
      return activeDemoPathIds.includes(c.id);
    }
    if (activeDistrict) {
      return c.from === activeDistrict || c.to === activeDistrict;
    }
    if (trainingMode && (c.to === 'training-cluster' || c.from === 'training-cluster')) {
      return true;
    }
    if (workloadSpec.activePathIds.includes(c.id)) {
      return true;
    }
    return false;
  };

  useFrame((_, delta) => {
    if (!instancedRef.current) return;

    const effectiveDelta = isPaused || reducedMotion ? 0 : Math.min(delta, 0.1);

    let instanceIdx = 0;
    for (let pIdx = 0; pIdx < curves.length; pIdx++) {
      const item = curves[pIdx];
      const highlighted = isPathHighlighted(item);
      const isTrainingPath =
        item.to === 'training-cluster' || item.from === 'training-cluster';

      const fromMetrics = allDistrictsMastery?.[item.from];
      const toMetrics = allDistrictsMastery?.[item.to];
      const fromMult = fromMetrics
        ? computeDistrictParticleSpeedMultiplier(fromMetrics)
        : 1.0;
      const toMult = toMetrics
        ? computeDistrictParticleSpeedMultiplier(toMetrics)
        : 1.0;
      const masteryMultiplier = isSingularityMode
        ? 2.0
        : Math.max(fromMult, toMult);
      const isOverdrive =
        isSingularityMode ||
        Boolean(fromMetrics?.isMastered || toMetrics?.isMastered);

      const isWorkloadActivePath = workloadSpec.activePathIds.includes(item.id);
      const isBottleneckPath =
        bottleneckSpec.targetDistrictId !== null &&
        (item.to === bottleneckSpec.targetDistrictId ||
          item.from === bottleneckSpec.targetDistrictId);

      const bottleneckSpeedFactor = isBottleneckPath ? 0.15 : 1.0;

      const pathSpeed =
        0.24 *
        flowSpeed *
        workloadSpec.speedMultiplier *
        masteryMultiplier *
        bottleneckSpeedFactor *
        (highlighted ? 1.35 : 0.65) *
        (trainingMode && isTrainingPath ? 1.5 : 1.0);

      for (let k = 0; k < PARTICLES_PER_PATH; k++) {
        const isOptimizedContenderB = k % 2 === 0;
        const battleSpeedFactor = isBattleRaceActive
          ? isOptimizedContenderB
            ? 2.25
            : 0.36
          : 1.0;
        const currentProg =
          (progressRef.current[instanceIdx] +
            effectiveDelta * pathSpeed * battleSpeedFactor) %
          1;
        progressRef.current[instanceIdx] = currentProg;

        item.curve.getPointAt(currentProg, tempPos);
        tempPos.y += Math.sin(currentProg * Math.PI) * 0.18;

        dummy.position.copy(tempPos);
        const scaleBase = isBattleRaceActive
          ? isOptimizedContenderB
            ? 0.22
            : 0.16
          : isBottleneckPath
          ? 0.21
          : isOverdrive
          ? 0.2
          : highlighted
          ? 0.18
          : 0.12 + (masteryMultiplier - 1) * 0.04;
        const pulse = 1 + Math.sin(currentProg * Math.PI) * 0.35;
        dummy.scale.setScalar(scaleBase * pulse);
        dummy.updateMatrix();

        instancedRef.current.setMatrixAt(instanceIdx, dummy.matrix);
        instancedRef.current.setColorAt(
          instanceIdx,
          isBattleRaceActive
            ? isOptimizedContenderB
              ? highlightColor
              : battleAmberColor
            : isBottleneckPath
            ? bottleneckColor
            : isWorkloadActivePath
            ? workloadColor
            : highlighted
            ? highlightColor
            : isSingularityMode
            ? overdriveColor
            : isOverdrive
            ? highlightColor
            : item.color
        );
        instanceIdx++;
      }
    }

    instancedRef.current.instanceMatrix.needsUpdate = true;
    if (instancedRef.current.instanceColor) {
      instancedRef.current.instanceColor.needsUpdate = true;
    }

    // Animate Hero Packet along the primary highlighted path or full loop
    if (heroPacketRef.current) {
      heroProgressRef.current =
        (heroProgressRef.current + effectiveDelta * 0.32 * flowSpeed) % 1;
      const targetCurves = curves.filter((c) => isPathHighlighted(c));
      const chosenList = targetCurves.length > 0 ? targetCurves : curves;
      const scaledIdx = Math.floor(heroProgressRef.current * chosenList.length);
      const localT = (heroProgressRef.current * chosenList.length) % 1;
      const activeCurve = chosenList[Math.min(scaledIdx, chosenList.length - 1)];
      if (activeCurve) {
        activeCurve.curve.getPointAt(localT, tempPos);
        tempPos.y += 0.25 + Math.sin(localT * Math.PI) * 0.22;
        heroPacketRef.current.position.copy(tempPos);
      }
    }
  });

  return (
    <group>
      {/* Conduit Base Tracks & Glowing Pathways */}
      {curves.map((item) => {
        const highlighted = isPathHighlighted(item);
        const isWorkloadActivePath = workloadSpec.activePathIds.includes(
          item.id
        );
        const isBottleneckPath =
          bottleneckSpec.targetDistrictId !== null &&
          (item.to === bottleneckSpec.targetDistrictId ||
            item.from === bottleneckSpec.targetDistrictId);
        const isOverdrive =
          isSingularityMode ||
          Boolean(
            allDistrictsMastery?.[item.from]?.isMastered ||
              allDistrictsMastery?.[item.to]?.isMastered
          );
        const dimmed =
          (activeDistrict !== null || activeDemoPathIds.length > 0) &&
          !highlighted &&
          !isSingularityMode &&
          !isBlueprintMode;

        const midPoint = item.points[Math.floor(item.points.length / 2)];
        const protocolInfo = CONDUIT_PROTOCOL_LABELS[item.id];

        return (
          <group key={item.id}>
            {/* Subtle Dark Track Bed */}
            <Line
              points={item.points}
              color={isNight ? '#1E3A6E' : '#94A3B8'}
              lineWidth={
                isBottleneckPath || highlighted || isOverdrive ? 4.5 : 2.5
              }
              transparent
              opacity={dimmed ? 0.3 : 0.78}
            />
            {/* Glowing Data Core Conduit */}
            <Line
              points={item.points}
              color={
                isBottleneckPath
                  ? '#EF4444'
                  : isWorkloadActivePath
                  ? workloadSpec.particleColorHex
                  : isSingularityMode
                  ? '#00F0FF'
                  : highlighted
                  ? '#00F0FF'
                  : item.hex
              }
              lineWidth={
                isBottleneckPath
                  ? 3.8
                  : isSingularityMode
                  ? 3.6
                  : highlighted || isOverdrive || isBlueprintMode
                  ? 3.2
                  : 1.8
              }
              transparent
              opacity={
                dimmed
                  ? 0.25
                  : isBottleneckPath ||
                    isSingularityMode ||
                    highlighted ||
                    isOverdrive ||
                    isBlueprintMode
                  ? 1.0
                  : 0.82
              }
            />

            {/* Blueprint Mode Floating Inter-District Protocol Label */}
            {isBlueprintMode && protocolInfo && midPoint && (
              <Html
                position={[midPoint.x, midPoint.y + 0.55, midPoint.z]}
                center
                zIndexRange={[6, 0]}
                style={{ pointerEvents: 'none' }}
              >
                <div className="pointer-events-none select-none rounded-lg border border-cyan-400/70 bg-slate-950/90 px-2 py-0.5 font-mono text-[9px] text-cyan-200 shadow-lg whitespace-nowrap">
                  <span className="font-bold text-cyan-400 mr-1">
                    [{protocolInfo.code}]
                  </span>
                  <span>{protocolInfo.spec}</span>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Instanced Flowing Data Particles */}
      <instancedMesh
        ref={instancedRef}
        args={[undefined, undefined, DATA_FLOW_PATHS.length * PARTICLES_PER_PATH]}
      >
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </instancedMesh>

      {/* Hero Featured Data Packet */}
      <group ref={heroPacketRef} position={[-10, 0.5, 8]}>
        <mesh>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.46, 16, 16]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={0.55}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
};
