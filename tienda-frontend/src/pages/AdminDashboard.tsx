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
      console.error('Error loading dashboard data:', error);
      
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
              <p className="text-gray-600">Panel de control y estadísticas</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 3 meses</option>
                <option value="1y">Último año</option>
              </select>
              
              <button
                onClick={loadDashboardData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                🔄 Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
      <div className="container mx-auto px-6 py-8">
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
