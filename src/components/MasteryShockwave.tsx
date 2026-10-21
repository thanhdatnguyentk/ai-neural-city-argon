'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface MasteryShockwaveProps {
  active: boolean;
  accentColorHex: string;
}

const DURATION_SECONDS = 1.8;

export const MasteryShockwave: React.FC<MasteryShockwaveProps> = ({
  active,
  accentColorHex,
}) => {
  const ringMeshRef = useRef<THREE.Mesh>(null);
  const ringMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const secondaryMeshRef = useRef<THREE.Mesh>(null);
  const secondaryMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const elapsedRef = useRef<number>(DURATION_SECONDS + 1);

  useEffect(() => {
    if (active) {
      elapsedRef.current = 0;
      if (ringMeshRef.current) {
        ringMeshRef.current.visible = true;
        ringMeshRef.current.scale.setScalar(0.5);
      }
      if (secondaryMeshRef.current) {
        secondaryMeshRef.current.visible = true;
        secondaryMeshRef.current.scale.setScalar(0.35);
      }
      if (ringMatRef.current) {
        ringMatRef.current.opacity = 0.85;
      }
      if (secondaryMatRef.current) {
        secondaryMatRef.current.opacity = 0.65;
      }
    }
  }, [active]);

  useFrame((_, delta) => {
    if (elapsedRef.current >= DURATION_SECONDS) {
      if (ringMeshRef.current && ringMeshRef.current.visible) {
        ringMeshRef.current.visible = false;
      }
      if (secondaryMeshRef.current && secondaryMeshRef.current.visible) {
        secondaryMeshRef.current.visible = false;
      }
      return;
    }

    elapsedRef.current += Math.min(delta, 0.1);
    const progress = Math.min(1, elapsedRef.current / DURATION_SECONDS);
    // Smooth ease-out curve
    const eased = 1 - Math.pow(1 - progress, 3);

    // Lerp radius from r = 0.5 to r = 6.0 while fading opacity 0.85 -> 0.0
    const radiusScale = THREE.MathUtils.lerp(0.5, 6.0, eased);
    const opacity = THREE.MathUtils.lerp(0.85, 0.0, progress);

    if (ringMeshRef.current && ringMatRef.current) {
      ringMeshRef.current.scale.setScalar(radiusScale);
      ringMatRef.current.opacity = Math.max(0, opacity);
    }

    if (secondaryMeshRef.current && secondaryMatRef.current) {
      const secondaryScale = THREE.MathUtils.lerp(0.35, 4.6, eased);
      secondaryMeshRef.current.scale.setScalar(secondaryScale);
      secondaryMatRef.current.opacity = Math.max(0, opacity * 0.75);
    }
  });

  return (
    <group position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
      <mesh ref={ringMeshRef} visible={false} raycast={() => null}>
        <ringGeometry args={[0.88, 1.0, 48]} />
        <meshBasicMaterial
          ref={ringMatRef}
          color={accentColorHex}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={secondaryMeshRef} visible={false} raycast={() => null}>
        <ringGeometry args={[0.72, 0.82, 48]} />
        <meshBasicMaterial
          ref={secondaryMatRef}
          color="#FFFFFF"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};
