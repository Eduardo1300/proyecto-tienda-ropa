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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-emerald-100 py-10 px-2 md:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl md:text-5xl bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">📦</span>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">Gestión de Inventario</h1>
          </div>
          <p className="text-gray-700 text-lg">Monitorea y administra el stock de productos</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-gray-700"
          >
            <option value="overview">Resumen</option>
            <option value="alerts">Alertas</option>
            <option value="reports">Reportes</option>
          </select>
        </div>
      </div>

      {/* Animated Tab Content */}
      <div className="transition-all duration-300">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><span>💰</span>Valor Total</h2>
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div className="text-3xl font-extrabold text-blue-600 mb-2">
                  €{inventoryValue?.totalValue?.toFixed(2) || '0.00'}
                </div>
                <p className="text-sm text-gray-600">Valor del inventario</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><span>📦</span>Productos</h2>
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="text-3xl font-extrabold text-green-600 mb-2">
                  {inventoryValue?.products || 0}
                </div>
                <p className="text-sm text-gray-600">En inventario</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-100 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><span>🚨</span>Alertas Activas</h2>
                  <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="text-3xl font-extrabold text-red-600 mb-2">
                  {alerts.filter(a => a.status === 'ACTIVE').length}
                </div>
                <p className="text-sm text-gray-600">Requieren atención</p>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-100 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><span>⚠️</span>Stock Bajo</h2>
                  <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <div className="text-3xl font-extrabold text-yellow-600 mb-2">
                  {lowStockProducts.length}
                </div>
                <p className="text-sm text-gray-600">Productos bajo mínimo</p>
              </Card>
            </div>

            {/* Recent Alerts */}
            {alerts && alerts.length > 0 && (
              <Card className="p-6 shadow-md bg-white/80 backdrop-blur">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2"><span>🚨</span>Alertas Recientes</h2>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className={`flex items-center justify-between p-3 rounded-xl border ${getPriorityColor(alert.priority)} shadow-sm transition-all duration-200 hover:scale-[1.02]`}> 
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                        <div>
                          <div className="font-semibold text-gray-800">{alert.message}</div>
                          <div className="text-sm text-gray-600">
                            {alert.product?.name || 'Producto'} • {new Date(alert.createdAt).toLocaleDateString('es-ES')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(alert.priority) + ' font-bold px-2 py-1 rounded-xl'}>
                          {alert.priority}
                        </Badge>
                        {alert.status === 'ACTIVE' && (
                          <button 
                            onClick={() => resolveAlert(alert.id)}
                            className="px-4 py-1 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow hover:scale-105 transition-all"
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
          <Card className="p-6 shadow-md bg-white/80 backdrop-blur">
            <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2"><span>🚨</span>Todas las Alertas</h2>
            <div className="space-y-3">
              {alerts && alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div key={alert.id} className={`flex items-center justify-between p-3 rounded-xl border ${getPriorityColor(alert.priority)} shadow-sm transition-all duration-200 hover:scale-[1.01]`}> 
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getAlertIcon(alert.type)}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{alert.message}</div>
                        <div className="text-sm text-gray-600">
                          {alert.product?.name || 'Producto'} • {new Date(alert.createdAt).toLocaleDateString('es-ES')}
                        </div>
                        {alert.currentValue !== undefined && alert.threshold !== undefined && (
                          <div className="text-xs text-gray-500 mt-1">
                            Actual: {alert.currentValue} | Umbral: {alert.threshold}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(alert.priority) + ' font-bold px-2 py-1 rounded-xl'}>
                        {alert.priority}
                      </Badge>
                      <Badge className={
                        alert.status === 'ACTIVE' ? 'bg-red-100 text-red-800 font-bold' :
                        alert.status === 'ACKNOWLEDGED' ? 'bg-yellow-100 text-yellow-800 font-bold' :
                        'bg-green-100 text-green-800 font-bold'
                      + ' px-2 py-1 rounded-xl'}>
                        {alert.status}
                      </Badge>
                      {alert.status === 'ACTIVE' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="px-4 py-1 text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow hover:scale-105 transition-all"
                          >
                            Reconocer
                          </button>
                          <button 
                            onClick={() => resolveAlert(alert.id)}
                            className="px-4 py-1 text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow hover:scale-105 transition-all"
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
          <div className="space-y-8">
            {/* Low Stock Products */}
            <Card className="p-6 shadow-md bg-white/80 backdrop-blur">
              <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2"><span>⚠️</span>Productos con Stock Bajo</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-100">
                      <th className="text-left py-3 px-4 font-semibold flex items-center gap-1"><span>📦</span>Producto</th>
                      <th className="text-left py-3 px-4 font-semibold flex items-center gap-1"><span>🔢</span>SKU</th>
                      <th className="text-right py-3 px-4 font-semibold flex items-center gap-1"><span>📊</span>Stock Actual</th>
                      <th className="text-right py-3 px-4 font-semibold flex items-center gap-1"><span>📉</span>Stock Mínimo</th>
                      <th className="text-center py-3 px-4 font-semibold flex items-center gap-1"><span>⚠️</span>Estado</th>
                      <th className="text-center py-3 px-4 font-semibold flex items-center gap-1"><span>🛠️</span>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts && lowStockProducts.length > 0 ? (
                      lowStockProducts.map((product, index) => (
                        <tr key={product.id || index} className="border-b border-gray-100 hover:bg-yellow-50 transition-all duration-150">
                          <td className="py-3 px-4 font-medium">{product.name || 'Sin nombre'}</td>
                          <td className="py-3 px-4 text-gray-600">{product.sku || 'Sin SKU'}</td>
                          <td className="py-3 px-4 text-right">{product.stock || product.availableStock || 0}</td>
                          <td className="py-3 px-4 text-right">{product.minStockLevel || 0}</td>
                          <td className="py-3 px-4 text-center">
                            <Badge className="bg-red-100 text-red-800 font-bold px-2 py-1 rounded-xl">
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
                              className="px-4 py-1 text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow hover:scale-105 transition-all"
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
            <Card className="p-6 shadow-md bg-white/80 backdrop-blur">
              <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2"><span>⏰</span>Productos por Vencer</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gradient-to-r from-rose-50 to-yellow-100">
                      <th className="text-left py-3 px-4 font-semibold flex items-center gap-1"><span>📦</span>Producto</th>
                      <th className="text-left py-3 px-4 font-semibold flex items-center gap-1"><span>🔢</span>SKU</th>
                      <th className="text-right py-3 px-4 font-semibold flex items-center gap-1"><span>📊</span>Stock</th>
                      <th className="text-center py-3 px-4 font-semibold flex items-center gap-1"><span>⏰</span>Fecha Vencimiento</th>
                      <th className="text-center py-3 px-4 font-semibold flex items-center gap-1"><span>⚠️</span>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expiringProducts && expiringProducts.length > 0 ? (
                      expiringProducts.map((product, index) => (
                        <tr key={product.id || index} className="border-b border-gray-100 hover:bg-rose-50 transition-all duration-150">
                          <td className="py-3 px-4 font-medium">{product.name || 'Sin nombre'}</td>
                          <td className="py-3 px-4 text-gray-600">{product.sku || 'Sin SKU'}</td>
                          <td className="py-3 px-4 text-right">{product.stock || product.availableStock || 0}</td>
                          <td className="py-3 px-4 text-center">
                            {product.expirationDate ? new Date(product.expirationDate).toLocaleDateString('es-ES') : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge className={
                              product.isExpired 
                                ? 'bg-red-100 text-red-800 font-bold px-2 py-1 rounded-xl' 
                                : 'bg-yellow-100 text-yellow-800 font-bold px-2 py-1 rounded-xl'
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
    </div>
  );
};

export default InventoryDashboard;
