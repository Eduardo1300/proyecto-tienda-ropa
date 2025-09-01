import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trash2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

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

interface WishlistItem {
  id: number;
  product: Product;
  addedAt: string;
  isActive: boolean;
}

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setError('Debes iniciar sesión para ver tus favoritos');
        navigate('/login');
        return;
      }

      const token = localStorage.getItem('token');
      
      // Intentar con diferentes endpoints posibles
      let response;
      try {
        response = await axios.get(`${API_BASE_URL}/wishlist`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error: any) {
        if (error.response?.status === 404) {
          response = await axios.get(`${API_BASE_URL}/products/wishlist`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          throw error;
        }
      }

      setWishlistItems(response.data.data || response.data || []);
    } catch (error: any) {
      console.error('Error fetching wishlist:', error);
      if (error.response?.status === 401) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        navigate('/login');
      } else {
        setError('Error al cargar favoritos. Por favor, intenta de nuevo más tarde.');
        setWishlistItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/wishlist/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setWishlistItems(prev => prev.filter(item => (item.product?.id || item.id) !== productId));
      alert('✅ Producto eliminado de favoritos');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Error al eliminar de favoritos');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="text-8xl mb-6">💝</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Tu Lista de Deseos está Vacía</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              ¡Empieza a agregar productos que te gusten! Explora nuestra colección y guarda tus favoritos.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Explorar Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Lista de Deseos</h1>
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'producto' : 'productos'} guardados
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-64 object-cover"
                />
                                  <button
                    onClick={() => removeFromWishlist(item.product?.id || item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-purple-600">${item.product.price}</span>
                    {item.product.compareAtPrice && (
                      <span className="text-lg text-gray-400 line-through">${item.product.compareAtPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-600">{item.product.averageRating}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/product/${item.product.id}`)}
                    className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
