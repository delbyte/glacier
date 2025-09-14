"use client";

import { useViewportVisibility } from "@/lib/use-viewport-visibility";
import { Component as RaycastAnimatedBackground } from "@/components/raycast-animated-blue-background";

interface SmartBackgroundProps {
  rootMargin?: string;
  threshold?: number;
}

export function SmartBackground({ 
  rootMargin = "10% 0px", 
  threshold = 0.1 
}: SmartBackgroundProps) {
  const { isVisible, ref } = useViewportVisibility<HTMLDivElement>({
    rootMargin,
    threshold
  });

  return (
    <div ref={ref} className="absolute inset-0 z-0 will-change-transform">
      <RaycastAnimatedBackground shouldAnimate={isVisible} />
    </div>
  );
}