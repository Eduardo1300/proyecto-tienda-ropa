import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
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
}

interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onQuickView: () => void;
  onAddToComparison: () => void;
  isInComparison: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  viewMode, 
  onQuickView, 
  onAddToComparison, 
  isInComparison 
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart: addToCartContext } = useCart();
  const { addNotification } = useNotifications();

  const addToWishlist = async () => {
    try {
      if (!user) {
        alert('Debes iniciar sesión para agregar a favoritos');
        navigate('/login');
        return;
      }

      const token = localStorage.getItem('token');
      
      // Intentar con diferentes endpoints posibles
      try {
        await axios.post('http://localhost:3000/api/wishlist', {
          productId: product.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error: any) {
        // Si falla, intentar con endpoint alternativo
        if (error.response?.status === 404) {
          await axios.post('http://localhost:3000/api/products/wishlist', {
            productId: product.id
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          throw error;
        }
      }
      
      setIsInWishlist(true);
      addNotification({
        type: 'success',
        title: 'Agregado a Favoritos',
        message: `${product.name} se agregó a tu lista de favoritos`,
        duration: 3000
      });
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      if (error.response?.status === 401) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login');
      } else {
        alert('Error al agregar a favoritos. Inténtalo de nuevo.');
      }
    }
  };

  const addToCart = async () => {
    try {
      setIsAddingToCart(true);
      
      if (!user) {
        addNotification({
          type: 'warning',
          title: 'Inicia Sesión',
          message: 'Debes iniciar sesión para agregar productos al carrito',
          duration: 4000
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        addNotification({
          type: 'warning',
          title: 'Inicia Sesión',
          message: 'Debes iniciar sesión para agregar productos al carrito',
          duration: 4000
        });
        return;
      }

      // Usar el contexto de carrito directamente
      addToCartContext(product);
      
      addNotification({
        type: 'success',
        title: 'Agregado al Carrito',
        message: `${product.name} se agregó a tu carrito`,
        duration: 3000
      });
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al agregar al carrito. Inténtalo de nuevo.',
        duration: 4000
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const trackView = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/api/products/track-view', {
          productId: product.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

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

  if (viewMode === 'list') {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 flex gap-4 hover:shadow-lg transition-shadow">
        <div className="relative w-32 h-32 flex-shrink-0">
          <img 
            src={product.imageUrl || product.image} 
            alt={product.name} 
            className="w-full h-full object-cover rounded-lg"
            onClick={() => { trackView(); onQuickView(); }}
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Nuevo</span>
            )}
            {product.isBestseller && (
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Bestseller</span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">-{discountPercentage}%</span>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                    onClick={() => { trackView(); navigate(`/product/${product.id}`); }}>
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={addToWishlist}
                  className={`p-2 rounded-full ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                >
                  {isInWishlist ? '❤️' : '🤍'}
                </button>
                <button
                  onClick={onAddToComparison}
                  className={`p-2 rounded-full ${isInComparison ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
                  title="Comparar"
                >
                  ⚖️
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {renderStars(product.averageRating)}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">${product.compareAtPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onQuickView}
                className="bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-sm"
              >
                👀 Vista Rápida
              </button>
              <button
                onClick={addToCart}
                disabled={isAddingToCart || product.stock <= 0}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isAddingToCart ? 'Agregando...' : product.stock <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <img 
          src={product.imageUrl || product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover cursor-pointer"
          onClick={() => { trackView(); onQuickView(); }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Nuevo</span>
          )}
          {product.isFeatured && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">Destacado</span>
          )}
          {product.isBestseller && (
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Bestseller</span>
          )}
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">-{discountPercentage}%</span>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={addToWishlist}
            className={`p-2 rounded-full bg-white shadow-md ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            {isInWishlist ? '❤️' : '🤍'}
          </button>
          <button
            onClick={onAddToComparison}
            className={`p-2 rounded-full bg-white shadow-md ${isInComparison ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'}`}
            title="Comparar"
          >
            ⚖️
          </button>
          <button
            onClick={onQuickView}
            className="p-2 rounded-full bg-white shadow-md text-gray-400 hover:text-gray-600"
            title="Vista Rápida"
          >
            👀
          </button>
        </div>

        {/* Stock indicator */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              Sin Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2"
              onClick={() => { trackView(); navigate(`/product/${product.id}`); }}>
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-sm text-gray-500">{product.brand}</p>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {renderStars(product.averageRating)}
          </div>
          <span className="text-sm text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
              ¡Solo {product.stock} disponibles!
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { trackView(); navigate(`/product/${product.id}`); }}
            className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors text-sm"
          >
            👁️ Ver Detalles
          </button>
          <button
            onClick={addToCart}
            disabled={isAddingToCart || product.stock <= 0}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isAddingToCart ? 'Agregando...' : product.stock <= 0 ? 'Sin Stock' : '🛒 Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
