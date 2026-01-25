import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import ProductQuickView from '../components/ProductQuickView';
import ProductComparison from '../components/ProductComparison';

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
  variants?: ProductVariant[];
  images?: ProductImage[];
}

interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  color?: string;
  size?: string;
  material?: string;
  stock: number;
  isDefault: boolean;
}

interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  isMain: boolean;
  type: string;
}

interface Filters {
  category: string;
  brand: string;
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  rating: number;
  inStock: boolean;
  onSale: boolean;
  featured: boolean;
  new: boolean;
  bestseller: boolean;
}

const ProductCatalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  
  // Filters
  const [filters, setFilters] = useState<Filters>({
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

  // Available filter options
  const [filterOptions, setFilterOptions] = useState({
    categories: [] as string[],
    brands: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    priceRange: [0, 1000] as [number, number],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters, searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      const productsData = response.data;
      setProducts(productsData);
      
      // Extract filter options
      const categories = [...new Set(productsData.map((p: Product) => p.category))];
      const brands = [...new Set(products.map((p: Product) => p.brand).filter(Boolean))] as string[];
      const colors = [...new Set(products.map((p: Product) => p.color).filter(Boolean))] as string[];
      const sizes = [...new Set(products.map((p: Product) => p.size).filter(Boolean))] as string[];
      const prices = productsData.map((p: Product) => p.price);
      const priceRange: [number, number] = [Math.min(...prices), Math.max(...prices)];
      
      setFilterOptions({ categories: categories as string[], brands, colors, sizes, priceRange });
      setFilters(prev => ({ ...prev, priceRange }));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = products.filter(product => {
      // Search query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.brand?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.category && product.category !== filters.category) return false;

      // Brand filter
      if (filters.brand && product.brand !== filters.brand) return false;

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) return false;

      // Color filter
      if (filters.colors.length > 0 && (!product.color || !filters.colors.includes(product.color))) return false;

      // Size filter
      if (filters.sizes.length > 0 && (!product.size || !filters.sizes.includes(product.size))) return false;

      // Rating filter
      if (filters.rating > 0 && product.averageRating < filters.rating) return false;

      // Stock filter
      if (filters.inStock && product.stock <= 0) return false;

      // Sale filter
      if (filters.onSale && !product.compareAtPrice) return false;

      // Featured filter
      if (filters.featured && !product.isFeatured) return false;

      // New filter
      if (filters.new && !product.isNew) return false;

      // Bestseller filter
      if (filters.bestseller && !product.isBestseller) return false;

      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.averageRating;
          bValue = b.averageRating;
          break;
        case 'reviews':
          aValue = a.reviewCount;
          bValue = b.reviewCount;
          break;
        case 'newest':
          aValue = new Date((a as any).createdAt || 0);
          bValue = new Date((b as any).createdAt || 0);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const addToComparison = (product: Product) => {
    if (comparisonProducts.length >= 4) {
      alert('Máximo 4 productos para comparar');
      return;
    }
    
    if (!comparisonProducts.find(p => p.id === product.id)) {
      setComparisonProducts([...comparisonProducts, product]);
    }
  };

  const removeFromComparison = (productId: number) => {
    setComparisonProducts(comparisonProducts.filter(p => p.id !== productId));
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🛍️ Catálogo de Productos</h1>
        <p className="text-gray-600 mt-2">Descubre nuestra colección completa</p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
            <option value="rating">Calificación</option>
            <option value="reviews">Reseñas</option>
            <option value="newest">Más Nuevo</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>

          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <ProductFilters
            filters={filters}
            filterOptions={filterOptions}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Products Grid/List */}
        <div className="flex-1">
          {/* Results Info */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} de {filteredProducts.length} productos
            </p>
            
            {/* Comparison Bar */}
            {comparisonProducts.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Comparar ({comparisonProducts.length}/4):
                </span>
                {comparisonProducts.map(product => (
                  <div key={product.id} className="flex items-center bg-blue-100 rounded-full px-2 py-1">
                    <span className="text-xs text-blue-800 mr-1">{product.name.substring(0, 10)}...</span>
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => setShowComparison(true)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                >
                  Comparar
                </button>
              </div>
            )}
          </div>

          {/* Products */}
          {currentProducts.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }>
              {currentProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                  onQuickView={() => setQuickViewProduct(product)}
                  onAddToComparison={() => addToComparison(product)}
                  isInComparison={comparisonProducts.some(p => p.id === product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron productos</p>
              <p className="text-gray-400 mt-2">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Anterior
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-3 py-2 border rounded-md ${
                        currentPage === pageNumber
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Siguiente
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Comparison Modal */}
      {showComparison && comparisonProducts.length > 0 && (
        <ProductComparison
          products={comparisonProducts}
          onClose={() => setShowComparison(false)}
          onRemoveProduct={removeFromComparison}
        />
      )}
    </div>
  );
};

export default ProductCatalog;
