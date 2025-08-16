import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductQuickView from '../components/ProductQuickView';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [comparisonItems, setComparisonItems] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceRange: [0, 1000] as [number, number],
    colors: [] as string[],
    sizes: [] as string[],
    rating: 0,
    inStock: true,
    onSale: false,
    featured: false,
    new: false,
    bestseller: false,
  });

  // Filter options for the ProductFilters component (unused for now)
  // const filterOptions = {
  //   categories: ['dresses', 'shirts', 'pants', 'jackets', 'skirts', 'sweaters'],
  //   brands: ['Elegance', 'Casual Co', 'Denim Pro', 'Leather Works', 'Nike', 'Adidas', 'Zara', 'H&M'],
  //   colors: ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Gris', 'Marrón', 'Rosa'],
  //   sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'],
  //   priceRange: [0, 1000] as [number, number],
  // };

  // Mock data fallback
  const mockProducts = [
    {
      id: 1,
      name: "Vestido Elegante Negro",
      description: "Vestido negro elegante perfecto para ocasiones especiales y eventos formales",
      price: 89.99,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1566479179817-05b6f6baefb8?w=400&h=500&fit=crop",
      category: "dresses",
      brand: "Elegance",
      colors: ["Negro"],
      sizes: ["S", "M", "L", "XL"],
      rating: 4.5,
      isNew: true,
      isFeatured: false,
      isOnSale: false,
      isBestseller: false
    },
    {
      id: 2,
      name: "Camisa Casual Blanca",
      description: "Camisa de algodón cómoda y fresca para el día a día",
      price: 45.50,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=500&fit=crop",
      category: "shirts",
      brand: "Casual Co",
      colors: ["Blanco"],
      sizes: ["XS", "S", "M", "L", "XL"],
      rating: 4.2,
      isNew: false,
      isFeatured: true,
      isOnSale: true,
      isBestseller: true
    },
    {
      id: 3,
      name: "Jeans Premium Azul",
      description: "Jeans de alta calidad con corte moderno y cómodo",
      price: 79.99,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
      category: "pants",
      brand: "Denim Pro",
      colors: ["Azul"],
      sizes: ["28", "30", "32", "34", "36"],
      rating: 4.7,
      isNew: false,
      isFeatured: false,
      isOnSale: false,
      isBestseller: true
    },
    {
      id: 4,
      name: "Chaqueta de Cuero",
      description: "Chaqueta de cuero genuino estilo motociclista",
      price: 199.99,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
      category: "jackets",
      brand: "Leather Works",
      colors: ["Negro", "Marrón"],
      sizes: ["S", "M", "L", "XL"],
      rating: 4.8,
      isNew: true,
      isFeatured: true,
      isOnSale: false,
      isBestseller: false
    }
  ];

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAll();
      
      if (response?.data && Array.isArray(response.data)) {
        // Clean and process API data
        const cleanedProducts = response.data
          .filter(product => product && product.id && product.name)
          .map(product => ({
            ...product,
            imageUrl: product.imageUrl || product.image || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop",
            price: parseFloat(product.price) || 0,
            stock: parseInt(product.stock) || 0,
            rating: product.rating || 0,
            isNew: product.isNew || false,
            isFeatured: product.isFeatured || false,
            isOnSale: product.isOnSale || false,
            isBestseller: product.isBestseller || false,
            colors: product.colors || [],
            sizes: product.sizes || [],
            brand: product.brand || 'Sin marca'
          }));
        
        setProducts(cleanedProducts);
      } else {
        console.warn('API response invalid, using mock data');
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error al cargar productos. Mostrando datos de ejemplo.');
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search products using useMemo for better performance
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Brand filter
    if (filters.brand) {
      filtered = filtered.filter(product => product.brand === filters.brand);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Colors filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors?.some((color: string) => filters.colors.includes(color))
      );
    }

    // Sizes filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes?.some((size: string) => filters.sizes.includes(size))
      );
    }

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Special filters
    if (filters.onSale) {
      filtered = filtered.filter(product => product.isOnSale);
    }
    if (filters.featured) {
      filtered = filtered.filter(product => product.isFeatured);
    }
    if (filters.new) {
      filtered = filtered.filter(product => product.isNew);
    }
    if (filters.bestseller) {
      filtered = filtered.filter(product => product.isBestseller);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, filters, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // const handleFiltersChange = (newFilters: any) => {
  //   setFilters(newFilters);
  // };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      priceRange: [0, 1000],
      colors: [],
      sizes: [],
      rating: 0,
      inStock: true,
      onSale: false,
      featured: false,
      new: false,
      bestseller: false,
    });
    setSearchTerm('');
  };

  const handleAddToComparison = (product: any) => {
    if (comparisonItems.length < 3 && !comparisonItems.find(item => item.id === product.id)) {
      setComparisonItems([...comparisonItems, product]);
    }
  };

  const handleRemoveFromComparison = (productId: number) => {
    setComparisonItems(comparisonItems.filter(item => item.id !== productId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🛍️ Nuestros Productos
          </h1>
          <p className="text-gray-600 text-lg">
            Descubre nuestra colección de moda exclusiva
          </p>
        </div>

        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
            <p className="font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Search and Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 items-center">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="name">Nombre A-Z</option>
                <option value="price-low">Precio: Menor a Mayor</option>
                <option value="price-high">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificados</option>
                <option value="newest">Más Nuevos</option>
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  ☰
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                🎛️ Filtros
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              {/* TODO: Implementar ProductFilters component */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Filtros</h3>
                <p className="text-gray-500">Filtros en desarrollo...</p>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Mostrando <span className="font-bold text-purple-600">{filteredProducts.length}</span> productos
                {searchTerm && (
                  <span> para "<span className="font-bold">{searchTerm}</span>"
                  </span>
                )}
              </p>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                {filteredProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={() => setQuickViewProduct(product)}
                    onAddToComparison={() => handleAddToComparison(product)}
                    isInComparison={comparisonItems.some(item => item.id === product.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😢</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta cambiar los filtros o el término de búsqueda
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
                >
                  🔄 Limpiar Filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Bar */}
        {comparisonItems.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-semibold">Comparar productos ({comparisonItems.length}/3):</span>
                <div className="flex gap-2">
                  {comparisonItems.map(item => (
                    <div key={item.id} className="flex items-center bg-purple-100 px-3 py-1 rounded-full">
                      <span className="text-sm">{item.name}</span>
                      <button
                        onClick={() => handleRemoveFromComparison(item.id)}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                onClick={() => {
                  // Mostrar modal de comparación
                  setShowComparison(true);
                }}
              >
                Comparar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Comparar Productos ({comparisonItems.length})
                </h2>
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              {comparisonItems.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⚖️</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No hay productos para comparar</h3>
                  <p className="text-gray-600">Agrega productos usando el botón de comparación</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Característica</th>
                        {comparisonItems.map((product) => (
                          <th key={product.id} className="text-center p-4 min-w-[200px]">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg mx-auto mb-2"
                            />
                            <h4 className="font-semibold text-sm">{product.name}</h4>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-4 font-medium">Precio</td>
                        {comparisonItems.map((product) => (
                          <td key={product.id} className="text-center p-4">
                            <span className="text-xl font-bold text-purple-600">${product.price}</span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 font-medium">Marca</td>
                        {comparisonItems.map((product) => (
                          <td key={product.id} className="text-center p-4">{product.brand || 'N/A'}</td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 font-medium">Categoría</td>
                        {comparisonItems.map((product) => (
                          <td key={product.id} className="text-center p-4">{product.category}</td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 font-medium">Stock</td>
                        {comparisonItems.map((product) => (
                          <td key={product.id} className="text-center p-4">
                            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                            </span>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b">
                        <td className="p-4 font-medium">Calificación</td>
                        {comparisonItems.map((product) => (
                          <td key={product.id} className="text-center p-4">
                            <div className="flex justify-center items-center gap-1">
                              <span className="text-yellow-400">★</span>
                              <span>{product.rating || 'N/A'}</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Acciones</td>
                        {comparisonItems.map((product) => (
                          <td key={product.id} className="text-center p-4">
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                              >
                                Ver Detalles
                              </button>
                              <button
                                onClick={() => handleRemoveFromComparison(product.id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                              >
                                Quitar
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
