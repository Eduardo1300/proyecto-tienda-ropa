import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import axios from 'axios';

interface DashboardMetrics {
  totalPageViews: number;
  uniqueVisitors: number;
  totalPurchases: number;
  totalRevenue: number;
  conversionRate: number;
  topProducts: any[];
  topPages: any[];
  userRegistrations: number;
  averageOrderValue: number;
}

interface RevenueData {
  date: string;
  revenue: number;
  orders: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (user?.role === 'admin') {
      loadAnalytics();
    }
  }, [user, dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || localStorage.getItem('access_token');
      
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        default:
          startDate.setDate(endDate.getDate() - 7);
      }

      // Cargar métricas del dashboard
      const metricsResponse = await axios.get('/api/analytics/dashboard', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setMetrics(metricsResponse.data);

      // Cargar datos de ingresos por día
      const revenueResponse = await axios.get('/api/analytics/revenue-by-day', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRevenueData(revenueResponse.data);

    } catch (error) {
      console.error('Error loading analytics:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Error al cargar datos de analytics',
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Acceso Restringido
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Solo los administradores pueden ver el dashboard de analytics
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando analytics...</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            📊 Dashboard de Analytics
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Métricas y estadísticas de tu tienda
          </p>
        </div>
        
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
          <option value="90d">Últimos 90 días</option>
        </select>
      </div>

      {metrics && (
        <>
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <span className="text-white text-xl">👁️</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Vistas de Página
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatNumber(metrics.totalPageViews)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-500 rounded-lg">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Visitantes Únicos
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatNumber(metrics.uniqueVisitors)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <span className="text-white text-xl">🛒</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Compras Totales
                  </p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {formatNumber(metrics.totalPurchases)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-6 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <span className="text-white text-xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    Ingresos Totales
                  </p>
                  <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                    {formatCurrency(metrics.totalRevenue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas secundarias */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                📈 Tasa de Conversión
              </h3>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {metrics.conversionRate.toFixed(2)}%
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                🛍️ Valor Promedio de Orden
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(metrics.averageOrderValue)}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                👤 Nuevos Registros
              </h3>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(metrics.userRegistrations)}
              </p>
            </div>
          </div>

          {/* Gráfico de ingresos */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📊 Ingresos por Día
            </h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              {revenueData.length > 0 ? (
                <div className="space-y-2">
                  {revenueData.map((day, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(day.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">
                          {formatCurrency(day.revenue)}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({day.orders} órdenes)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                  No hay datos de ingresos para mostrar
                </p>
              )}
            </div>
          </div>

          {/* Top productos y páginas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🏆 Productos Más Vistos
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                {metrics.topProducts.length > 0 ? (
                  <div className="space-y-3">
                    {metrics.topProducts.slice(0, 5).map((product, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-900 dark:text-white">
                          Producto #{product.productId}
                        </span>
                        <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                          {formatNumber(product.views)} vistas
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No hay datos de productos para mostrar
                  </p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📄 Páginas Más Visitadas
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                {metrics.topPages.length > 0 ? (
                  <div className="space-y-3">
                    {metrics.topPages.slice(0, 5).map((page, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-900 dark:text-white truncate">
                          {page.page || 'Página desconocida'}
                        </span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {formatNumber(page.views)} vistas
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No hay datos de páginas para mostrar
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
