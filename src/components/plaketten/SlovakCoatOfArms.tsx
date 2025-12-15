'use client';

import React from 'react';
import CoatOfArms from './CoatOfArms';

interface SlovakCoatOfArmsProps {
  scale?: number;
  isHovering?: boolean;
  tilt?: { rotateX: number; rotateY: number };
}

export default function SlovakCoatOfArms({ scale = 1, isHovering = false, tilt }: SlovakCoatOfArmsProps) {
  return (
    <CoatOfArms
      src="/coa/sk.svg"
      alt="Slovak coat of arms"
      scale={scale}
      size={50}
      isHovering={isHovering}
      tilt={tilt}
      useNextImage={false}
    />
  );
}
