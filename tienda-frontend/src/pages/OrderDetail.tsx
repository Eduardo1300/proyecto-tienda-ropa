import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi } from '../services/adminApi';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  trackingCode?: string;
  estimatedDeliveryDate?: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  items: OrderItem[];
  statusHistory?: Array<{
    id: number;
    status: string;
    createdAt: string;
    notes?: string;
  }>;
}

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(parseInt(orderId));
    }
  }, [orderId]);

  const fetchOrderDetail = async (id: number) => {
    try {
      setLoading(true);
      const orderData = await adminApi.getOrderById(id);
      setOrder(orderData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los detalles de la orden');
      console.error('Error fetching order detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'processing':
        return 'Procesando';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando detalles de la orden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Volver al Perfil
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Orden no encontrada</h2>
          <p className="text-gray-600 mb-6">La orden solicitada no existe o no tienes permisos para verla.</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            Volver al Perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center text-purple-600 hover:text-purple-800 mb-4"
          >
            ← Volver al Perfil
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Detalles de la Orden #{order.orderNumber}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Información de la Orden</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Número de Orden</p>
                  <p className="font-semibold">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha de Creación</p>
                  <p className="font-semibold">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="font-semibold text-purple-600">
                    ${typeof order.total === 'number' ? order.total.toFixed(2) : parseFloat(order.total || '0').toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🛍️ Productos</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img
                      src={item.product.imageUrl || 'https://via.placeholder.com/80x80'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                      <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                      <p className="text-sm text-gray-600">
                        Precio unitario: ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || '0').toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-purple-600">
                        ${(typeof item.price === 'number' ? item.price * item.quantity : parseFloat(item.price || '0') * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🚚 Dirección de Envío</h2>
              <p className="text-gray-600">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tracking Information */}
            {order.trackingCode && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Seguimiento</h2>
                <div>
                  <p className="text-sm text-gray-600">Código de Seguimiento</p>
                  <p className="font-semibold break-all">{order.trackingCode}</p>
                </div>
                {order.estimatedDeliveryDate && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Fecha Estimada de Entrega</p>
                    <p className="font-semibold">{formatDate(order.estimatedDeliveryDate)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Historial de Estados</h2>
                <div className="space-y-3">
                  {order.statusHistory
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((history) => (
                      <div key={history.id} className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{getStatusText(history.status)}</p>
                          <p className="text-xs text-gray-600">{formatDate(history.createdAt)}</p>
                          {history.notes && (
                            <p className="text-sm text-gray-600 mt-1">{history.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
