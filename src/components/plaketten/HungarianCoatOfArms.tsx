'use client';

import React from 'react';
import CoatOfArms from './CoatOfArms';

interface HungarianCoatOfArmsProps {
  scale?: number;
  isHovering?: boolean;
  tilt?: { rotateX: number; rotateY: number };
}

export default function HungarianCoatOfArms({ scale = 1, isHovering = false, tilt }: HungarianCoatOfArmsProps) {
  return (
    <CoatOfArms
      src="/coa/hr.svg"
      alt="Hungarian coat of arms"
      scale={scale}
      size={50}
      isHovering={isHovering}
      tilt={tilt}
      useNextImage={false}
    />
  );
}
