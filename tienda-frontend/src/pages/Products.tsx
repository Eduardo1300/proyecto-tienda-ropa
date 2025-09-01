import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductQuickView from '../components/ProductQuickView';
import ProductFilters from '../components/ProductFilters';

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

  // Generate filter options dynamically from products
  const filterOptions = useMemo(() => {
    const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
    const colors = Array.from(new Set(products.flatMap(p => p.colors || []).filter(Boolean)));
    const sizes = Array.from(new Set(products.flatMap(p => p.sizes || []).filter(Boolean)));
    const prices = products.map(p => p.price).filter(p => p > 0);
    const priceRange: [number, number] = prices.length > 0 
      ? [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
      : [0, 1000];

    return {
      categories: categories.length > 0 ? categories : ['dresses', 'shirts', 'pants', 'jackets', 'skirts', 'sweaters'],
      brands: brands.length > 0 ? brands : ['Elegance', 'Casual Co', 'Denim Pro', 'Leather Works', 'Nike', 'Adidas', 'Zara', 'H&M'],
      colors: colors.length > 0 ? colors : ['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Gris', 'Marrón', 'Rosa'],
      sizes: sizes.length > 0 ? sizes : ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'],
      priceRange,
    };
  }, [products]);

  // Función para cargar productos
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
        console.error('API response invalid');
        setProducts([]);
        setError('No se pudieron cargar los productos.');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Error al cargar productos. Por favor, intenta de nuevo.');
      setProducts([]);
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

  // Update price range when products are loaded
  useEffect(() => {
    if (products.length > 0 && filters.priceRange[0] === 0 && filters.priceRange[1] === 1000) {
      setFilters(prevFilters => ({
        ...prevFilters,
        priceRange: filterOptions.priceRange,
      }));
    }
  }, [products, filterOptions.priceRange]);

  // const handleFiltersChange = (newFilters: any) => {
  //   setFilters(newFilters);
  // };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    const newPriceRange = filterOptions.priceRange;
    setFilters({
      category: '',
      brand: '',
      priceRange: newPriceRange,
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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.colors.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.rating > 0) count++;
    if (!filters.inStock) count++; // Not in stock is considered an active filter
    if (filters.onSale) count++;
    if (filters.featured) count++;
    if (filters.new) count++;
    if (filters.bestseller) count++;
    // Check if price range is different from default
    if (filters.priceRange[0] !== filterOptions.priceRange[0] || 
        filters.priceRange[1] !== filterOptions.priceRange[1]) count++;
    return count;
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
            {/* Enhanced Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar productos, marcas, categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition-all duration-200 hover:shadow-md"
              />
              
              {/* Search Icon */}
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-purple-500 text-lg">🔍</span>
              </div>
              
              {/* Clear Button */}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="text-lg">✕</span>
                </button>
              )}
              
              {/* Search Suggestions Hint */}
              {searchTerm.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-500 px-4">
                  Busca por nombre, descripción o marca
                </div>
              )}
            </div>

            {/* Enhanced Controls */}
            <div className="flex gap-3 items-center flex-wrap">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white shadow-sm hover:shadow-md transition-all appearance-none pr-8"
                >
                  <option value="name">📝 Nombre A-Z</option>
                  <option value="price-low">💰 Precio: Menor a Mayor</option>
                  <option value="price-high">💎 Precio: Mayor a Menor</option>
                  <option value="rating">⭐ Mejor Calificados</option>
                  <option value="newest">🆕 Más Nuevos</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <span className="text-gray-400">▼</span>
                </div>
              </div>

              {/* View Mode Buttons */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-purple-600 text-white shadow-inner' 
                      : 'bg-white text-gray-600 hover:bg-purple-50'
                  }`}
                  title="Vista en cuadrícula"
                >
                  <span className="text-lg">⊞</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 transition-all ${
                    viewMode === 'list' 
                      ? 'bg-purple-600 text-white shadow-inner' 
                      : 'bg-white text-gray-600 hover:bg-purple-50'
                  }`}
                  title="Vista en lista"
                >
                  <span className="text-lg">☰</span>
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg font-medium transition-all shadow-sm hover:shadow-md ${
                  showFilters
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-purple-600 border border-purple-200 hover:bg-purple-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  🎛️ Filtros
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </span>
              </button>

              {/* Quick Filter Buttons */}
              <div className="hidden lg:flex gap-2">
                {/* Sale Items */}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, onSale: !prev.onSale }))}
                  className={`px-3 py-2 rounded-full text-sm transition-all ${
                    filters.onSale
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  🏷️ Oferta
                </button>

                {/* New Items */}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, new: !prev.new }))}
                  className={`px-3 py-2 rounded-full text-sm transition-all ${
                    filters.new
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  � Nuevo
                </button>

                {/* Featured Items */}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, featured: !prev.featured }))}
                  className={`px-3 py-2 rounded-full text-sm transition-all ${
                    filters.featured
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  ⭐ Destacado
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Bar */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex items-center gap-2 flex-wrap p-4 bg-purple-50 rounded-lg border border-purple-200">
              <span className="text-sm font-medium text-purple-700">Filtros activos:</span>
              
              {/* Active Category */}
              {filters.category && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  📂 {filters.category}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                    className="ml-1 hover:text-purple-600"
                  >
                    ×
                  </button>
                </span>
              )}

              {/* Active Brand */}
              {filters.brand && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  🏷️ {filters.brand}
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, brand: '' }))}
                    className="ml-1 hover:text-purple-600"
                  >
                    ×
                  </button>
                </span>
              )}

              {/* Active Colors */}
              {filters.colors.map(color => (
                <span key={color} className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  🎨 {color}
                  <button
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      colors: prev.colors.filter(c => c !== color) 
                    }))}
                    className="ml-1 hover:text-purple-600"
                  >
                    ×
                  </button>
                </span>
              ))}

              {/* Active Sizes */}
              {filters.sizes.map(size => (
                <span key={size} className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  📏 {size}
                  <button
                    onClick={() => setFilters(prev => ({ 
                      ...prev, 
                      sizes: prev.sizes.filter(s => s !== size) 
                    }))}
                    className="ml-1 hover:text-purple-600"
                  >
                    ×
                  </button>
                </span>
              ))}

              {/* Active Special Filters */}
              {filters.onSale && (
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                  🏷️ En oferta
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, onSale: false }))}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.new && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  🆕 Nuevo
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, new: false }))}
                    className="ml-1 hover:text-green-600"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.featured && (
                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  ⭐ Destacado
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, featured: false }))}
                    className="ml-1 hover:text-yellow-600"
                  >
                    ×
                  </button>
                </span>
              )}

              {filters.bestseller && (
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                  🔥 Bestseller
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, bestseller: false }))}
                    className="ml-1 hover:text-orange-600"
                  >
                    ×
                  </button>
                </span>
              )}

              {/* Clear All Button */}
              <button
                onClick={clearFilters}
                className="ml-2 px-3 py-1 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition-colors"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <ProductFilters
                filters={filters}
                filterOptions={filterOptions}
                onFiltersChange={handleFiltersChange}
              />
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
