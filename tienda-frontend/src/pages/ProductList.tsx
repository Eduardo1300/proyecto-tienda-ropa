import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { productsAPI } from '../services/api';
import { getProductImage } from '../utils/productImages';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  const categories = ['all', 'hombre', 'mujer', 'accesorios', 'zapatos'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsAPI.getAll();
        setProducts(response.data.data || response.data);
      } catch (error) {
        // Mock data for development
        setProducts([
          {
            id: 1,
            name: 'Camiseta Básica',
            description: 'Camiseta 100% algodón, cómoda y versátil',
            price: 29.99,
            stock: 50,
            category: 'hombre',
            imageUrl: 'https://via.placeholder.com/300x300/6366f1/ffffff?text=Camiseta'
          },
          {
            id: 2,
            name: 'Vestido Elegante',
            description: 'Vestido perfecto para ocasiones especiales',
            price: 89.99,
            stock: 25,
            category: 'mujer',
            imageUrl: 'https://via.placeholder.com/300x300/ec4899/ffffff?text=Vestido'
          },
          {
            id: 3,
            name: 'Bolso de Cuero',
            description: 'Bolso de cuero genuino con múltiples compartimentos',
            price: 129.99,
            stock: 15,
            category: 'accesorios',
            imageUrl: 'https://via.placeholder.com/300x300/f59e0b/ffffff?text=Bolso'
          },
          {
            id: 4,
            name: 'Zapatillas Deportivas',
            description: 'Zapatillas cómodas para el día a día',
            price: 79.99,
            stock: 30,
            category: 'zapatos',
            imageUrl: 'https://via.placeholder.com/300x300/10b981/ffffff?text=Zapatillas'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    // Opcional: mostrar un toast o notificación
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">Cargando productos increíbles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            🛍️ Nuestros 
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Productos Premium
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Descubre nuestra colección completa de moda exclusiva</p>
        </div>
        
        {/* Barra de búsqueda y filtros */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-white/10 text-gray-200 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {category === 'all' ? '✨ Todos' : '📌 ' + category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              No se encontraron productos
            </h2>
            <p className="text-gray-300 text-lg">
              Intenta con otros términos de búsqueda o categorías
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:border-white/40 transition-all duration-300">
                    <div className="relative h-72 bg-gradient-to-br from-purple-600/20 to-pink-600/20 overflow-hidden">
                      <img 
                        src={getProductImage(product.name, product.category, product.imageUrl)} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 space-y-2">
                        {(product.stock || 0) < 10 && (product.stock || 0) > 0 && (
                          <div className="bg-red-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                            ⏰ Últimas {product.stock}
                          </div>
                        )}
                        {(product.stock || 0) === 0 && (
                          <div className="bg-gray-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                            ❌ Agotado
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-block bg-purple-500/30 text-purple-200 text-xs px-3 py-1 rounded-full font-semibold border border-purple-400/50 backdrop-blur-sm">
                          📌 {product.category}
                        </span>
                        <span className="text-sm text-gray-300">
                          Stock: <span className="text-purple-300 font-bold">{product.stock || 0}</span>
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
                      
                      <div className="pt-3 border-t border-white/10">
                        <span className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                          S/ {product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    disabled={(product.stock || 0) === 0}
                    className={`flex-1 px-4 py-3 rounded-lg font-bold transition-all duration-300 ${
                      (product.stock || 0) === 0
                        ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:shadow-lg hover:shadow-purple-500/50'
                    }`}
                  >
                    {(product.stock || 0) === 0 ? '❌ Agotado' : '🛒 Agregar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
