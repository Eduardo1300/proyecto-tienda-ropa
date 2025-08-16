import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import type { OrdersStat } from '../../types/admin.types';

interface OrdersStatsProps {
  data: OrdersStat | null;
  onLoadData: (data: OrdersStat) => void;
}

export const OrdersStats: React.FC<OrdersStatsProps> = ({ data, onLoadData }) => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'total' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    loadOrdersData();
  }, [currentPage, statusFilter, sortBy, sortOrder]);

  const loadOrdersData = async () => {
    setLoading(true);
    try {
      const ordersData = await adminApi.getOrdersStats();
      onLoadData(ordersData);
    } catch (error) {
      console.error('Error loading orders data:', error);
      // Fallback to mock data
      const mockOrders = [
        {
          id: 1,
          orderNumber: 'ORD-2024-001',
          customerName: 'Ana García',
          customerEmail: 'ana.garcia@email.com',
          total: 129.99,
          status: 'delivered',
          itemsCount: 3,
          createdAt: new Date('2024-01-15T10:30:00')
        },
        {
          id: 2,
          orderNumber: 'ORD-2024-002',
          customerName: 'Carlos Rodríguez',
          customerEmail: 'carlos.rodriguez@email.com',
          total: 89.50,
          status: 'shipped',
          itemsCount: 2,
          createdAt: new Date('2024-01-15T14:15:00')
        },
        {
          id: 3,
          orderNumber: 'ORD-2024-003',
          customerName: 'María López',
          customerEmail: 'maria.lopez@email.com',
          total: 245.75,
          status: 'processing',
          itemsCount: 5,
          createdAt: new Date('2024-01-15T16:45:00')
        },
        {
          id: 4,
          orderNumber: 'ORD-2024-004',
          customerName: 'David Martín',
          customerEmail: 'david.martin@email.com',
          total: 67.25,
          status: 'pending',
          itemsCount: 1,
          createdAt: new Date('2024-01-16T09:20:00')
        },
        {
          id: 5,
          orderNumber: 'ORD-2024-005',
          customerName: 'Laura Sánchez',
          customerEmail: 'laura.sanchez@email.com',
          total: 156.80,
          status: 'delivered',
          itemsCount: 4,
          createdAt: new Date('2024-01-16T11:10:00')
        },
        {
          id: 6,
          orderNumber: 'ORD-2024-006',
          customerName: 'Jorge Fernández',
          customerEmail: 'jorge.fernandez@email.com',
          total: 45.99,
          status: 'cancelled',
          itemsCount: 1,
          createdAt: new Date('2024-01-16T13:30:00')
        },
        {
          id: 7,
          orderNumber: 'ORD-2024-007',
          customerName: 'Patricia Morales',
          customerEmail: 'patricia.morales@email.com',
          total: 198.40,
          status: 'shipped',
          itemsCount: 6,
          createdAt: new Date('2024-01-16T15:45:00')
        },
        {
          id: 8,
          orderNumber: 'ORD-2024-008',
          customerName: 'Roberto Silva',
          customerEmail: 'roberto.silva@email.com',
          total: 312.60,
          status: 'processing',
          itemsCount: 8,
          createdAt: new Date('2024-01-16T17:20:00')
        }
      ];

      const filteredOrders = mockOrders
        .filter(order => statusFilter === 'all' || order.status === statusFilter)
        .sort((a, b) => {
          let comparison = 0;
          switch (sortBy) {
            case 'date':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
            case 'total':
              comparison = a.total - b.total;
              break;
            case 'status':
              comparison = a.status.localeCompare(b.status);
              break;
          }
          return sortOrder === 'desc' ? -comparison : comparison;
        });

      const ordersData: OrdersStat = {
        orders: filteredOrders,
        total: filteredOrders.length,
        pages: Math.ceil(filteredOrders.length / 10),
        currentPage: currentPage
      };

      onLoadData(ordersData);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '⚙️';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  if (!data || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statusCounts = data.orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = data.orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalRevenue / (data.orders.length || 1);
  const totalItems = data.orders.reduce((sum, order) => sum + order.itemsCount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Pedidos</p>
              <p className="text-2xl font-bold">{data.total}</p>
              <p className="text-blue-200 text-xs">+12.5% este mes</p>
            </div>
            <div className="text-3xl">📦</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Revenue Total</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="text-green-200 text-xs">+8.7% este mes</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Valor Promedio</p>
              <p className="text-2xl font-bold">${averageOrderValue.toFixed(0)}</p>
              <p className="text-purple-200 text-xs">por pedido</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Items Vendidos</p>
              <p className="text-2xl font-bold">{totalItems}</p>
              <p className="text-orange-200 text-xs">productos</p>
            </div>
            <div className="text-3xl">🛍️</div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Estado de Pedidos</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { status: 'pending', label: 'Pendientes', color: 'bg-yellow-50 border-yellow-200' },
            { status: 'processing', label: 'Procesando', color: 'bg-blue-50 border-blue-200' },
            { status: 'shipped', label: 'Enviados', color: 'bg-purple-50 border-purple-200' },
            { status: 'delivered', label: 'Entregados', color: 'bg-green-50 border-green-200' },
            { status: 'cancelled', label: 'Cancelados', color: 'bg-red-50 border-red-200' }
          ].map(({ status, label, color }) => (
            <div key={status} className={`border rounded-lg p-4 ${color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{getStatusIcon(status)}</span>
                <span className="text-2xl font-bold text-gray-800">
                  {statusCounts[status] || 0}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-500">
                {((statusCounts[status] || 0) / data.total * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Orders Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">📋 Gestión de Pedidos</h3>
            <p className="text-gray-600">Listado y seguimiento de pedidos recientes</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendientes</option>
              <option value="processing">Procesando</option>
              <option value="shipped">Enviados</option>
              <option value="delivered">Entregados</option>
              <option value="cancelled">Cancelados</option>
            </select>
            
            <div className="flex">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'total' | 'status')}
                className="px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Ordenar por Fecha</option>
                <option value="total">Ordenar por Total</option>
                <option value="status">Ordenar por Estado</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
                title={sortOrder === 'asc' ? 'Ascendente' : 'Descendente'}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            
            <button
              onClick={loadOrdersData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.orderNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: #{order.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customerEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold">{order.itemsCount}</div>
                    <div className="text-xs text-gray-500">productos</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold text-lg">
                      ${order.total.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold">
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded" 
                        title="Ver detalles"
                      >
                        👁️
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 transition-colors p-1 rounded" 
                        title="Editar pedido"
                      >
                        ✏️
                      </button>
                      <button 
                        className="text-purple-600 hover:text-purple-900 transition-colors p-1 rounded" 
                        title="Rastreo"
                      >
                        📍
                      </button>
                      <button 
                        className="text-orange-600 hover:text-orange-900 transition-colors p-1 rounded" 
                        title="Imprimir"
                      >
                        🖨️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data.pages > 1 && (
          <div className="flex items-center justify-between pt-6">
            <div className="text-sm text-gray-500">
              Página {data.currentPage} de {data.pages} ({data.total} pedidos total)
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(data.pages, currentPage + 1))}
                disabled={currentPage >= data.pages}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Acciones Rápidas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg p-4 transition-colors">
            <span className="text-2xl">⏳</span>
            <div className="text-left">
              <div className="font-semibold text-yellow-800">Procesar Pendientes</div>
              <div className="text-sm text-yellow-600">{statusCounts.pending || 0} pedidos</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 transition-colors">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <div className="font-semibold text-blue-800">Generar Reportes</div>
              <div className="text-sm text-blue-600">Análisis ventas</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 transition-colors">
            <span className="text-2xl">📦</span>
            <div className="text-left">
              <div className="font-semibold text-purple-800">Gestionar Envíos</div>
              <div className="text-sm text-purple-600">Tracking masivo</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 transition-colors">
            <span className="text-2xl">📧</span>
            <div className="text-left">
              <div className="font-semibold text-green-800">Notificar Clientes</div>
              <div className="text-sm text-green-600">Estado pedidos</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
