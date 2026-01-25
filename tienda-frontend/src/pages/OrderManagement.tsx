import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ordersAPI, API_BASE_URL } from '../services/api';
import type { Order } from '../types';

// Extend the Order type with additional properties needed for UI
interface ExtendedOrder extends Order {
  canBeCancelled: boolean;
  canBeReturned: boolean;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      
      const ordersData = response.data;
      
      // Transform orders to add UI-specific properties
      const extendedOrders: ExtendedOrder[] = ordersData.map((order: Order) => ({
        ...order,
        canBeCancelled: order.status === 'pending' || order.status === 'processing',
        canBeReturned: order.status === 'delivered'
      }));
      
      setOrders(extendedOrders);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!selectedOrder || !cancelReason.trim()) return;

    setCancellingOrder(selectedOrder.id);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/orders/${selectedOrder.id}/cancel`, {
        reason: cancelReason,
        notes: 'Cancelled by customer'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refresh orders
      await fetchOrders();
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedOrder(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error cancelling order');
    } finally {
      setCancellingOrder(null);
    }
  };

  const downloadInvoice = async (orderId: number, orderNumber: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}/invoice`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error downloading invoice');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      returned: 'bg-orange-100 text-orange-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusDisplayName = (status: string) => {
    const names = {
      pending: 'Pendiente',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
      returned: 'Devuelto',
      refunded: 'Reembolsado',
    };
    return names[status as keyof typeof names] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
          <p className="mt-2 text-gray-600">Gestiona y rastrea todos tus pedidos</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
            <p className="text-gray-600 mb-6">Cuando realices tu primer pedido, aparecerá aquí</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Pedido #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusDisplayName(order.status)}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        ${Number(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                            {item.product.imageUrl ? (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-md"
                              />
                            ) : (
                              <span className="text-gray-400 text-xs">Sin imagen</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              Cantidad: {item.quantity} × ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-3">
                      <Link
                        to={`/orders/${order.id}/tracking`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        🔍 Rastrear
                      </Link>
                      <button
                        onClick={() => downloadInvoice(order.id, order.orderNumber || `ORD-${order.id}`)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        📄 Factura
                      </button>
                      {order.canBeReturned && (
                        <Link
                          to={`/orders/${order.id}/return`}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          ↩️ Devolver
                        </Link>
                      )}
                    </div>
                    {order.canBeCancelled && (
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowCancelModal(true);
                        }}
                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        ❌ Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && selectedOrder && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Cancelar Pedido #{selectedOrder.orderNumber}
                </h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo de cancelación *
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Selecciona un motivo</option>
                    <option value="changed_mind">Cambié de opinión</option>
                    <option value="found_better_price">Encontré mejor precio</option>
                    <option value="delivery_too_slow">Entrega muy lenta</option>
                    <option value="ordered_by_mistake">Pedido por error</option>
                    <option value="other">Otro motivo</option>
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancelOrder}
                    disabled={!cancelReason.trim() || cancellingOrder === selectedOrder.id}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancellingOrder === selectedOrder.id ? 'Cancelando...' : 'Confirmar Cancelación'}
                  </button>
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setCancelReason('');
                      setSelectedOrder(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
