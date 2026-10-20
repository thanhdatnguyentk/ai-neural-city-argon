'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { DATA_FLOW_PATHS, DistrictId } from '@/data/districts';

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
}) => {
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const heroPacketRef = useRef<THREE.Group>(null);
  const progressRef = useRef<number[]>(
    Array.from({ length: DATA_FLOW_PATHS.length * PARTICLES_PER_PATH }, (_, i) => (i % PARTICLES_PER_PATH) / PARTICLES_PER_PATH)
  );
  const heroProgressRef = useRef(0);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempPos = useMemo(() => new THREE.Vector3(), []);

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

  // Determine which paths are currently emphasized
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

    const effectiveDelta = isPaused || reducedMotion ? 0 : delta;

    let instanceIdx = 0;
    for (let pIdx = 0; pIdx < curves.length; pIdx++) {
      const item = curves[pIdx];
      const highlighted = isPathHighlighted(item);
      const isTrainingPath =
        item.to === 'training-cluster' || item.from === 'training-cluster';
      const pathSpeed =
        0.24 *
        flowSpeed *
        (highlighted ? 1.55 : 1.0) *
        (trainingMode && isTrainingPath ? 1.75 : 1.0);

      for (let k = 0; k < PARTICLES_PER_PATH; k++) {
        const currentProg =
          (progressRef.current[instanceIdx] + effectiveDelta * pathSpeed) % 1;
        progressRef.current[instanceIdx] = currentProg;

        item.curve.getPointAt(currentProg, tempPos);
        // Add slight vertical arc in the middle of each segment
        tempPos.y += Math.sin(currentProg * Math.PI) * 0.18;

        dummy.position.copy(tempPos);
        const scaleBase = highlighted ? 0.16 : 0.11;
        const pulse = 1 + Math.sin(currentProg * Math.PI) * 0.35;
        dummy.scale.setScalar(scaleBase * pulse);
        dummy.updateMatrix();

        instancedRef.current.setMatrixAt(instanceIdx, dummy.matrix);
        instancedRef.current.setColorAt(
          instanceIdx,
          highlighted ? new THREE.Color('#00F0FF') : item.color
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
        const dimmed =
          (activeDistrict !== null || activeDemoPathIds.length > 0) && !highlighted;

        return (
          <group key={item.id}>
            {/* Subtle Dark Track Bed */}
            <Line
              points={item.points}
              color={isNight ? '#1E293B' : '#94A3B8'}
              lineWidth={highlighted ? 4.5 : 2.5}
              transparent
              opacity={dimmed ? 0.25 : 0.65}
            />
            {/* Glowing Data Core Conduit */}
            <Line
              points={item.points}
              color={highlighted ? '#00F0FF' : item.hex}
              lineWidth={highlighted ? 3.2 : 1.6}
              transparent
              opacity={dimmed ? 0.2 : highlighted ? 0.98 : 0.72}
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
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      {/* Hero Featured Data Packet */}
      <group ref={heroPacketRef} position={[-10, 0.5, 8]}>
        <mesh>
          <sphereGeometry args={[0.24, 16, 16]} />
          <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.42, 16, 16]} />
          <meshBasicMaterial
            color="#00F0FF"
            transparent
            opacity={0.45}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
};
