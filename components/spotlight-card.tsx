"use client";

import React, { useEffect, useRef, ReactNode, useState } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'ice' | 'glacier' | 'deep' | 'frost' | 'arctic';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  customSize?: boolean; // When true, ignores size prop and uses width/height or className
}

const glowColorMap = {
  ice: { base: 200, spread: 20 },      // Light blue-white like ice
  glacier: { base: 210, spread: 30 },  // Medium glacier blue
  deep: { base: 220, spread: 40 },     // Dark deep blue
  frost: { base: 190, spread: 15 },    // Very light frost blue
  arctic: { base: 195, spread: 25 }    // Cool arctic blue
};

const sizeMap = {
  sm: 'flex-1 min-h-[200px]',
  md: 'flex-1 min-h-[280px]',
  lg: 'flex-1 min-h-[320px]'
};

const GlowCard: React.FC<GlowCardProps> = ({ 
  children, 
  className = '', 
  glowColor = 'glacier',
  size = 'md',
  width,
  height,
  customSize = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      const userAgent = navigator.userAgent;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      return isTouchDevice && (isSmallScreen || isMobileUserAgent);
    };

    setIsMobile(checkIsMobile());

    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Skip all pointer tracking on mobile to preserve native scrolling
    if (isMobile) return;

    let rafId: number;
    let lastUpdate = 0;
    const throttleMs = 16; // ~60fps

    const syncPointer = (e: PointerEvent) => {
      const now = Date.now();
      if (now - lastUpdate < throttleMs) return;
      
      lastUpdate = now;
      
      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        const { clientX: x, clientY: y } = e;
        
        if (cardRef.current) {
          cardRef.current.style.setProperty('--x', x.toFixed(2));
          cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
          cardRef.current.style.setProperty('--y', y.toFixed(2));
          cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
        }
      });
    };

    document.addEventListener('pointermove', syncPointer, { passive: true });
    return () => {
      document.removeEventListener('pointermove', syncPointer);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isMobile]);

  const { base, spread } = glowColorMap[glowColor];

  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return ''; // Let className or inline styles handle sizing
    }
    return sizeMap[size];
  };

  const getInlineStyles = () => {
    const baseStyles: React.CSSProperties & {
      '--base': number;
      '--spread': number;
      '--radius': string;
      '--border': string;
      '--backdrop': string;
      '--backup-border': string;
      '--size': string;
      '--outer': string;
      '--border-size': string;
      '--spotlight-size': string;
      '--hue': string;
      width?: string;
      height?: string;
    } = {
      '--base': base,
      '--spread': spread,
      '--radius': '14',
      '--border': '3',
      '--backdrop': 'hsl(210 20% 12% / 0.15)',
      '--backup-border': 'var(--backdrop)',
      '--size': '200',
      '--outer': '1',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      // On mobile: simplify background, remove fixed attachment, allow touch
      backgroundImage: isMobile 
        ? 'linear-gradient(135deg, hsl(210 20% 12% / 0.3), hsl(210 30% 8% / 0.5))'
        : `radial-gradient(
            var(--spotlight-size) var(--spotlight-size) at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
          )`,
      backgroundColor: 'var(--backdrop, transparent)',
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      backgroundAttachment: isMobile ? 'scroll' : 'fixed', // Mobile: scroll, PC: fixed
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative' as const,
      touchAction: isMobile ? 'auto' : 'none', // Mobile: allow touch, PC: disable
    };

    // Add width and height if provided
    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return baseStyles;
  };

  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-attachment: ${isMobile ? 'scroll' : 'fixed'};
      background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
      background-repeat: no-repeat;
      background-position: 50% 50%;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }
    
    /* Mobile: simplified glow effects for performance */
    @media (max-width: 768px) and (pointer: coarse) {
      [data-glow]::before,
      [data-glow]::after {
        opacity: 0.3;
        filter: none;
      }
      
      [data-glow] [data-glow] {
        filter: blur(2px) !important;
        opacity: 0.2 !important;
      }
    }
    
    /* PC: full glow effects */
    @media (min-width: 769px) and (pointer: fine) {
      [data-glow]::before {
        background-image: radial-gradient(
          calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
          calc(var(--x, 0) * 1px)
          calc(var(--y, 0) * 1px),
          hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
        );
        filter: brightness(2);
      }
      
      [data-glow]::after {
        background-image: radial-gradient(
          calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
          calc(var(--x, 0) * 1px)
          calc(var(--y, 0) * 1px),
          hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
        );
      }
      
      [data-glow] [data-glow] {
        position: absolute;
        inset: 0;
        will-change: filter;
        opacity: var(--outer, 1);
        border-radius: calc(var(--radius) * 1px);
        border-width: calc(var(--border-size) * 20);
        filter: blur(calc(var(--border-size) * 10));
        background: none;
        pointer-events: none;
        border: none;
      }
      
      [data-glow] > [data-glow]::before {
        inset: -10px;
        border-width: 10px;
      }
    }
    
    /* Mobile fallback if media queries don't work */
    [data-glow]::before {
      background-image: ${isMobile 
        ? 'linear-gradient(135deg, hsl(210 50% 30% / 0.3), hsl(210 60% 20% / 0.5))'
        : `radial-gradient(
            calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
          )`};
      filter: ${isMobile ? 'none' : 'brightness(2)'};
    }
    
    [data-glow]::after {
      background-image: ${isMobile 
        ? 'none'
        : `radial-gradient(
            calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
            calc(var(--x, 0) * 1px)
            calc(var(--y, 0) * 1px),
            hsl(0 100% 100% / var(--border-light-opacity, 1)), transparent 100%
          )`};
    }
    
    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: ${isMobile ? 'auto' : 'filter'};
      opacity: ${isMobile ? '0.2' : 'var(--outer, 1)'};
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: ${isMobile ? 'blur(2px)' : 'blur(calc(var(--border-size) * 10))'};
      background: none;
      pointer-events: none;
      border: none;
    }
    
    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={getInlineStyles()}
        className={`
          ${getSizeClasses()}
          ${!customSize ? 'aspect-[4/5]' : ''}
          rounded-2xl 
          relative 
          flex 
          flex-col 
          shadow-[0_1rem_2rem_-1rem_black] 
          ${isMobile ? 'p-3 gap-3' : 'p-4 gap-4'}
          backdrop-blur-[5px]
          ${isMobile ? 'min-h-0' : ''}
          ${className}
        `}
      >
        <div ref={innerRef} data-glow></div>
        {children}
      </div>
    </>
  );
};

export { GlowCard }