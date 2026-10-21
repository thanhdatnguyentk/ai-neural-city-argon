'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface DistrictProgressRingProps {
  completedCount: number; // 0 to 4
  footprint: [number, number];
  accentColorHex: string;
  isNight: boolean;
  isPaused: boolean;
  reducedMotion: boolean;
}

const SEGMENTS = [0, 1, 2, 3] as const;
const GAP_RADIANS = 0.14;
const ARC_LENGTH = Math.PI / 2 - GAP_RADIANS;

export const DistrictProgressRing: React.FC<DistrictProgressRingProps> = ({
  completedCount,
  footprint,
  accentColorHex,
  isNight,
  isPaused,
  reducedMotion,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const materialRefs = useRef<(THREE.MeshBasicMaterial | null)[]>([
    null,
    null,
    null,
    null,
  ]);

  const [fw, fd] = footprint;
  const innerRadius = useMemo(() => Math.min(fw, fd) * 0.485, [fw, fd]);
  const outerRadius = useMemo(() => Math.min(fw, fd) * 0.545, [fw, fd]);

  const activeColor = useMemo(
    () => new THREE.Color(accentColorHex),
    [accentColorHex]
  );
  const inactiveColor = useMemo(
    () => new THREE.Color(isNight ? '#1E293B' : '#94A3B8'),
    [isNight]
  );

  const isMastered = completedCount >= 4;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    if (groupRef.current && !isPaused && !reducedMotion) {
      if (isMastered) {
        groupRef.current.rotation.z += dt * 0.35;
      } else {
        groupRef.current.rotation.z = THREE.MathUtils.lerp(
          groupRef.current.rotation.z,
          0,
          dt * 4
        );
      }
    }

    for (let i = 0; i < 4; i++) {
      const mat = materialRefs.current[i];
      if (!mat) continue;
      const isSegmentCompleted = i < completedCount;
      const pulse =
        isSegmentCompleted && !isPaused && !reducedMotion
          ? 0.08 * Math.sin(state.clock.elapsedTime * 3.0 + i)
          : 0;
      const targetOpacity = isSegmentCompleted ? 0.9 + pulse : 0.25;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, dt * 8);
      mat.color.lerp(isSegmentCompleted ? activeColor : inactiveColor, dt * 8);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, 0.425, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      {SEGMENTS.map((segIdx) => {
        const thetaStart = segIdx * (Math.PI / 2) + GAP_RADIANS * 0.5;
        const isDone = segIdx < completedCount;
        return (
          <mesh key={segIdx}>
            <ringGeometry
              args={[innerRadius, outerRadius, 20, 1, thetaStart, ARC_LENGTH]}
            />
            <meshBasicMaterial
              ref={(el) => {
                materialRefs.current[segIdx] = el;
              }}
              color={isDone ? accentColorHex : isNight ? '#1E293B' : '#94A3B8'}
              transparent
              opacity={isDone ? 0.9 : 0.25}
              blending={isDone ? THREE.AdditiveBlending : THREE.NormalBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};
