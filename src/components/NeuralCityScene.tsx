'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
  RoundedBox,
  Edges,
} from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  DISTRICTS,
  DISTRICT_MAP,
  DistrictId,
  PipelineStageId,
} from '@/data/districts';
import { District } from './District';
import { DataFlow } from './DataFlow';
import { IsometricCityFallback } from './IsometricCityFallback';
import type { DistrictMasteryMetrics } from '@/hooks/useRoadmapProgress';
import {
  WorkloadPresetId,
  BottleneckScenarioId,
  BOTTLENECK_SCENARIO_MAP,
} from '@/data/bottleneck-scenarios';

export interface NeuralCitySceneProps {
  selectedDistrict: DistrictId | null;
  hoveredDistrict: DistrictId | null;
  activePipelineStage: PipelineStageId | null;
  highlightedFlowDistrict: DistrictId | null;
  activeDemoPathIds: string[];
  showLabels: boolean;
  isPaused: boolean;
  flowSpeed: number;
  trainingMode: boolean;
  isNight: boolean;
  reducedMotion: boolean;
  cameraZoomDelta: number;
  cameraAzimuthDelta: number;
  cameraResetTrigger: number;
  forceSimplified2D: boolean;
  heroMinimized?: boolean;
  allDistrictsMastery?: Record<DistrictId, DistrictMasteryMetrics>;
  lastMasteredDistrictId?: DistrictId | null;
  isSingularityMode?: boolean;
  activeWorkload?: WorkloadPresetId;
  activeBottleneck?: BottleneckScenarioId;
  isBlueprintMode?: boolean;
  onSelectDistrict: (id: DistrictId | null) => void;
  onHoverDistrict: (id: DistrictId | null) => void;
}

/** City-Wide Orbital Energy Ring when all 8 districts reach 100% (32/32 Neural Singularity Mode) */
const SingularityCoreAura: React.FC<{
  isPaused: boolean;
  reducedMotion: boolean;
}> = ({ isPaused, reducedMotion }) => {
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (isPaused || reducedMotion) return;
    const dt = Math.min(delta, 0.1);
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += dt * 0.25;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= dt * 0.38;
    }
  });

  return (
    <group position={[0, 0.2, 0]} raycast={() => null}>
      <mesh
        ref={outerRingRef}
        rotation={[-Math.PI / 2, 0, 0]}
        raycast={() => null}
      >
        <ringGeometry args={[17.8, 18.25, 64]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh
        ref={innerRingRef}
        rotation={[-Math.PI / 2, 0, Math.PI / 6]}
        raycast={() => null}
      >
        <ringGeometry args={[16.8, 17.15, 32]} />
        <meshBasicMaterial
          color="#EC4899"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

/** Instanced peripheral micro-modules to frame the isometric city island without clutter */
const AmbientCityStructures: React.FC<{ isNight: boolean }> = ({ isNight }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const beaconRef = useRef<THREE.InstancedMesh>(null);

  const blocks = useMemo(() => {
    const items: { pos: [number, number, number]; scale: [number, number, number] }[] = [
      { pos: [-14.5, 0.4, -8], scale: [1.2, 0.8, 1.2] },
      { pos: [-14.5, 0.65, -5.5], scale: [1.0, 1.3, 1.0] },
      { pos: [-14.5, 0.45, 2.5], scale: [1.1, 0.9, 1.4] },
      { pos: [-13.5, 0.5, 12.5], scale: [1.3, 1.0, 1.1] },
      { pos: [-8.5, 0.6, 13.5], scale: [1.2, 1.2, 1.0] },
      { pos: [4.5, 0.55, 13.5], scale: [1.4, 1.1, 1.1] },
      { pos: [14.0, 0.7, 3.5], scale: [1.1, 1.4, 1.1] },
      { pos: [14.0, 0.5, -5.0], scale: [1.2, 1.0, 1.2] },
      { pos: [11.5, 0.65, -12.0], scale: [1.3, 1.3, 1.1] },
      { pos: [-9.5, 0.5, -13.0], scale: [1.4, 1.0, 1.1] },
      { pos: [1.5, 0.45, -13.5], scale: [1.2, 0.9, 1.2] },
      { pos: [-4.0, 0.4, 4.0], scale: [0.9, 0.8, 0.9] },
      { pos: [4.2, 0.45, 4.2], scale: [0.9, 0.9, 0.9] },
      { pos: [3.8, 0.4, -4.2], scale: [0.85, 0.8, 0.85] },
    ];
    return items;
  }, []);

  useEffect(() => {
    if (!meshRef.current || !beaconRef.current) return;
    const dummy = new THREE.Object3D();

    blocks.forEach((b, i) => {
      dummy.position.set(b.pos[0], b.pos[1], b.pos[2]);
      dummy.scale.set(b.scale[0], b.scale[1], b.scale[2]);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      dummy.position.set(b.pos[0], b.pos[1] * 2 + 0.08, b.pos[2]);
      dummy.scale.set(0.2, 0.1, 0.2);
      dummy.updateMatrix();
      beaconRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    beaconRef.current.instanceMatrix.needsUpdate = true;
  }, [blocks]);

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, blocks.length]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={isNight ? '#152A54' : '#CBD5E1'}
          roughness={0.45}
          metalness={0.3}
        />
      </instancedMesh>
      <instancedMesh ref={beaconRef} args={[undefined, undefined, blocks.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#F59E0B" />
      </instancedMesh>
    </group>
  );
};

interface CameraRigProps {
  selectedDistrict: DistrictId | null;
  cameraZoomDelta: number;
  cameraAzimuthDelta: number;
  cameraResetTrigger: number;
  reducedMotion: boolean;
  heroMinimized?: boolean;
}

const CameraRig: React.FC<CameraRigProps> = ({
  selectedDistrict,
  cameraZoomDelta,
  cameraAzimuthDelta,
  cameraResetTrigger,
  reducedMotion,
  heroMinimized = false,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();

  const baseZoom = useMemo(() => {
    if (size.width < 640) return 17;
    if (size.width < 1024) return 22;
    return 27;
  }, [size.width]);

  const baseOffsetX = size.width >= 1024 && !heroMinimized ? -3.6 : 0;
  const baseOffsetZ = size.width >= 1024 && !heroMinimized ? 3.6 : 0;

  const targetVec = useMemo(() => new THREE.Vector3(baseOffsetX, 0.5, baseOffsetZ), [baseOffsetX, baseOffsetZ]);
  const desiredTarget = useMemo(() => new THREE.Vector3(baseOffsetX, 0.5, baseOffsetZ), [baseOffsetX, baseOffsetZ]);

  useEffect(() => {
    camera.position.set(26, 22, 26);
    camera.lookAt(baseOffsetX, 0.5, baseOffsetZ);
    camera.updateProjectionMatrix();
    if (controlsRef.current) {
      controlsRef.current.target.set(baseOffsetX, 0.5, baseOffsetZ);
      controlsRef.current.update();
    }
  }, [cameraResetTrigger, camera, baseOffsetX, baseOffsetZ]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (selectedDistrict) {
      const d = DISTRICT_MAP[selectedDistrict];
      desiredTarget.set(d.position[0] * 0.65, 0.8, d.position[2] * 0.65);
    } else {
      desiredTarget.set(baseOffsetX, 0.5, baseOffsetZ);
    }

    const lerpSpeed = reducedMotion ? 1 : Math.min(1, Math.min(delta, 0.1) * 5.5);
    targetVec.lerp(desiredTarget, lerpSpeed);
    controlsRef.current.target.copy(targetVec);

    // Smooth Orthographic zoom
    const focusMultiplier = selectedDistrict ? 1.25 : 1.0;
    const rawTargetZoom = (baseZoom + cameraZoomDelta * 5) * focusMultiplier;
    const clampedZoom = THREE.MathUtils.clamp(rawTargetZoom, 14, 58);

    if (Math.abs(camera.zoom - clampedZoom) > 0.05) {
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, clampedZoom, lerpSpeed);
      camera.updateProjectionMatrix();
    }

    // Apply subtle azimuth offset when user clicks Rotate buttons
    if (!selectedDistrict && Math.abs(cameraAzimuthDelta) > 0.001) {
      const currentAzimuth = controlsRef.current.getAzimuthalAngle();
      const defaultAzimuth = Math.PI / 4 + cameraAzimuthDelta * 0.28;
      const nextAz = THREE.MathUtils.lerp(currentAzimuth, defaultAzimuth, lerpSpeed * 0.5);
      controlsRef.current.setAzimuthalAngle(nextAz);
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={[0, 0.5, 0]}
      enableDamping={!reducedMotion}
      dampingFactor={0.07}
      enablePan={true}
      minZoom={14}
      maxZoom={58}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.6}
      minAzimuthAngle={-Math.PI / 2}
      maxAzimuthAngle={Math.PI}
      rotateSpeed={0.55}
      zoomSpeed={0.85}
    />
  );
};

export const NeuralCityScene: React.FC<NeuralCitySceneProps> = (props) => {
  const {
    selectedDistrict,
    hoveredDistrict,
    activePipelineStage,
    highlightedFlowDistrict,
    activeDemoPathIds,
    showLabels,
    isPaused,
    flowSpeed,
    trainingMode,
    isNight,
    reducedMotion,
    cameraZoomDelta,
    cameraAzimuthDelta,
    cameraResetTrigger,
    forceSimplified2D,
    heroMinimized = false,
    allDistrictsMastery,
    lastMasteredDistrictId = null,
    isSingularityMode = false,
    activeWorkload = 'multimodal-vision',
    activeBottleneck = 'none',
    isBlueprintMode = false,
    onSelectDistrict,
    onHoverDistrict,
  } = props;

  const bottleneckSpec =
    BOTTLENECK_SCENARIO_MAP[activeBottleneck] ||
    BOTTLENECK_SCENARIO_MAP['none'];

  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [sceneReady, setSceneReady] = useState<boolean>(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch {
      setWebglSupported(false);
    }
  }, []);

  // Safety timeout: if WebGL fails to initialize within 4s (e.g. blocked GPU), fall back gracefully to 2D Isometric Schematic
  useEffect(() => {
    if (sceneReady || !webglSupported) return;
    const timer = setTimeout(() => {
      if (!sceneReady) {
        setWebglSupported(false);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [sceneReady, webglSupported]);

  if (!webglSupported || forceSimplified2D) {
    return (
      <IsometricCityFallback
        selectedDistrict={selectedDistrict}
        hoveredDistrict={hoveredDistrict}
        highlightedFlowDistrict={highlightedFlowDistrict}
        showLabels={showLabels}
        isPaused={isPaused}
        isNight={isNight}
        onSelectDistrict={(id) => onSelectDistrict(id)}
        onHoverDistrict={onHoverDistrict}
        reason={
          !webglSupported
            ? 'WebGL unavailable — Running Interactive 2D Isometric Schematic'
            : '2D Schematic Mode Active'
        }
      />
    );
  }

  return (
    <div className="relative h-full w-full select-none">
      {/* Graceful Loading Overlay while WebGL initializes */}
      {!sceneReady && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#040814]/80 backdrop-blur-sm transition-opacity duration-500">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-cyan-300">
            Initializing Neural City Geometry...
          </p>
        </div>
      )}

      <Canvas
        orthographic
        shadows
        dpr={[1, 2]}
        camera={{
          position: [26, 22, 26],
          zoom: 30,
          near: -100,
          far: 200,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, camera }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = isNight ? 1.25 : 1.05;
          camera.lookAt(0, 0.5, 0);
          camera.updateProjectionMatrix();
          setSceneReady(true);
        }}
        onPointerMissed={() => {
          onSelectDistrict(null);
        }}
      >
        <Suspense fallback={null}>
          <CameraRig
            selectedDistrict={selectedDistrict}
            cameraZoomDelta={cameraZoomDelta}
            cameraAzimuthDelta={cameraAzimuthDelta}
            cameraResetTrigger={cameraResetTrigger}
            reducedMotion={reducedMotion}
            heroMinimized={heroMinimized}
          />

          {/* Lighting Setup — Bright, crisp isometric diorama illumination */}
          <ambientLight
            intensity={isNight ? 1.15 : 1.6}
            color={isNight ? '#BFDBFE' : '#FFFFFF'}
          />
          <hemisphereLight
            args={[
              isNight ? '#38BDF8' : '#FFFFFF',
              isNight ? '#0F172A' : '#CBD5E1',
              isNight ? 0.85 : 0.6,
            ]}
          />
          <directionalLight
            castShadow
            position={[20, 34, 18]}
            intensity={isNight ? 1.85 : 2.2}
            color={isNight ? '#E0F2FE' : '#FFFBEB'}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-22}
            shadow-camera-right={22}
            shadow-camera-top={22}
            shadow-camera-bottom={-22}
          />
          <directionalLight
            position={[-18, 20, -14]}
            intensity={isNight ? 0.75 : 0.5}
            color="#A855F7"
          />

          {/* Accent Point Lights for Core & Data Flow */}
          <pointLight
            position={[0.5, 5, 0]}
            intensity={isNight ? 3.0 : 0.8}
            distance={22}
            color="#EC4899"
          />
          <pointLight
            position={[-8, 4, -2]}
            intensity={isNight ? 2.2 : 0.6}
            distance={18}
            color="#00F0FF"
          />
          <pointLight
            position={[5.5, 4, -8.5]}
            intensity={isNight ? (trainingMode ? 3.8 : 2.2) : 0.8}
            distance={18}
            color="#8B5CF6"
          />

          {/* Subtle Background Starfield in Night Mode */}
          {isNight && (
            <Stars
              radius={55}
              depth={35}
              count={800}
              factor={2.4}
              saturation={0.5}
              fade
              speed={isPaused || reducedMotion ? 0 : 0.4}
            />
          )}

          {/* City Floating Island Architectural Platform */}
          <group position={[0, -0.35, 0]}>
            <RoundedBox
              args={[34, 0.7, 32]}
              radius={0.25}
              smoothness={2}
              receiveShadow
            >
              <meshStandardMaterial
                color={isNight ? '#081226' : '#CBD5E1'}
                roughness={0.65}
                metalness={0.25}
              />
            </RoundedBox>
          </group>

          {/* Crisp Isometric Coordinate Grid across the entire City Island */}
          <gridHelper
            args={[
              32,
              32,
              isNight ? '#0ea5e9' : '#64748B',
              isNight ? '#13284c' : '#94A3B8',
            ]}
            position={[0, 0.02, 0]}
          />

          {/* Peripheral Micro-Structures */}
          <AmbientCityStructures isNight={isNight} />

          {/* City-Wide Neural Singularity Orbital Aura (when 32/32 = 100% City Mastery) */}
          {isSingularityMode && (
            <SingularityCoreAura
              isPaused={isPaused}
              reducedMotion={reducedMotion}
            />
          )}

          {/* Glowing Data Conduit Network & Particles */}
          <DataFlow
            selectedDistrict={selectedDistrict}
            hoveredDistrict={hoveredDistrict}
            highlightedFlowDistrict={highlightedFlowDistrict}
            activeDemoPathIds={activeDemoPathIds}
            isPaused={isPaused}
            flowSpeed={flowSpeed}
            trainingMode={trainingMode}
            isNight={isNight}
            reducedMotion={reducedMotion}
            allDistrictsMastery={allDistrictsMastery}
            isSingularityMode={isSingularityMode}
            activeWorkload={activeWorkload}
            activeBottleneck={activeBottleneck}
            isBlueprintMode={isBlueprintMode}
          />

          {/* The 8 Core AI Pipeline Districts */}
          {DISTRICTS.map((district, index) => {
            const isPipelineHighlighted =
              activePipelineStage !== null &&
              district.pipelineStage === activePipelineStage;
            const isFlowHighlighted =
              highlightedFlowDistrict !== null &&
              (district.id === highlightedFlowDistrict ||
                district.connectsTo.includes(highlightedFlowDistrict) ||
                district.receivesFrom.includes(highlightedFlowDistrict));
            const isBottleneckTarget =
              bottleneckSpec.targetDistrictId === district.id;
            const isAdversarialShieldActive =
              district.id === 'computer-vision' &&
              (activeWorkload === 'adversarial-injection' ||
                activeBottleneck === 'prompt-injection-spike');

            return (
              <District
                key={district.id}
                district={district}
                index={index}
                isSelected={selectedDistrict === district.id}
                isHovered={hoveredDistrict === district.id}
                isPipelineHighlighted={isPipelineHighlighted}
                isFlowHighlighted={isFlowHighlighted}
                showLabels={showLabels}
                isPaused={isPaused}
                flowSpeed={flowSpeed}
                trainingMode={trainingMode}
                isNight={isNight}
                reducedMotion={reducedMotion}
                masteryMetrics={allDistrictsMastery?.[district.id]}
                isShockwaveActive={lastMasteredDistrictId === district.id}
                isBlueprintMode={isBlueprintMode}
                isBottleneckTarget={isBottleneckTarget}
                isAdversarialShieldActive={isAdversarialShieldActive}
                onSelect={(id) => onSelectDistrict(id)}
                onHover={onHoverDistrict}
              />
            );
          })}
        </Suspense>
      </Canvas>
    </div>
  );
};
