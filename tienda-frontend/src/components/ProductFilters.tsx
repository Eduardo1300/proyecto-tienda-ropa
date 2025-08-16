import React from 'react';

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

interface FilterOptions {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: [number, number];
}

interface ProductFiltersProps {
  filters: Filters;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: Filters) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  filterOptions,
  onFiltersChange,
}) => {
  const updateFilter = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const toggleArrayFilter = (key: 'colors' | 'sizes', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: '',
      brand: '',
      priceRange: filterOptions.priceRange,
      colors: [],
      sizes: [],
      rating: 0,
      inStock: true,
      onSale: false,
      featured: false,
      new: false,
      bestseller: false,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category) count++;
    if (filters.brand) count++;
    if (filters.colors.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.rating > 0) count++;
    if (filters.onSale) count++;
    if (filters.featured) count++;
    if (filters.new) count++;
    if (filters.bestseller) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">🔍 Filtros</h3>
        {getActiveFiltersCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Limpiar ({getActiveFiltersCount()})
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📂 Categoría
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las categorías</option>
            {filterOptions.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🏷️ Marca
          </label>
          <select
            value={filters.brand}
            onChange={(e) => updateFilter('brand', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todas las marcas</option>
            {filterOptions.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💰 Rango de Precio
          </label>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
            <input
              type="range"
              min={filterOptions.priceRange[0]}
              max={filterOptions.priceRange[1]}
              value={filters.priceRange[1]}
              onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 1000])}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Colors Filter */}
        {filterOptions.colors.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎨 Colores
            </label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleArrayFilter('colors', color)}
                  className={`px-3 py-1 rounded-full text-sm border ${
                    filters.colors.includes(color)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sizes Filter */}
        {filterOptions.sizes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📏 Tallas
            </label>
            <div className="flex flex-wrap gap-2">
              {filterOptions.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleArrayFilter('sizes', size)}
                  className={`px-3 py-1 rounded-md text-sm border ${
                    filters.sizes.includes(size)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⭐ Calificación Mínima
          </label>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating} className="flex items-center">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={(e) => updateFilter('rating', parseInt(e.target.value))}
                  className="mr-2"
                />
                <div className="flex items-center">
                  {Array.from({ length: rating }, (_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                  {Array.from({ length: 5 - rating }, (_, i) => (
                    <span key={i} className="text-gray-300">☆</span>
                  ))}
                  <span className="ml-1 text-sm text-gray-600">y más</span>
                </div>
              </label>
            ))}
            <label className="flex items-center">
              <input
                type="radio"
                name="rating"
                value={0}
                checked={filters.rating === 0}
                onChange={(e) => updateFilter('rating', parseInt(e.target.value))}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">Todas las calificaciones</span>
            </label>
          </div>
        </div>

        {/* Special Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            🏆 Especiales
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => updateFilter('inStock', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Solo en stock</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={(e) => updateFilter('onSale', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">🏷️ En oferta</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={(e) => updateFilter('featured', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">⭐ Destacados</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.new}
                onChange={(e) => updateFilter('new', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">🆕 Nuevos</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.bestseller}
                onChange={(e) => updateFilter('bestseller', e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">🔥 Bestsellers</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
