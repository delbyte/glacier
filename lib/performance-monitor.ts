import { useEffect } from 'react';

// Performance monitoring utilities for development
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private startTimes: Map<string, number> = new Map();
  private endTimes: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Start timing an operation
  start(label: string): void {
    this.startTimes.set(label, performance.now());
    if (process.env.NODE_ENV === 'development') {
      console.log(`🏁 Started: ${label}`);
    }
  }

  // End timing and log results
  end(label: string): number {
    const startTime = this.startTimes.get(label);
    if (!startTime) {
      console.warn(`⚠️ No start time found for: ${label}`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    this.endTimes.set(label, endTime);

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Completed: ${label} in ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  // Get all timing results
  getResults(): Record<string, number> {
    const results: Record<string, number> = {};
    this.startTimes.forEach((startTime, label) => {
      const endTime = this.endTimes.get(label);
      if (endTime) {
        results[label] = endTime - startTime;
      }
    });
    return results;
  }

  // Component timing wrapper
  static time<T>(label: string, fn: () => T): T {
    const monitor = PerformanceMonitor.getInstance();
    monitor.start(label);
    try {
      const result = fn();
      monitor.end(label);
      return result;
    } catch (error) {
      monitor.end(label);
      throw error;
    }
  }

  // Async component timing wrapper
  static async timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const monitor = PerformanceMonitor.getInstance();
    monitor.start(label);
    try {
      const result = await fn();
      monitor.end(label);
      return result;
    } catch (error) {
      monitor.end(label);
      throw error;
    }
  }

  // Log bundle sizes and performance metrics
  static logBundleMetrics(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');

      console.group('🚀 Performance Metrics');
      console.log(`DNS Lookup: ${(navigation.domainLookupEnd - navigation.domainLookupStart).toFixed(2)}ms`);
      console.log(`Connection: ${(navigation.connectEnd - navigation.connectStart).toFixed(2)}ms`);
      console.log(`Response: ${(navigation.responseEnd - navigation.responseStart).toFixed(2)}ms`);
      console.log(`DOM Load: ${(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart).toFixed(2)}ms`);
      console.log(`Page Load: ${(navigation.loadEventEnd - navigation.loadEventStart).toFixed(2)}ms`);
      
      paint.forEach((entry) => {
        console.log(`${entry.name}: ${entry.startTime.toFixed(2)}ms`);
      });
      console.groupEnd();
    }
  }
}

// Hook for React components
export function usePerformanceMonitor(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();
  
  useEffect(() => {
    monitor.start(`${componentName} Mount`);
    return () => {
      monitor.end(`${componentName} Mount`);
    };
  }, [componentName, monitor]);

  return {
    start: (label: string) => monitor.start(`${componentName}: ${label}`),
    end: (label: string) => monitor.end(`${componentName}: ${label}`),
  };
}

// Bundle size reporter (development only)
export function reportBundleSize() {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Estimate JavaScript bundle size
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    let totalSize = 0;

    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('/_next/')) {
        fetch(src)
          .then(response => response.blob())
          .then(blob => {
            totalSize += blob.size;
            console.log(`📦 Bundle chunk: ${src.split('/').pop()} - ${(blob.size / 1024).toFixed(2)}KB`);
          })
          .catch(() => {
            // Ignore fetch errors for size estimation
          });
      }
    });

    setTimeout(() => {
      console.log(`📊 Estimated total bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
    }, 2000);
  }
}

export default PerformanceMonitor;