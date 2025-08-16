import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import type { ProductStat } from '../../types/admin.types';

interface ProductsStatsProps {
  data: ProductStat[];
  onLoadData: (data: ProductStat[]) => void;
}

export const ProductsStats: React.FC<ProductsStatsProps> = ({ data, onLoadData }) => {
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'sales' | 'revenue' | 'views'>('revenue');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    loadProductsData();
  }, []);

  const loadProductsData = async () => {
    setLoading(true);
    try {
      // Cargar datos reales de la API
      const products = await adminApi.getProductsStats(20);
      onLoadData(products);
    } catch (error) {
      console.error('Error loading products data:', error);
      
      // Fallback a datos mock si falla la API
      const mockProducts: ProductStat[] = [
        {
          id: 1,
          name: 'Camiseta Premium Algodón',
          category: 'Ropa',
          sales: 245,
          revenue: 12250.00,
          stock: 45,
          views: 1580,
          rating: 4.8,
          image: '/api/placeholder/60/60',
          trend: 'up',
          trendPercent: 15.3
        },
        {
          id: 2,
          name: 'Zapatillas Deportivas Running',
          category: 'Zapatos',
          sales: 189,
          revenue: 18900.00,
          stock: 23,
          views: 2340,
          rating: 4.6,
          image: '/api/placeholder/60/60',
          trend: 'up',
          trendPercent: 22.1
        },
        {
          id: 3,
          name: 'Jeans Slim Fit',
          category: 'Pantalones',
          sales: 156,
          revenue: 9360.00,
          stock: 78,
          views: 980,
          rating: 4.4,
          image: '/api/placeholder/60/60',
          trend: 'down',
          trendPercent: -3.2
        }
      ];

      onLoadData(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(data.map(p => p.category || 'Sin categoría')))];
  
  const filteredData = data
    .filter(product => filterCategory === 'all' || (product.category || 'Sin categoría') === filterCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'sales':
          return b.sales - a.sales;
        case 'revenue':
          return b.revenue - a.revenue;
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0);
  const totalSales = data.reduce((sum, p) => sum + p.sales, 0);
  const lowStockProducts = data.filter(p => p.stock < 20).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Revenue Total</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="text-blue-200 text-xs">+18.2% vs mes anterior</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Unidades Vendidas</p>
              <p className="text-2xl font-bold">{totalSales.toLocaleString()}</p>
              <p className="text-green-200 text-xs">+12.5% vs mes anterior</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Productos Activos</p>
              <p className="text-2xl font-bold">{data.length}</p>
              <p className="text-purple-200 text-xs">+3 nuevos este mes</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Stock Bajo</p>
              <p className="text-2xl font-bold">{lowStockProducts}</p>
              <p className="text-red-200 text-xs">Requieren reposición</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">📊 Top Productos</h3>
            <p className="text-gray-600">Rendimiento de productos por categoría</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'sales' | 'revenue' | 'views')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="revenue">Ordenar por Revenue</option>
              <option value="sales">Ordenar por Ventas</option>
              <option value="views">Ordenar por Visualizaciones</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las Categorías' : category}
                </option>
              ))}
            </select>
            
            <button
              onClick={loadProductsData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ventas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vistas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    {product.category && (
                      <div className="text-sm text-gray-500">{product.category}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold">{product.sales.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">unidades</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold">${product.revenue.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className={`font-semibold ${product.stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </div>
                    {product.stock < 20 && (
                      <div className="text-xs text-red-500">Stock bajo</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.views.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
