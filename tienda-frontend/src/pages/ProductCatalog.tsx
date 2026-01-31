import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import ProductQuickView from '../components/ProductQuickView';
import ProductComparison from '../components/ProductComparison';
import { Button, Card, Badge } from '../components/ui';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <Badge variant="primary" size="lg" className="mb-4 inline-block backdrop-blur-md">
          🛍️ Catálogo Completo
        </Badge>
        <h1 className="text-5xl font-black text-white mb-4">
          Descubre Nuestra
          <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Colección Premium
          </span>
        </h1>
        <p className="text-gray-300 text-lg">Encuentra las mejores tendencias de moda para ti</p>
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
              className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-purple-200/70 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-xl">🔍</span>
            </div>
          </div>
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center space-x-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-sm"
          >
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
            <option value="rating">Calificación</option>
            <option value="reviews">Reseñas</option>
            <option value="newest">Más Nuevo</option>
          </select>

          <Button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>

          <div className="flex border border-white/30 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 ${viewMode === 'grid' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 ${viewMode === 'list' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className="w-64 flex-shrink-0">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 p-6 sticky top-4">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              🔍 Filtros
            </h3>
            <ProductFilters
              filters={filters}
              filterOptions={filterOptions}
              onFiltersChange={setFilters}
            />
          </Card>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1">
          {/* Results Info */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-300">
              Mostrando {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} de {filteredProducts.length} productos
            </p>
            
            {/* Comparison Bar */}
            {comparisonProducts.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-purple-200">
                  Comparar ({comparisonProducts.length}/4):
                </span>
                {comparisonProducts.map(product => (
                  <div key={product.id} className="flex items-center bg-purple-600/30 rounded-full px-3 py-1 border border-purple-400/30">
                    <span className="text-xs text-white mr-1">{product.name.substring(0, 10)}...</span>
                    <button
                      onClick={() => removeFromComparison(product.id)}
                      className="text-purple-200 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <Button
                  onClick={() => setShowComparison(true)}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Comparar
                </Button>
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
            <Card className="text-center py-16 bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-8xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">No se encontraron productos</h3>
              <p className="text-gray-300 mb-6">Intenta ajustar los filtros de búsqueda</p>
              <Button variant="outline" icon="🔄" className="text-white border-white/30 hover:bg-white/10">
                Limpiar Filtros
              </Button>
            </Card>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex space-x-2">
                <Button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  ← Anterior
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      variant={currentPage === pageNumber ? "primary" : "outline"}
                      className={currentPage === pageNumber ? "bg-gradient-to-r from-purple-600 to-pink-600" : "border-white/30 text-white hover:bg-white/10"}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                
                <Button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Siguiente →
                </Button>
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
