'use client';

import React from 'react';
import { EUCountry } from '@/types/plate';

interface EUBandProps {
  scale?: number;
  countryCode?: EUCountry;
}

export default function EUBand({ scale = 1, countryCode = 'D' }: EUBandProps) {
  const width = 45 * scale;
  const height = 110 * scale;
  
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: `${8 * scale}px`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: '#003399',
        borderRadius: `${6 * scale}px 0 0 ${6 * scale}px`,
        padding: `${6 * scale}px ${4 * scale}px`,
      }}
    >
      {/* EU Stars */}
      <svg
        width={36 * scale}
        height={36 * scale}
        viewBox="0 0 36 36"
        fill="none"
      >
        <g fill="#FFCC00">
          {/* 12 stars in a circle - all pointing upward */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const cx = 18 + 13 * Math.cos(angle);
            const cy = 18 + 13 * Math.sin(angle);
            return (
              <polygon
                key={i}
                points={createStarPoints(cx, cy, 2.5, 1.1)}
              />
            );
          })}
        </g>
      </svg>
      
      {/* Country code */}
      <span
        style={{
          color: '#FFFFFF',
          fontSize: `${countryCode.length > 2 ? 18 : countryCode.length > 1 ? 22 : 26}px`,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '1px',
          transform: `scale(${scale})`,
          transformOrigin: 'center',
        }}
      >
        {countryCode}
      </span>
    </div>
  );
}

function createStarPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * 36 - 90) * (Math.PI / 180);
    const r = i % 2 === 0 ? outerR : innerR;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(' ');
}
