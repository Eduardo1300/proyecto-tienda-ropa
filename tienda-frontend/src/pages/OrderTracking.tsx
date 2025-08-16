import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.get(`http://localhost:3000/orders/${orderId}/tracking`, {
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
          <p className="mt-4 text-gray-600">Cargando información de seguimiento...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!trackingInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No se encontró información de seguimiento</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Seguimiento de Pedido #{trackingInfo.orderNumber}
          </h1>
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingInfo.status)}`}>
              {getStatusDisplayName(trackingInfo.status)}
            </span>
            {trackingInfo.trackingCode && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Código de seguimiento:</span> {trackingInfo.trackingCode}
              </div>
            )}
          </div>
        </div>

        {/* Shipping Information */}
        {(trackingInfo.trackingCode || trackingInfo.shippingCarrier) && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Envío</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trackingInfo.shippingCarrier && (
                <div>
                  <p className="text-sm text-gray-600">Transportista</p>
                  <p className="font-medium">{trackingInfo.shippingCarrier}</p>
                </div>
              )}
              {trackingInfo.trackingCode && (
                <div>
                  <p className="text-sm text-gray-600">Código de Seguimiento</p>
                  <p className="font-medium font-mono">{trackingInfo.trackingCode}</p>
                </div>
              )}
              {trackingInfo.estimatedDeliveryDate && (
                <div>
                  <p className="text-sm text-gray-600">Fecha Estimada de Entrega</p>
                  <p className="font-medium">
                    {new Date(trackingInfo.estimatedDeliveryDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
              {trackingInfo.actualDeliveryDate && (
                <div>
                  <p className="text-sm text-gray-600">Fecha de Entrega</p>
                  <p className="font-medium">
                    {new Date(trackingInfo.actualDeliveryDate).toLocaleDateString('es-ES')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial de Estados</h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {trackingInfo.statusHistory.map((item, idx) => (
                <li key={item.id}>
                  <div className="relative pb-8">
                    {idx !== trackingInfo.statusHistory.length - 1 && (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getStatusColor(item.toStatus)}`}>
                          <span className="text-xs">●</span>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-900">
                            Estado cambiado a <span className="font-medium">{getStatusDisplayName(item.toStatus)}</span>
                          </p>
                          {item.reason && (
                            <p className="text-sm text-gray-600">Motivo: {item.reason}</p>
                          )}
                          {item.notes && (
                            <p className="text-sm text-gray-600">Notas: {item.notes}</p>
                          )}
                          {item.changedBy && (
                            <p className="text-xs text-gray-500">Por: {item.changedBy.username}</p>
                          )}
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
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
