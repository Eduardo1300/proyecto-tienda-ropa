import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';
import { productsAPI } from '../services/api';

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
        console.error('Error fetching products:', error);
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
    console.log(`Agregado al carrito: ${product.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🛍️ Nuestros Productos</h1>
        
        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category === 'all' ? 'Todos' : category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              No se encontraron productos
            </h2>
            <p className="text-gray-500">
              Intenta con otros términos de búsqueda o categorías
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-64 object-cover"
                    />
                    {product.stock < 10 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                        ¡Últimas unidades!
                      </span>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full mb-2">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-purple-600">
                        S/ {product.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Stock disponible: {product.stock}
                    </p>
                  </div>
                </Link>
                
                <div className="p-4 pt-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    disabled={product.stock === 0}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
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
