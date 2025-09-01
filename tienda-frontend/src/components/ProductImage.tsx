import React, { useState, useRef, useEffect } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  placeholder?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  fallbackSrc,
  className = '',
  loading = 'lazy',
  placeholder = true,
  onLoad,
  onError,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(loading === 'eager');
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate a better fallback image based on product name/category
  const getSmartFallback = (alt: string): string => {
    if (fallbackSrc) return fallbackSrc;
    
    // Extract category or product type from alt text
    const altLower = alt.toLowerCase();
    let imageId = '1441986300917-64674bd600d8'; // Default fashion image
    
    if (altLower.includes('dress') || altLower.includes('vestido')) {
      imageId = '1539008835657-9d018c30a73d'; // Dress image
    } else if (altLower.includes('shirt') || altLower.includes('camisa')) {
      imageId = '1521498542256-a76fb756498e'; // Shirt image
    } else if (altLower.includes('pants') || altLower.includes('pantalon')) {
      imageId = '1542272454315-7d6d87b9c5c0'; // Pants image
    } else if (altLower.includes('jacket') || altLower.includes('chaqueta')) {
      imageId = '1551028719-244a29ca9526'; // Jacket image
    } else if (altLower.includes('shoes') || altLower.includes('zapatos')) {
      imageId = '1549298916-b41d501d3772'; // Shoes image
    } else if (altLower.includes('bag') || altLower.includes('bolso')) {
      imageId = '1553062407-98eeb64c6a62'; // Bag image
    }

    return `https://images.unsplash.com/photo-${imageId}?w=400&h=500&fit=crop&auto=format&q=80`;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (loading === 'lazy' && imgRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1, rootMargin: '50px' }
      );

      observer.observe(imgRef.current);

      return () => observer.disconnect();
    }
  }, [loading]);

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setImageError(true);
    if (onError) onError();
  };

  const finalSrc = imageError ? getSmartFallback(alt) : src;

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Loading Placeholder */}
      {placeholder && !imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-2">🖼️</div>
            <div className="text-sm">Cargando...</div>
          </div>
        </div>
      )}

      {/* Main Image */}
      {isVisible && (
        <img
          src={finalSrc}
          alt={alt}
          loading={loading}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`
            transition-all duration-500 w-full h-full object-cover
            ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}
            ${className}
          `}
        />
      )}

      {/* Error State */}
      {imageError && imageLoaded && (
        <div className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">
          Imagen alternativa
        </div>
      )}

      {/* Image Quality Badge */}
      {imageLoaded && !imageError && (
        <div className="absolute top-2 left-2 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs opacity-0 hover:opacity-100 transition-opacity">
          HD
        </div>
      )}
    </div>
  );
};

export default ProductImage;
