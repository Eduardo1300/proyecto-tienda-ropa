import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';
import ProductImage from './ProductImage';
import { Button, Card, Badge } from './ui';

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
        await axios.post(`${API_BASE_URL}/wishlist`, {
          productId: product.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error: any) {
        // Si falla, intentar con endpoint alternativo
        if (error.response?.status === 404) {
          await axios.post(`${API_BASE_URL}/products/wishlist`, {
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
        // Cambiar la URL relativa a la base del backend
        await axios.post(`${API_BASE_URL}/api/products/track-view`, {
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
      <Card className="flex gap-4 hover:shadow-xl transition-all duration-300" padding="md">
        <div className="relative w-32 h-32 flex-shrink-0 cursor-pointer" onClick={() => { trackView(); onQuickView(); }}>
          <ProductImage
            src={product.imageUrl || product.image}
            alt={product.name}
            className="w-full h-full rounded-lg"
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <Badge variant="success" size="sm" icon="✨">Nuevo</Badge>}
            {product.isBestseller && <Badge variant="warning" size="sm" icon="🔥">Bestseller</Badge>}
            {discountPercentage > 0 && <Badge variant="danger" size="sm">-{discountPercentage}%</Badge>}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 cursor-pointer transition-colors"
                    onClick={() => { trackView(); navigate(`/product/${product.id}`); }}>
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <button
                  onClick={(e) => { e?.stopPropagation(); addToWishlist(); }}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    isInWishlist 
                      ? 'text-red-500 bg-red-50' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  {isInWishlist ? '❤️' : '🤍'}
                </button>
                <button
                  onClick={(e) => { e?.stopPropagation(); onAddToComparison(); }}
                  className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                    isInComparison 
                      ? 'text-blue-500 bg-blue-50' 
                      : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                  }`}
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
              <span className="text-xl font-bold text-gray-900">S/ {product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">S/ {product.compareAtPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => { e?.stopPropagation(); onQuickView(); }}
                icon="👁️"
              >
                Vista Rápida
              </Button>
              <Button
                onClick={(e) => { e?.stopPropagation(); addToCart(); }}
                disabled={isAddingToCart || product.stock <= 0}
                loading={isAddingToCart}
                size="sm"
                icon="🛒"
              >
                {product.stock <= 0 ? 'Sin Stock' : 'Agregar'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view
  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1" padding="none">
      <div className="relative cursor-pointer" onClick={() => { trackView(); onQuickView(); }}>
        <ProductImage
          src={product.imageUrl || product.image}
          alt={product.name}
          className="w-full h-48 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge variant="success" size="sm" icon="✨">Nuevo</Badge>}
          {product.isFeatured && <Badge variant="primary" size="sm" icon="⭐">Destacado</Badge>}
          {product.isBestseller && <Badge variant="warning" size="sm" icon="🔥">Bestseller</Badge>}
          {discountPercentage > 0 && <Badge variant="danger" size="sm">-{discountPercentage}%</Badge>}
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button
            onClick={(e) => { e.stopPropagation(); addToWishlist(); }}
            className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-110 ${
              isInWishlist 
                ? 'bg-red-500 text-white shadow-red-500/25' 
                : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            {isInWishlist ? '❤️' : '🤍'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAddToComparison(); }}
            className={`p-3 rounded-full backdrop-blur-md shadow-lg transition-all duration-200 hover:scale-110 ${
              isInComparison 
                ? 'bg-blue-500 text-white shadow-blue-500/25' 
                : 'bg-white/80 text-gray-600 hover:bg-blue-50 hover:text-blue-500'
            }`}
            title="Comparar"
          >
            ⚖️
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(); }}
            className="p-3 rounded-full bg-white/80 backdrop-blur-md text-gray-600 hover:bg-purple-50 hover:text-purple-500 shadow-lg transition-all duration-200 hover:scale-110"
            title="Vista Rápida"
          >
            �️
          </button>
        </div>

        {/* Stock indicator */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <Badge variant="danger" size="lg" icon="⚠️">Sin Stock</Badge>
          </div>
        )}

        {/* Quick add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <Button
            onClick={(e) => { e?.stopPropagation(); addToCart(); }}
            disabled={isAddingToCart || product.stock <= 0}
            loading={isAddingToCart}
            fullWidth
            variant="primary"
            size="sm"
            icon="🛒"
            className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
          >
            {product.stock <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
          </Button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 cursor-pointer line-clamp-2 transition-colors duration-200"
              onClick={() => { trackView(); navigate(`/product/${product.id}`); }}>
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-sm text-purple-600 font-medium">{product.brand}</p>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {renderStars(product.averageRating)}
          </div>
          <span className="text-sm text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">S/ {product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">S/ {product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          
          {product.stock > 0 && product.stock <= 5 && (
            <Badge variant="warning" size="sm" icon="⚠️">
              Solo {product.stock} disponibles
            </Badge>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => { trackView(); navigate(`/product/${product.id}`); }}
            variant="outline"
            size="sm"
            fullWidth
            icon="👁️"
          >
            Ver Detalles
          </Button>
          <Button
            onClick={(e) => { e?.stopPropagation(); addToCart(); }}
            disabled={isAddingToCart || product.stock <= 0}
            loading={isAddingToCart}
            size="sm"
            fullWidth
            icon="🛒"
          >
            {product.stock <= 0 ? 'Sin Stock' : 'Agregar'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
