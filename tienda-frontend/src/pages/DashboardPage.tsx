import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  loyaltyPoints: number;
  memberSince: Date;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  wishlistItems: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  date: Date;
  itemCount: number;
}

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  discount: number;
  imageUrl?: string;
}

interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  discount: number;
  imageUrl?: string;
  totalPurchased: number;
}

interface RecentlyViewedProduct {
  id: number;
  name: string;
  price: number;
  discount: number;
  imageUrl?: string;
}

interface PendingOrder {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  date: Date;
  estimatedDelivery: Date;
}

interface DashboardData {
  user: UserInfo;
  stats: UserStats;
  recentOrders: RecentOrder[];
  wishlist: WishlistItem[];
  favoriteProducts: FavoriteProduct[];
  recentlyViewed: RecentlyViewedProduct[];
  pendingOrders: PendingOrder[];
}

const UserDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data para demo
    const mockData: DashboardData = {
      user: {
        id: 1,
        name: 'Usuario Demo',
        email: 'usuario@demo.com',
        loyaltyPoints: 150,
        memberSince: new Date('2023-01-15'),
      },
      stats: {
        totalOrders: 12,
        totalSpent: 450.75,
        loyaltyPoints: 150,
        wishlistItems: 3,
      },
      recentOrders: [
        {
          id: 1,
          orderNumber: 'ORD-001',
          status: 'delivered',
          total: 89.99,
          date: new Date('2024-01-20'),
          itemCount: 2,
        },
        {
          id: 2,
          orderNumber: 'ORD-002',
          status: 'shipped',
          total: 125.50,
          date: new Date('2024-01-18'),
          itemCount: 1,
        }
      ],
      wishlist: [
        {
          id: 1,
          name: 'Camiseta Premium',
          price: 29.99,
          discount: 0,
        },
        {
          id: 2,
          name: 'Pantalón Casual',
          price: 59.99,
          discount: 10,
        }
      ],
      favoriteProducts: [],
      recentlyViewed: [],
      pendingOrders: [
        {
          id: 2,
          orderNumber: 'ORD-002',
          status: 'shipped',
          total: 125.50,
          date: new Date('2024-01-18'),
          estimatedDelivery: new Date('2024-01-25'),
        }
      ],
    };

    setTimeout(() => {
      setDashboardData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {dashboardData.user.avatarUrl ? (
                <img
                  src={dashboardData.user.avatarUrl}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 text-2xl font-bold">
                    {dashboardData.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                ¡Hola, {dashboardData.user.name}!
              </h1>
              <p className="text-gray-600">{dashboardData.user.email}</p>
              <p className="text-sm text-gray-500">
                Miembro desde {formatDate(dashboardData.user.memberSince)}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-indigo-600">
                <span className="text-sm mr-2">🎁</span>
                <span className="text-2xl font-bold">{dashboardData.user.loyaltyPoints}</span>
              </div>
              <p className="text-sm text-gray-500">Puntos de fidelidad</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <span className="text-2xl mr-4">🛍️</span>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalOrders}</p>
                <p className="text-gray-600">Pedidos totales</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <span className="text-2xl mr-4">💰</span>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(dashboardData.stats.totalSpent)}
                </p>
                <p className="text-gray-600">Total gastado</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <span className="text-2xl mr-4">❤️</span>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.wishlistItems}</p>
                <p className="text-gray-600">Lista de deseos</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <span className="text-2xl mr-4">🎁</span>
              <div>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.loyaltyPoints}</p>
                <p className="text-gray-600">Puntos disponibles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Pedidos recientes</h2>
                <Link to="/orders" className="text-indigo-600 hover:text-indigo-800">
                  Ver todos
                </Link>
              </div>
              <div className="space-y-4">
                {dashboardData.recentOrders.length > 0 ? (
                  dashboardData.recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Pedido #{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {order.itemCount} artículo{order.itemCount !== 1 ? 's' : ''} • {formatDate(order.date)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatPrice(order.total)}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No tienes pedidos recientes</p>
                )}
              </div>
            </div>

            {/* Pending Orders */}
            {dashboardData.pendingOrders.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Pedidos en camino</h2>
                <div className="space-y-4">
                  {dashboardData.pendingOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">Pedido #{order.orderNumber}</p>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <span className="mr-1">🚚</span>
                            Entrega estimada: {formatDate(order.estimatedDelivery)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatPrice(order.total)}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Wishlist */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Lista de deseos</h2>
                <span className="text-xl">❤️</span>
              </div>
              <div className="space-y-4">
                {dashboardData.wishlist.length > 0 ? (
                  dashboardData.wishlist.slice(0, 3).map((item) => (
                    <Link key={item.id} to={`/products/${item.id}`} className="block">
                      <div className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400">📦</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-indigo-600 font-bold">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">Tu lista de deseos está vacía</p>
                )}
              </div>
            </div>

            {/* Recently Viewed */}
            {dashboardData.recentlyViewed.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Vistos recientemente</h2>
                  <span className="text-xl">👁️</span>
                </div>
                <div className="space-y-4">
                  {dashboardData.recentlyViewed.slice(0, 3).map((item) => (
                    <Link key={item.id} to={`/products/${item.id}`} className="block">
                      <div className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400">📦</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-indigo-600 font-bold">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones rápidas</h2>
              <div className="space-y-2">
                <Link
                  to="/products"
                  className="block w-full text-left px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  🛍️ Explorar productos
                </Link>
                <Link
                  to="/orders"
                  className="block w-full text-left px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  📋 Ver historial de pedidos
                </Link>
                <Link
                  to="/wishlist"
                  className="block w-full text-left px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  ❤️ Ver lista de deseos
                </Link>
                <Link
                  to="/profile"
                  className="block w-full text-left px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                >
                  ⚙️ Configurar perfil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
