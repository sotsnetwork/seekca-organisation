import React, { Suspense, lazy, ComponentType } from 'react';
import { cn } from '@/lib/utils';

interface LazyWrapperProps {
  fallback?: React.ReactNode;
  className?: string;
}

// Default loading fallback
const DefaultFallback = ({ className }: { className?: string }) => (
  <div className={cn(
    'flex items-center justify-center p-8',
    'animate-pulse bg-muted rounded-lg',
    className
  )}>
    <div className="flex flex-col items-center space-y-2">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  </div>
);

// Higher-order component for lazy loading
export function withLazyLoading<T extends object>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyWrapper(props: T & LazyWrapperProps) {
    const { fallback: propFallback, className, ...componentProps } = props;
    
    return (
      <Suspense fallback={propFallback || fallback || <DefaultFallback className={className} />}>
        <LazyComponent {...(componentProps as T)} />
      </Suspense>
    );
  };
}

// Hook for lazy loading with intersection observer
export function useLazyLoad(threshold = 0.1) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

// Lazy image component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback,
  className,
  ...props
}) => {
  const { ref, isVisible } = useLazyLoad();
  const [loaded, setLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);

  return (
    <div ref={ref} className={cn('relative', className)}>
      {isVisible && (
        <>
          {!loaded && !error && (fallback || <DefaultFallback />)}
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'transition-opacity duration-300',
              loaded ? 'opacity-100' : 'opacity-0',
              className
            )}
            {...props}
          />
        </>
      )}
    </div>
  );
};

export default withLazyLoading;
