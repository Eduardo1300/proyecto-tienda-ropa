import React, { useState } from 'react';
import axios from 'axios';

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
  specifications?: string;
  careInstructions?: string;
  shippingInfo?: string;
  returnPolicy?: string;
}

interface ProductComparisonProps {
  products?: Product[];
  productsToCompare?: Product[];
  onRemoveProduct: (productId: number) => void;
  onClearComparison?: () => void;
  onClose: () => void;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  products,
  productsToCompare: comparisonProducts,
  onRemoveProduct,
  onClearComparison,
  onClose,
}) => {
  const productsToCompare = products || comparisonProducts || [];
  const [isAddingToCart, setIsAddingToCart] = useState<{ [key: number]: boolean }>({});

  const addToCart = async (product: Product) => {
    try {
      setIsAddingToCart(prev => ({ ...prev, [product.id]: true }));
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Debes iniciar sesión para agregar al carrito');
        return;
      }

      await axios.post('/api/cart/add', {
        productId: product.id,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Producto agregado al carrito');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al agregar al carrito');
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [product.id]: false }));
    }
  };

  const addToWishlist = async (product: Product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para agregar a favoritos');
        return;
      }

      await axios.post('/api/wishlist', {
        productId: product.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Producto agregado a favoritos');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
    }
    
    return stars;
  };

  const getDiscountPercentage = (product: Product) => {
    return product.compareAtPrice 
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;
  };

  const getBestValue = () => {
    if (!productsToCompare.length) return null;
    return productsToCompare.reduce((best, current) => 
      current.price < best.price ? current : best
    );
  };

  const getHighestRated = () => {
    if (!productsToCompare.length) return null;
    return productsToCompare.reduce((best, current) => 
      current.averageRating > best.averageRating ? current : best
    );
  };

  const bestValue = getBestValue();
  const highestRated = getHighestRated();

  if (!productsToCompare.length) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 text-center">
          <div className="mb-4">
            <span className="text-6xl">⚖️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sin productos para comparar</h2>
          <p className="text-gray-600 mb-4">
            Agrega productos a la comparación para ver sus diferencias lado a lado.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚖️</span>
            <h2 className="text-xl font-semibold text-gray-900">
              Comparar Productos ({productsToCompare.length})
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClearComparison}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Limpiar Todo
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <td className="w-48 p-4 font-medium text-gray-900 border-b border-gray-200">
                    Producto
                  </td>
                  {productsToCompare.map((product) => (
                    <td key={product.id} className="p-4 border-b border-gray-200 text-center min-w-64">
                      <div className="relative">
                        <button
                          onClick={() => onRemoveProduct(product.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-10"
                        >
                          ×
                        </button>
                        <img
                          src={product.imageUrl || product.image}
                          alt={product.name}
                          className="w-32 h-32 object-cover rounded-lg mx-auto mb-3"
                        />
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">{product.name}</h3>
                        {product.brand && (
                          <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
                        )}
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 justify-center mb-2">
                          {product === bestValue && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              💰 Mejor Precio
                            </span>
                          )}
                          {product === highestRated && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              ⭐ Mejor Valorado
                            </span>
                          )}
                          {product.isBestseller && (
                            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                              🔥 Bestseller
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {/* Price Row */}
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 border-b border-gray-200">
                    💰 Precio
                  </td>
                  {productsToCompare.map((product) => (
                    <td key={product.id} className="p-4 border-b border-gray-200 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xl font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compareAtPrice && (
                          <div className="flex flex-col items-center">
                            <span className="text-sm text-gray-500 line-through">
                              ${product.compareAtPrice.toFixed(2)}
                            </span>
                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                              -{getDiscountPercentage(product)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 border-b border-gray-200">
                    ⭐ Calificación
                  </td>
                  {productsToCompare.map((product) => (
                    <td key={product.id} className="p-4 border-b border-gray-200 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center justify-center">
                          {renderStars(product.averageRating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.averageRating.toFixed(1)} ({product.reviewCount})
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Stock Row */}
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 border-b border-gray-200">
                    📦 Stock
                  </td>
                  {productsToCompare.map((product) => (
                    <td key={product.id} className="p-4 border-b border-gray-200 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock > 0 ? (
                            product.stock > 10 ? 'En stock' : `${product.stock} disponibles`
                          ) : 'Sin stock'}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Category Row */}
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 border-b border-gray-200">
                    📂 Categoría
                  </td>
                  {productsToCompare.map((product) => (
                    <td key={product.id} className="p-4 border-b border-gray-200 text-center">
                      <span className="text-sm text-gray-600">{product.category}</span>
                    </td>
                  ))}
                </tr>

                {/* SKU Row */}
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 border-b border-gray-200">
                    🏷️ SKU
                  </td>
                  {productsToCompare.map((product) => (
                    <td key={product.id} className="p-4 border-b border-gray-200 text-center">
                      <span className="text-sm text-gray-600 font-mono">{product.sku}</span>
                    </td>
                  ))}
                </tr>

                {/* Color Row */}
                {productsToCompare.some(p => p.color) && (
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900 border-b border-gray-200">
                      🎨 Color
                    </td>
                    {productsToCompare.map((product) => (
                      <td key={product.id} className="p-4 border-b border-gray-200 text-center">
                        <span className="text-sm text-gray-600">{product.color || '-'}</span>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Size Row */}
                {productsToCompare.some(p => p.size) && (
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900 border-b border-gray-200">
                      📏 Talla
                    </td>
                    {productsToCompare.map((product) => (
                      <td key={product.id} className="p-4 border-b border-gray-200 text-center">
                        <span className="text-sm text-gray-600">{product.size || '-'}</span>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Description Row */}
                <tr className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 border-b border-gray-200">
                    📝 Descripción
                  </td>
                  {productsToCompare.map((product) => (
                    <td key={product.id} className="p-4 border-b border-gray-200 text-center">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {product.description}
                      </p>
                    </td>
                  ))}
                </tr>

                {/* Tags Row */}
                {productsToCompare.some(p => p.tags && p.tags.length > 0) && (
                  <tr className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900 border-b border-gray-200">
                      🏷️ Etiquetas
                    </td>
                    {productsToCompare.map((product) => (
                      <td key={product.id} className="p-4 border-b border-gray-200 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {product.tags && product.tags.length > 0 ? (
                            product.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                )}

                {/* Actions Row */}
                <tr>
                  <td className="p-4 font-medium text-gray-900">
                    🛒 Acciones
                  </td>
                  {productsToCompare.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={isAddingToCart[product.id] || product.stock <= 0}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {isAddingToCart[product.id] ? 'Agregando...' : product.stock <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                        </button>
                        
                        <button
                          onClick={() => addToWishlist(product)}
                          className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm"
                        >
                          🤍 Favoritos
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">📊 Resumen de Comparación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>💰 Mejor Precio:</strong> {bestValue?.name} (${bestValue?.price.toFixed(2)})
              </div>
              <div>
                <strong>⭐ Mejor Valorado:</strong> {highestRated?.name} ({highestRated?.averageRating.toFixed(1)} estrellas)
              </div>
              <div>
                <strong>🔥 Bestsellers:</strong> {productsToCompare.filter(p => p.isBestseller).length} de {productsToCompare.length}
              </div>
              <div>
                <strong>📦 En Stock:</strong> {productsToCompare.filter(p => p.stock > 0).length} de {productsToCompare.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductComparison;
