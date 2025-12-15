'use client';

import React from 'react';
import CoatOfArms from './CoatOfArms';

interface SwissCoatOfArmsProps {
  scale?: number;
  isHovering?: boolean;
  tilt?: { rotateX: number; rotateY: number };
}

// Swiss national coat of arms - displayed on the left side of Swiss plates
export default function SwissCoatOfArms({ scale = 1, isHovering = false, tilt }: SwissCoatOfArmsProps) {
  return (
    <CoatOfArms
      src="/coa/ch/CH.svg"
      alt="Schweizer Wappen"
      scale={scale}
      size={50}
      isHovering={isHovering}
      tilt={tilt}
    />
  );
}
