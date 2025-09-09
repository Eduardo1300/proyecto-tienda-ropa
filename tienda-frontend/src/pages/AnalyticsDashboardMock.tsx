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
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">
          Panel de análisis de la tienda (Usando datos mock + API real)
        </p>
        
        {/* Connection Status */}
        <div className="mt-4 flex justify-center gap-2">
          {connectionTest ? (
            <Badge className="bg-green-100 text-green-800">
              ✅ API Conectada - {connectionTest.message}
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800">
              ❌ API No disponible
            </Badge>
          )}
          
          {error && (
            <Badge className="bg-yellow-100 text-yellow-800">
              ⚠️ {error}
            </Badge>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Visitas Totales</h3>
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {mockDashboard.overview.totalPageViews.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">Páginas vistas</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-teal-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Visitantes Únicos</h3>
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {mockDashboard.overview.uniqueVisitors.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">Usuarios únicos</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Ventas Totales</h3>
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            €{mockDashboard.overview.totalRevenue.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600">{mockDashboard.overview.totalPurchases} órdenes</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Tasa de Conversión</h3>
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {mockDashboard.overview.conversionRate.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600">Conversión de visitas</p>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Ingresos por Día</h2>
        <div className="space-y-3">
          {mockDashboard.revenue.map((day, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="text-sm font-medium">{day.date}</div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{day.orders} órdenes</span>
                <span className="text-lg font-semibold">€{day.revenue.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Products */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Productos Más Vendidos</h2>
        <div className="space-y-3">
          {mockDashboard.topProducts.map((product, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <div className="text-sm font-medium">Producto #{product.productId}</div>
                <div className="text-xs text-gray-500">{product.views} vistas</div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">{product.purchases} ventas</span>
                <span className="text-lg font-semibold">€{product.revenue.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Debug Information */}
      {connectionTest && (
        <Card className="p-6 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Información de Conexión</h3>
          <div className="space-y-2 text-sm">
            <div><strong>Usuario:</strong> {user?.email} ({user?.role})</div>
            <div><strong>Token:</strong> {token ? 'Presente' : 'Ausente'}</div>
            <div><strong>API Test:</strong> {connectionTest.message}</div>
            <div><strong>Timestamp:</strong> {connectionTest.timestamp}</div>
            {error && <div className="text-red-600"><strong>Error:</strong> {error}</div>}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsDashboardMock;
