import React, { useState, useMemo } from 'react';

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
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    brand: true,
    price: true,
    colors: false,
    sizes: false,
    rating: false,
    special: false,
  });
  const [categorySearch, setCategorySearch] = useState('');
  const [brandSearch, setBrandSearch] = useState('');
  
  // Memoized filtered options for better performance
  const filteredCategories = useMemo(() => {
    return filterOptions.categories.filter(category =>
      category.toLowerCase().includes(categorySearch.toLowerCase())
    );
  }, [filterOptions.categories, categorySearch]);

  const filteredBrands = useMemo(() => {
    return filterOptions.brands.filter(brand =>
      brand.toLowerCase().includes(brandSearch.toLowerCase())
    );
  }, [filterOptions.brands, brandSearch]);

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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
    setCategorySearch('');
    setBrandSearch('');
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

  const hasCustomPriceRange = () => {
    return filters.priceRange[0] !== filterOptions.priceRange[0] || 
           filters.priceRange[1] !== filterOptions.priceRange[1];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent p-4">
        <div className="flex items-center justify-between text-white">
          <h3 className="text-lg font-semibold flex items-center">
            🔍 Filtros
            {getActiveFiltersCount() > 0 && (
              <span className="ml-2 bg-white text-primary text-sm px-2 py-1 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </h3>
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
            >
              Limpiar Todo
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Category Filter with Search */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('category')}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 hover:text-primary transition-colors"
          >
            <span className="flex items-center">
              📂 Categoría {filters.category &&               <span className="ml-1 text-primary">✓</span>}
            </span>
            <span className="text-gray-400 dark:text-gray-500">{expandedSections.category ? '−' : '+'}</span>
          </button>
          
          {expandedSections.category && (
            <div className="space-y-2">
              {filterOptions.categories.length > 5 && (
                <input
                  type="text"
                  placeholder="Buscar categoría..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                />
              )}
              <div className="max-h-32 overflow-y-auto">
                <div className="space-y-1">
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={filters.category === ''}
                      onChange={() => updateFilter('category', '')}
                      className="mr-2 text-primary"
                    />
                    <span className="text-gray-600 dark:text-gray-300">Todas las categorías</span>
                  </label>
                  {filteredCategories.map((category) => (
                    <label key={category} className="flex items-center text-sm">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={filters.category === category}
                        onChange={() => updateFilter('category', category)}
                        className="mr-2 text-primary"
                      />
                      <span className="capitalize text-gray-700 dark:text-gray-200">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brand Filter with Search */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('brand')}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 hover:text-primary transition-colors"
          >
            <span className="flex items-center">
              🏷️ Marca {filters.brand &&               <span className="ml-1 text-primary">✓</span>}
            </span>
            <span className="text-gray-400 dark:text-gray-500">{expandedSections.brand ? '−' : '+'}</span>
          </button>
          
          {expandedSections.brand && (
            <div className="space-y-2">
              {filterOptions.brands.length > 5 && (
                <input
                  type="text"
                  placeholder="Buscar marca..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                />
              )}
              <div className="max-h-32 overflow-y-auto">
                <div className="space-y-1">
                  <label className="flex items-center text-sm">
                    <input
                      type="radio"
                      name="brand"
                      value=""
                      checked={filters.brand === ''}
                      onChange={() => updateFilter('brand', '')}
                      className="mr-2 text-primary"
                    />
                    <span className="text-gray-600 dark:text-gray-300">Todas las marcas</span>
                  </label>
                  {filteredBrands.map((brand) => (
                    <label key={brand} className="flex items-center text-sm">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={filters.brand === brand}
                        onChange={() => updateFilter('brand', brand)}
                        className="mr-2 text-primary"
                      />
                      <span className="text-gray-700 dark:text-gray-200">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 hover:text-primary transition-colors"
          >
            <span className="flex items-center">
              💰 Precio {hasCustomPriceRange() &&               <span className="ml-1 text-primary">✓</span>}
            </span>
            <span className="text-gray-400 dark:text-gray-500">{expandedSections.price ? '−' : '+'}</span>
          </button>
          
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-primary">${filters.priceRange[0]}</span>
                <span className="text-gray-400 dark:text-gray-500">-</span>
                <span className="font-semibold text-primary">${filters.priceRange[1]}</span>
              </div>
              
              {/* Dual Range Slider */}
              <div className="relative">
                <input
                  type="range"
                  min={filterOptions.priceRange[0]}
                  max={filterOptions.priceRange[1]}
                  value={filters.priceRange[0]}
                  onChange={(e) => updateFilter('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                  className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="range"
                  min={filterOptions.priceRange[0]}
                  max={filterOptions.priceRange[1]}
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                  className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              {/* Quick Price Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Menos de $50', max: 50 },
                  { label: '$50 - $100', min: 50, max: 100 },
                  { label: '$100 - $200', min: 100, max: 200 },
                  { label: 'Más de $200', min: 200 },
                ].map((range, index) => (
                  <button
                    key={index}
                    onClick={() => updateFilter('priceRange', [range.min || filterOptions.priceRange[0], range.max || filterOptions.priceRange[1]])}
                    className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs hover:bg-primary-light/10 hover:border-primary-light dark:hover:bg-primary-dark/10 transition-colors text-gray-700 dark:text-gray-200"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colors Filter */}
        {filterOptions.colors.length > 0 && (
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('colors')}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 hover:text-primary transition-colors"
            >
              <span className="flex items-center">
                🎨 Colores {filters.colors.length > 0 && <span className="ml-1 text-primary">({filters.colors.length})</span>}
              </span>
              <span className="text-gray-400 dark:text-gray-500">{expandedSections.colors ? '−' : '+'}</span>
            </button>
            
            {expandedSections.colors && (
              <div className="grid grid-cols-2 gap-2">
                {filterOptions.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleArrayFilter('colors', color)}
                    className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                      filters.colors.includes(color)
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-primary-light hover:bg-primary-light/10 dark:hover:bg-primary-dark/10'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sizes Filter */}
        {filterOptions.sizes.length > 0 && (
          <div className="border-b pb-4">
            <button
              onClick={() => toggleSection('sizes')}
              className="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 hover:text-primary transition-colors"
            >
              <span className="flex items-center">
                📏 Tallas {filters.sizes.length > 0 && <span className="ml-1 text-primary">({filters.sizes.length})</span>}
              </span>
              <span className="text-gray-400 dark:text-gray-500">{expandedSections.sizes ? '−' : '+'}</span>
            </button>
            
            {expandedSections.sizes && (
              <div className="grid grid-cols-3 gap-2">
                {filterOptions.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleArrayFilter('sizes', size)}
                    className={`px-2 py-2 rounded-md text-sm border transition-all font-medium ${
                      filters.sizes.includes(size)
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-primary-light hover:bg-primary-light/10 dark:hover:bg-primary-dark/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Rating Filter */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('rating')}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 hover:text-primary transition-colors"
          >
            <span className="flex items-center">
              ⭐ Calificación {filters.rating > 0 &&               <span className="ml-1 text-primary">✓</span>}
            </span>
            <span className="text-gray-400 dark:text-gray-500">{expandedSections.rating ? '−' : '+'}</span>
          </button>
          
          {expandedSections.rating && (
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                  <input
                    type="radio"
                    name="rating"
                    value={rating}
                    checked={filters.rating === rating}
                    onChange={(e) => updateFilter('rating', parseInt(e.target.value))}
                    className="mr-3 text-primary"
                  />
                  <div className="flex items-center">
                    {Array.from({ length: rating }, (_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                    {Array.from({ length: 5 - rating }, (_, i) => (
                      <span key={i} className="text-gray-300 text-sm">☆</span>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">y más</span>
                  </div>
                </label>
              ))}
              <label className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded">
                <input
                  type="radio"
                  name="rating"
                  value={0}
                  checked={filters.rating === 0}
                  onChange={(e) => updateFilter('rating', parseInt(e.target.value))}
                  className="mr-3 text-primary"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">Todas las calificaciones</span>
              </label>
            </div>
          )}
        </div>

        {/* Special Filters */}
        <div>
          <button
            onClick={() => toggleSection('special')}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 hover:text-primary transition-colors"
          >
            <span className="flex items-center">
              🏆 Especiales
              {(filters.onSale || filters.featured || filters.new || filters.bestseller || !filters.inStock) && 
                              <span className="ml-1 text-primary">✓</span>
              }
            </span>
            <span className="text-gray-400 dark:text-gray-500">{expandedSections.special ? '−' : '+'}</span>
          </button>
          
          {expandedSections.special && (
            <div className="space-y-2">
              {[
                { key: 'inStock', label: '📦 Solo en stock', checked: filters.inStock },
                { key: 'onSale', label: '🏷️ En oferta', checked: filters.onSale },
                { key: 'featured', label: '⭐ Destacados', checked: filters.featured },
                { key: 'new', label: '🆕 Nuevos', checked: filters.new },
                { key: 'bestseller', label: '🔥 Bestsellers', checked: filters.bestseller },
              ].map((filter) => (
                <label key={filter.key} className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={filter.checked}
                    onChange={(e) => updateFilter(filter.key as keyof Filters, e.target.checked)}
                    className="mr-3 text-primary rounded"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200">{filter.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;