'use client';

import React, { forwardRef, useRef, useState, useLayoutEffect } from 'react';
import { GermanPlateConfig, PlateStyle } from '@/types/plate';
import EUBand from './EUBand';
import StatePlakette from './StatePlakette';
import HUPlakette from './HUPlakette';

interface LicensePlateProps {
  config: GermanPlateConfig;
  scale?: number;
}

// Get styles based on plate style
function getPlateStyles(style: PlateStyle, scale: number) {
  const is3D = style !== 'normal';
  const isGlossy = style.includes('glossy');
  const isCarbon = style.includes('carbon');
  const isBlack = style.includes('black');
  
  const borderColor = '#000';
  
  const textShadow = is3D 
    ? `
      ${-1 * scale}px ${-1 * scale}px ${0}px rgba(255,255,255,0.8),
      ${1 * scale}px ${1 * scale}px ${0}px rgba(0,0,0,0.4),
      ${2 * scale}px ${2 * scale}px ${0}px rgba(0,0,0,0.3),
      ${3 * scale}px ${3 * scale}px ${0}px rgba(0,0,0,0.2)
    `
    : 'none';
  
  return { borderColor, textShadow, is3D, isGlossy, isCarbon, isBlack };
}

const LicensePlate = forwardRef<HTMLDivElement, LicensePlateProps>(
  ({ config, scale = 1 }, ref) => {
    const { cityCode, letters, numbers, suffix, showStatePlakette, showHUPlakette, state, city, huYear, huMonth, width, plateStyle, country, fontColor, backgroundColor, plateText } = config;
    
    const contentRef = useRef<HTMLDivElement>(null);
    const [compressionRatio, setCompressionRatio] = useState(1);
    
    // Plate dimensions
    const plateHeight = 110 * scale;
    const euBandWidth = 45 * scale;
    const borderWidth = 3 * scale;
    const padding = 12 * scale; // Padding on each side of content
    const maxPlateWidth = width === 'standard' ? 520 * scale : calculateCompactWidth(config) * scale;
    const plateWidth = maxPlateWidth;
    
    // Available width for content (after EU band, borders, and padding)
    const availableWidth = plateWidth - euBandWidth - (borderWidth * 2) - (padding * 2);
    
    const isGermany = country === 'D';
    const fontSize = 105 * scale;
    const styles = getPlateStyles(plateStyle, scale);
    const textColor = fontColor || '#000000';
    
    // Measure content and calculate compression after render
    useLayoutEffect(() => {
      if (contentRef.current) {
        // Reset scale to measure natural size
        contentRef.current.style.transform = 'none';
        const contentWidth = contentRef.current.scrollWidth;
        
        if (contentWidth > availableWidth) {
          const ratio = availableWidth / contentWidth;
          setCompressionRatio(Math.max(0.65, ratio)); // Don't compress below 65%
        } else {
          setCompressionRatio(1);
        }
      }
    }, [cityCode, letters, numbers, suffix, showStatePlakette, showHUPlakette, plateText, availableWidth, scale]);
    
    const baseTextStyle: React.CSSProperties = {
      fontSize: `${fontSize}px`,
      fontWeight: 'normal',
      letterSpacing: `${2 * scale}px`,
      whiteSpace: 'nowrap',
    };
    
    const textStyle: React.CSSProperties = styles.isCarbon 
      ? {
          ...baseTextStyle,
          color: 'transparent',
          backgroundImage: `
            repeating-linear-gradient(0deg, #222 0px, #222 ${2 * scale}px, #333 ${2 * scale}px, #333 ${4 * scale}px),
            repeating-linear-gradient(90deg, #1a1a1a 0px, #1a1a1a ${2 * scale}px, #2a2a2a ${2 * scale}px, #2a2a2a ${4 * scale}px)
          `,
          backgroundBlendMode: 'multiply',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: `${1 * scale}px ${1 * scale}px 0 rgba(0,0,0,0.6), ${-0.5 * scale}px ${-0.5 * scale}px 0 rgba(100,100,100,0.5)`,
          filter: styles.isGlossy ? 'brightness(1.1)' : 'none',
        }
      : {
          ...baseTextStyle,
          color: textColor,
          textShadow: styles.textShadow,
          ...(styles.isGlossy && {
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 40%, transparent 50%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            backgroundSize: '100% 200%',
            backgroundPosition: 'top',
          }),
        };
    
    const whiteBorderWidth = styles.is3D ? 0 : 1.5 * scale;
    
    return (
      <div
        ref={ref}
        style={{
          display: 'inline-block',
          padding: `${whiteBorderWidth}px`,
          backgroundColor: styles.is3D ? 'transparent' : '#fff',
          borderRadius: `${10 * scale}px`,
          flexShrink: 0,
          flexGrow: 0,
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            width: `${plateWidth}px`,
            height: `${plateHeight}px`,
            backgroundColor: backgroundColor || '#FFFFFF',
            border: `${borderWidth}px solid ${styles.borderColor}`,
            borderRadius: `${8 * scale}px`,
            overflow: 'hidden',
            fontFamily: 'EuroPlate, sans-serif',
            boxShadow: styles.is3D 
              ? `inset ${2 * scale}px ${2 * scale}px ${4 * scale}px rgba(255,255,255,0.5), inset ${-1 * scale}px ${-1 * scale}px ${3 * scale}px rgba(0,0,0,0.15)` 
              : 'none',
          }}
        >
          {/* EU Band - fixed position */}
          <EUBand scale={scale} countryCode={country} />
          
          {/* Content area - fixed width, centered content */}
          <div 
            style={{ 
              position: 'absolute',
              left: `${euBandWidth}px`,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: `0 ${padding}px`,
              overflow: 'hidden',
            }}
          >
            {/* Scalable content wrapper */}
            <div
              ref={contentRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: `${16 * scale}px`,
                transform: compressionRatio < 1 ? `scaleX(${compressionRatio})` : undefined,
                transformOrigin: 'center',
              }}
            >
              {isGermany ? (
                <>
                  {/* City code */}
                  <span style={textStyle}>{cityCode}</span>
                  
                  {/* Plaketten - counter-scale to maintain aspect ratio */}
                  {(showStatePlakette || showHUPlakette) && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: `${2 * scale}px`,
                        flexShrink: 0,
                        transform: compressionRatio < 1 ? `scaleX(${1 / compressionRatio})` : undefined,
                      }}
                    >
                      {showHUPlakette && (
                        <HUPlakette year={huYear} month={huMonth} scale={scale * 0.85} />
                      )}
                      {showStatePlakette && (
                        <StatePlakette state={state} city={city} scale={scale * 1.0} />
                      )}
                    </div>
                  )}
                  
                  {/* Letters and numbers */}
                  <span style={textStyle}>{letters} {numbers}{suffix}</span>
                </>
              ) : (
                <span style={textStyle}>{plateText || ''}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

LicensePlate.displayName = 'LicensePlate';

export default LicensePlate;

// Calculate minimum width for compact mode
function calculateCompactWidth(config: GermanPlateConfig): number {
  const euBandWidth = 45;
  const padding = 24; // 12px on each side
  const charWidth = 47;
  const plaketteWidth = 50;
  const gap = 16;
  
  let width = euBandWidth + padding;
  width += config.cityCode.length * charWidth;
  
  if (config.showStatePlakette || config.showHUPlakette) {
    width += plaketteWidth + gap;
  }
  
  const suffixLength = config.suffix ? 1 : 0;
  const spaceWidth = 20;
  width += (config.letters.length + config.numbers.length + suffixLength) * charWidth + spaceWidth + gap;
  
  return Math.max(width, 340);
}
