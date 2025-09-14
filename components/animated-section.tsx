"use client";

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAnimationControl } from '@/lib/use-viewport-visibility';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  duration?: number;
  rootMargin?: string;
}

export function AnimatedSection({
  children,
  className = "",
  id,
  delay = 0,
  duration = 0.6,
  rootMargin = "20% 0px"
}: AnimatedSectionProps) {
  const { ref, shouldAnimate, hasBeenVisible } = useAnimationControl({
    rootMargin,
  });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={shouldAnimate ? { 
        opacity: 1, 
        y: 0,
        transition: { 
          duration,
          delay,
          ease: "easeOut"
        }
      } : hasBeenVisible ? {
        opacity: 0.3, // Fade out when not in view but keep some visibility
        y: 0,
        transition: { duration: 0.3 }
      } : { opacity: 0, y: 50 }}
      style={{
        // Pause all child animations when not in view
        animationPlayState: shouldAnimate ? 'running' : 'paused',
      }}
    >
      {children}
    </motion.section>
  );
}