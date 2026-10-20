'use client';

import React from 'react';
import { DISTRICTS, DATA_FLOW_PATHS, DistrictId, DISTRICT_MAP } from '@/data/districts';

interface IsometricCityFallbackProps {
  selectedDistrict: DistrictId | null;
  hoveredDistrict: DistrictId | null;
  highlightedFlowDistrict: DistrictId | null;
  showLabels: boolean;
  isPaused: boolean;
  isNight: boolean;
  onSelectDistrict: (id: DistrictId) => void;
  onHoverDistrict: (id: DistrictId | null) => void;
  reason?: string;
}

/** Convert 3D [x, y, z] city coordinates to 2D isometric SVG coordinates */
function toIso(x: number, y: number, z: number): [number, number] {
  const scale = 24;
  const isoX = 500 + (x - z) * scale * 0.866;
  const isoY = 320 + (x + z) * scale * 0.5 - y * scale;
  return [isoX, isoY];
}

export const IsometricCityFallback: React.FC<IsometricCityFallbackProps> = ({
  selectedDistrict,
  hoveredDistrict,
  highlightedFlowDistrict,
  showLabels,
  isPaused,
  isNight,
  onSelectDistrict,
  onHoverDistrict,
  reason,
}) => {
  const activeFocus = highlightedFlowDistrict || selectedDistrict || hoveredDistrict;

  return (
    <div
      className={`relative h-full w-full overflow-hidden flex items-center justify-center select-none ${
        isNight ? 'bg-[#040814]' : 'bg-slate-100'
      }`}
      role="region"
      aria-label="Interactive Isometric AI Neural City Map"
    >
      {reason && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 rounded-full border border-cyan-500/30 bg-slate-900/90 px-4 py-1 text-xs font-mono text-cyan-300 shadow-lg">
          {reason}
        </div>
      )}

      <svg
        viewBox="0 0 1000 660"
        className="w-full h-full max-w-[1200px] max-h-[820px]"
        aria-label="AI Neural City Isometric Schematic"
      >
        <defs>
          <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity={isNight ? '0.16' : '0.08'} />
            <stop offset="60%" stopColor="#8B5CF6" stopOpacity={isNight ? '0.08' : '0.04'} />
            <stop offset="100%" stopColor="#040814" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background Ambient Halo */}
        <ellipse cx="500" cy="330" rx="440" ry="250" fill="url(#cityGlow)" />

        {/* Isometric Platform Diamond */}
        <polygon
          points="500,70 910,320 500,570 90,320"
          fill={isNight ? '#081229' : '#E2E8F0'}
          stroke={isNight ? '#1E3A8A' : '#94A3B8'}
          strokeWidth="2"
        />
        <polygon
          points="500,90 880,320 500,550 120,320"
          fill="none"
          stroke="#00F0FF"
          strokeOpacity="0.22"
          strokeDasharray="6 6"
        />

        {/* Data Flow Conduits */}
        {DATA_FLOW_PATHS.map((path) => {
          const dFrom = DISTRICT_MAP[path.from];
          const dTo = DISTRICT_MAP[path.to];
          const [x1, y1] = toIso(dFrom.position[0], 0.3, dFrom.position[2]);
          const [x2, y2] = toIso(dTo.position[0], 0.3, dTo.position[2]);
          const isHighlighted =
            !activeFocus || path.from === activeFocus || path.to === activeFocus;
          const strokeColor =
            path.type === 'data'
              ? '#00F0FF'
              : path.type === 'neural'
              ? '#A855F7'
              : '#38BDF8';

          return (
            <g key={path.id} opacity={isHighlighted ? 0.95 : 0.25}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth={isHighlighted ? 3 : 1.5}
              />
              {!isPaused && (
                <circle r={isHighlighted ? 5 : 3.5} fill="#FFFFFF">
                  <animateMotion
                    dur="2.8s"
                    repeatCount="indefinite"
                    path={`M${x1},${y1} L${x2},${y2}`}
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Isometric Districts */}
        {DISTRICTS.map((district) => {
          const [cx, cy] = toIso(district.position[0], 0, district.position[2]);
          const isSelected = selectedDistrict === district.id;
          const isHovered = hoveredDistrict === district.id;
          const active = isSelected || isHovered;

          return (
            <g
              key={district.id}
              transform={`translate(${cx}, ${cy})`}
              className="cursor-pointer transition-transform duration-200"
              onClick={() => onSelectDistrict(district.id)}
              onMouseEnter={() => onHoverDistrict(district.id)}
              onMouseLeave={() => onHoverDistrict(null)}
              role="button"
              tabIndex={0}
              aria-label={`${district.name}: ${district.tagline}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectDistrict(district.id);
                }
              }}
            >
              {/* Isometric Plinth Base */}
              <polygon
                points="0,-34 62,0 0,34 -62,0"
                fill={isNight ? '#0F1E3D' : '#CBD5E1'}
                stroke={active ? '#00F0FF' : district.accentColor}
                strokeWidth={active ? 3 : 1.5}
              />
              {/* Isometric 3D Building Block */}
              <polygon
                points="0,-78 42,-54 0,-30 -42,-54"
                fill={district.accentColor}
                fillOpacity={active ? 0.9 : 0.65}
              />
              <polygon
                points="-42,-54 0,-30 0,14 -42,-10"
                fill={isNight ? '#162A52' : '#94A3B8'}
                stroke={district.accentColor}
                strokeWidth="1"
              />
              <polygon
                points="42,-54 0,-30 0,14 42,-10"
                fill={isNight ? '#0C1833' : '#64748B'}
                stroke={district.accentColor}
                strokeWidth="1"
              />
              {/* Warm Amber Status Window */}
              <circle cx="-16" cy="-22" r="3" fill="#F59E0B" />
              <circle cx="16" cy="-22" r="3" fill="#F59E0B" />

              {/* Label */}
              {(showLabels || active) && (
                <g transform="translate(0, -94)">
                  <rect
                    x="-76"
                    y="-16"
                    width="152"
                    height="26"
                    rx="13"
                    fill={isNight ? '#040814' : '#FFFFFF'}
                    fillOpacity="0.92"
                    stroke={active ? '#00F0FF' : district.accentColor}
                    strokeWidth={active ? 2 : 1}
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    fill={isNight ? '#F8FAFC' : '#0F172A'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {district.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
