"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useViewportVisibility } from "@/lib/use-viewport-visibility";

// Dynamically import UnicornScene with SSR disabled
const UnicornScene = dynamic(() => import("unicornstudio-react"), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black" />
});

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 100); // Debounce resize events
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return windowSize;
};

interface ComponentProps {
  shouldAnimate?: boolean;
}

export const Component = ({ shouldAnimate = true }: ComponentProps) => {
  const { width, height } = useWindowSize();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until component is mounted and we have valid dimensions
  if (!mounted || width === 0 || height === 0) {
    return <div className="w-full h-screen bg-black" />;
  }

  // Only render the expensive UnicornScene when animation should be active
  if (!shouldAnimate) {
    return <div className="w-full h-screen bg-black opacity-60" />;
  }

  return (
    <div className="flex flex-col items-center opacity-60 will-change-transform">
        <UnicornScene
        production={true} 
        projectId="ed7SJMvTJEVxfqzypOOQ" 
        width={width} 
        height={height}
        />
    </div>
  );
};

