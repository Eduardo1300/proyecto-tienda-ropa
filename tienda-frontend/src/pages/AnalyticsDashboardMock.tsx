import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const AnalyticsDashboardMock: React.FC = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  // Get API base URL from axios instance
  const API_BASE_URL = api.defaults.baseURL || 'http://localhost:3002';
  
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🧪 Testing analytics API connection...');
        console.log('User:', user);
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('API Base URL:', API_BASE_URL);

        // Test basic endpoint
        const testResponse = await fetch(`${API_BASE_URL}/analytics/test`);
        const testData = await testResponse.json();
        
        console.log('Test Response Status:', testResponse.status);
        console.log('Test Data:', testData);
        
        if (testResponse.ok) {
          console.log('✅ Analytics test endpoint successful:', testData);
          setConnectionTest(testData);
          
          // Load dashboard data
          if (token && user?.role === 'admin') {
            // Get last 30 days
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            
            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];
            
            console.log(`📅 Fetching data from ${startDateStr} to ${endDateStr}`);
            
            const dashboardUrl = `${API_BASE_URL}/analytics/dashboard?startDate=${startDateStr}&endDate=${endDateStr}`;
            console.log('Dashboard URL:', dashboardUrl);
            
            const dashboardResponse = await fetch(dashboardUrl, {
              method: 'GET',
              headers: headers
            });

            console.log('Dashboard Response Status:', dashboardResponse.status);
            
            if (dashboardResponse.ok) {
              const response = await dashboardResponse.json();
              console.log('✅ Dashboard response:', response);
              
              // Mapear la estructura correcta
              const data = response.data || response;
              console.log('✅ Dashboard data loaded:', data);
              console.log('📊 Data structure:', {
                hasOverview: !!data.overview,
                hasRevenue: !!data.revenue,
                hasTopProducts: !!data.topProducts,
                overviewKeys: data.overview ? Object.keys(data.overview) : [],
                revenueLength: data.revenue ? data.revenue.length : 0,
                topProductsLength: data.topProducts ? data.topProducts.length : 0,
              });
              setDashboardData(data);
            } else {
              const errorText = await dashboardResponse.text();
              console.log('❌ Dashboard failed:', dashboardResponse.status, errorText);
              setError(`Dashboard endpoint failed: ${dashboardResponse.status}`);
            }
          } else {
            console.log('⚠️ User is not admin or no token');
            console.log('Token:', token ? 'Present' : 'Missing');
            console.log('User Role:', user?.role);
          }
        } else {
          console.log('❌ Analytics test failed:', testResponse.status);
          setError('Analytics API not available');
        }

      } catch (err) {
        console.error('Analytics connection error:', err);
        setError(`Error connecting to analytics API: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadAnalyticsData();
    }
  }, [user, token]);

  // Mock data for display (fallback if API fails)
  const mockDashboard = {
    overview: {
      totalPageViews: 1234,
      uniqueVisitors: 567,
      totalPurchases: 89,
      totalRevenue: 4567.89,
      conversionRate: 15.7,
      averageOrderValue: 51.32,
      userRegistrations: 23
    },
    revenue: [
      { date: '2025-09-02', revenue: 234.50, orders: 5 },
      { date: '2025-09-03', revenue: 456.78, orders: 8 },
      { date: '2025-09-04', revenue: 123.45, orders: 3 },
      { date: '2025-09-05', revenue: 678.90, orders: 12 },
      { date: '2025-09-06', revenue: 345.67, orders: 7 },
      { date: '2025-09-07', revenue: 567.89, orders: 9 },
      { date: '2025-09-08', revenue: 789.12, orders: 14 }
    ],
    topProducts: [
      { productId: 1, views: 234, revenue: 1200.50, purchases: 15 },
      { productId: 2, views: 189, revenue: 890.25, purchases: 12 },
      { productId: 3, views: 156, revenue: 675.00, purchases: 9 }
    ]
  };

  // Use real data if available, fallback to mock
  const dataToDisplay = dashboardData ? {
    overview: {
      totalPageViews: dashboardData.overview?.totalPageViews || 0,
      uniqueVisitors: dashboardData.overview?.uniqueVisitors || 0,
      totalPurchases: dashboardData.overview?.totalPurchases || 0,
      totalRevenue: dashboardData.overview?.totalRevenue || 0,
      conversionRate: dashboardData.overview?.conversionRate || 0,
      averageOrderValue: dashboardData.overview?.averageOrderValue || 0,
      userRegistrations: dashboardData.overview?.userRegistrations || 0
    },
    revenue: (dashboardData.revenue || []).map((item: any) => ({
      date: new Date(item.date).toISOString().split('T')[0],
      revenue: parseFloat(item.revenue) || 0,
      orders: parseInt(item.orders) || 0
    })),
    topProducts: (dashboardData.overview?.topProducts || []).map((item: any) => ({
      productId: item.productId,
      views: parseInt(item.views) || 0,
      purchases: item.purchases || 0,
      revenue: item.revenue || 0
    }))
  } : mockDashboard;
  

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">Probando conexión con Analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header Mejorado */}
        <Card className="mb-10 overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white" padding="lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-5xl shadow-lg">📈</div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
                <p className="text-purple-100 text-lg">Panel de análisis de la tienda (Mock + API)</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {connectionTest ? (
                <Badge className="bg-green-500/20 text-green-100 text-base px-4 py-2 rounded-full">
                  ✅ API Conectada - {connectionTest.message}
                </Badge>
              ) : (
                <Badge className="bg-red-500/20 text-red-100 text-base px-4 py-2 rounded-full">
                  ❌ API No disponible
                </Badge>
              )}
              {error && (
                <Badge className="bg-yellow-500/20 text-yellow-100 text-base px-4 py-2 rounded-full">
                  ⚠️ {error}
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="p-8 bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">👁️</div>
              <h3 className="text-lg font-semibold">Visitas Totales</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{(dataToDisplay?.overview?.totalPageViews || 0).toLocaleString()}</div>
            <p className="text-base text-blue-100">Páginas vistas</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">🧑‍🤝‍🧑</div>
              <h3 className="text-lg font-semibold">Visitantes Únicos</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{(dataToDisplay?.overview?.uniqueVisitors || 0).toLocaleString()}</div>
            <p className="text-base text-green-100">Usuarios únicos</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">💸</div>
              <h3 className="text-lg font-semibold">Ventas Totales</h3>
            </div>
            <div className="text-4xl font-bold mb-2">S/ {(dataToDisplay?.overview?.totalRevenue || 0).toLocaleString()}</div>
            <p className="text-base text-pink-100">{(dataToDisplay?.overview?.totalPurchases || 0)} órdenes</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">📊</div>
              <h3 className="text-lg font-semibold">Tasa de Conversión</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{((dataToDisplay?.overview?.conversionRate || 0).toFixed(1))}%</div>
            <p className="text-base text-yellow-100">Conversión de visitas</p>
          </Card>
        </div>

        {/* Ingresos por Día */}
        <Card className="p-8 mb-10 bg-white/80 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">💰 Ingresos por Día</h2>
          {dataToDisplay?.revenue && dataToDisplay.revenue.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataToDisplay.revenue.map((day: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow">
                  <div className="text-lg font-semibold text-indigo-700">{day.date}</div>
                  <div className="flex items-center gap-6">
                    <span className="text-base text-gray-600">{day.orders} órdenes</span>
                    <span className="text-2xl font-bold text-indigo-900">S/ {(day.revenue || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No hay datos de ingresos disponibles</div>
          )}
        </Card>

        {/* Productos Más Vendidos */}
        <Card className="p-8 mb-10 bg-white/80 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-pink-700 flex items-center gap-2">🏆 Productos Más Vendidos</h2>
          {dataToDisplay?.topProducts && dataToDisplay.topProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dataToDisplay.topProducts.map((product: any, index: number) => (
                <div key={index} className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl shadow">
                  <div>
                    <div className="text-lg font-semibold text-pink-700">Producto #{product.productId}</div>
                    <div className="text-xs text-gray-500">{product.views} vistas</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-base text-gray-600">{product.purchases} ventas</span>
                    <span className="text-2xl font-bold text-pink-900">S/ {(product.revenue || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">No hay datos de productos disponibles</div>
          )}
        </Card>

        {/* Debug Información de Conexión */}
        {connectionTest && (
          <Card className="p-8 bg-gradient-to-r from-gray-50 to-purple-50">
            <h3 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">🔎 Información de Conexión</h3>
            <div className="space-y-2 text-base">
              <div><strong>Usuario:</strong> {user?.email} ({user?.role})</div>
              <div><strong>Token:</strong> {token ? 'Presente' : 'Ausente'}</div>
              <div><strong>API URL:</strong> {API_BASE_URL}</div>
              <div><strong>API Test:</strong> {connectionTest.message}</div>
              <div><strong>Dashboard Data:</strong> {dashboardData ? '✅ Cargado' : '❌ No cargado'}</div>
              <div><strong>Timestamp:</strong> {connectionTest.timestamp}</div>
              {error && <div className="text-red-600"><strong>Error:</strong> {error}</div>}
              {dashboardData && (
                <div className="mt-4 pt-4 border-t">
                  <strong>Datos Cargados:</strong>
                  <pre className="bg-white p-2 rounded mt-2 text-xs overflow-auto max-h-48">
                    {JSON.stringify(dashboardData, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboardMock;
