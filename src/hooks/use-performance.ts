import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export function usePerformance() {
  const reportMetric = useCallback((name: string, value: number) => {
    // Report to analytics service (Vercel Analytics, Google Analytics, etc.)
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Send to Vercel Analytics if available
      if (window.va) {
        window.va.track('performance_metric', { metric: name, value });
      }
      
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance Metric - ${name}:`, value);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('performance' in window)) return;

    // Measure First Contentful Paint
    const measureFCP = () => {
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        reportMetric('fcp', fcpEntry.startTime);
      }
    };

    // Measure Largest Contentful Paint
    const measureLCP = () => {
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      const lastLCPEntry = lcpEntries[lcpEntries.length - 1];
      if (lastLCPEntry) {
        reportMetric('lcp', lastLCPEntry.startTime);
      }
    };

    // Measure First Input Delay
    const measureFID = () => {
      const fidEntries = performance.getEntriesByType('first-input');
      if (fidEntries.length > 0) {
        const fidEntry = fidEntries[0] as PerformanceEventTiming;
        reportMetric('fid', fidEntry.processingStart - fidEntry.startTime);
      }
    };

    // Measure Cumulative Layout Shift
    const measureCLS = () => {
      let clsValue = 0;
      const clsEntries = performance.getEntriesByType('layout-shift');
      
      for (const entry of clsEntries as PerformanceEntry[]) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      
      if (clsValue > 0) {
        reportMetric('cls', clsValue);
      }
    };

    // Measure Time to First Byte
    const measureTTFB = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        reportMetric('ttfb', navigationEntry.responseStart - navigationEntry.requestStart);
      }
    };

    // Set up observers
    const fcpObserver = new PerformanceObserver(measureFCP);
    fcpObserver.observe({ entryTypes: ['paint'] });

    const lcpObserver = new PerformanceObserver(measureLCP);
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    const fidObserver = new PerformanceObserver(measureFID);
    fidObserver.observe({ entryTypes: ['first-input'] });

    const clsObserver = new PerformanceObserver(measureCLS);
    clsObserver.observe({ entryTypes: ['layout-shift'] });

    // Measure TTFB immediately
    measureTTFB();

    // Cleanup
    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [reportMetric]);

  return {
    reportMetric,
  };
}

// Hook for measuring component render performance
export function useRenderPerformance(componentName: string) {
  const startTime = performance.now();

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time:`, renderTime.toFixed(2), 'ms');
    }
  });
}

// Hook for measuring async operations
export function useAsyncPerformance() {
  const measureAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${operationName} completed in:`, duration.toFixed(2), 'ms');
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      console.error(`${operationName} failed after:`, duration.toFixed(2), 'ms', error);
      throw error;
    }
  }, []);

  return { measureAsync };
}
