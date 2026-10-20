'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { DistrictData, DistrictId } from '@/data/districts';

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
  onSelect: (id: DistrictId) => void;
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
  onSelect,
  onHover,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const animatedPartRef = useRef<THREE.Group>(null);
  const secondaryPartRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const assemblyProgress = useRef(reducedMotion ? 1 : 0);

  const [localHover, setLocalHover] = useState(false);
  const activeHover = isHovered || localHover;
  const isHighlighted = isSelected || activeHover || isPipelineHighlighted || isFlowHighlighted;

  const baseColor = isNight ? '#0C1631' : '#E2E8F0';
  const buildingBodyColor = isNight ? '#132247' : '#F8FAFC';
  const buildingDarkColor = isNight ? '#091226' : '#CBD5E1';
  const windowAmber = '#F59E0B';

  const accentThreeColor = useMemo(() => new THREE.Color(district.accentColor), [district.accentColor]);
  const secondaryThreeColor = useMemo(() => new THREE.Color(district.secondaryColor), [district.secondaryColor]);

  useFrame((state, delta) => {
    // 1. Assembly intro animation
    if (assemblyProgress.current < 1) {
      if (reducedMotion) {
        assemblyProgress.current = 1;
      } else {
        const delay = index * 0.09;
        if (state.clock.elapsedTime > delay) {
          assemblyProgress.current = Math.min(1, assemblyProgress.current + delta * 1.8);
        }
      }
    }

    const eased = 1 - Math.pow(1 - assemblyProgress.current, 3);

    if (groupRef.current) {
      // Subtle hover/select elevation
      const targetY = (activeHover ? 0.22 : isSelected ? 0.16 : 0) - (1 - eased) * 2.2;
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.14);
      const scaleVal = Math.max(0.01, eased);
      groupRef.current.scale.set(1, scaleVal, 1);
    }

    if (isPaused || reducedMotion) return;

    const speedMultiplier =
      district.id === 'training-cluster' && trainingMode ? flowSpeed * 2.4 : flowSpeed;
    const t = state.clock.elapsedTime * speedMultiplier;

    // 2. District-specific subtle idle animations
    if (animatedPartRef.current) {
      if (district.id === 'model-core') {
        animatedPartRef.current.rotation.y = t * 0.6;
        animatedPartRef.current.rotation.z = Math.sin(t * 0.8) * 0.25;
        animatedPartRef.current.position.y = 2.5 + Math.sin(t * 1.5) * 0.15;
      } else if (district.id === 'input-gateway') {
        animatedPartRef.current.rotation.y = t * 0.8;
      } else if (district.id === 'computer-vision') {
        // Scanning laser plane up and down
        animatedPartRef.current.position.y = 1.4 + Math.sin(t * 2.0) * 0.75;
      } else if (district.id === 'nlp-district') {
        animatedPartRef.current.rotation.y = -t * 0.5;
        animatedPartRef.current.position.y = 1.8 + Math.sin(t * 1.4) * 0.1;
      } else if (district.id === 'training-cluster') {
        // Pulsing energy ring along GPU towers
        animatedPartRef.current.position.y = 1.6 + Math.sin(t * 3.2) * 0.9;
      } else if (district.id === 'data-lake') {
        animatedPartRef.current.position.y = 0.85 + Math.sin(t * 1.3) * 0.12;
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

  const [fw, fd] = district.footprint;
  const emissiveBoost = isSelected ? 1.8 : activeHover ? 1.5 : isHighlighted ? 1.2 : 0.8;

  return (
    <group position={district.position}>
      <group
        ref={groupRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        {/* District Plinth Base */}
        <RoundedBox args={[fw, 0.36, fd]} position={[0, 0.18, 0]} radius={0.12} smoothness={2} receiveShadow castShadow>
          <meshStandardMaterial
            color={baseColor}
            roughness={0.5}
            metalness={0.3}
          />
        </RoundedBox>

        {/* Glowing Base Trim */}
        <mesh position={[0, 0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[Math.min(fw, fd) * 0.44, Math.min(fw, fd) * 0.48, 32]} />
          <meshBasicMaterial
            color={district.accentColor}
            transparent
            opacity={isHighlighted ? 0.95 : 0.42}
          />
        </mesh>

        {/* Selection / Hover Outer Halo Ring */}
        {isHighlighted && (
          <mesh
            ref={pulseRingRef}
            position={[0, 0.06, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[Math.max(fw, fd) * 0.56, Math.max(fw, fd) * 0.62, 48]} />
            <meshBasicMaterial
              color={isSelected ? '#00F0FF' : district.accentColor}
              transparent
              opacity={isSelected ? 0.95 : 0.65}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Corner Warm Amber Beacons */}
        {[
          [-fw * 0.42, 0.42, -fd * 0.42],
          [fw * 0.42, 0.42, -fd * 0.42],
          [-fw * 0.42, 0.42, fd * 0.42],
          [fw * 0.42, 0.42, fd * 0.42],
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]}>
            <boxGeometry args={[0.14, 0.12, 0.14]} />
            <meshStandardMaterial
              color={windowAmber}
              emissive={windowAmber}
              emissiveIntensity={isNight ? 1.4 : 0.7}
            />
          </mesh>
        ))}

        {/* ==================== 1. INPUT GATEWAY ==================== */}
        {district.id === 'input-gateway' && (
          <group>
            {/* Left & Right Portal Pylons */}
            <mesh position={[-1.2, 1.6, -0.4]} castShadow receiveShadow>
              <boxGeometry args={[0.85, 2.5, 1.1]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.35} metalness={0.4} />
            </mesh>
            <mesh position={[1.2, 1.6, -0.4]} castShadow receiveShadow>
              <boxGeometry args={[0.85, 2.5, 1.1]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.35} metalness={0.4} />
            </mesh>
            {/* Overhead Portal Bridge */}
            <mesh position={[0, 2.65, -0.4]} castShadow>
              <boxGeometry args={[3.3, 0.45, 0.9]} />
              <meshStandardMaterial color={buildingDarkColor} roughness={0.3} metalness={0.5} />
            </mesh>
            {/* Glowing Portal Energy Gate */}
            <mesh position={[0, 1.45, -0.4]}>
              <boxGeometry args={[1.5, 1.9, 0.12]} />
              <meshStandardMaterial
                color={accentThreeColor}
                emissive={accentThreeColor}
                emissiveIntensity={1.1 * emissiveBoost}
                transparent
                opacity={0.55}
              />
            </mesh>
            {/* Amber Window Strips on Pylons */}
            {[0.9, 1.4, 1.9, 2.3].map((y, i) => (
              <React.Fragment key={i}>
                <mesh position={[-1.2, y, 0.17]}>
                  <boxGeometry args={[0.5, 0.08, 0.04]} />
                  <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={1.3} />
                </mesh>
                <mesh position={[1.2, y, 0.17]}>
                  <boxGeometry args={[0.5, 0.08, 0.04]} />
                  <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={1.3} />
                </mesh>
              </React.Fragment>
            ))}
            {/* Arrival Helipad / Data Intake Pad */}
            <mesh position={[0, 0.42, 1.15]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.95, 24]} />
              <meshStandardMaterial
                color={accentThreeColor}
                emissive={accentThreeColor}
                emissiveIntensity={0.9 * emissiveBoost}
                transparent
                opacity={0.75}
              />
            </mesh>
            {/* Rotating Radar / Receiver Dish on Top */}
            <group ref={animatedPartRef} position={[-1.2, 3.05, -0.4]}>
              <mesh rotation={[0.4, 0, 0]}>
                <coneGeometry args={[0.45, 0.3, 16, 1, true]} />
                <meshStandardMaterial
                  color={district.accentColor}
                  emissive={accentThreeColor}
                  emissiveIntensity={0.8}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh position={[0, 0.2, 0]}>
                <sphereGeometry args={[0.09, 12, 12]} />
                <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={1.8} />
              </mesh>
            </group>
          </group>
        )}

        {/* ==================== 2. DATA LAKE ==================== */}
        {district.id === 'data-lake' && (
          <group>
            {/* 3 Cylindrical Data Silo Reservoirs */}
            {[
              [-1.1, -0.8, 1.15, 2.2],
              [1.1, -0.6, 0.95, 1.8],
              [-0.1, 1.0, 1.25, 1.5],
            ].map(([x, z, r, h], idx) => (
              <group key={idx} position={[x, 0.36, z]}>
                {/* Outer Glass/Metal Tank */}
                <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[r, r, h, 8]} />
                  <meshStandardMaterial
                    color={buildingBodyColor}
                    roughness={0.25}
                    metalness={0.5}
                    transparent
                    opacity={0.85}
                  />
                </mesh>
                {/* Glowing Cyan Data Rings around Silo */}
                {[0.3, 0.6, 0.85].map((ratio, rIdx) => (
                  <mesh key={rIdx} position={[0, h * ratio, 0]}>
                    <cylinderGeometry args={[r * 1.03, r * 1.03, 0.09, 8]} />
                    <meshStandardMaterial
                      color={district.accentColor}
                      emissive={accentThreeColor}
                      emissiveIntensity={1.2 * emissiveBoost}
                    />
                  </mesh>
                ))}
                {/* Top Reservoir Pool Glow */}
                <mesh position={[0, h + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                  <circleGeometry args={[r * 0.82, 8]} />
                  <meshStandardMaterial
                    color={district.accentColor}
                    emissive={accentThreeColor}
                    emissiveIntensity={1.1 * emissiveBoost}
                  />
                </mesh>
              </group>
            ))}
            {/* Floating Indexing Crystal Ring */}
            <group ref={animatedPartRef} position={[-0.1, 1.2, 1.0]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.85, 0.05, 12, 24]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={1.5 * emissiveBoost}
                />
              </mesh>
            </group>
          </group>
        )}

        {/* ==================== 3. COMPUTER VISION DISTRICT ==================== */}
        {district.id === 'computer-vision' && (
          <group>
            {/* Optical Observatory Dome Base */}
            <mesh position={[-1.0, 1.1, -0.6]} castShadow receiveShadow>
              <cylinderGeometry args={[1.05, 1.2, 1.5, 12]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.35} metalness={0.45} />
            </mesh>
            {/* Geodesic Camera Lens Dome */}
            <mesh position={[-1.0, 1.85, -0.6]} castShadow>
              <sphereGeometry args={[0.98, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color={district.accentColor}
                emissive={accentThreeColor}
                emissiveIntensity={0.6 * emissiveBoost}
                wireframe
              />
            </mesh>
            {/* 3 Layered Convolutional Filter Frames */}
            {[0.4, 0.95, 1.5].map((zPos, idx) => (
              <group key={idx} position={[0.95, 1.45, zPos - 0.6]}>
                <mesh castShadow>
                  <boxGeometry args={[1.65, 1.9, 0.08]} />
                  <meshStandardMaterial
                    color={idx === 1 ? '#8B5CF6' : '#38BDF8'}
                    emissive={idx === 1 ? '#8B5CF6' : '#38BDF8'}
                    emissiveIntensity={0.75 * emissiveBoost}
                    transparent
                    opacity={0.38}
                  />
                </mesh>
                {/* Frame Border Bar */}
                <mesh position={[0, 0.98, 0]}>
                  <boxGeometry args={[1.7, 0.08, 0.14]} />
                  <meshStandardMaterial color={buildingDarkColor} />
                </mesh>
              </group>
            ))}
            {/* Animated Laser Scan Bar */}
            <group ref={animatedPartRef} position={[0.95, 1.4, 0.35]}>
              <mesh>
                <boxGeometry args={[1.8, 0.07, 1.35]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={2.0}
                  transparent
                  opacity={0.85}
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
              [-1.2, -0.7, 1.8],
              [-0.6, 0.7, 2.3],
              [0, -0.2, 3.1],
              [0.6, 0.7, 2.5],
              [1.2, -0.7, 1.9],
            ].map(([x, z, h], idx) => (
              <group key={idx} position={[x, 0.36, z]}>
                <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.68, h, 0.68]} />
                  <meshStandardMaterial color={buildingBodyColor} roughness={0.3} metalness={0.45} />
                </mesh>
                {/* Token Embedding Band */}
                <mesh position={[0, h - 0.25, 0]}>
                  <boxGeometry args={[0.74, 0.14, 0.74]} />
                  <meshStandardMaterial
                    color={idx % 2 === 0 ? district.accentColor : district.secondaryColor}
                    emissive={idx % 2 === 0 ? accentThreeColor : secondaryThreeColor}
                    emissiveIntensity={1.3 * emissiveBoost}
                  />
                </mesh>
                {/* Warm Amber Status Windows */}
                <mesh position={[0, h * 0.5, 0.35]}>
                  <boxGeometry args={[0.38, 0.08, 0.02]} />
                  <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={1.4} />
                </mesh>
              </group>
            ))}
            {/* Rotating Semantic Attention Rings */}
            <group ref={animatedPartRef} position={[0, 2.1, 0]}>
              <mesh rotation={[Math.PI / 2, 0.2, 0]}>
                <torusGeometry args={[1.55, 0.045, 12, 36]} />
                <meshStandardMaterial
                  color="#38BDF8"
                  emissive="#38BDF8"
                  emissiveIntensity={1.4 * emissiveBoost}
                />
              </mesh>
            </group>
            <group ref={secondaryPartRef} position={[0, 2.5, 0]}>
              <mesh rotation={[Math.PI / 2, -0.25, 0]}>
                <torusGeometry args={[1.15, 0.04, 12, 32]} />
                <meshStandardMaterial
                  color="#A855F7"
                  emissive="#A855F7"
                  emissiveIntensity={1.4 * emissiveBoost}
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
              <group key={idx} position={[x, 0.36, z]}>
                <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.82, h, 0.82]} />
                  <meshStandardMaterial color={buildingDarkColor} roughness={0.3} metalness={0.6} />
                </mesh>
                {/* Vertical Neural GPU LED Strip (Front & Side) */}
                <mesh position={[0, h / 2, 0.42]}>
                  <boxGeometry args={[0.14, h * 0.82, 0.03]} />
                  <meshStandardMaterial
                    color={trainingMode ? '#EC4899' : district.accentColor}
                    emissive={trainingMode ? '#EC4899' : district.accentColor}
                    emissiveIntensity={(trainingMode ? 2.2 : 1.2) * emissiveBoost}
                  />
                </mesh>
                {/* Amber Server Rack Lights */}
                {[0.7, 1.4, 2.1].map((wy, wIdx) => (
                  <mesh key={wIdx} position={[0.42, wy, 0]}>
                    <boxGeometry args={[0.03, 0.08, 0.45]} />
                    <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={1.5} />
                  </mesh>
                ))}
                {/* Top GPU Cooling Cap */}
                <mesh position={[0, h + 0.05, 0]}>
                  <cylinderGeometry args={[0.3, 0.3, 0.08, 12]} />
                  <meshStandardMaterial
                    color="#00F0FF"
                    emissive="#00F0FF"
                    emissiveIntensity={trainingMode ? 2.0 : 1.0}
                  />
                </mesh>
              </group>
            ))}
            {/* Overhead Interconnect Bus Bridges */}
            <mesh position={[0, 2.7, -1.0]} castShadow>
              <boxGeometry args={[3.4, 0.18, 0.25]} />
              <meshStandardMaterial color={district.accentColor} emissive={accentThreeColor} emissiveIntensity={0.9} />
            </mesh>
            <mesh position={[0, 2.7, 1.0]} castShadow>
              <boxGeometry args={[3.4, 0.18, 0.25]} />
              <meshStandardMaterial color={district.accentColor} emissive={accentThreeColor} emissiveIntensity={0.9} />
            </mesh>
            {/* Synchronized Training Wave Plane */}
            <group ref={animatedPartRef} position={[0, 1.8, 0]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[1.6, 2.15, 24]} />
                <meshBasicMaterial
                  color={trainingMode ? '#EC4899' : '#8B5CF6'}
                  transparent
                  opacity={trainingMode ? 0.75 : 0.38}
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
            <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.85, 2.2, 0.6, 8]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.3} metalness={0.5} />
            </mesh>
            <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[1.3, 1.65, 0.45, 8]} />
              <meshStandardMaterial color={buildingDarkColor} roughness={0.25} metalness={0.6} />
            </mesh>

            {/* 4 Corner Synaptic Relay Obelisks */}
            {[
              [-1.75, -1.75],
              [1.75, -1.75],
              [-1.75, 1.75],
              [1.75, 1.75],
            ].map(([ox, oz], idx) => (
              <group key={idx} position={[ox, 0.36, oz]}>
                <mesh position={[0, 1.35, 0]} castShadow receiveShadow>
                  <boxGeometry args={[0.62, 2.7, 0.62]} />
                  <meshStandardMaterial color={buildingBodyColor} roughness={0.35} metalness={0.45} />
                </mesh>
                {/* Glowing Violet Energy Strip */}
                <mesh position={[0, 1.4, 0]}>
                  <boxGeometry args={[0.66, 2.2, 0.16]} />
                  <meshStandardMaterial
                    color="#8B5CF6"
                    emissive="#8B5CF6"
                    emissiveIntensity={1.3 * emissiveBoost}
                  />
                </mesh>
                {/* Top Amber Beacon */}
                <mesh position={[0, 2.8, 0]}>
                  <sphereGeometry args={[0.14, 12, 12]} />
                  <meshStandardMaterial color={windowAmber} emissive={windowAmber} emissiveIntensity={1.8} />
                </mesh>
              </group>
            ))}

            {/* Levitating Central Neural Core Crystal */}
            <group ref={animatedPartRef} position={[0, 2.5, 0]}>
              <mesh castShadow>
                <icosahedronGeometry args={[0.88, 0]} />
                <meshStandardMaterial
                  color="#EC4899"
                  emissive="#EC4899"
                  emissiveIntensity={1.5 * emissiveBoost}
                  roughness={0.15}
                  metalness={0.3}
                />
              </mesh>
              {/* Wireframe Outer Neural Mesh */}
              <mesh scale={1.22}>
                <icosahedronGeometry args={[0.88, 1]} />
                <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.65} />
              </mesh>
            </group>

            {/* Gimbal Neural Rings */}
            <group ref={secondaryPartRef} position={[0, 2.5, 0]}>
              <mesh rotation={[0.5, 0, 0]}>
                <torusGeometry args={[1.45, 0.045, 16, 48]} />
                <meshStandardMaterial
                  color="#8B5CF6"
                  emissive="#8B5CF6"
                  emissiveIntensity={1.6 * emissiveBoost}
                />
              </mesh>
              <mesh rotation={[-0.5, 0.6, Math.PI / 3]}>
                <torusGeometry args={[1.7, 0.035, 16, 48]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={1.4 * emissiveBoost}
                />
              </mesh>
            </group>

            {/* Vertical Core Energy Column */}
            <mesh position={[0, 1.9, 0]}>
              <cylinderGeometry args={[0.32, 0.55, 1.2, 16]} />
              <meshBasicMaterial color="#EC4899" transparent opacity={0.35} />
            </mesh>
          </group>
        )}

        {/* ==================== 7. INFERENCE CENTER ==================== */}
        {district.id === 'inference-center' && (
          <group>
            {/* Central Low-Latency Prism Tower */}
            <mesh position={[0, 1.85, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.7, 1.05, 3.0, 6]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.25} metalness={0.55} />
            </mesh>
            {/* 3 Accelerator Pods Surrounding the Prism */}
            {[
              [-1.25, 0.85, 1.9],
              [1.25, 0.85, 1.9],
              [0, -1.25, 2.2],
            ].map(([x, z, h], idx) => (
              <group key={idx} position={[x, 0.36, z]}>
                <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.48, 0.58, h, 6]} />
                  <meshStandardMaterial color={buildingDarkColor} roughness={0.3} metalness={0.5} />
                </mesh>
                <mesh position={[0, h + 0.02, 0]}>
                  <cylinderGeometry args={[0.38, 0.38, 0.1, 6]} />
                  <meshStandardMaterial
                    color="#00F0FF"
                    emissive="#00F0FF"
                    emissiveIntensity={1.4 * emissiveBoost}
                  />
                </mesh>
              </group>
            ))}
            {/* Spinning Predictor Crown */}
            <group ref={animatedPartRef} position={[0, 3.65, 0]}>
              <mesh>
                <octahedronGeometry args={[0.52, 0]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={1.7 * emissiveBoost}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.88, 0.04, 12, 24]} />
                <meshStandardMaterial
                  color="#8B5CF6"
                  emissive="#8B5CF6"
                  emissiveIntensity={1.4 * emissiveBoost}
                />
              </mesh>
            </group>
          </group>
        )}

        {/* ==================== 8. OUTPUT TERMINAL ==================== */}
        {district.id === 'output-terminal' && (
          <group>
            {/* Terminal Dispatch Base Building */}
            <mesh position={[-0.6, 1.25, -0.5]} castShadow receiveShadow>
              <boxGeometry args={[1.8, 1.8, 1.5]} />
              <meshStandardMaterial color={buildingBodyColor} roughness={0.3} metalness={0.45} />
            </mesh>
            {/* Broadcast Communications Spire */}
            <mesh position={[-0.6, 2.9, -0.5]} castShadow>
              <cylinderGeometry args={[0.08, 0.28, 1.8, 12]} />
              <meshStandardMaterial color={buildingDarkColor} metalness={0.6} roughness={0.2} />
            </mesh>
            {/* Pulsing Emitter Rings at Top of Spire */}
            <group ref={animatedPartRef} position={[-0.6, 3.85, -0.5]}>
              <mesh>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={2.0 * emissiveBoost}
                />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.32, 0.45, 24]} />
                <meshBasicMaterial color="#00F0FF" transparent opacity={0.8} side={THREE.DoubleSide} />
              </mesh>
            </group>
            {/* Holographic Result Display Screen */}
            <group position={[0.75, 1.75, 0.65]} rotation={[0, -Math.PI / 6, 0]}>
              <mesh>
                <boxGeometry args={[1.9, 1.25, 0.08]} />
                <meshStandardMaterial
                  color="#00F0FF"
                  emissive="#00F0FF"
                  emissiveIntensity={1.1 * emissiveBoost}
                  transparent
                  opacity={0.72}
                />
              </mesh>
              {/* Warm Amber Output Status Bars on Screen */}
              {[0.25, 0, -0.25].map((by, bIdx) => (
                <mesh key={bIdx} position={[-0.15 + bIdx * 0.1, by, 0.06]}>
                  <boxGeometry args={[1.1 - bIdx * 0.2, 0.1, 0.02]} />
                  <meshStandardMaterial
                    color={bIdx === 0 ? windowAmber : '#FFFFFF'}
                    emissive={bIdx === 0 ? windowAmber : '#00F0FF'}
                    emissiveIntensity={1.5}
                  />
                </mesh>
              ))}
            </group>
          </group>
        )}

        {/* ==================== FLOATING 3D LABEL & HOVER CARD ==================== */}
        {(showLabels || activeHover || isSelected) && (
          <Html
            position={[
              0,
              district.id === 'model-core' ? 4.7 : district.id === 'training-cluster' ? 4.4 : 4.1,
              0,
            ]}
            center
            distanceFactor={26}
            zIndexRange={[20, 0]}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelect(district.id);
              }}
              onMouseEnter={() => {
                setLocalHover(true);
                onHover(district.id);
              }}
              onMouseLeave={() => {
                setLocalHover(false);
                onHover(null);
              }}
              className={`group cursor-pointer select-none transition-all duration-200 ${
                activeHover || isSelected ? 'scale-105 z-30' : 'opacity-90 hover:opacity-100'
              }`}
            >
              {/* Compact District Pill */}
              <div
                className={`flex items-center gap-2 rounded-full border px-3 py-1 backdrop-blur-md shadow-lg transition-colors ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-950/95 text-white shadow-cyan-500/25'
                    : activeHover
                    ? 'border-cyan-400/80 bg-slate-900/95 text-white shadow-cyan-500/20'
                    : isNight
                    ? 'border-slate-700/80 bg-slate-950/80 text-slate-200'
                    : 'border-slate-300 bg-white/90 text-slate-900'
                }`}
              >
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: district.accentColor,
                    boxShadow: `0 0 8px ${district.accentColor}`,
                  }}
                />
                <span className="font-mono text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap">
                  {district.name}
                </span>
              </div>

              {/* Expanded Hover Tooltip with Short Description */}
              {activeHover && !isSelected && (
                <div className="mt-1.5 w-60 rounded-xl border border-cyan-500/40 bg-slate-950/95 p-2.5 text-left shadow-2xl backdrop-blur-md">
                  <p className="text-[11px] leading-snug text-slate-200 font-sans">
                    {district.tagline}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between border-t border-slate-800 pt-1.5 font-mono text-[10px] text-cyan-400">
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
