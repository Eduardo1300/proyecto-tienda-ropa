import React, { useState, useEffect } from 'react';
import { DashboardOverview } from '../components/admin/DashboardOverview';
import { SalesChart } from '../components/admin/SalesChart';
import { ProductsStats } from '../components/admin/ProductsStats';
import { CustomersStats } from '../components/admin/CustomersStats';
import { InventoryAlerts } from '../components/admin/InventoryAlerts';
import { ReviewsStats } from '../components/admin/ReviewsStats';
import { OrdersStats } from '../components/admin/OrdersStats';
import { adminApi } from '../services/adminApi';
import type { 
  DashboardOverviewData,
  SalesDataPoint,
  ProductStat,
  CustomerStat,
  InventoryAlert,
  ReviewStat,
  OrdersStat 
} from '../types/admin.types';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  
  // Estado para los datos
  const [overviewData, setOverviewData] = useState<DashboardOverviewData | null>(null);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [productsData, setProductsData] = useState<ProductStat[]>([]);
  const [customersData, setCustomersData] = useState<CustomerStat[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([]);
  const [reviewsData, setReviewsData] = useState<ReviewStat[]>([]);
  const [ordersData, setOrdersData] = useState<OrdersStat | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [period]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar datos reales de la API
      const [overview, sales] = await Promise.all([
        adminApi.getOverview(period),
        adminApi.getSalesData(period, 'day')
      ]);

      setOverviewData(overview);
      setSalesData(sales);
      
    } catch (error) {
      
      // Fallback a datos mock si falla la API
      const mockOverviewData: DashboardOverviewData = {
        totalSales: 125430.50,
        salesGrowth: 15.3,
        totalOrders: 856,
        ordersGrowth: 8.7,
        totalCustomers: 1234,
        customersGrowth: 12.4,
        totalProducts: 89,
        productsGrowth: 5.2,
        averageOrderValue: 146.50,
        conversionRate: 3.2,
        topSellingCategories: [
          { category: 'Ropa', sales: 45000, growth: 20.1 },
          { category: 'Zapatos', sales: 32000, growth: 15.8 },
          { category: 'Accesorios', sales: 28000, growth: 10.5 }
        ]
      };

      const mockSalesData: SalesDataPoint[] = [
        { date: '2024-01-01', sales: 12000, orders: 45, customers: 38 },
        { date: '2024-01-02', sales: 15000, orders: 52, customers: 41 },
        { date: '2024-01-03', sales: 18000, orders: 63, customers: 52 },
        { date: '2024-01-04', sales: 14000, orders: 48, customers: 39 },
        { date: '2024-01-05', sales: 16000, orders: 55, customers: 45 },
        { date: '2024-01-06', sales: 20000, orders: 68, customers: 58 },
        { date: '2024-01-07', sales: 22000, orders: 74, customers: 62 }
      ];

      setOverviewData(mockOverviewData);
      setSalesData(mockSalesData);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: '📊' },
    { id: 'sales', name: 'Ventas', icon: '💰' },
    { id: 'products', name: 'Productos', icon: '📦' },
    { id: 'customers', name: 'Clientes', icon: '👥' },
    { id: 'inventory', name: 'Inventario', icon: '📋' },
    { id: 'reviews', name: 'Reviews', icon: '⭐' },
    { id: 'orders', name: 'Pedidos', icon: '🛒' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Floating Gradient Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 relative z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard Administrativo</h1>
              <p className="text-gray-300">Panel de control y estadísticas</p>
            </div>
            
            <div className="flex items-center space-x-4 flex-col sm:flex-row gap-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-white/20 bg-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="7d" className="bg-gray-800 text-white">Últimos 7 días</option>
                <option value="30d" className="bg-gray-800 text-white">Últimos 30 días</option>
                <option value="90d" className="bg-gray-800 text-white">Últimos 3 meses</option>
                <option value="1y" className="bg-gray-800 text-white">Último año</option>
              </select>
              
              <button
                onClick={loadDashboardData}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-purple-300'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 relative z-10">
        {activeTab === 'overview' && overviewData && (
          <DashboardOverview data={overviewData} />
        )}
        
        {activeTab === 'sales' && (
          <SalesChart data={salesData} period={period} />
        )}
        
        {activeTab === 'products' && (
          <ProductsStats data={productsData} onLoadData={setProductsData} />
        )}
        
        {activeTab === 'customers' && (
          <CustomersStats data={customersData} onLoadData={setCustomersData} />
        )}
        
        {activeTab === 'inventory' && (
          <InventoryAlerts data={inventoryAlerts} onLoadData={setInventoryAlerts} />
        )}
        
        {activeTab === 'reviews' && (
          <ReviewsStats data={reviewsData} onLoadData={setReviewsData} />
        )}
        
        {activeTab === 'orders' && (
          <OrdersStats data={ordersData} onLoadData={setOrdersData} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
