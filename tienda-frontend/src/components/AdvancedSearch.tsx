import React, { useState, useEffect, useMemo } from 'react';
// import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface SearchFilters {
  search: string;
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  minPrice: number | '';
  maxPrice: number | '';
  minRating: number | '';
  inStock: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  sortBy: string;
}

interface AvailableFilters {
  categories: string[];
  brands: string[];
  colors: string[];
  sizes: string[];
  priceRange: { min: number; max: number };
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  availableFilters: AvailableFilters;
  isLoading: boolean;
  resultCount: number;
}

const SORT_OPTIONS = [
  { value: 'created_desc', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name_asc', label: 'Nombre: A-Z' },
  { value: 'name_desc', label: 'Nombre: Z-A' },
  { value: 'rating', label: 'Mejor valorados' },
  { value: 'popularity', label: 'Más populares' },
];

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  availableFilters,
  isLoading,
  resultCount
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
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
  });

  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true,
    brands: false,
    colors: false,
    sizes: false,
    price: false,
    features: false
  });

  // Debounced search
  const debouncedSearch = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (searchFilters: SearchFilters) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onSearch(searchFilters);
      }, 300);
    };
  }, [onSearch]);

  useEffect(() => {
    debouncedSearch(filters);
  }, [filters, debouncedSearch]);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key: 'categories' | 'brands' | 'colors' | 'sizes', value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
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
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    count += filters.categories.length;
    count += filters.brands.length;
    count += filters.colors.length;
    count += filters.sizes.length;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.minRating) count++;
    if (filters.inStock) count++;
    if (filters.isFeatured) count++;
    if (filters.isNew) count++;
    if (filters.isBestseller) count++;
    return count;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ 
    title, 
    sectionKey, 
    children 
  }: { 
    title: string; 
    sectionKey: string; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-gray-200 pb-4">
      <button
        className="flex w-full items-center justify-between text-left"
        onClick={() => toggleSection(sectionKey)}
      >
        <span className="font-medium text-gray-900">{title}</span>
        <span className={`text-gray-400 transform transition-transform ${
            expandedSections[sectionKey] ? 'rotate-180' : ''
          }`}>▼</span>
      </button>
      {expandedSections[sectionKey] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxFilter = ({ 
    options, 
    selectedValues, 
    onChange 
  }: { 
    options: string[]; 
    selectedValues: string[]; 
    onChange: (value: string) => void;
  }) => (
    <>
      {options.map((option) => (
        <label key={option} className="flex items-center">
          <input
            type="checkbox"
            checked={selectedValues.includes(option)}
            onChange={() => onChange(option)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-600 capitalize">{option}</span>
        </label>
      ))}
    </>
  );

  return (
    <div className="bg-white">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-400">🔍</span>
        </div>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Buscar productos..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Filter Toggle & Sort */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Filtros
          {getActiveFiltersCount() > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {isLoading ? 'Buscando...' : `${resultCount} productos`}
          </span>
          
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Filtros activos:</span>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Limpiar todos
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <span className="text-xs">×</span>
                </button>
              </span>
            )}
            {[...filters.categories, ...filters.brands, ...filters.colors, ...filters.sizes].map((filter) => (
              <span key={filter} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                {filter}
                <button
                  onClick={() => {
                    if (filters.categories.includes(filter)) toggleArrayFilter('categories', filter);
                    if (filters.brands.includes(filter)) toggleArrayFilter('brands', filter);
                    if (filters.colors.includes(filter)) toggleArrayFilter('colors', filter);
                    if (filters.sizes.includes(filter)) toggleArrayFilter('sizes', filter);
                  }}
                  className="ml-1 text-gray-600 hover:text-gray-800"
                >
                  <span className="text-xs">×</span>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Categories */}
            {availableFilters.categories.length > 0 && (
              <FilterSection title="Categorías" sectionKey="categories">
                <CheckboxFilter
                  options={availableFilters.categories}
                  selectedValues={filters.categories}
                  onChange={(value) => toggleArrayFilter('categories', value)}
                />
              </FilterSection>
            )}

            {/* Brands */}
            {availableFilters.brands.length > 0 && (
              <FilterSection title="Marcas" sectionKey="brands">
                <CheckboxFilter
                  options={availableFilters.brands}
                  selectedValues={filters.brands}
                  onChange={(value) => toggleArrayFilter('brands', value)}
                />
              </FilterSection>
            )}

            {/* Colors */}
            {availableFilters.colors.length > 0 && (
              <FilterSection title="Colores" sectionKey="colors">
                <CheckboxFilter
                  options={availableFilters.colors}
                  selectedValues={filters.colors}
                  onChange={(value) => toggleArrayFilter('colors', value)}
                />
              </FilterSection>
            )}

            {/* Sizes */}
            {availableFilters.sizes.length > 0 && (
              <FilterSection title="Tallas" sectionKey="sizes">
                <CheckboxFilter
                  options={availableFilters.sizes}
                  selectedValues={filters.sizes}
                  onChange={(value) => toggleArrayFilter('sizes', value)}
                />
              </FilterSection>
            )}

            {/* Price Range */}
            <FilterSection title="Rango de precios" sectionKey="price">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : '')}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : '')}
                    className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                {availableFilters.priceRange && (
                  <p className="text-xs text-gray-500">
                    Rango disponible: ${availableFilters.priceRange.min} - ${availableFilters.priceRange.max}
                  </p>
                )}
              </div>
            </FilterSection>

            {/* Features */}
            <FilterSection title="Características" sectionKey="features">
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">En stock</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isFeatured}
                    onChange={(e) => handleFilterChange('isFeatured', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Destacados</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isNew}
                    onChange={(e) => handleFilterChange('isNew', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Nuevos</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isBestseller}
                    onChange={(e) => handleFilterChange('isBestseller', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Más vendidos</span>
                </label>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Calificación mínima
                  </label>
                  <select
                    value={filters.minRating}
                    onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Cualquiera</option>
                    <option value="4">4+ estrellas</option>
                    <option value="3">3+ estrellas</option>
                    <option value="2">2+ estrellas</option>
                    <option value="1">1+ estrellas</option>
                  </select>
                </div>
              </div>
            </FilterSection>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
