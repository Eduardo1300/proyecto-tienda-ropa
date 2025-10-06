import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../components/ui';
import { useAuth } from '../context/AuthContext';

const AnalyticsDashboardMock: React.FC = () => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  
  const [connectionTest, setConnectionTest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const testAnalyticsConnection = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('🧪 Testing analytics API connection...');
        console.log('User:', user);
        console.log('Token:', token ? 'Present' : 'Missing');

        // Test basic endpoint
        const testResponse = await fetch('http://localhost:3002/analytics/test');
        const testData = await testResponse.json();
        
        if (testResponse.ok) {
          console.log('✅ Analytics test endpoint successful:', testData);
          setConnectionTest(testData);
          
          // Try to create sample data
          const sampleDataResponse = await fetch('http://localhost:3002/analytics/test/create-sample-data', {
            method: 'POST'
          });
          
          if (sampleDataResponse.ok) {
            const sampleData = await sampleDataResponse.json();
            console.log('✅ Sample data created:', sampleData);
          } else {
            console.log('⚠️ Could not create sample data:', sampleDataResponse.status);
          }
          
          // Try authenticated endpoint
          if (token && user?.role === 'admin') {
            const dashboardResponse = await fetch(
              `http://localhost:3002/analytics/dashboard?startDate=2025-08-10&endDate=2025-09-09`,
              {
                method: 'GET',
                headers: headers
              }
            );

            if (dashboardResponse.ok) {
              const dashboardData = await dashboardResponse.json();
              console.log('✅ Dashboard data loaded:', dashboardData);
            } else {
              console.log('❌ Dashboard failed:', dashboardResponse.status, await dashboardResponse.text());
              setError(`Dashboard endpoint failed: ${dashboardResponse.status}`);
            }
          } else {
            console.log('⚠️ User is not admin or no token, skipping dashboard test');
            setError('User must be admin to access analytics dashboard');
          }
        } else {
          console.log('❌ Analytics test failed:', testResponse.status);
          setError('Analytics API not available');
        }

      } catch (err) {
        console.error('Analytics connection error:', err);
        setError('Error connecting to analytics API');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      testAnalyticsConnection();
    }
  }, [user, token]);

  // Mock data for display
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
            <div className="text-4xl font-bold mb-2">{mockDashboard.overview.totalPageViews.toLocaleString()}</div>
            <p className="text-base text-blue-100">Páginas vistas</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">🧑‍🤝‍🧑</div>
              <h3 className="text-lg font-semibold">Visitantes Únicos</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{mockDashboard.overview.uniqueVisitors.toLocaleString()}</div>
            <p className="text-base text-green-100">Usuarios únicos</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">💸</div>
              <h3 className="text-lg font-semibold">Ventas Totales</h3>
            </div>
            <div className="text-4xl font-bold mb-2">S/ {mockDashboard.overview.totalRevenue.toLocaleString()}</div>
            <p className="text-base text-pink-100">{mockDashboard.overview.totalPurchases} órdenes</p>
          </Card>
          <Card className="p-8 bg-gradient-to-br from-yellow-500 to-orange-500 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">📊</div>
              <h3 className="text-lg font-semibold">Tasa de Conversión</h3>
            </div>
            <div className="text-4xl font-bold mb-2">{mockDashboard.overview.conversionRate.toFixed(1)}%</div>
            <p className="text-base text-yellow-100">Conversión de visitas</p>
          </Card>
        </div>

        {/* Ingresos por Día */}
        <Card className="p-8 mb-10 bg-white/80 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">💰 Ingresos por Día</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockDashboard.revenue.map((day, index) => (
              <div key={index} className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow">
                <div className="text-lg font-semibold text-indigo-700">{day.date}</div>
                <div className="flex items-center gap-6">
                  <span className="text-base text-gray-600">{day.orders} órdenes</span>
                  <span className="text-2xl font-bold text-indigo-900">S/ {day.revenue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Productos Más Vendidos */}
        <Card className="p-8 mb-10 bg-white/80 shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-pink-700 flex items-center gap-2">🏆 Productos Más Vendidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockDashboard.topProducts.map((product, index) => (
              <div key={index} className="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl shadow">
                <div>
                  <div className="text-lg font-semibold text-pink-700">Producto #{product.productId}</div>
                  <div className="text-xs text-gray-500">{product.views} vistas</div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-base text-gray-600">{product.purchases} ventas</span>
                  <span className="text-2xl font-bold text-pink-900">S/ {product.revenue.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Debug Información de Conexión */}
        {connectionTest && (
          <Card className="p-8 bg-gradient-to-r from-gray-50 to-purple-50">
            <h3 className="text-xl font-bold mb-4 text-indigo-700 flex items-center gap-2">🔎 Información de Conexión</h3>
            <div className="space-y-2 text-base">
              <div><strong>Usuario:</strong> {user?.email} ({user?.role})</div>
              <div><strong>Token:</strong> {token ? 'Presente' : 'Ausente'}</div>
              <div><strong>API Test:</strong> {connectionTest.message}</div>
              <div><strong>Timestamp:</strong> {connectionTest.timestamp}</div>
              {error && <div className="text-red-600"><strong>Error:</strong> {error}</div>}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboardMock;
