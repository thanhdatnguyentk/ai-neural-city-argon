'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrthographicCamera,
  OrbitControls,
  Grid,
  Stars,
  RoundedBox,
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
  onSelectDistrict: (id: DistrictId | null) => void;
  onHoverDistrict: (id: DistrictId | null) => void;
}

/** Instanced peripheral micro-modules to frame the isometric city island without clutter */
const AmbientCityStructures: React.FC<{ isNight: boolean }> = ({ isNight }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const beaconRef = useRef<THREE.InstancedMesh>(null);

  const blocks = useMemo(() => {
    const items: { pos: [number, number, number]; scale: [number, number, number] }[] = [
      // Outer perimeter data banks & substations
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
      dummy.scale.set(0.18, 0.08, 0.18);
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
          color={isNight ? '#0D1B38' : '#CBD5E1'}
          roughness={0.5}
          metalness={0.35}
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
}

const CameraRig: React.FC<CameraRigProps> = ({
  selectedDistrict,
  cameraZoomDelta,
  cameraAzimuthDelta,
  cameraResetTrigger,
  reducedMotion,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera, size } = useThree();

  const baseZoom = useMemo(() => {
    if (size.width < 640) return 16;
    if (size.width < 1024) return 22;
    return 29;
  }, [size.width]);

  const targetVec = useMemo(() => new THREE.Vector3(0, 0.5, 0), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(0, 0.5, 0), []);

  useEffect(() => {
    if (!controlsRef.current) return;
    // Reset camera position & orientation on reset trigger
    camera.position.set(26, 22, 26);
    controlsRef.current.target.set(0, 0.5, 0);
    controlsRef.current.update();
  }, [cameraResetTrigger, camera]);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (selectedDistrict) {
      const d = DISTRICT_MAP[selectedDistrict];
      desiredTarget.set(d.position[0] * 0.65, 0.8, d.position[2] * 0.65);
    } else {
      desiredTarget.set(0, 0.5, 0);
    }

    const lerpSpeed = reducedMotion ? 1 : Math.min(1, delta * 5.5);
    targetVec.lerp(desiredTarget, lerpSpeed);
    controlsRef.current.target.copy(targetVec);

    // Smooth Orthographic zoom
    const focusMultiplier = selectedDistrict ? 1.24 : 1.0;
    const rawTargetZoom = (baseZoom + cameraZoomDelta * 5) * focusMultiplier;
    const clampedZoom = THREE.MathUtils.clamp(rawTargetZoom, 13, 56);

    if (Math.abs(camera.zoom - clampedZoom) > 0.05) {
      camera.zoom = THREE.MathUtils.lerp(camera.zoom, clampedZoom, lerpSpeed);
      camera.updateProjectionMatrix();
    }

    // Apply subtle azimuth offset when user clicks Rotate buttons
    const currentAzimuth = controlsRef.current.getAzimuthalAngle();
    const defaultAzimuth = Math.PI / 4 + cameraAzimuthDelta * 0.28;
    if (!selectedDistrict && Math.abs(cameraAzimuthDelta) > 0.001) {
      const nextAz = THREE.MathUtils.lerp(currentAzimuth, defaultAzimuth, lerpSpeed * 0.5);
      controlsRef.current.setAzimuthalAngle(nextAz);
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={!reducedMotion}
      dampingFactor={0.07}
      enablePan={true}
      minZoom={13}
      maxZoom={56}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2.65}
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
    onSelectDistrict,
    onHoverDistrict,
  } = props;

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
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = isNight ? 1.15 : 1.0;
          setSceneReady(true);
        }}
        onPointerMissed={() => {
          onSelectDistrict(null);
        }}
      >
        <Suspense fallback={null}>
          {/* Isometric Orthographic Camera (~35.26 deg elevation) */}
          <OrthographicCamera
            makeDefault
            position={[26, 22, 26]}
            zoom={29}
            near={-100}
            far={200}
          />

          <CameraRig
            selectedDistrict={selectedDistrict}
            cameraZoomDelta={cameraZoomDelta}
            cameraAzimuthDelta={cameraAzimuthDelta}
            cameraResetTrigger={cameraResetTrigger}
            reducedMotion={reducedMotion}
          />

          {/* Subtle Atmospheric Fog */}
          <fog attach="fog" args={[isNight ? '#040814' : '#E2E8F0', 48, 125]} />

          {/* Lighting Setup */}
          <ambientLight
            intensity={isNight ? 0.65 : 1.4}
            color={isNight ? '#93C5FD' : '#FFFFFF'}
          />
          <directionalLight
            castShadow
            position={[18, 32, 16]}
            intensity={isNight ? 1.35 : 2.1}
            color={isNight ? '#E0F2FE' : '#FFFBEB'}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-22}
            shadow-camera-right={22}
            shadow-camera-top={22}
            shadow-camera-bottom={-22}
          />
          {/* Accent Point Lights for Core & Data Flow */}
          <pointLight
            position={[0.5, 5, 0]}
            intensity={isNight ? 2.4 : 0.8}
            distance={18}
            color="#EC4899"
          />
          <pointLight
            position={[-8, 4, -2]}
            intensity={isNight ? 1.8 : 0.6}
            distance={16}
            color="#00F0FF"
          />
          <pointLight
            position={[5.5, 4, -8.5]}
            intensity={isNight ? (trainingMode ? 3.2 : 1.8) : 0.8}
            distance={16}
            color="#8B5CF6"
          />

          {/* Subtle Background Starfield in Night Mode */}
          {isNight && (
            <Stars
              radius={55}
              depth={35}
              count={900}
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
              radius={0.35}
              smoothness={3}
              receiveShadow
            >
              <meshStandardMaterial
                color={isNight ? '#060D1F' : '#CBD5E1'}
                roughness={0.75}
                metalness={0.25}
              />
            </RoundedBox>

            {/* Glowing Perimeter Rim around the City Island */}
            <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[21.5, 21.8, 4]} />
              <meshBasicMaterial
                color="#00F0FF"
                transparent
                opacity={isNight ? 0.25 : 0.15}
              />
            </mesh>
          </group>

          {/* Abstract Digital Coordinate Grid */}
          <Grid
            position={[0, 0.01, 0]}
            args={[34, 32]}
            cellSize={1.5}
            cellThickness={0.6}
            cellColor={isNight ? '#0F244A' : '#94A3B8'}
            sectionSize={6}
            sectionThickness={1.1}
            sectionColor={isNight ? '#1D4ED8' : '#64748B'}
            fadeDistance={42}
            fadeStrength={1.2}
          />

          {/* Peripheral Micro-Structures */}
          <AmbientCityStructures isNight={isNight} />

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
