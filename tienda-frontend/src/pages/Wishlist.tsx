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
      alert('Error al eliminar de favoritos');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">💝 Cargando tus favoritos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-3xl font-bold text-white mb-3">Error</h2>
          <p className="text-gray-300 mb-8 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
          >
            🔄 Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center py-20">
            <div className="text-8xl mb-6">💝</div>
            <h1 className="text-5xl font-bold text-white mb-4">Tu Lista de Deseos está Vacía</h1>
            <p className="text-gray-300 mb-8 max-w-md mx-auto text-lg">
              ¡Empieza a agregar productos que te gusten! Explora nuestra colección y guarda tus favoritos.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🛍️ Explorar Productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">💝 Mi Lista de Deseos</h1>
          <p className="text-gray-300 text-lg">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'producto' : 'productos'} guardados
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl hover:border-white/40 transition-all duration-300 transform hover:scale-105 group">
              <div className="relative overflow-hidden h-64 bg-white/5">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-red-500/30 backdrop-blur-md border border-red-400/50 rounded-full p-2 hover:bg-red-500/50 transition-all">
                  <button
                    onClick={() => removeFromWishlist(item.product?.id || item.id)}
                    className="text-red-200 hover:text-red-100 transition-colors"
                    title="Eliminar de favoritos"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{item.product.name}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.product.description}</p>
                
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">${item.product.price}</span>
                    {item.product.compareAtPrice && (
                      <span className="text-lg text-gray-500 line-through">${item.product.compareAtPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-full px-3 py-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm text-gray-300 font-semibold">{item.product.averageRating}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/product/${item.product.id}`)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  👁️ Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
