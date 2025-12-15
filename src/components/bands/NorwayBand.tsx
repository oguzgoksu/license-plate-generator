'use client';

import React from 'react';
import Image from 'next/image';

interface NorwayBandProps {
  scale?: number;
  height?: number | string;
  borderRadius?: number;
}

export default function NorwayBand({ scale = 1, height, borderRadius = 5 }: NorwayBandProps) {
  const width = 45 * scale;
  const defaultHeight = 110 * scale;
  const actualHeight = height || defaultHeight;
  const radius = borderRadius * scale;
  
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
      <div style={{ 
        width: `${32 * scale}px`, 
        height: `${24 * scale}px`,
        position: 'relative',
        borderRadius: `${2 * scale}px`,
        overflow: 'hidden',
        boxShadow: `0 ${1 * scale}px ${3 * scale}px rgba(0,0,0,0.4)`,
      }}>
        <Image
          src="/flags/no.svg"
          alt="Norwegian Flag"
          fill
          style={{ objectFit: 'cover' }}
        />
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
