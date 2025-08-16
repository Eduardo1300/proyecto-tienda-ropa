import React from 'react';
import type { DashboardOverviewData } from '../../types/admin.types';

interface DashboardOverviewProps {
  data: DashboardOverviewData;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <span className={`flex items-center text-sm font-medium ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? '📈' : '📉'}
        {Math.abs(growth)}%
      </span>
    );
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    growth: number;
    icon: string;
    description?: string;
  }> = ({ title, value, growth, icon, description }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-gray-600 font-medium">{title}</h3>
        </div>
        {formatGrowth(growth)}
      </div>
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-800">
          {typeof value === 'number' ? formatCurrency(value) : value}
        </p>
      </div>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas Totales"
          value={data.totalSales}
          growth={data.salesGrowth}
          icon="💰"
          description="Ingresos del período"
        />
        
        <StatCard
          title="Pedidos"
          value={data.totalOrders.toLocaleString()}
          growth={data.ordersGrowth}
          icon="🛒"
          description="Total de pedidos"
        />
        
        <StatCard
          title="Clientes"
          value={data.totalCustomers.toLocaleString()}
          growth={data.customersGrowth}
          icon="👥"
          description="Clientes únicos"
        />
        
        <StatCard
          title="Productos"
          value={data.totalProducts.toString()}
          growth={data.productsGrowth}
          icon="📦"
          description="Productos activos"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Métricas Clave</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Valor Promedio de Pedido</span>
              <span className="font-semibold text-gray-800">
                {formatCurrency(data.averageOrderValue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tasa de Conversión</span>
              <span className="font-semibold text-gray-800">{data.conversionRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pedidos por Cliente</span>
              <span className="font-semibold text-gray-800">
                {(data.totalOrders / data.totalCustomers).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🏆 Categorías Top</h3>
          <div className="space-y-4">
            {data.topSellingCategories.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 font-medium">{category.category}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {formatCurrency(category.sales)}
                  </p>
                  {formatGrowth(category.growth)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Acciones Rápidas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="text-2xl mb-2">➕</span>
            <span className="text-sm font-medium text-blue-700">Nuevo Producto</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm font-medium text-green-700">Ver Pedidos</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="text-2xl mb-2">👥</span>
            <span className="text-sm font-medium text-purple-700">Gestionar Clientes</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <span className="text-2xl mb-2">📊</span>
            <span className="text-sm font-medium text-orange-700">Ver Reportes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
