import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  // Mock data - extensive product catalog
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Vestido Elegante Negro",
      description: "Vestido negro elegante perfecto para ocasiones especiales y eventos formales",
      price: 89.99,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1566479179817-05b6f6baefb8?w=400&h=500&fit=crop",
      category: "dresses"
    },
    {
      id: 2,
      name: "Camisa Casual Blanca",
      description: "Camisa de algodón cómoda y fresca para el día a día",
      price: 45.50,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=500&fit=crop",
      category: "shirts"
    },
    {
      id: 3,
      name: "Jeans Premium Azul",
      description: "Jeans de alta calidad con corte moderno y cómodo",
      price: 79.99,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
      category: "pants"
    },
    {
      id: 4,
      name: "Chaqueta de Cuero",
      description: "Chaqueta de cuero genuino estilo motociclista",
      price: 199.99,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
      category: "jackets"
    },
    {
      id: 5,
      name: "Blusa Floral",
      description: "Blusa con estampado floral para un look primaveral",
      price: 52.99,
      stock: 18,
      imageUrl: "https://images.unsplash.com/photo-1564759224907-65b0e9b4a6f8?w=400&h=500&fit=crop",
      category: "shirts"
    },
    {
      id: 6,
      name: "Falda Midi Plisada",
      description: "Falda midi plisada elegante y versátil",
      price: 65.00,
      stock: 12,
      imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a13d72?w=400&h=500&fit=crop",
      category: "skirts"
    },
    {
      id: 7,
      name: "Suéter de Lana",
      description: "Suéter tejido de lana merino súper suave",
      price: 95.00,
      stock: 10,
      imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400&h=500&fit=crop",
      category: "sweaters"
    },
    {
      id: 8,
      name: "Vestido Veraniego",
      description: "Vestido ligero perfecto para días soleados",
      price: 68.50,
      stock: 16,
      imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop",
      category: "dresses"
    }
  ];

  const categories = [
    { value: 'all', label: '🛍️ Todos' },
    { value: 'dresses', label: '👗 Vestidos' },
    { value: 'shirts', label: '👕 Camisas' },
    { value: 'pants', label: '👖 Pantalones' },
    { value: 'jackets', label: '🧥 Chaquetas' },
    { value: 'skirts', label: '🩱 Faldas' },
    { value: 'sweaters', label: '🧶 Suéteres' }
  ];

  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            ✨ Nuestra Colección
          </h1>
          <p className="text-xl text-gray-600">
            Descubre la moda que define tu estilo único
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="🔍 Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-30 focus:border-purple-500 transition-all duration-300"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.value
                      ? 'bg-gradient-primary text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-30 focus:border-purple-500 transition-all duration-300"
            >
              <option value="name">📝 Ordenar por Nombre</option>
              <option value="price-low">💰 Precio: Menor a Mayor</option>
              <option value="price-high">💎 Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Mostrando <span className="font-bold text-purple-600">{filteredProducts.length}</span> productos
            {selectedCategory !== 'all' && (
              <span> en <span className="font-bold text-purple-600">
                {categories.find(c => c.value === selectedCategory)?.label}
              </span></span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="relative overflow-hidden group">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-secondary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    ⭐ Nuevo
                  </span>
                </div>
                <Link
                  to={`/products/${product.id}`}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                  <span className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold transform scale-90 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                    👁️ Ver Detalles
                  </span>
                </Link>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-600">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-gradient-primary text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 btn-modern"
                  >
                    🛒 Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta cambiar los filtros o el término de búsqueda
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
                setSortBy('name');
              }}
              className="bg-gradient-primary text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 btn-modern"
            >
              🔄 Limpiar Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
