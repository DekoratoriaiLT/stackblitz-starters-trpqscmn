'use client';

import React from 'react';

interface MeasurementOverlayProps {
  plotis?: string; // Width
  aukstis?: string; // Height
  show: boolean;
}

export function MeasurementOverlay({ plotis, aukstis, show }: MeasurementOverlayProps) {
  if (!show || (!plotis && !aukstis)) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20" style={{ padding: '2rem' }}>
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        {/* Top horizontal measurement line (Plotis/Width) */}
        {plotis && (
          <g>
            {/* Horizontal line at top */}
            <line
              x1="5"
              y1="5"
              x2="95"
              y2="5"
              stroke="#000"
              strokeWidth="0.5"
            />
            {/* Left end cap */}
            <line
              x1="5"
              y1="3"
              x2="5"
              y2="7"
              stroke="#000"
              strokeWidth="0.5"
            />
            {/* Right end cap */}
            <line
              x1="95"
              y1="3"
              x2="95"
              y2="7"
              stroke="#000"
              strokeWidth="0.5"
            />
            {/* Background for text */}
            <rect
              x="45"
              y="1"
              width="10"
              height="4"
              fill="white"
              opacity="0.9"
            />
            {/* Text */}
            <text
              x="50"
              y="4"
              textAnchor="middle"
              fontSize="3"
              fill="#000"
              fontWeight="bold"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {plotis}
            </text>
          </g>
        )}

        {/* Left vertical measurement line (Aukštis/Height) */}
        {aukstis && (
          <g>
            {/* Vertical line at left */}
            <line
              x1="5"
              y1="5"
              x2="5"
              y2="95"
              stroke="#000"
              strokeWidth="0.5"
            />
            {/* Top end cap */}
            <line
              x1="3"
              y1="5"
              x2="7"
              y2="5"
              stroke="#000"
              strokeWidth="0.5"
            />
            {/* Bottom end cap */}
            <line
              x1="3"
              y1="95"
              x2="7"
              y2="95"
              stroke="#000"
              strokeWidth="0.5"
            />
            {/* Background for text */}
            <rect
              x="1"
              y="48"
              width="4"
              height="4"
              fill="white"
              opacity="0.9"
            />
            {/* Text - rotated */}
            <text
              x="3"
              y="50"
              textAnchor="middle"
              fontSize="3"
              fill="#000"
              fontWeight="bold"
              transform="rotate(-90 3 50)"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              {aukstis}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}