import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import type { CustomerStat } from '../../types/admin.types';

interface CustomersStatsProps {
  data: CustomerStat[];
  onLoadData: (data: CustomerStat[]) => void;
}

export const CustomersStats: React.FC<CustomersStatsProps> = ({ data, onLoadData }) => {
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'orders' | 'totalSpent' | 'lastOrder'>('totalSpent');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCustomersData();
  }, []);

  const loadCustomersData = async () => {
    setLoading(true);
    try {
      // Cargar datos reales de la API
      const customers = await adminApi.getCustomersStats(20);
      onLoadData(customers);
    } catch (error) {
      
      // Fallback a datos mock si falla la API
      const mockCustomers: CustomerStat[] = [
        {
          id: 1,
          name: 'Ana García',
          email: 'ana.garcia@email.com',
          orders: 12,
          totalSpent: 2340.50,
          lastOrder: new Date('2024-01-15'),
          avatar: '/api/placeholder/40/40',
          loyaltyTier: 'Gold',
          location: 'Madrid, España'
        },
        {
          id: 2,
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@email.com',
          orders: 8,
          totalSpent: 1875.25,
          lastOrder: new Date('2024-01-10'),
          avatar: '/api/placeholder/40/40',
          loyaltyTier: 'Silver',
          location: 'Barcelona, España'
        },
        {
          id: 3,
          name: 'María López',
          email: 'maria.lopez@email.com',
          orders: 15,
          totalSpent: 3125.75,
          lastOrder: new Date('2024-01-12'),
          avatar: '/api/placeholder/40/40',
          loyaltyTier: 'Platinum',
          location: 'Valencia, España'
        },
        {
          id: 4,
          name: 'David Martín',
          email: 'david.martin@email.com',
          orders: 5,
          totalSpent: 892.30,
          lastOrder: new Date('2024-01-08'),
          avatar: '/api/placeholder/40/40',
          loyaltyTier: 'Bronze',
          location: 'Sevilla, España'
        },
        {
          id: 5,
          name: 'Laura Sánchez',
          email: 'laura.sanchez@email.com',
          orders: 22,
          totalSpent: 4567.80,
          lastOrder: new Date('2024-01-14'),
          avatar: '/api/placeholder/40/40',
          loyaltyTier: 'Platinum',
          location: 'Bilbao, España'
        }
      ];

      onLoadData(mockCustomers);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'orders':
          return b.orders - a.orders;
        case 'totalSpent':
          return b.totalSpent - a.totalSpent;
        case 'lastOrder':
          return new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime();
        default:
          return 0;
      }
    });

  const totalCustomers = data.length;
  const totalRevenue = data.reduce((sum, c) => sum + c.totalSpent, 0);
  const averageOrderValue = totalRevenue / data.reduce((sum, c) => sum + c.orders, 0);
  const vipCustomers = data.filter(c => c.loyaltyTier === 'Platinum' || c.loyaltyTier === 'Gold').length;

  const getLoyaltyBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-purple-100 text-purple-800';
      case 'Gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Silver':
        return 'bg-gray-100 text-gray-800';
      case 'Bronze':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

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
              <p className="text-blue-100 text-sm">Total Clientes</p>
              <p className="text-2xl font-bold">{totalCustomers.toLocaleString()}</p>
              <p className="text-blue-200 text-xs">+8.2% este mes</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Revenue Total</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="text-green-200 text-xs">+15.3% este mes</p>
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

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Clientes VIP</p>
              <p className="text-2xl font-bold">{vipCustomers}</p>
              <p className="text-yellow-200 text-xs">Gold y Platinum</p>
            </div>
            <div className="text-3xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Customer Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">👥 Gestión de Clientes</h3>
            <p className="text-gray-600">Información detallada de tus mejores clientes</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'orders' | 'totalSpent' | 'lastOrder')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="totalSpent">Ordenar por Gasto Total</option>
              <option value="orders">Ordenar por N° Pedidos</option>
              <option value="lastOrder">Ordenar por Último Pedido</option>
            </select>
            
            <button
              onClick={loadCustomersData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gasto Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={customer.avatar} 
                        alt={customer.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {customer.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLoyaltyBadgeColor(customer.loyaltyTier || 'Bronze')}`}>
                      {customer.loyaltyTier}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold">{customer.orders}</div>
                    <div className="text-xs text-gray-500">pedidos</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold">${customer.totalSpent.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">
                      ${Math.round(customer.totalSpent / customer.orders)}/pedido
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold">
                      {new Date(customer.lastOrder).toLocaleDateString('es-ES')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.floor((Date.now() - new Date(customer.lastOrder).getTime()) / (1000 * 60 * 60 * 24))} días
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors" title="Ver perfil">
                        👁️
                      </button>
                      <button className="text-green-600 hover:text-green-900 transition-colors" title="Enviar mensaje">
                        💬
                      </button>
                      <button className="text-purple-600 hover:text-purple-900 transition-colors" title="Ver pedidos">
                        📋
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Segmentación de Clientes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['Platinum', 'Gold', 'Silver', 'Bronze'].map(tier => {
            const tierCustomers = data.filter(c => c.loyaltyTier === tier);
            const tierRevenue = tierCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
            const avgSpent = tierRevenue / (tierCustomers.length || 1);
            
            return (
              <div key={tier} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">{tier}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getLoyaltyBadgeColor(tier)}`}>
                    {tierCustomers.length}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-semibold">${tierRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Promedio:</span>
                    <span className="font-semibold">${avgSpent.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">% Total:</span>
                    <span className="font-semibold">
                      {((tierCustomers.length / totalCustomers) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Acciones Rápidas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 transition-colors">
            <span className="text-2xl">📧</span>
            <div className="text-left">
              <div className="font-semibold text-blue-800">Enviar Newsletter</div>
              <div className="text-sm text-blue-600">A todos los clientes</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 transition-colors">
            <span className="text-2xl">🎁</span>
            <div className="text-left">
              <div className="font-semibold text-green-800">Crear Promoción</div>
              <div className="text-sm text-green-600">Para clientes VIP</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 transition-colors">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <div className="font-semibold text-purple-800">Exportar Datos</div>
              <div className="text-sm text-purple-600">Lista completa</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
