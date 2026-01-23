import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';

interface OrderTrackingInfo {
  orderNumber: string;
  status: string;
  trackingCode?: string;
  shippingCarrier?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  statusHistory: Array<{
    id: number;
    fromStatus: string;
    toStatus: string;
    reason?: string;
    notes?: string;
    createdAt: string;
    changedBy?: {
      username: string;
    };
  }>;
}

const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [trackingInfo, setTrackingInfo] = useState<OrderTrackingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrackingInfo();
  }, [orderId]);

  const fetchTrackingInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/orders/${orderId}/tracking`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrackingInfo(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error fetching tracking information');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50',
      processing: 'bg-blue-500/30 text-blue-100 border border-blue-400/50',
      shipped: 'bg-purple-500/30 text-purple-100 border border-purple-400/50',
      delivered: 'bg-green-500/30 text-green-100 border border-green-400/50',
      cancelled: 'bg-red-500/30 text-red-100 border border-red-400/50',
      returned: 'bg-orange-500/30 text-orange-100 border border-orange-400/50',
      refunded: 'bg-gray-500/30 text-gray-100 border border-gray-400/50',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/30 text-gray-100 border border-gray-400/50';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="mt-4 text-gray-300 text-lg">📦 Cargando información de seguimiento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="text-red-400 text-5xl mb-4">❌</div>
          <p className="text-red-300 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!trackingInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <p className="text-gray-300 text-lg relative z-10">📋 No se encontró información de seguimiento</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 relative overflow-hidden">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 mb-8 hover:border-white/30 transition-all duration-300">
          <h1 className="text-4xl font-bold text-white mb-4">
            📦 Seguimiento de Pedido #{trackingInfo.orderNumber}
          </h1>
          <div className="flex items-center flex-wrap gap-6">
            <span className={`inline-flex items-center px-6 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${getStatusColor(trackingInfo.status)}`}>
              🎯 {getStatusDisplayName(trackingInfo.status)}
            </span>
            {trackingInfo.trackingCode && (
              <div className="text-gray-300">
                <span className="font-bold text-white">Código:</span> <span className="font-mono text-purple-300">{trackingInfo.trackingCode}</span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping Information */}
        {(trackingInfo.trackingCode || trackingInfo.shippingCarrier) && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 mb-8 hover:border-white/30 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">🚚 Información de Envío</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trackingInfo.shippingCarrier && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-gray-400 text-sm font-medium mb-1">Transportista</p>
                  <p className="text-white font-bold text-lg">{trackingInfo.shippingCarrier}</p>
                </div>
              )}
              {trackingInfo.trackingCode && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-gray-400 text-sm font-medium mb-1">Código de Seguimiento</p>
                  <p className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-mono font-bold text-lg">{trackingInfo.trackingCode}</p>
                </div>
              )}
              {trackingInfo.estimatedDeliveryDate && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-gray-400 text-sm font-medium mb-1">📅 Fecha Estimada de Entrega</p>
                  <p className="text-white font-bold text-lg">
                    {new Date(trackingInfo.estimatedDeliveryDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
              {trackingInfo.actualDeliveryDate && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-gray-400 text-sm font-medium mb-1">✅ Fecha de Entrega</p>
                  <p className="text-green-300 font-bold text-lg">
                    {new Date(trackingInfo.actualDeliveryDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status History Timeline */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 hover:border-white/30 transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-8">⏳ Historial de Estados</h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {trackingInfo.statusHistory.map((item, idx) => (
                <li key={item.id}>
                  <div className="relative pb-10">
                    {idx !== trackingInfo.statusHistory.length - 1 && (
                      <span className="absolute top-12 left-8 -ml-px h-full w-1 bg-gradient-to-b from-purple-500/50 to-transparent" aria-hidden="true" />
                    )}
                    <div className="relative flex space-x-4">
                      <div>
                        <span className={`h-16 w-16 rounded-full flex items-center justify-center ring-4 ring-gray-900 ${getStatusColor(item.toStatus)} font-bold text-xl backdrop-blur-sm`}>
                          ✓
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-2 flex justify-between space-x-4">
                        <div className="flex flex-col space-y-2">
                          <p className="text-white font-bold text-lg">
                            Estado: <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">{getStatusDisplayName(item.toStatus)}</span>
                          </p>
                          {item.reason && (
                            <p className="text-gray-300 text-sm">💭 <span className="font-medium">Motivo:</span> {item.reason}</p>
                          )}
                          {item.notes && (
                            <p className="text-gray-300 text-sm">📝 <span className="font-medium">Notas:</span> {item.notes}</p>
                          )}
                          {item.changedBy && (
                            <p className="text-gray-400 text-xs">👤 Por: <span className="font-medium text-gray-300">{item.changedBy.username}</span></p>
                          )}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-400 font-medium">
                          {new Date(item.createdAt).toLocaleString('es-ES')}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
