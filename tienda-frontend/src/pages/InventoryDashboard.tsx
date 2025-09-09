import React, { useState } from 'react';
import { 
  useInventoryAlerts, 
  useInventoryReports, 
  useStockManagement 
} from '../hooks/useInventory';
import { Card, Badge } from '../components/ui';

const InventoryDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { 
    alerts, 
    isLoading: alertsLoading, 
    error: alertsError, 
    acknowledgeAlert, 
    resolveAlert 
  } = useInventoryAlerts();

  const {
    lowStockProducts,
    expiringProducts,
    inventoryValue,
    isLoading: reportsLoading,
    error: reportsError,
  } = useInventoryReports();

  const { updateStock } = useStockManagement();

  const handleUpdateStock = async (productId: number, newQuantity: number) => {
    try {
      await updateStock({
        productId,
        quantity: newQuantity,
        reason: 'ADJUSTMENT',
        type: 'ADJUSTMENT',
        notes: 'Manual adjustment from dashboard'
      });
      alert('Stock actualizado exitosamente');
    } catch (error) {
      alert('Error al actualizar el stock');
    }
  };

  const getPriorityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'LOW_STOCK': return '🔴';
      case 'OUT_OF_STOCK': return '🚨';
      case 'EXPIRING_SOON': return '⏰';
      case 'EXPIRED': return '❌';
      case 'REORDER_POINT': return '📦';
      case 'OVERSTOCK': return '📈';
      default: return '⚠️';
    }
  };

  const isLoading = alertsLoading || reportsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (alertsError || reportsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 text-lg font-semibold">Error al cargar datos de inventario</h2>
          <p className="text-red-600">{alertsError || reportsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📦 Gestión de Inventario</h1>
          <p className="text-gray-600">
            Monitorea y administra el stock de productos
          </p>
        </div>
        <div className="flex gap-2">
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="overview">Resumen</option>
            <option value="alerts">Alertas</option>
            <option value="reports">Reportes</option>
          </select>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Valor Total</h2>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                €{inventoryValue?.totalValue?.toFixed(2) || '0.00'}
              </div>
              <p className="text-sm text-gray-600">
                Valor del inventario
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Productos</h2>
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {inventoryValue?.products || 0}
              </div>
              <p className="text-sm text-gray-600">
                En inventario
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Alertas Activas</h2>
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-red-600 mb-2">
                {alerts.filter(a => a.status === 'ACTIVE').length}
              </div>
              <p className="text-sm text-gray-600">
                Requieren atención
              </p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">Stock Bajo</h2>
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {lowStockProducts.length}
              </div>
              <p className="text-sm text-gray-600">
                Productos bajo mínimo
              </p>
            </Card>
          </div>

          {/* Recent Alerts */}
          {alerts && alerts.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Alertas Recientes</h2>
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg border ${getPriorityColor(alert.priority)}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{getAlertIcon(alert.type)}</span>
                      <div>
                        <div className="font-medium">{alert.message}</div>
                        <div className="text-sm text-gray-600">
                          {alert.product?.name || 'Producto'} - {new Date(alert.createdAt).toLocaleDateString('es-ES')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                      {alert.status === 'ACTIVE' && (
                        <button 
                          onClick={() => resolveAlert(alert.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Resolver
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Todas las Alertas</h2>
          <div className="space-y-3">
            {alerts && alerts.length > 0 ? (
              alerts.map((alert) => (
                <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg border ${getPriorityColor(alert.priority)}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getAlertIcon(alert.type)}</span>
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-gray-600">
                        {alert.product?.name || 'Producto'} - {new Date(alert.createdAt).toLocaleDateString('es-ES')}
                      </div>
                      {alert.currentValue !== undefined && alert.threshold !== undefined && (
                        <div className="text-xs text-gray-500 mt-1">
                          Actual: {alert.currentValue} | Umbral: {alert.threshold}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority}
                    </Badge>
                    <Badge className={
                      alert.status === 'ACTIVE' ? 'bg-red-100 text-red-800' :
                      alert.status === 'ACKNOWLEDGED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {alert.status}
                    </Badge>
                    {alert.status === 'ACTIVE' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Reconocer
                        </button>
                        <button 
                          onClick={() => resolveAlert(alert.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Resolver
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                No hay alertas disponibles
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Low Stock Products */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Productos con Stock Bajo</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Producto</th>
                    <th className="text-left py-3 px-4 font-semibold">SKU</th>
                    <th className="text-right py-3 px-4 font-semibold">Stock Actual</th>
                    <th className="text-right py-3 px-4 font-semibold">Stock Mínimo</th>
                    <th className="text-center py-3 px-4 font-semibold">Estado</th>
                    <th className="text-center py-3 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts && lowStockProducts.length > 0 ? (
                    lowStockProducts.map((product, index) => (
                      <tr key={product.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{product.name || 'Sin nombre'}</td>
                        <td className="py-3 px-4 text-gray-600">{product.sku || 'Sin SKU'}</td>
                        <td className="py-3 px-4 text-right">{product.stock || product.availableStock || 0}</td>
                        <td className="py-3 px-4 text-right">{product.minStockLevel || 0}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge className="bg-red-100 text-red-800">
                            Stock Bajo
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              const newStock = prompt('Nuevo stock:', (product.stock || 0).toString());
                              if (newStock && !isNaN(Number(newStock))) {
                                handleUpdateStock(product.id, Number(newStock));
                              }
                            }}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Actualizar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        No hay productos con stock bajo
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Expiring Products */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Productos por Vencer</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Producto</th>
                    <th className="text-left py-3 px-4 font-semibold">SKU</th>
                    <th className="text-right py-3 px-4 font-semibold">Stock</th>
                    <th className="text-center py-3 px-4 font-semibold">Fecha Vencimiento</th>
                    <th className="text-center py-3 px-4 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {expiringProducts && expiringProducts.length > 0 ? (
                    expiringProducts.map((product, index) => (
                      <tr key={product.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{product.name || 'Sin nombre'}</td>
                        <td className="py-3 px-4 text-gray-600">{product.sku || 'Sin SKU'}</td>
                        <td className="py-3 px-4 text-right">{product.stock || product.availableStock || 0}</td>
                        <td className="py-3 px-4 text-center">
                          {product.expirationDate ? new Date(product.expirationDate).toLocaleDateString('es-ES') : 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Badge className={
                            product.isExpired 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }>
                            {product.isExpired ? 'Vencido' : 'Por Vencer'}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-500">
                        No hay productos por vencer
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;
