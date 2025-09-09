import React, { useState } from 'react';
import { useAnalyticsDashboard, useUserActivity } from '../hooks/useAnalytics';
import { Card, Badge } from '../components/ui';
import PageTransition from '../components/PageTransition';

interface DateRange {
  startDate: string;
  endDate: string;
}

const AnalyticsDashboard: React.FC = () => {
  // const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { dashboard, isLoading: dashboardLoading, error: dashboardError } = useAnalyticsDashboard(dateRange);
  const { userData } = useUserActivity(dateRange);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  if (dashboardError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 text-lg font-semibold">Error al cargar analytics</h2>
          <p className="text-red-600">{dashboardError}</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Análisis detallado del rendimiento de la tienda
          </p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">a</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      {dashboardLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-animation">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse p-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Ingresos Totales</h3>
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboard?.overview.totalRevenue || 0)}
                </div>
                <p className="text-xs text-gray-500">
                  {dashboard?.overview.totalPurchases || 0} órdenes
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Visitantes Únicos</h3>
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {dashboard?.overview.uniqueVisitors?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-gray-500">
                  {dashboard?.overview.totalPageViews?.toLocaleString() || 0} vistas
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Tasa de Conversión</h3>
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatPercentage(dashboard?.overview.conversionRate || 0)}
                </div>
                <p className="text-xs text-gray-500">
                  de visitantes a compradores
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium">Valor Promedio de Orden</h3>
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L12 18m-2.5 0h7" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(dashboard?.overview.averageOrderValue || 0)}
                </div>
                <p className="text-xs text-gray-500">
                  promedio por compra
                </p>
              </div>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Ingresos por Día</h2>
                <p className="text-sm text-gray-600">Evolución de ingresos en el período seleccionado</p>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {dashboard?.revenue && dashboard.revenue.length > 0 ? (
                  dashboard.revenue.map((day, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">
                        {new Date(day.date).toLocaleDateString('es-ES')}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">
                          {formatCurrency(day.revenue)}
                        </span>
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          {day.orders} órdenes
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No hay datos de ingresos disponibles
                  </p>
                )}
              </div>
            </Card>

            {/* Top Products */}
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Productos Top por Ingresos</h2>
                <p className="text-sm text-gray-600">Productos que más ingresos han generado</p>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {dashboard?.topProducts && dashboard.topProducts.length > 0 ? (
                  dashboard.topProducts.map((product, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <span className="text-sm font-medium">
                          Producto #{product.productId}
                        </span>
                        <p className="text-xs text-gray-500">
                          {product.purchases} compras
                        </p>
                      </div>
                      <span className="text-sm font-bold text-green-600">
                        {formatCurrency(product.revenue)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    No hay datos de productos disponibles
                  </p>
                )}
              </div>
            </Card>

            {/* Customer Segmentation */}
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Segmentación de Clientes</h2>
                <p className="text-sm text-gray-600">Clasificación de clientes por comportamiento</p>
              </div>
              <div className="space-y-4">
                {userData?.segmentation ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span>Clientes Nuevos</span>
                      <Badge className="bg-green-100 text-green-800">{userData.segmentation.newCustomers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Clientes Recurrentes</span>
                      <Badge className="bg-blue-100 text-blue-800">{userData.segmentation.returningCustomers}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Clientes VIP</span>
                      <Badge className="bg-yellow-100 text-yellow-800">{userData.segmentation.vipCustomers}</Badge>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Cargando datos de segmentación...
                  </p>
                )}
              </div>
            </Card>

            {/* Conversion Funnel */}
            <Card className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">Funnel de Conversión</h2>
                <p className="text-sm text-gray-600">Paso a paso del comportamiento del usuario</p>
              </div>
              <div className="space-y-3">
                {userData?.behavior ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Vistas de Página
                      </span>
                      <span className="font-semibold">{userData.behavior.pageViews.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Vistas de Producto
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{userData.behavior.productViews.toLocaleString()}</span>
                        <Badge className="bg-gray-100 text-gray-800 text-xs">
                          {formatPercentage(userData.behavior.funnelRates.viewToProduct)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0L12 18m-2.5 0h7" />
                        </svg>
                        Agregados al Carrito
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{userData.behavior.addToCarts.toLocaleString()}</span>
                        <Badge className="bg-gray-100 text-gray-800 text-xs">
                          {formatPercentage(userData.behavior.funnelRates.productToCart)}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Compras Realizadas
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{userData.behavior.purchases.toLocaleString()}</span>
                        <Badge className="bg-gray-100 text-gray-800 text-xs">
                          {formatPercentage(userData.behavior.funnelRates.cartToPurchase)}
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Conversión General</span>
                        <Badge className="bg-green-100 text-green-800">
                          {formatPercentage(userData.behavior.funnelRates.overallConversion)}
                        </Badge>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Cargando datos de comportamiento...
                  </p>
                )}
              </div>
            </Card>
          </div>
        </>
      )}
      </div>
    </PageTransition>
  );
};

export default AnalyticsDashboard;
