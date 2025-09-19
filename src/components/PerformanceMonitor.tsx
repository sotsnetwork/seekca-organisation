import React, { useEffect, useState } from 'react';
import { usePerformance } from '@/hooks/use-performance';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);
  const { reportMetric } = usePerformance();

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            reportMetric('fcp', entry.startTime);
          }
        } else if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
          reportMetric('lcp', entry.startTime);
        } else if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          const fid = fidEntry.processingStart - fidEntry.startTime;
          setMetrics(prev => ({ ...prev, fid }));
          reportMetric('fid', fid);
        } else if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            setMetrics(prev => ({ 
              ...prev, 
              cls: (prev.cls || 0) + clsEntry.value 
            }));
            reportMetric('cls', clsEntry.value);
          }
        }
      }
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });

    // Measure TTFB
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      setMetrics(prev => ({ ...prev, ttfb }));
      reportMetric('ttfb', ttfb);
    }

    return () => observer.disconnect();
  }, [reportMetric]);

  if (!isVisible) return null;

  const getScore = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return { score: 'Good', color: 'text-green-600' };
    if (value <= thresholds.poor) return { score: 'Needs Improvement', color: 'text-yellow-600' };
    return { score: 'Poor', color: 'text-red-600' };
  };

  const fcpScore = metrics.fcp ? getScore(metrics.fcp, { good: 1800, poor: 3000 }) : null;
  const lcpScore = metrics.lcp ? getScore(metrics.lcp, { good: 2500, poor: 4000 }) : null;
  const fidScore = metrics.fid ? getScore(metrics.fid, { good: 100, poor: 300 }) : null;
  const clsScore = metrics.cls ? getScore(metrics.cls, { good: 0.1, poor: 0.25 }) : null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        {metrics.fcp && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">FCP:</span>
            <span className={fcpScore?.color}>
              {metrics.fcp.toFixed(0)}ms ({fcpScore?.score})
            </span>
          </div>
        )}
        
        {metrics.lcp && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">LCP:</span>
            <span className={lcpScore?.color}>
              {metrics.lcp.toFixed(0)}ms ({lcpScore?.score})
            </span>
          </div>
        )}
        
        {metrics.fid && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">FID:</span>
            <span className={fidScore?.color}>
              {metrics.fid.toFixed(0)}ms ({fidScore?.score})
            </span>
          </div>
        )}
        
        {metrics.cls && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">CLS:</span>
            <span className={clsScore?.color}>
              {metrics.cls.toFixed(3)} ({clsScore?.score})
            </span>
          </div>
        )}
        
        {metrics.ttfb && (
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">TTFB:</span>
            <span className="text-gray-900 dark:text-white">
              {metrics.ttfb.toFixed(0)}ms
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
};

export default PerformanceMonitor;
