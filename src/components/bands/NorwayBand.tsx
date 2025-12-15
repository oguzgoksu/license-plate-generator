'use client';

import React from 'react';
import Image from 'next/image';

interface NorwayBandProps {
  scale?: number;
  height?: number | string;
  borderRadius?: number;
  isHovering?: boolean;
  tilt?: { rotateX: number; rotateY: number };
}

export default function NorwayBand({ scale = 1, height, borderRadius = 5, isHovering = false, tilt = { rotateX: 0, rotateY: 0 } }: NorwayBandProps) {
  const width = 45 * scale;
  const defaultHeight = 110 * scale;
  const actualHeight = height || defaultHeight;
  const radius = borderRadius * scale;
  
  // Calculate shimmer position based on tilt
  const shimmerX = 50 + (tilt.rotateY * 3);
  const shimmerY = 50 + (tilt.rotateX * 3);
  
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: `${6 * scale}px`,
        width: `${width}px`,
        height: actualHeight,
        backgroundColor: '#003399', // Blue like EU band
        borderRadius: `${radius}px 0 0 ${radius}px`,
        padding: `${6 * scale}px ${4 * scale}px`,
      }}
    >
      {/* Norwegian Flag */}
      <div 
        style={{ 
          width: `${32 * scale}px`, 
          height: `${24 * scale}px`,
          position: 'relative',
          borderRadius: `${2 * scale}px`,
          overflow: 'hidden',
          boxShadow: `0 ${1 * scale}px ${3 * scale}px rgba(0,0,0,0.4)`,
        }}
      >
        <Image
          src="/flags/no.svg"
          alt="Norwegian Flag"
          fill
          style={{ objectFit: 'cover' }}
        />
        {/* Dynamic shimmer overlay */}
        {isHovering && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(ellipse at ${shimmerX}% ${shimmerY}%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)`,
              pointerEvents: 'none',
            }}
          />
        )}
      </div>
      
      {/* Country code N */}
      <span
        style={{
          color: '#FFFFFF',
          fontSize: `${26 * scale}px`,
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          letterSpacing: '1px',
          textShadow: `0 ${1 * scale}px ${2 * scale}px rgba(0,0,0,0.3)`,
        }}
      >
        N
      </span>
    </div>
  );
}
