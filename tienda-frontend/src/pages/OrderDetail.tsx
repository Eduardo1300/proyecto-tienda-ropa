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
    const colors = {
      pending: 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50',
      processing: 'bg-blue-500/30 text-blue-100 border border-blue-400/50',
      shipped: 'bg-purple-500/30 text-purple-100 border border-purple-400/50',
      delivered: 'bg-green-500/30 text-green-100 border border-green-400/50',
      cancelled: 'bg-red-500/30 text-red-100 border border-red-400/50',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500/30 text-gray-100 border border-gray-400/50';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">⏳ Cargando detalles de la orden...</p>
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
          <div className="text-red-400 text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-300 mb-8 text-lg">{error}</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
          >
            ⬅️ Volver al Perfil
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Floating Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="text-center relative z-10">
          <div className="text-yellow-400 text-6xl mb-4">📦</div>
          <h2 className="text-3xl font-bold text-white mb-2">Orden no encontrada</h2>
          <p className="text-gray-300 mb-8 text-lg">La orden solicitada no existe o no tienes permisos para verla.</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg"
          >
            ⬅️ Volver al Perfil
          </button>
        </div>
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

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center text-gray-300 hover:text-white mb-6 font-semibold text-lg group"
          >
            <span className="group-hover:-translate-x-2 transition-transform">⬅️</span>
            <span className="ml-2">Volver al Perfil</span>
          </button>
          <h1 className="text-5xl font-bold text-white">
            📋 Detalles de la Orden #{order.orderNumber}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 mb-8 hover:border-white/30 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-6">ℹ️ Información de la Orden</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-gray-400 text-sm font-medium mb-1">Número de Orden</p>
                  <p className="text-white font-bold text-lg">{order.orderNumber}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-gray-400 text-sm font-medium mb-2">Estado</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-gray-400 text-sm font-medium mb-1">📅 Fecha de Creación</p>
                  <p className="text-white font-semibold">{formatDate(order.createdAt)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-gray-400 text-sm font-medium mb-1">Total</p>
                  <p className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-bold text-lg">
                    ${typeof order.total === 'number' ? order.total.toFixed(2) : parseFloat(order.total || '0').toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 mb-8 hover:border-white/30 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-6">🛍️ Productos</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                    <img
                      src={item.product.imageUrl || 'https://via.placeholder.com/80x80'}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl ring-2 ring-white/20"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg">{item.product.name}</h3>
                      <p className="text-gray-300 text-sm">📦 Cantidad: {item.quantity}</p>
                      <p className="text-gray-400 text-sm">
                        💵 Precio unitario: ${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price || '0').toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-bold text-lg">
                        ${(typeof item.price === 'number' ? item.price * item.quantity : parseFloat(item.price || '0') * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 hover:border-white/30 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-6">🚚 Dirección de Envío</h2>
              <p className="text-gray-300 text-lg leading-relaxed bg-white/5 border border-white/10 rounded-2xl p-4">{order.shippingAddress}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tracking Information */}
            {order.trackingCode && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 mb-8 hover:border-white/30 transition-all duration-300">
                <h2 className="text-xl font-bold text-white mb-6">📍 Seguimiento</h2>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                  <p className="text-gray-400 text-sm font-medium mb-1">Código de Seguimiento</p>
                  <p className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-mono font-bold break-all">{order.trackingCode}</p>
                </div>
                {order.estimatedDeliveryDate && (
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-gray-400 text-sm font-medium mb-1">📅 Fecha Estimada</p>
                    <p className="text-white font-semibold">{formatDate(order.estimatedDeliveryDate)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Status History */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 hover:border-white/30 transition-all duration-300">
                <h2 className="text-xl font-bold text-white mb-6">📈 Historial de Estados</h2>
                <div className="space-y-4">
                  {order.statusHistory
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((history) => (
                      <div key={history.id} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                        <div className="flex-1">
                          <p className="font-bold text-white text-sm">{getStatusText(history.status)}</p>
                          <p className="text-gray-400 text-xs">{formatDate(history.createdAt)}</p>
                          {history.notes && (
                            <p className="text-gray-300 text-sm mt-1">{history.notes}</p>
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
