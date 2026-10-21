'use client';

import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface MasteryBeaconProps {
  accentColorHex: string;
  secondaryColorHex: string;
  footprint: [number, number];
  crownHeight?: number;
  isPaused: boolean;
  reducedMotion: boolean;
}

const MOTE_COUNT = 20; // Capped <= 24 instanced points per mastered district for locked 60 FPS

interface MoteSeed {
  x: number;
  z: number;
  phase: number;
  speed: number;
  scale: number;
}

export const MasteryBeacon: React.FC<MasteryBeaconProps> = ({
  accentColorHex,
  secondaryColorHex,
  footprint,
  crownHeight = 3.9,
  isPaused,
  reducedMotion,
}) => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  const crownGemRef = useRef<THREE.Mesh>(null);
  const beamMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const motesRef = useRef<THREE.InstancedMesh>(null);

  const [fw, fd] = footprint;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const moteSeeds = useMemo<MoteSeed[]>(() => {
    return Array.from({ length: MOTE_COUNT }, (_, i) => {
      const angle = (i / MOTE_COUNT) * Math.PI * 2;
      const radiusRatio = 0.22 + ((i * 7) % 10) * 0.022;
      return {
        x: Math.cos(angle) * fw * radiusRatio,
        z: Math.sin(angle) * fd * radiusRatio,
        phase: (i / MOTE_COUNT) * 1.0,
        speed: 0.28 + (i % 5) * 0.06,
        scale: 0.045 + (i % 3) * 0.015,
      };
    });
  }, [fw, fd]);

  useLayoutEffect(() => {
    if (!motesRef.current) return;
    moteSeeds.forEach((seed, idx) => {
      dummy.position.set(seed.x, 0.5 + seed.phase * crownHeight, seed.z);
      dummy.scale.setScalar(seed.scale);
      dummy.updateMatrix();
      motesRef.current!.setMatrixAt(idx, dummy.matrix);
    });
    motesRef.current.instanceMatrix.needsUpdate = true;
  }, [moteSeeds, dummy, crownHeight]);

  useFrame((state, delta) => {
    if (isPaused || reducedMotion) return;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.1);

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += dt * 0.85;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= dt * 1.25;
    }
    if (crownGemRef.current) {
      crownGemRef.current.rotation.y += dt * 1.6;
      crownGemRef.current.position.y =
        crownHeight + Math.sin(t * 3.0) * 0.12;
    }
    if (beamMatRef.current) {
      const targetOp = 0.16 + 0.04 * Math.sin(t * 3.0);
      beamMatRef.current.opacity = THREE.MathUtils.lerp(
        beamMatRef.current.opacity,
        targetOp,
        dt * 6
      );
    }

    if (motesRef.current) {
      for (let i = 0; i < MOTE_COUNT; i++) {
        const seed = moteSeeds[i];
        const cycle = (seed.phase + t * seed.speed) % 1;
        const y = 0.45 + cycle * (crownHeight + 0.4);
        const pulseScale = seed.scale * Math.sin(cycle * Math.PI);
        dummy.position.set(
          seed.x + Math.sin(t * 1.5 + i) * 0.06,
          y,
          seed.z + Math.cos(t * 1.5 + i) * 0.06
        );
        dummy.scale.setScalar(Math.max(0.01, pulseScale));
        dummy.updateMatrix();
        motesRef.current.setMatrixAt(i, dummy.matrix);
      }
      motesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group raycast={() => null}>
      {/* Subtle Vertical Volumetric Light Beam Cylinder (Additive Blending, Opacity ~0.18) */}
      <mesh position={[0, crownHeight * 0.55, 0]} raycast={() => null}>
        <cylinderGeometry
          args={[
            Math.min(fw, fd) * 0.24,
            Math.min(fw, fd) * 0.36,
            crownHeight * 1.05,
            16,
            1,
            true,
          ]}
        />
        <meshBasicMaterial
          ref={beamMatRef}
          color={accentColorHex}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Dual Counter-Rotating Geometric Octagon Halo Rings */}
      <group position={[0, crownHeight, 0]}>
        <mesh
          ref={outerRingRef}
          rotation={[-Math.PI / 2, 0, 0]}
          raycast={() => null}
        >
          <ringGeometry args={[0.92, 1.05, 8]} />
          <meshBasicMaterial
            color={accentColorHex}
            transparent
            opacity={0.88}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <mesh
          ref={innerRingRef}
          rotation={[-Math.PI / 2, 0, Math.PI / 8]}
          raycast={() => null}
        >
          <ringGeometry args={[0.58, 0.7, 8]} />
          <meshBasicMaterial
            color={secondaryColorHex}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Floating Ascended Crown Star Crystal */}
      <mesh
        ref={crownGemRef}
        position={[0, crownHeight, 0]}
        raycast={() => null}
      >
        <octahedronGeometry args={[0.26, 0]} />
        <meshBasicMaterial
          color="#FFFFFF"
          wireframe
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Rising Ambient Micro-Particles (<= 24 Instanced Points) */}
      <instancedMesh
        ref={motesRef}
        args={[undefined, undefined, MOTE_COUNT]}
        raycast={() => null}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color={accentColorHex}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </instancedMesh>
    </group>
  );
};
