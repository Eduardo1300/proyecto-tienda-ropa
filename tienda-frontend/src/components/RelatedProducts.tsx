import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  imageUrl: string;
  category: string;
  brand?: string;
  color?: string;
  size?: string;
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  averageRating: number;
  reviewCount: number;
  tags: string[];
}

interface RelatedProductsProps {
  productId: number;
  categoryId?: number;
  limit?: number;
  title?: string;
  className?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  productId,
  categoryId,
  limit = 8,
  title = "Productos Relacionados",
  className = ""
}) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comparisonProducts, setComparisonProducts] = useState<number[]>([]);

  useEffect(() => {
    fetchRelatedProducts();
  }, [productId, categoryId, limit]);

  const fetchRelatedProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try multiple strategies to get related products
      const strategies = [
        // 1. Products from same category
        categoryId ? `/api/products?category=${categoryId}&exclude=${productId}&limit=${limit}` : null,
        // 2. Products with similar tags
        `/api/products/${productId}/related?limit=${limit}`,
        // 3. Recently viewed recommendations
        `/api/recently-viewed/recommendations?limit=${limit}`,
        // 4. Fallback to featured products
        `/api/products?featured=true&exclude=${productId}&limit=${limit}`
      ].filter(Boolean);

      let products: Product[] = [];

      for (const strategy of strategies) {
        if (products.length >= limit) break;

        try {
          const response = await axios.get(strategy!);
          const fetchedProducts = Array.isArray(response.data) ? response.data : response.data.products || [];
          
          // Filter out current product and duplicates
          const newProducts = fetchedProducts
            .filter((p: Product) => p.id !== productId)
            .filter((p: Product) => !products.some(existing => existing.id === p.id));

          products = [...products, ...newProducts].slice(0, limit);
        } catch (err) {
          continue;
        }
      }

      setRelatedProducts(products);
    } catch (err) {
      setError('Error al cargar productos relacionados');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (product: Product) => {
    // This would open a quick view modal
  };

  const handleAddToComparison = (product: Product) => {
    setComparisonProducts(prev => {
      if (prev.includes(product.id)) {
        return prev.filter(id => id !== product.id);
      } else if (prev.length < 4) {
        return [...prev, product.id];
      } else {
        alert('Solo puedes comparar hasta 4 productos a la vez');
        return prev;
      }
    });
  };

  const scrollLeft = () => {
    const container = document.getElementById(`related-products-${productId}`);
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById(`related-products-${productId}`);
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className={`${className}`}>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="text-center py-8">
          <span className="text-4xl mb-2 block">😞</span>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchRelatedProducts}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <div className={`${className}`}>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="text-center py-8">
          <span className="text-4xl mb-2 block">🔍</span>
          <p className="text-gray-600">No se encontraron productos relacionados</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          🔗 {title}
        </h3>
        
        {relatedProducts.length > 4 && (
          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
              aria-label="Desplazar izquierda"
            >
              ←
            </button>
            <button
              onClick={scrollRight}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
              aria-label="Desplazar derecha"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Products Grid/Carousel */}
      <div className="relative">
        <div
          id={`related-products-${productId}`}
          className={`${
            relatedProducts.length > 4
              ? 'flex gap-4 overflow-x-auto scrollbar-hide pb-4'
              : 'grid grid-cols-2 md:grid-cols-4 gap-4'
          }`}
          style={relatedProducts.length > 4 ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
        >
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className={relatedProducts.length > 4 ? 'flex-shrink-0 w-64' : ''}
            >
              <ProductCard
                product={product}
                viewMode="grid"
                onQuickView={() => handleQuickView(product)}
                onAddToComparison={() => handleAddToComparison(product)}
                isInComparison={comparisonProducts.includes(product.id)}
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlays for Scroll Indication */}
        {relatedProducts.length > 4 && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </>
        )}
      </div>

      {/* Comparison Bar */}
      {comparisonProducts.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-medium">
                ⚖️ {comparisonProducts.length} productos seleccionados para comparar
              </span>
              {comparisonProducts.length >= 2 && (
                <span className="text-sm text-blue-500">
                  (Mínimo 2 productos requeridos)
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {comparisonProducts.length >= 2 && (
                <button
                  onClick={() => {
                    // This would open the comparison modal
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm"
                >
                  Comparar Ahora
                </button>
              )}
              
              <button
                onClick={() => setComparisonProducts([])}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 text-sm"
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Link */}
      {categoryId && (
        <div className="mt-6 text-center">
          <a
            href={`/productos?category=${categoryId}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Ver todos los productos de esta categoría →
          </a>
        </div>
      )}
    </div>
  );
};

export default RelatedProducts;
