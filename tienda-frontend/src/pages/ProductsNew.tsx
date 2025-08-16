import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductQuickView from '../components/ProductQuickView';
import AdvancedSearch, { type SearchFilters } from '../components/AdvancedSearch';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  imageUrl: string;
  category: string;
  brand: string;
  colors: string[];
  sizes: string[];
  rating: number;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  isBestseller: boolean;
  averageRating: number;
  reviewCount: number;
  createdAt?: string;
  sku: string;
  isActive: boolean;
  tags: string[];
  compareAtPrice?: number;
  color?: string;
  size?: string;
}

interface SearchResult {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters: {
    categories: string[];
    brands: string[];
    colors: string[];
    sizes: string[];
    priceRange: { min: number; max: number };
  };
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [searchResult, setSearchResult] = useState<SearchResult>({
    data: [],
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
    filters: {
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      priceRange: { min: 0, max: 1000 }
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [comparisonItems, setComparisonItems] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data fallback
  const mockData: SearchResult = {
    data: [
      {
        id: 1,
        name: "Vestido Elegante Negro",
        description: "Vestido negro elegante perfecto para ocasiones especiales y eventos formales",
        price: 89.99,
        stock: 15,
        image: "https://images.unsplash.com/photo-1566479179817-05b6f6baefb8?w=400&h=500&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1566479179817-05b6f6baefb8?w=400&h=500&fit=crop",
        category: "vestidos",
        brand: "Elegance",
        colors: ["Negro"],
        sizes: ["S", "M", "L", "XL"],
        rating: 4.5,
        averageRating: 4.5,
        reviewCount: 23,
        isNew: true,
        isFeatured: false,
        isOnSale: false,
        isBestseller: false,
        sku: "VEN-001",
        isActive: true,
        tags: ["vestidos", "elegante", "formal"]
      },
      {
        id: 2,
        name: "Camisa Casual Blanca",
        description: "Camisa de algodón cómoda y fresca para el día a día",
        price: 45.50,
        stock: 25,
        image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=500&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=500&fit=crop",
        category: "camisas",
        brand: "Casual Co",
        colors: ["Blanco"],
        sizes: ["XS", "S", "M", "L", "XL"],
        rating: 4.2,
        averageRating: 4.2,
        reviewCount: 18,
        isNew: false,
        isFeatured: true,
        isOnSale: true,
        isBestseller: true,
        sku: "CAM-002",
        isActive: true,
        tags: ["camisas", "casual", "algodón"]
      },
      {
        id: 3,
        name: "Jeans Premium Azul",
        description: "Jeans de alta calidad con corte moderno y cómodo",
        price: 79.99,
        stock: 20,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
        category: "pantalones",
        brand: "Denim Pro",
        colors: ["Azul"],
        sizes: ["28", "30", "32", "34", "36"],
        rating: 4.7,
        averageRating: 4.7,
        reviewCount: 45,
        isNew: false,
        isFeatured: false,
        isOnSale: false,
        isBestseller: true,
        sku: "JEA-003",
        isActive: true,
        tags: ["jeans", "denim", "premium"]
      },
      {
        id: 4,
        name: "Chaqueta de Cuero",
        description: "Chaqueta de cuero genuino estilo motociclista",
        price: 199.99,
        stock: 8,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
        category: "chaquetas",
        brand: "Leather Works",
        colors: ["Negro", "Marrón"],
        sizes: ["S", "M", "L", "XL"],
        rating: 4.8,
        averageRating: 4.8,
        reviewCount: 12,
        isNew: true,
        isFeatured: true,
        isOnSale: false,
        isBestseller: false,
        sku: "CHA-004",
        isActive: true,
        tags: ["chaquetas", "cuero", "moto"]
      }
    ],
    total: 4,
    page: 1,
    limit: 20,
    totalPages: 1,
    filters: {
      categories: ["vestidos", "camisas", "pantalones", "chaquetas"],
      brands: ["Elegance", "Casual Co", "Denim Pro", "Leather Works"],
      colors: ["Negro", "Blanco", "Azul", "Marrón"],
      sizes: ["XS", "S", "M", "L", "XL", "28", "30", "32", "34", "36"],
      priceRange: { min: 45.50, max: 199.99 }
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);

      // Prepare search parameters
      const searchParams = new URLSearchParams();
      
      if (filters.search) searchParams.append('search', filters.search);
      if (filters.categories.length > 0) searchParams.append('categories', filters.categories.join(','));
      if (filters.brands.length > 0) searchParams.append('brands', filters.brands.join(','));
      if (filters.colors.length > 0) searchParams.append('colors', filters.colors.join(','));
      if (filters.sizes.length > 0) searchParams.append('sizes', filters.sizes.join(','));
      if (filters.minPrice) searchParams.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice) searchParams.append('maxPrice', filters.maxPrice.toString());
      if (filters.minRating) searchParams.append('minRating', filters.minRating.toString());
      if (filters.inStock) searchParams.append('inStock', 'true');
      if (filters.isFeatured) searchParams.append('isFeatured', 'true');
      if (filters.isNew) searchParams.append('isNew', 'true');
      if (filters.isBestseller) searchParams.append('isBestseller', 'true');
      searchParams.append('sortBy', filters.sortBy);
      searchParams.append('page', currentPage.toString());
      searchParams.append('limit', '20');

      console.log('🔍 Searching with params:', searchParams.toString());

      // Try to call the API
      try {
        const response = await fetch(`http://localhost:3002/products/search?${searchParams.toString()}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Search API response:', data);
          
          if (data && typeof data === 'object') {
            setSearchResult({
              data: data.data || [],
              total: data.total || 0,
              page: data.page || 1,
              limit: data.limit || 20,
              totalPages: data.totalPages || 0,
              filters: data.filters || mockData.filters
            });
          } else {
            throw new Error('Invalid API response format');
          }
        } else {
          throw new Error(`API responded with status: ${response.status}`);
        }
      } catch (apiError) {
        console.warn('🚨 API search failed, using mock data:', apiError);
        
        // Filter mock data based on search criteria
        let filteredData = [...mockData.data];
        
        if (filters.search) {
          filteredData = filteredData.filter(product =>
            product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.brand.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        if (filters.categories.length > 0) {
          filteredData = filteredData.filter(product => 
            filters.categories.some(cat => product.category.toLowerCase().includes(cat.toLowerCase()))
          );
        }
        
        if (filters.brands.length > 0) {
          filteredData = filteredData.filter(product => 
            filters.brands.some(brand => product.brand.toLowerCase().includes(brand.toLowerCase()))
          );
        }
        
        if (filters.minPrice && typeof filters.minPrice === 'number') {
          filteredData = filteredData.filter(product => product.price >= (filters.minPrice as number));
        }
        
        if (filters.maxPrice && typeof filters.maxPrice === 'number') {
          filteredData = filteredData.filter(product => product.price <= (filters.maxPrice as number));
        }
        
        if (filters.inStock) {
          filteredData = filteredData.filter(product => product.stock > 0);
        }
        
        if (filters.isFeatured) {
          filteredData = filteredData.filter(product => product.isFeatured);
        }
        
        if (filters.isNew) {
          filteredData = filteredData.filter(product => product.isNew);
        }
        
        if (filters.isBestseller) {
          filteredData = filteredData.filter(product => product.isBestseller);
        }

        setSearchResult({
          ...mockData,
          data: filteredData,
          total: filteredData.length
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Error en la búsqueda. Mostrando datos de ejemplo.');
      setSearchResult(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    const initialFilters: SearchFilters = {
      search: '',
      categories: [],
      brands: [],
      colors: [],
      sizes: [],
      minPrice: '',
      maxPrice: '',
      minRating: '',
      inStock: false,
      isFeatured: false,
      isNew: false,
      isBestseller: false,
      sortBy: 'created_desc'
    };
    
    handleSearch(initialFilters);
  }, []);

  const handleAddToComparison = (product: Product) => {
    if (comparisonItems.length < 3 && !comparisonItems.find(item => item.id === product.id)) {
      setComparisonItems([...comparisonItems, product]);
    }
  };

  const handleRemoveFromComparison = (productId: number) => {
    setComparisonItems(comparisonItems.filter(item => item.id !== productId));
  };

  // Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (searchResult.totalPages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(searchResult.totalPages, startPage + maxPagesToShow - 1);

    // Previous button
    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          ←
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-md ${
            i === currentPage
              ? 'bg-purple-600 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    if (currentPage < searchResult.totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          →
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        {pages}
      </div>
    );
  };

  if (loading && searchResult.data.length === 0) {
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

        {/* Advanced Search Component */}
        <div className="mb-8">
          <AdvancedSearch
            onSearch={handleSearch}
            availableFilters={searchResult.filters}
            isLoading={loading}
            resultCount={searchResult.total}
          />
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          {searchResult.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {searchResult.data.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={() => setQuickViewProduct(product)}
                  onAddToComparison={() => handleAddToComparison(product)}
                  isInComparison={comparisonItems.some(item => item.id === product.id)}
                  viewMode="grid"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-6">
                Intenta cambiar los filtros o el término de búsqueda
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {renderPagination()}

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
                onClick={() => setShowComparison(true)}
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
                          <td key={product.id} className="text-center p-4 capitalize">{product.category}</td>
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
                              <span>{product.averageRating || 'N/A'}</span>
                              <span className="text-gray-500 text-sm">({product.reviewCount || 0})</span>
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
