"use client";

import { useEffect, useState, useRef } from 'react';

interface UseViewportVisibilityOptions {
  threshold?: number; // Percentage of element that must be visible (0-1)
  rootMargin?: string; // Margin around the viewport (e.g., "20% 0px")
  enabled?: boolean; // Whether to enable the observer
}

export function useViewportVisibility<T extends HTMLElement = HTMLDivElement>(options: UseViewportVisibilityOptions = {}) {
  const { threshold = 0.1, rootMargin = "20% 0px", enabled = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        
        // Track if element has ever been visible
        if (visible && !hasBeenVisible) {
          setHasBeenVisible(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const element = elementRef.current;
    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, enabled, hasBeenVisible]);

  return {
    ref: elementRef,
    isVisible,
    hasBeenVisible,
  };
}

// Hook specifically for animation control
export function useAnimationControl<T extends HTMLElement = HTMLDivElement>(options: UseViewportVisibilityOptions = {}) {
  const { isVisible, hasBeenVisible, ref } = useViewportVisibility<T>({
    rootMargin: "20% 0px", // Start/stop animations when 20% in view
    threshold: 0.2, // Need 20% visible
    ...options,
  });

  return {
    ref,
    shouldAnimate: isVisible, // Only animate when in view
    hasBeenVisible, // Track if it's been seen before
    isVisible,
  };
}