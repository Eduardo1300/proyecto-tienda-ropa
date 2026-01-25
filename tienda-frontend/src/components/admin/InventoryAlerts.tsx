import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/adminApi';
import type { InventoryAlert } from '../../types/admin.types';

interface InventoryAlertsProps {
  data: InventoryAlert[];
  onLoadData: (data: InventoryAlert[]) => void;
}

export const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ data, onLoadData }) => {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'low_stock' | 'out_of_stock' | 'reorder' | 'overstock'>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'stock' | 'date'>('priority');

  useEffect(() => {
    loadInventoryData();
  }, []);

  const loadInventoryData = async () => {
    setLoading(true);
    try {
      const alertsData = await adminApi.getInventoryAlerts();
      onLoadData(alertsData);
    } catch (error) {
      // Fallback to mock data if API fails
      const mockAlerts: InventoryAlert[] = [
        {
          id: 1,
          productName: 'Camiseta Basic Blanca',
          productSku: 'TSH-001-WHI',
          currentStock: 2,
          minStock: 10,
          maxStock: 100,
          alertType: 'low_stock',
          priority: 'high',
          lastRestocked: new Date('2024-01-05'),
          supplier: 'TextilCorp',
          estimatedRestockDate: new Date('2024-01-20'),
          unitCost: 15.50,
          averageSales: 5,
          category: 'Camisetas',
          location: 'A-1-3'
        },
        {
          id: 2,
          productName: 'Jeans Slim Fit Azul',
          productSku: 'JNS-002-BLU',
          currentStock: 0,
          minStock: 5,
          maxStock: 50,
          alertType: 'out_of_stock',
          priority: 'critical',
          lastRestocked: new Date('2024-01-01'),
          supplier: 'DenimFactory',
          estimatedRestockDate: new Date('2024-01-18'),
          unitCost: 45.00,
          averageSales: 3,
          category: 'Pantalones',
          location: 'B-2-1'
        },
        {
          id: 3,
          productName: 'Vestido Floral Verde',
          productSku: 'DRS-003-GRN',
          currentStock: 3,
          minStock: 8,
          maxStock: 40,
          alertType: 'reorder',
          priority: 'medium',
          lastRestocked: new Date('2024-01-08'),
          supplier: 'FashionPlus',
          estimatedRestockDate: new Date('2024-01-22'),
          unitCost: 32.75,
          averageSales: 2,
          category: 'Vestidos',
          location: 'C-1-2'
        },
        {
          id: 4,
          productName: 'Chaqueta Deportiva Negra',
          productSku: 'JKT-004-BLK',
          currentStock: 85,
          minStock: 10,
          maxStock: 50,
          alertType: 'overstock',
          priority: 'low',
          lastRestocked: new Date('2024-01-12'),
          supplier: 'SportWear Inc',
          estimatedRestockDate: new Date('2024-02-15'),
          unitCost: 67.90,
          averageSales: 1,
          category: 'Chaquetas',
          location: 'D-3-4'
        }
      ];
      onLoadData(mockAlerts);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data
    .filter(alert => filter === 'all' || alert.alertType === filter)
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'stock':
          return a.currentStock - b.currentStock;
        case 'date':
          return new Date(a.lastRestocked).getTime() - new Date(b.lastRestocked).getTime();
        default:
          return 0;
      }
    });

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'low_stock':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'reorder':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overstock':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'out_of_stock': return '❌';
      case 'low_stock': return '⚠️';
      case 'reorder': return '🔄';
      case 'overstock': return '📦';
      default: return '📋';
    }
  };

  const alertTypeCounts = data.reduce((acc, alert) => {
    acc[alert.alertType] = (acc[alert.alertType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = data.reduce((sum, alert) => sum + (alert.currentStock * alert.unitCost), 0);
  const totalAlerts = data.length;
  const criticalAlerts = data.filter(a => a.priority === 'critical' || a.priority === 'high').length;

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
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Alertas Activas</p>
              <p className="text-2xl font-bold">{totalAlerts}</p>
              <p className="text-red-200 text-xs">{criticalAlerts} críticas</p>
            </div>
            <div className="text-3xl">🚨</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Sin Stock</p>
              <p className="text-2xl font-bold">{alertTypeCounts.out_of_stock || 0}</p>
              <p className="text-orange-200 text-xs">productos</p>
            </div>
            <div className="text-3xl">❌</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Stock Bajo</p>
              <p className="text-2xl font-bold">{alertTypeCounts.low_stock || 0}</p>
              <p className="text-yellow-200 text-xs">productos</p>
            </div>
            <div className="text-3xl">⚠️</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Valor Inventario</p>
              <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
              <p className="text-green-200 text-xs">en riesgo</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
      </div>

      {/* Inventory Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">📦 Alertas de Inventario</h3>
            <p className="text-gray-600">Gestión y monitoreo del stock disponible</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas las alertas</option>
              <option value="out_of_stock">Sin stock</option>
              <option value="low_stock">Stock bajo</option>
              <option value="reorder">Para reordenar</option>
              <option value="overstock">Exceso stock</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'priority' | 'stock' | 'date')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="priority">Ordenar por Prioridad</option>
              <option value="stock">Ordenar por Stock</option>
              <option value="date">Ordenar por Fecha</option>
            </select>
            
            <button
              onClick={loadInventoryData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo Alerta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rango Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ETA Restock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {alert.productName}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {alert.productSku}
                      </div>
                      <div className="text-xs text-gray-400">
                        📍 {alert.location} | {alert.category}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getAlertTypeColor(alert.alertType)}`}>
                      {getAlertIcon(alert.alertType)} {alert.alertType.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                      {alert.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold text-lg">
                      {alert.currentStock}
                    </div>
                    <div className="text-xs text-gray-500">
                      {alert.averageSales}/día promedio
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="text-xs">
                      <div>Mín: <span className="font-semibold">{alert.minStock}</span></div>
                      <div>Máx: <span className="font-semibold">{alert.maxStock}</span></div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`h-2 rounded-full ${
                          alert.currentStock <= alert.minStock ? 'bg-red-500' :
                          alert.currentStock >= alert.maxStock ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(5, (alert.currentStock / alert.maxStock) * 100))}%`
                        }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{alert.supplier}</div>
                    <div className="text-xs text-gray-500">
                      Costo: ${alert.unitCost}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold">
                      {alert.estimatedRestockDate ? 
                        new Date(alert.estimatedRestockDate).toLocaleDateString('es-ES')
                        : 'N/A'
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      {alert.estimatedRestockDate ? 
                        `${Math.ceil((new Date(alert.estimatedRestockDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} días`
                        : ''
                      }
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
                        title="Crear orden"
                      >
                        🛒
                      </button>
                      <button 
                        className="text-purple-600 hover:text-purple-900 transition-colors p-1 rounded" 
                        title="Contactar proveedor"
                      >
                        📞
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Acciones Rápidas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg p-4 transition-colors">
            <span className="text-2xl">🚨</span>
            <div className="text-left">
              <div className="font-semibold text-red-800">Órdenes Urgentes</div>
              <div className="text-sm text-red-600">Stock crítico</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 transition-colors">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <div className="font-semibold text-blue-800">Reportes</div>
              <div className="text-sm text-blue-600">Análisis inventario</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 transition-colors">
            <span className="text-2xl">⚙️</span>
            <div className="text-left">
              <div className="font-semibold text-green-800">Configurar</div>
              <div className="text-sm text-green-600">Límites stock</div>
            </div>
          </button>
          
          <button className="flex items-center justify-center space-x-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 transition-colors">
            <span className="text-2xl">📈</span>
            <div className="text-left">
              <div className="font-semibold text-purple-800">Predicciones</div>
              <div className="text-sm text-purple-600">IA demanda</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
