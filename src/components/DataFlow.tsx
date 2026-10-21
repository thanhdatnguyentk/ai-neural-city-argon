'use client';

import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { DATA_FLOW_PATHS, DistrictId } from '@/data/districts';
import {
  DistrictMasteryMetrics,
  computeDistrictParticleSpeedMultiplier,
} from '@/hooks/useRoadmapProgress';

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

      const pathSpeed =
        0.24 *
        flowSpeed *
        masteryMultiplier *
        (highlighted ? 1.45 : 1.0) *
        (trainingMode && isTrainingPath ? 1.65 : 1.0);

      for (let k = 0; k < PARTICLES_PER_PATH; k++) {
        const currentProg =
          (progressRef.current[instanceIdx] + effectiveDelta * pathSpeed) % 1;
        progressRef.current[instanceIdx] = currentProg;

        item.curve.getPointAt(currentProg, tempPos);
        tempPos.y += Math.sin(currentProg * Math.PI) * 0.18;

        dummy.position.copy(tempPos);
        const scaleBase = isOverdrive
          ? 0.2
          : highlighted
          ? 0.18
          : 0.13 + (masteryMultiplier - 1) * 0.04;
        const pulse = 1 + Math.sin(currentProg * Math.PI) * 0.35;
        dummy.scale.setScalar(scaleBase * pulse);
        dummy.updateMatrix();

        instancedRef.current.setMatrixAt(instanceIdx, dummy.matrix);
        instancedRef.current.setColorAt(
          instanceIdx,
          highlighted
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
        const isOverdrive =
          isSingularityMode ||
          Boolean(
            allDistrictsMastery?.[item.from]?.isMastered ||
              allDistrictsMastery?.[item.to]?.isMastered
          );
        const dimmed =
          (activeDistrict !== null || activeDemoPathIds.length > 0) &&
          !highlighted &&
          !isSingularityMode;

        return (
          <group key={item.id}>
            {/* Subtle Dark Track Bed */}
            <Line
              points={item.points}
              color={isNight ? '#1E3A6E' : '#94A3B8'}
              lineWidth={highlighted || isOverdrive ? 4.5 : 2.5}
              transparent
              opacity={dimmed ? 0.3 : 0.78}
            />
            {/* Glowing Data Core Conduit */}
            <Line
              points={item.points}
              color={
                isSingularityMode
                  ? '#00F0FF'
                  : highlighted
                  ? '#00F0FF'
                  : item.hex
              }
              lineWidth={
                isSingularityMode
                  ? 3.6
                  : highlighted || isOverdrive
                  ? 3.2
                  : 1.8
              }
              transparent
              opacity={
                dimmed
                  ? 0.25
                  : isSingularityMode || highlighted || isOverdrive
                  ? 1.0
                  : 0.82
              }
            />
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
