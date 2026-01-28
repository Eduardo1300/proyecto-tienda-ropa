import React, { useState, useEffect } from 'react';

interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  isMain: boolean;
  type: string;
  width?: number;
  height?: number;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  productName, 
  className = '' 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sort images to show main image first
  const sortedImages = [...images].sort((a, b) => {
    if (a.isMain && !b.isMain) return -1;
    if (!a.isMain && b.isMain) return 1;
    return 0;
  });

  useEffect(() => {
    // Reset selected image when images change
    setSelectedImageIndex(0);
    setIsZoomed(false);
    setIsFullscreen(false);
  }, [images]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSelectedImageIndex(prev => 
        prev > 0 ? prev - 1 : sortedImages.length - 1
      );
    } else if (e.key === 'ArrowRight') {
      setSelectedImageIndex(prev => 
        prev < sortedImages.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'Escape') {
      setIsFullscreen(false);
      setIsZoomed(false);
    }
  };

  const currentImage = sortedImages[selectedImageIndex];

  if (!sortedImages.length) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <span className="text-4xl mb-2 block">🖼️</span>
          <p>Sin imágenes disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Image Display */}
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md group cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onClick={() => setIsFullscreen(true)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="relative aspect-square">
          <img
            src={currentImage.url}
            alt={currentImage.altText || `${productName} - Imagen ${selectedImageIndex + 1}`}
            className={`w-full h-full object-cover transition-transform duration-300 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : {}
            }
          />
          
          {/* Image Counter */}
          {sortedImages.length > 1 && (
            <div className="absolute top-4 right-4 bg-gray-900/50 dark:bg-gray-900/70 text-white px-2 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {sortedImages.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {sortedImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(prev => 
                    prev > 0 ? prev - 1 : sortedImages.length - 1
                  );
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-900/50 dark:bg-gray-900/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700/75 dark:hover:bg-gray-800/75"
                aria-label="Imagen anterior"
              >
                ←
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImageIndex(prev => 
                    prev < sortedImages.length - 1 ? prev + 1 : 0
                  );
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900/50 dark:bg-gray-900/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-700/75 dark:hover:bg-gray-800/75"
                aria-label="Siguiente imagen"
              >
                →
              </button>
            </>
          )}

          {/* Zoom Indicator */}
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-gray-900/50 dark:bg-gray-900/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
              🔍 Hover para zoom • Click para pantalla completa
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {sortedImages.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                index === selectedImageIndex
                  ? 'border-primary ring-2 ring-primary-light/50'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-light/50 dark:hover:border-primary-dark'
              }`}
            >
              <img
                src={image.url}
                alt={image.altText || `${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsFullscreen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-7xl max-h-full p-4">
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-200 z-10"
              aria-label="Cerrar pantalla completa"
            >
              ×
            </button>

            {/* Fullscreen Image */}
            <img
              src={currentImage.url}
              alt={currentImage.altText || `${productName} - Imagen ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Fullscreen Navigation */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(prev => 
                      prev > 0 ? prev - 1 : sortedImages.length - 1
                    );
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-900/50 text-white p-3 rounded-full hover:bg-gray-700/75"
                  aria-label="Imagen anterior"
                >
                  ←
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(prev => 
                      prev < sortedImages.length - 1 ? prev + 1 : 0
                    );
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900/50 text-white p-3 rounded-full hover:bg-gray-700/75"
                  aria-label="Siguiente imagen"
                >
                  →
                </button>
              </>
            )}

            {/* Fullscreen Counter and Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
              <div className="bg-gray-900/50 px-4 py-2 rounded-lg">
                <div className="text-sm mb-1">
                  {selectedImageIndex + 1} de {sortedImages.length}
                </div>
                <div className="text-xs text-gray-300 dark:text-gray-400">
                  Usa las flechas del teclado para navegar • ESC para cerrar
                </div>
              </div>
            </div>

            {/* Thumbnail Strip in Fullscreen */}
            {sortedImages.length > 1 && (
              <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto">
                {sortedImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex(index);
                    }}
                    className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden ${
                      index === selectedImageIndex
                        ? 'border-primary'
                        : 'border-gray-500 dark:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
