import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '100vw',
  quality = 80,
  placeholder = 'empty',
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate WebP and AVIF sources
  const getOptimizedSrc = (originalSrc: string, format: 'webp' | 'avif') => {
    if (originalSrc.startsWith('http')) {
      return originalSrc; // External images, return as-is
    }
    
    const baseName = originalSrc.replace(/\.[^/.]+$/, '');
    const extension = originalSrc.split('.').pop();
    
    // For local images, we'll use the same path but with different extension
    // In production, you might want to use a CDN or image optimization service
    return `${baseName}.${format}`;
  };

  const handleLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setImageError(true);
    onError?.();
  };

  // Preload critical images
  useEffect(() => {
    if (priority && !imageLoaded && !imageError) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      if (sizes) link.setAttribute('imagesizes', sizes);
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src, sizes, imageLoaded, imageError]);

  if (imageError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-muted text-muted-foreground',
          className
        )}
        style={{ width, height }}
      >
        <span className="text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <picture className={cn('block', className)}>
      {/* AVIF format (best compression) */}
      <source
        srcSet={getOptimizedSrc(src, 'avif')}
        type="image/avif"
        sizes={sizes}
      />
      
      {/* WebP format (good compression, wide support) */}
      <source
        srcSet={getOptimizedSrc(src, 'webp')}
        type="image/webp"
        sizes={sizes}
      />
      
      {/* Fallback to original format */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        decoding={priority ? 'sync' : 'async'}
        className={cn(
          'transition-opacity duration-300',
          imageLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto',
        }}
      />
      
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div 
          className={cn(
            'absolute inset-0 bg-muted animate-pulse',
            placeholder === 'blur' && 'backdrop-blur-sm'
          )}
          style={{ width, height }}
        />
      )}
    </picture>
  );
};

export default OptimizedImage;
