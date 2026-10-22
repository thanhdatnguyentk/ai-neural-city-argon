'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, RoundedBox, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { DistrictData, DistrictId } from '@/data/districts';
import type { DistrictMasteryMetrics } from '@/hooks/useRoadmapProgress';
import type { DistrictSaturationMetric } from '@/types/tycoon-strategy';
import { DistrictProgressRing } from './DistrictProgressRing';
import { MasteryBeacon } from './MasteryBeacon';
import { MasteryShockwave } from './MasteryShockwave';

interface DistrictProps {
  district: DistrictData;
  index: number;
  isSelected: boolean;
  isHovered: boolean;
  isPipelineHighlighted: boolean;
  isFlowHighlighted: boolean;
  showLabels: boolean;
  isPaused: boolean;
  flowSpeed: number;
  trainingMode: boolean;
  isNight: boolean;
  reducedMotion: boolean;
  masteryMetrics?: DistrictMasteryMetrics;
  isShockwaveActive?: boolean;
  isBlueprintMode?: boolean;
  isBottleneckTarget?: boolean;
  isAdversarialShieldActive?: boolean;
  tycoonMetric?: DistrictSaturationMetric;
  onSelect: (id: DistrictId) => void;
  onDoubleClick?: (id: DistrictId) => void;
  onHover: (id: DistrictId | null) => void;
}

export const District: React.FC<DistrictProps> = ({
  district,
  index,
  isSelected,
  isHovered,
  isPipelineHighlighted,
  isFlowHighlighted,
  showLabels,
  isPaused,
  flowSpeed,
  trainingMode,
  isNight,
  reducedMotion,
  masteryMetrics,
  isShockwaveActive = false,
  isBlueprintMode = false,
  isBottleneckTarget = false,
  isAdversarialShieldActive = false,
  tycoonMetric,
  onSelect,
  onDoubleClick,
  onHover,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const animatedPartRef = useRef<THREE.Group>(null);
  const secondaryPartRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  // Start at 0.35 so buildings are immediately visible on frame 0 and smoothly rise to 1.0
  const assemblyProgress = useRef(reducedMotion ? 1 : 0.35);

  const [localHover, setLocalHover] = useState(false);
  const activeHover = isHovered || localHover;
  const isHighlighted = isSelected || activeHover || isPipelineHighlighted || isFlowHighlighted;

  const completedCount = masteryMetrics?.completedCount ?? 0;
  const isMastered = masteryMetrics?.isMastered ?? false;
  const masteryRatio = completedCount / 4;
  const smoothEmissiveRef = useRef<number>(0.9);

  const baseColor = isBlueprintMode
    ? '#06152D'
    : isBottleneckTarget
    ? '#3B0A14'
    : isNight
    ? '#112248'
    : '#CBD5E1';
  const buildingBodyColor = isBlueprintMode
    ? '#092247'
    : isBottleneckTarget
    ? '#4C0D19'
    : isNight
    ? '#1E3A6E'
    : '#F8FAFC';
  const buildingDarkColor = isBlueprintMode
    ? '#051329'
    : isBottleneckTarget
    ? '#380812'
    : isNight
    ? '#132852'
    : '#94A3B8';
  const edgeColor = isBottleneckTarget
    ? '#EF4444'
    : isBlueprintMode || isHighlighted
    ? '#00F0FF'
    : district.accentColor;
  const windowAmber = '#F59E0B';

  const accentThreeColor = useMemo(() => new THREE.Color(district.accentColor), [district.accentColor]);
  const secondaryThreeColor = useMemo(() => new THREE.Color(district.secondaryColor), [district.secondaryColor]);

  useFrame((state, delta) => {
    // 1. Assembly intro animation
    if (assemblyProgress.current < 1) {
      if (reducedMotion) {
        assemblyProgress.current = 1;
      } else {
        const delay = index * 0.06;
        if (state.clock.elapsedTime > delay) {
          assemblyProgress.current = Math.min(1, assemblyProgress.current + Math.min(delta, 0.1) * 1.6);
        }
      }
    }

    const eased = 1 - Math.pow(1 - assemblyProgress.current, 3);

    if (groupRef.current) {
      const targetY = (activeHover ? 0.25 : isSelected ? 0.18 : 0) - (1 - eased) * 0.8;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.18);
      const scaleVal = Math.max(0.35, eased);
      groupRef.current.scale.set(1, scaleVal, 1);

      // Progressive Emissive Boost (I_target = I_0 + p * 1.15) & Harmonic Breathing when Mastered
      const i0 = isSelected ? 1.8 : activeHover ? 1.5 : isHighlighted ? 1.2 : 0.9;
      const iTargetBase = i0 + masteryRatio * 1.15;
      const harmonicWave =
        isMastered && !isPaused && !reducedMotion
          ? 0.35 * Math.sin(3.0 * state.clock.elapsedTime)
          : 0;
      const desiredEmissive = iTargetBase + harmonicWave;
      smoothEmissiveRef.current = THREE.MathUtils.lerp(
        smoothEmissiveRef.current,
        desiredEmissive,
        Math.min(1, Math.min(delta, 0.1) * 6)
      );

      groupRef.current.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat && mat.isMeshStandardMaterial) {
            mat.wireframe = isBlueprintMode;
            if (mat.emissiveIntensity > 0) {
              if (mat.userData.baseEmissiveRatio === undefined) {
                mat.userData.baseEmissiveRatio = mat.emissiveIntensity / i0;
              }
              const bottleneckPulse = isBottleneckTarget
                ? 1.6 + 0.8 * Math.sin(state.clock.elapsedTime * 7.0)
                : 1.0;
              mat.emissiveIntensity =
                mat.userData.baseEmissiveRatio *
                smoothEmissiveRef.current *
                bottleneckPulse;
            }
          }
        }
      });
    }

    if (isPaused || reducedMotion) return;

    const masteryAnimBoost = isMastered ? 1.35 : 1 + masteryRatio * 0.2;
    const speedMultiplier =
      (district.id === 'training-cluster' && trainingMode ? flowSpeed * 2.4 : flowSpeed) *
      masteryAnimBoost;
    const t = state.clock.elapsedTime * speedMultiplier;

    // 2. District-specific subtle idle animations
    if (animatedPartRef.current) {
      if (district.id === 'model-core') {
        animatedPartRef.current.rotation.y = t * 0.6;
        animatedPartRef.current.rotation.z = Math.sin(t * 0.8) * 0.25;
        animatedPartRef.current.position.y = 2.6 + Math.sin(t * 1.5) * 0.15;
      } else if (district.id === 'input-gateway') {
        animatedPartRef.current.rotation.y = t * 0.8;
      } else if (district.id === 'computer-vision') {
        animatedPartRef.current.position.y = 1.45 + Math.sin(t * 2.0) * 0.7;
      } else if (district.id === 'nlp-district') {
        animatedPartRef.current.rotation.y = -t * 0.5;
        animatedPartRef.current.position.y = 2.0 + Math.sin(t * 1.4) * 0.1;
      } else if (district.id === 'training-cluster') {
        animatedPartRef.current.position.y = 1.6 + Math.sin(t * 3.2) * 0.9;
      } else if (district.id === 'data-lake') {
        animatedPartRef.current.position.y = 1.2 + Math.sin(t * 1.3) * 0.12;
      } else if (district.id === 'inference-center') {
        animatedPartRef.current.rotation.y = t * 1.2;
      } else if (district.id === 'output-terminal') {
        animatedPartRef.current.scale.setScalar(1 + Math.sin(t * 2.5) * 0.08);
      }
    }

    if (secondaryPartRef.current) {
      if (district.id === 'model-core') {
        secondaryPartRef.current.rotation.x = t * 0.45;
        secondaryPartRef.current.rotation.y = -t * 0.5;
      } else if (district.id === 'nlp-district') {
        secondaryPartRef.current.rotation.y = t * 0.7;
      }
    }

    if (pulseRingRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.04;
      pulseRingRef.current.scale.set(pulse, pulse, 1);
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setLocalHover(true);
    onHover(district.id);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setLocalHover(false);
    onHover(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(district.id);
  };

  const handleDoubleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onDoubleClick?.(district.id);
  };

  const [fw, fd] = district.footprint;
  const i0 = isSelected ? 1.8 : activeHover ? 1.5 : isHighlighted ? 1.2 : 0.9;
  const emissiveBoost = i0 + masteryRatio * 1.15;
  const crownHeight =
    district.id === 'model-core'
      ? 4.3
      : district.id === 'training-cluster'
      ? 4.15
      : district.id === 'output-terminal'
      ? 4.2
      : 3.75;

  return (
    <group position={district.position}>
      {/* Level-Up 100% Shockwave Animation */}
      <MasteryShockwave
        active={isShockwaveActive}
        accentColorHex={district.accentColor}
      />

      <group
        ref={groupRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* District Plinth Base */}
        <RoundedBox args={[fw, 0.4, fd]} position={[0, 0.2, 0]} radius={0.1} smoothness={2} receiveShadow castShadow>
          <meshStandardMaterial
            color={baseColor}
            roughness={0.4}
            metalness={0.25}
          />
        </RoundedBox>

        {/* 4-Segment Holographic Base Progress Ring (0% -> 25% -> 50% -> 75% -> 100%) */}
        <DistrictProgressRing
          completedCount={completedCount}
          footprint={district.footprint}
          accentColorHex={district.accentColor}
          isNight={isNight}
          isPaused={isPaused}
          reducedMotion={reducedMotion}
        />

        {/* Ascended 100% Mastery Holographic Crown, Volumetric Beam & Rising Motes */}
        {isMastered && (
          <MasteryBeacon
            accentColorHex={district.accentColor}
            secondaryColorHex={district.secondaryColor}
            footprint={district.footprint}
            crownHeight={crownHeight}
            isPaused={isPaused}
            reducedMotion={reducedMotion}
          />
        )}

        {/* Chaos Bottleneck Crimson Alert Cylinder & Ring */}
        {isBottleneckTarget && (
          <group raycast={() => null}>
            <mesh position={[0, 0.44, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
              <ringGeometry args={[Math.max(fw, fd) * 0.56, Math.max(fw, fd) * 0.68, 48]} />
              <meshBasicMaterial
                color="#EF4444"
                transparent
                opacity={0.92}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, 2.4, 0]} raycast={() => null}>
              <cylinderGeometry args={[Math.min(fw, fd) * 0.42, Math.min(fw, fd) * 0.48, 4.4, 24, 1, true]} />
              <meshBasicMaterial
                color="#EF4444"
                transparent
                opacity={0.22}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        )}

        {/* Adversarial Containment Holographic Shield Dome (Guardrails Defense) */}
        {isAdversarialShieldActive && (
          <group position={[0, 0.4, 0]} raycast={() => null}>
            <mesh raycast={() => null}>
              <sphereGeometry args={[Math.max(fw, fd) * 0.58, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshBasicMaterial
                color="#00F0FF"
                wireframe
                transparent
                opacity={0.65}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh raycast={() => null}>
              <sphereGeometry args={[Math.max(fw, fd) * 0.56, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshBasicMaterial
                color="#F59E0B"
                transparent
                opacity={0.14}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
              />
            </mesh>
          </group>
        )}

        {/* Glowing Base Trim */}
        <mesh position={[0, 0.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.min(fw, fd) * 0.43, Math.min(fw, fd) * 0.48, 32]} />
          <meshBasicMaterial
            color={district.accentColor}
            transparent
            opacity={isHighlighted ? 0.95 : 0.55}
          />
        </mesh>

        {/* Selection / Hover Outer Halo Ring & Holographic Vertical Beacon */}
        {isHighlighted && (
          <group>
            <mesh
              ref={pulseRingRef}
              position={[0, 0.06, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[Math.max(fw, fd) * 0.55, Math.max(fw, fd) * 0.64, 48]} />
              <meshBasicMaterial
                color={isSelected ? '#00F0FF' : district.accentColor}
                transparent
                opacity={isSelected ? 0.95 : 0.72}
                side={THREE.DoubleSide}
              />
            </mesh>
            {(isSelected || activeHover) && (
              <mesh position={[0, 2.6, 0]}>
                <cylinderGeometry args={[Math.min(fw, fd) * 0.36, Math.min(fw, fd) * 0.44, 5.0, 24, 1, true]} />
                <meshBasicMaterial
                  color={isSelected ? '#00F0FF' : district.accentColor}
                  transparent
                  opacity={isSelected ? 0.11 : 0.06}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>
            )}
          </group>
        )}

        {/* Corner Warm Amber Beacons */}
        {[
          [-fw * 0.42, 0.46, -fd * 0.42],
          [fw * 0.42, 0.46, -fd * 0.42],
          [-fw * 0.42, 0.46, fd * 0.42],
          [fw * 0.42, 0.46, fd * 0.42],
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]}>
            <boxGeometry args={[0.18, 0.14, 0.18]} />
            <meshStandardMaterial
              color={windowAmber}
              emissive={windowAmber}
              emissiveIntensity={isNight ? 1.6 : 0.8}
            />
          </mesh>
        ))}

        {/* ==================== 1. INPUT GATEWAY ==================== */}
        {district.id === 'input-gateway' && (
          <group>
            {/* Left & Right Portal Pylons */}
            <mesh position={[-1.2, 1.65, -0.4]} castShadow receiveShadow>
              <boxGeometry args={[0.9, 2.5, 1.15]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.35} metalness={0.3} />
              <Edges color={edgeColor} />
            </mesh>
            <mesh position={[1.2, 1.65, -0.4]} castShadow receiveShadow>
              <boxGeometry args={[0.9, 2.5, 1.15]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.35} metalness={0.3} />
              <Edges color={edgeColor} />
            </mesh>
            {/* Overhead Portal Bridge */}
            <mesh position={[0, 2.7, -0.4]} castShadow>
              <boxGeometry args={[3.4, 0.5, 0.95]} />
              <meshStandardMaterial color={buildingDarkColor} roughness={0.3} metalness={0.4} />
              <Edges color="#00F0FF" />
            </mesh>
            {/* Glowing Portal Energy Gate */}
            <mesh position={[0, 1.5, -0.4]}>
              <boxGeometry args={[1.5, 1.9, 0.14]} />
              <meshStandardMaterial
                color={accentThreeColor}
                emissive={accentThreeColor}
                emissiveIntensity={1.2 * emissiveBoost}
                transparent
                opacity={0.65}
              />
            </mesh>
            {/* Amber Window Strips on Pylons */}
            {[0.9, 1.4, 1.9, 2.3].map((y, i) => (
              <React.Fragment key={i}>
                <mesh position={[-1.2, y, 0.2]}>
                  <boxGeometry args={[0.55, 0.1, 0.04]} />
                  <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={1.5} />
                </mesh>
                <mesh position={[1.2, y, 0.2]}>
                  <boxGeometry args={[0.55, 0.1, 0.04]} />
                  <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={1.5} />
                </mesh>
              </React.Fragment>
            ))}
            {/* Arrival Helipad / Data Intake Pad */}
            <mesh position={[0, 0.43, 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.0, 24]} />
              <meshStandardMaterial
                color={accentThreeColor}
                emissive={accentThreeColor}
                emissiveIntensity={1.0 * emissiveBoost}
                transparent
                opacity={0.8}
              />
            </mesh>
            {/* Rotating Radar / Receiver Dish on Top */}
            <group ref={animatedPartRef} position={[-1.2, 3.15, -0.4]}>
              <mesh rotation={[0.4, 0, 0]}>
                <coneGeometry args={[0.5, 0.35, 16, 1, true]} />
                <meshStandardMaterial
                  color={district.accentColor}
                  emissive={accentThreeColor}
                  emissiveIntensity={0.9}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh position={[0, 0.22, 0]}>
                <sphereGeometry args={[0.11, 12, 12]} />
                <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={2.0} />
              </mesh>
            </group>
          </group>
        )}

        {/* ==================== 2. DATA LAKE ==================== */}
        {district.id === 'data-lake' && (
          <group>
            {/* 3 Cylindrical Data Silo Reservoirs */}
            {[
              [-1.1, -0.8, 1.15, 2.3],
              [1.1, -0.6, 0.95, 1.9],
              [-0.1, 1.0, 1.25, 1.6],
            ].map(([x, z, r, h], idx) => (
              <group key={idx} position={[x, 0.4, z]}>
                <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[r, r, h, 8]} />
                  <meshStandardMaterial
                    color={buildingBodyColor}
                    roughness={0.25}
                    metalness={0.35}
                  />
                  <Edges color={edgeColor} />
                </mesh>
                {/* Glowing Cyan Data Rings around Silo */}
                {[0.3, 0.6, 0.85].map((ratio, rIdx) => (
                  <mesh key={rIdx} position={[0, h * ratio, 0]}>
                    <cylinderGeometry args={[r * 1.03, r * 1.03, 0.1, 8]} />
                    <meshStandardMaterial
                      color={district.accentColor}
                      emissive={accentThreeColor}
                      emissiveIntensity={1.3 * emissiveBoost}
                    />
                  </mesh>
                ))}
                {/* Top Reservoir Pool Glow */}
                <mesh position={[0, h + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[r * 0.84, 8]} />
                  <meshStandardMaterial
                    color={district.accentColor}
                    emissive={accentThreeColor}
                    emissiveIntensity={1.2 * emissiveBoost}
                  />
                </mesh>
              </group>
            ))}
            {/* Floating Indexing Crystal Ring */}
            <group ref={animatedPartRef} position={[-0.1, 1.2, 1.0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.9, 0.06, 12, 24]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={1.6 * emissiveBoost}
                />
              </mesh>
            </group>
          </group>
        )}

        {/* ==================== 3. COMPUTER VISION DISTRICT ==================== */}
        {district.id === 'computer-vision' && (
          <group>
            {/* Optical Observatory Dome Base */}
            <mesh position={[-1.0, 1.15, -0.6]} castShadow receiveShadow>
              <cylinderGeometry args={[1.05, 1.2, 1.5, 12]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.35} metalness={0.35} />
              <Edges color={edgeColor} />
            </mesh>
            {/* Geodesic Camera Lens Dome */}
            <mesh position={[-1.0, 1.9, -0.6]} castShadow>
              <sphereGeometry args={[1.0, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color={district.accentColor}
                emissive={accentThreeColor}
                emissiveIntensity={0.8 * emissiveBoost}
                wireframe
              />
            </mesh>
            {/* 3 Layered Convolutional Filter Frames */}
            {[0.4, 0.95, 1.5].map((zPos, idx) => (
              <group key={idx} position={[0.95, 1.5, zPos - 0.6]}>
                <mesh castShadow>
                  <boxGeometry args={[1.7, 1.95, 0.09]} />
                  <meshStandardMaterial
                    color={idx === 1 ? '#8B5CF6' : '#38BDF8'}
                    emissive={idx === 1 ? '#8B5CF6' : '#38BDF8'}
                    emissiveIntensity={0.9 * emissiveBoost}
                    transparent
                    opacity={0.5}
                  />
                  <Edges color={idx === 1 ? '#C084FC' : '#00F0FF'} />
                </mesh>
              </group>
            ))}
            {/* Animated Laser Scan Bar */}
            <group ref={animatedPartRef} position={[0.95, 1.45, 0.35]}>
              <mesh>
                <boxGeometry args={[1.85, 0.08, 1.4]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={2.2}
                  transparent
                  opacity={0.9}
                />
              </mesh>
            </group>
          </group>
        )}

        {/* ==================== 4. NLP DISTRICT ==================== */}
        {district.id === 'nlp-district' && (
          <group>
            {/* 5 Stepped Transformer Sequence Spires */}
            {[
              [-1.2, -0.7, 1.9],
              [-0.6, 0.7, 2.4],
              [0, -0.2, 3.2],
              [0.6, 0.7, 2.6],
              [1.2, -0.7, 2.0],
            ].map(([x, z, h], idx) => (
              <group key={idx} position={[x, 0.4, z]}>
                <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.7, h, 0.7]} />
                  <meshStandardMaterial color={buildingBodyColor} roughness={0.3} metalness={0.35} />
                  <Edges color={edgeColor} />
                </mesh>
                {/* Token Embedding Band */}
                <mesh position={[0, h - 0.25, 0]}>
                  <boxGeometry args={[0.76, 0.16, 0.76]} />
                  <meshStandardMaterial
                    color={idx % 2 === 0 ? district.accentColor : district.secondaryColor}
                    emissive={idx % 2 === 0 ? accentThreeColor : secondaryThreeColor}
                    emissiveIntensity={1.4 * emissiveBoost}
                  />
                </mesh>
                {/* Warm Amber Status Windows */}
                <mesh position={[0, h * 0.5, 0.36]}>
                  <boxGeometry args={[0.42, 0.1, 0.03]} />
                  <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={1.6} />
                </mesh>
              </group>
            ))}
            {/* Rotating Semantic Attention Rings */}
            <group ref={animatedPartRef} position={[0, 2.1, 0]}>
              <mesh rotation={[Math.PI / 2, 0.2, 0]}>
                <torusGeometry args={[1.6, 0.055, 12, 36]} />
                <meshStandardMaterial
                  color="#38BDF8"
                  emissive="#38BDF8"
                  emissiveIntensity={1.5 * emissiveBoost}
                />
              </mesh>
            </group>
            <group ref={secondaryPartRef} position={[0, 2.5, 0]}>
              <mesh rotation={[Math.PI / 2, -0.25, 0]}>
                <torusGeometry args={[1.2, 0.05, 12, 32]} />
                <meshStandardMaterial
                  color="#A855F7"
                  emissive="#A855F7"
                  emissiveIntensity={1.5 * emissiveBoost}
                />
              </mesh>
            </group>
          </group>
        )}

        {/* ==================== 5. TRAINING CLUSTER ==================== */}
        {district.id === 'training-cluster' && (
          <group>
            {/* 6 High-Density GPU Towers in a 3x2 Matrix */}
            {[
              [-1.35, -1.0, 3.2],
              [0, -1.0, 3.6],
              [1.35, -1.0, 3.2],
              [-1.35, 1.0, 2.9],
              [0, 1.0, 3.4],
              [1.35, 1.0, 2.9],
            ].map(([x, z, h], idx) => (
              <group key={idx} position={[x, 0.4, z]}>
                <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.84, h, 0.84]} />
                  <meshStandardMaterial color={buildingDarkColor} roughness={0.3} metalness={0.45} />
                  <Edges color={trainingMode ? '#EC4899' : edgeColor} />
                </mesh>
                {/* Vertical Neural GPU LED Strip (Front & Side) */}
                <mesh position={[0, h / 2, 0.43]}>
                  <boxGeometry args={[0.16, h * 0.82, 0.04]} />
                  <meshStandardMaterial
                    color={trainingMode ? '#EC4899' : district.accentColor}
                    emissive={trainingMode ? '#EC4899' : district.accentColor}
                    emissiveIntensity={(trainingMode ? 2.4 : 1.4) * emissiveBoost}
                  />
                </mesh>
                {/* Amber Server Rack Lights */}
                {[0.7, 1.4, 2.1].map((wy, wIdx) => (
                  <mesh key={wIdx} position={[0.43, wy, 0]}>
                    <boxGeometry args={[0.04, 0.1, 0.48]} />
                    <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={1.6} />
                  </mesh>
                ))}
                {/* Top GPU Cooling Cap */}
                <mesh position={[0, h + 0.05, 0]}>
                  <cylinderGeometry args={[0.32, 0.32, 0.1, 12]} />
                  <meshStandardMaterial
                    color="#00F0FF"
                    emissive="#00F0FF"
                    emissiveIntensity={trainingMode ? 2.2 : 1.2}
                  />
                </mesh>
              </group>
            ))}
            {/* Overhead Interconnect Bus Bridges */}
            <mesh position={[0, 2.75, -1.0]} castShadow>
              <boxGeometry args={[3.4, 0.2, 0.28]} />
              <meshStandardMaterial color={district.accentColor} emissive={accentThreeColor} emissiveIntensity={1.1} />
            </mesh>
            <mesh position={[0, 2.75, 1.0]} castShadow>
              <boxGeometry args={[3.4, 0.2, 0.28]} />
              <meshStandardMaterial color={district.accentColor} emissive={accentThreeColor} emissiveIntensity={1.1} />
            </mesh>
            {/* Synchronized Training Wave Plane */}
            <group ref={animatedPartRef} position={[0, 1.8, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.6, 2.2, 24]} />
                <meshBasicMaterial
                  color={trainingMode ? '#EC4899' : '#8B5CF6'}
                  transparent
                  opacity={trainingMode ? 0.8 : 0.45}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          </group>
        )}

        {/* ==================== 6. MODEL CORE (CENTERPIECE) ==================== */}
        {district.id === 'model-core' && (
          <group>
            {/* Stepped Octagonal Citadel Pedestal */}
            <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.9, 2.25, 0.65, 8]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.3} metalness={0.4} />
              <Edges color={edgeColor} />
            </mesh>
            <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.35, 1.7, 0.48, 8]} />
              <meshStandardMaterial color={buildingDarkColor} roughness={0.25} metalness={0.5} />
              <Edges color="#EC4899" />
            </mesh>

            {/* 4 Corner Synaptic Relay Obelisks */}
            {[
              [-1.75, -1.75],
              [1.75, -1.75],
              [-1.75, 1.75],
              [1.75, 1.75],
            ].map(([ox, oz], idx) => (
              <group key={idx} position={[ox, 0.4, oz]}>
                <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.65, 2.7, 0.65]} />
                  <meshStandardMaterial color={buildingBodyColor} roughness={0.35} metalness={0.35} />
                  <Edges color="#8B5CF6" />
                </mesh>
                {/* Glowing Violet Energy Strip */}
                <mesh position={[0, 1.4, 0]}>
                  <boxGeometry args={[0.7, 2.2, 0.18]} />
                  <meshStandardMaterial
                    color="#8B5CF6"
                    emissive="#8B5CF6"
                    emissiveIntensity={1.5 * emissiveBoost}
                  />
                </mesh>
                {/* Top Amber Beacon */}
                <mesh position={[0, 2.85, 0]}>
                  <sphereGeometry args={[0.16, 12, 12]} />
                  <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={2.0} />
                </mesh>
              </group>
            ))}

            {/* Levitating Central Neural Core Crystal */}
            <group ref={animatedPartRef} position={[0, 2.6, 0]}>
              <mesh castShadow>
                <icosahedronGeometry args={[0.92, 0]} />
                <meshStandardMaterial
                  color="#EC4899"
                  emissive="#EC4899"
                  emissiveIntensity={1.7 * emissiveBoost}
                  roughness={0.15}
                  metalness={0.3}
                />
              </mesh>
              {/* Wireframe Outer Neural Mesh */}
              <mesh scale={1.25}>
                <icosahedronGeometry args={[0.92, 1]} />
                <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.75} />
              </mesh>
            </group>

            {/* Gimbal Neural Rings */}
            <group ref={secondaryPartRef} position={[0, 2.6, 0]}>
              <mesh rotation={[0.5, 0, 0]}>
                <torusGeometry args={[1.5, 0.055, 16, 48]} />
                <meshStandardMaterial
                  color="#8B5CF6"
                  emissive="#8B5CF6"
                  emissiveIntensity={1.8 * emissiveBoost}
                />
              </mesh>
              <mesh rotation={[-0.5, 0.6, Math.PI / 3]}>
                <torusGeometry args={[1.75, 0.045, 16, 48]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={1.6 * emissiveBoost}
                />
              </mesh>
            </group>

            {/* Vertical Core Energy Column */}
            <mesh position={[0, 1.95, 0]}>
              <cylinderGeometry args={[0.35, 0.6, 1.2, 16]} />
              <meshBasicMaterial color="#EC4899" transparent opacity={0.45} />
            </mesh>
          </group>
        )}

        {/* ==================== 7. INFERENCE CENTER ==================== */}
        {district.id === 'inference-center' && (
          <group>
            {/* Central Low-Latency Prism Tower */}
            <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.72, 1.08, 3.0, 6]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.25} metalness={0.4} />
              <Edges color={edgeColor} />
            </mesh>
            {/* 3 Accelerator Pods Surrounding the Prism */}
            {[
              [-1.25, 0.85, 1.9],
              [1.25, 0.85, 1.9],
              [0, -1.25, 2.2],
            ].map(([x, z, h], idx) => (
              <group key={idx} position={[x, 0.4, z]}>
                <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.5, 0.6, h, 6]} />
                  <meshStandardMaterial color={buildingDarkColor} roughness={0.3} metalness={0.4} />
                  <Edges color="#00F0FF" />
                </mesh>
                <mesh position={[0, h + 0.02, 0]}>
                  <cylinderGeometry args={[0.4, 0.4, 0.12, 6]} />
                  <meshStandardMaterial
                    color="#00F0FF"
                    emissive="#00F0FF"
                    emissiveIntensity={1.6 * emissiveBoost}
                  />
                </mesh>
              </group>
            ))}
            {/* Spinning Predictor Crown */}
            <group ref={animatedPartRef} position={[0, 3.7, 0]}>
              <mesh>
                <octahedronGeometry args={[0.55, 0]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={1.8 * emissiveBoost}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.9, 0.05, 12, 24]} />
                <meshStandardMaterial
                  color="#8B5CF6"
                  emissive="#8B5CF6"
                  emissiveIntensity={1.6 * emissiveBoost}
                />
              </mesh>
            </group>
          </group>
        )}

        {/* ==================== 8. OUTPUT TERMINAL ==================== */}
        {district.id === 'output-terminal' && (
          <group>
            {/* Terminal Dispatch Base Building */}
            <mesh position={[-0.6, 1.3, -0.5]} castShadow receiveShadow>
              <boxGeometry args={[1.85, 1.8, 1.55]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.3} metalness={0.35} />
              <Edges color={edgeColor} />
            </mesh>
            {/* Broadcast Communications Spire */}
            <mesh position={[-0.6, 2.95, -0.5]} castShadow>
              <cylinderGeometry args={[0.09, 0.3, 1.8, 12]} />
              <meshStandardMaterial color={buildingDarkColor} metalness={0.5} roughness={0.2} />
            </mesh>
            {/* Pulsing Emitter Rings at Top of Spire */}
            <group ref={animatedPartRef} position={[-0.6, 3.9, -0.5]}>
              <mesh>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={2.2 * emissiveBoost}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.34, 0.48, 24]} />
                <meshBasicMaterial color="#00F0FF" transparent opacity={0.85} side={THREE.DoubleSide} />
              </mesh>
            </group>
            {/* Holographic Result Display Screen */}
            <group position={[0.75, 1.8, 0.65]} rotation={[0, -Math.PI / 6, 0]}>
              <mesh>
                <boxGeometry args={[1.95, 1.3, 0.09]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={1.2 * emissiveBoost}
                  transparent
                  opacity={0.78}
                />
                <Edges color="#FFFFFF" />
              </mesh>
              {/* Warm Amber Output Status Bars on Screen */}
              {[0.25, 0, -0.25].map((by, bIdx) => (
                <mesh key={bIdx} position={[-0.15 + bIdx * 0.1, by, 0.06]}>
                  <boxGeometry args={[1.15 - bIdx * 0.2, 0.11, 0.02]} />
                  <meshStandardMaterial
                    color={bIdx === 0 ? windowAmber : '#FFFFFF'}
                    emissive={bIdx === 0 ? windowAmber : '#00F0FF'}
                    emissiveIntensity={1.6}
                  />
                </mesh>
              ))}
            </group>
          </group>
        )}

        {/* ==================== FLOATING 3D LABEL & HOVER CARD ==================== */}
        {/* NOTE: No distanceFactor on Html when using OrthographicCamera so labels render at 1:1 crisp CSS pixel scale */}
        {(showLabels || activeHover || isSelected) && (
          <Html
            position={[
              0,
              district.id === 'model-core' ? 4.85 : district.id === 'training-cluster' ? 4.55 : 4.25,
              0,
            ]}
            center
            zIndexRange={[8, 0]}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelect(district.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onDoubleClick?.(district.id);
              }}
              onMouseEnter={() => {
                setLocalHover(true);
                onHover(district.id);
              }}
              onMouseLeave={() => {
                setLocalHover(false);
                onHover(null);
              }}
              className={`group cursor-pointer select-none transition-transform duration-200 ${
                activeHover || isSelected ? 'scale-105 z-10' : 'opacity-95 hover:opacity-100'
              }`}
            >
              {/* Compact District Pill */}
              <div
                className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 shadow-lg transition-colors ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-950 text-white shadow-cyan-500/30 ring-1 ring-cyan-400/50'
                    : activeHover
                    ? 'border-cyan-400/80 bg-slate-900 text-white shadow-cyan-500/20'
                    : isNight
                    ? 'border-slate-700/90 bg-slate-950/90 text-slate-100'
                    : 'border-slate-400/80 bg-white/95 text-slate-900 shadow-slate-300/60'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: district.accentColor,
                    boxShadow: `0 0 8px ${district.accentColor}`,
                  }}
                />
                <span className="font-mono text-[9px] opacity-60 font-semibold">
                  0{index + 1}
                </span>
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase whitespace-nowrap">
                  {district.name}
                </span>
                {tycoonMetric && tycoonMetric.unlockedTier > 0 && (
                  <span className="ml-0.5 inline-flex items-center rounded-full border border-cyan-400/80 bg-cyan-500/25 px-1.5 py-0.2 font-mono text-[8px] font-bold tracking-wider text-cyan-200 whitespace-nowrap">
                    [T{tycoonMetric.unlockedTier}
                    {tycoonMetric.unlockedTier === 3 ? ' ★' : ''}]
                  </span>
                )}
                {tycoonMetric?.isPrimaryBottleneck && (
                  <span className="ml-0.5 inline-flex items-center rounded-full border border-amber-400 bg-rose-600/95 px-1.5 py-0.2 font-mono text-[8px] font-bold tracking-wider text-white animate-pulse whitespace-nowrap">
                    ⚠️ BOTTLENECK: {tycoonMetric.saturationPercent}% LOAD
                  </span>
                )}
                {isBottleneckTarget && !tycoonMetric?.isPrimaryBottleneck && (
                  <span className="ml-0.5 inline-flex items-center rounded-full border border-rose-400 bg-rose-600/90 px-1.5 py-0.2 font-mono text-[8px] font-bold tracking-wider text-white animate-pulse whitespace-nowrap">
                    ⚠ BOTTLENECK
                  </span>
                )}
                {isAdversarialShieldActive && !isBottleneckTarget && (
                  <span className="ml-0.5 inline-flex items-center rounded-full border border-amber-400 bg-amber-500/30 px-1.5 py-0.2 font-mono text-[8px] font-bold tracking-wider text-amber-200 whitespace-nowrap">
                    🛡 SHIELD ACTIVE
                  </span>
                )}
                {isMastered ? (
                  <span className="ml-0.5 inline-flex items-center rounded-full border border-amber-400/70 bg-amber-500/20 px-1.5 py-0.2 font-mono text-[8px] font-bold tracking-wider text-amber-300 shadow-sm shadow-amber-500/30 whitespace-nowrap">
                    ★ MASTERED
                  </span>
                ) : completedCount > 0 ? (
                  <span
                    className="ml-0.5 inline-flex items-center rounded-full px-1.5 py-0.2 font-mono text-[8px] font-bold whitespace-nowrap"
                    style={{
                      backgroundColor: `${district.accentColor}25`,
                      color: isNight ? district.accentColor : '#0F172A',
                    }}
                  >
                    {completedCount}/4
                  </span>
                ) : null}
              </div>

              {/* Expanded Hover Tooltip with Short Description */}
              {activeHover && !isSelected && (
                <div
                  className={`mt-1.5 w-56 rounded-xl border p-2.5 text-left shadow-2xl ${
                    isNight
                      ? 'border-cyan-500/40 bg-slate-950/95 text-slate-100'
                      : 'border-cyan-600/40 bg-white/95 text-slate-900'
                  }`}
                >
                  <p
                    className={`text-[11px] leading-snug font-sans ${
                      isNight ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    {district.tagline}
                  </p>
                  <div
                    className={`mt-1.5 flex items-center justify-between border-t pt-1.5 font-mono text-[10px] ${
                      isNight
                        ? 'border-slate-800 text-cyan-400'
                        : 'border-slate-200 text-cyan-700 font-semibold'
                    }`}
                  >
                    <span>{district.metrics.throughput}</span>
                    <span>Click to inspect →</span>
                  </div>
                </div>
              )}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
};
