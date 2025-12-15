'use client';

import React from 'react';
import { SwissCanton } from '@/types/plate';
import CoatOfArms from './CoatOfArms';

interface SwissCantonPlaketteProps {
  canton: SwissCanton;
  scale?: number;
  isHovering?: boolean;
  tilt?: { rotateX: number; rotateY: number };
}

export default function SwissCantonPlakette({ canton, scale = 1, isHovering = false, tilt }: SwissCantonPlaketteProps) {
  return (
    <CoatOfArms
      src={`/coa/ch/${canton}.svg`}
      alt={`Wappen ${canton}`}
      scale={scale}
      size={50}
      isHovering={isHovering}
      tilt={tilt}
    />
  );
}
