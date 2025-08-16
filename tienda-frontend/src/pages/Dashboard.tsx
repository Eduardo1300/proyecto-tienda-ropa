import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  loyaltyPoints: number;
  memberSince: string;
}

interface Stats {
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
  date: string;
  itemCount: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  imageUrl?: string;
}

interface WishlistItem extends Product {}

interface FavoriteProduct extends Product {
  totalPurchased: number;
}

interface PendingOrder {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  date: string;
  estimatedDelivery: string;
}

interface DashboardData {
  user: UserInfo;
  stats: Stats;
  recentOrders: RecentOrder[];
  wishlist: WishlistItem[];
  favoriteProducts: FavoriteProduct[];
  recentlyViewed: Product[];
  pendingOrders: PendingOrder[];
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`http://localhost:3002/users/${user.id}/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los datos del dashboard');
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>No se pudieron cargar los datos del dashboard</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header del Dashboard */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {dashboardData.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hola, {dashboardData.user.name}
              </h1>
              <p className="text-gray-600">
                Miembro desde {formatDate(dashboardData.user.memberSince)}
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Pedidos</h3>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardData.stats.totalOrders}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Gastado</h3>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(dashboardData.stats.totalSpent)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Puntos de Fidelidad</h3>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardData.stats.loyaltyPoints}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Lista de Deseos</h3>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardData.stats.wishlistItems}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pedidos Recientes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pedidos Recientes
            </h2>
            {dashboardData.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.itemCount} artículos
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No tienes pedidos recientes
              </p>
            )}
          </div>

          {/* Lista de Deseos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Lista de Deseos
            </h2>
            {dashboardData.wishlist.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {dashboardData.wishlist.slice(0, 4).map((item) => (
                  <div key={item.id} className="text-center">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Tu lista de deseos está vacía
              </p>
            )}
          </div>

          {/* Productos Favoritos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tus Productos Favoritos
            </h2>
            {dashboardData.favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {dashboardData.favoriteProducts.map((product) => (
                  <div key={product.id} className="text-center">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm">Sin imagen</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Comprado {product.totalPurchased} veces
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No tienes productos favoritos aún
              </p>
            )}
          </div>

          {/* Pedidos Pendientes */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pedidos Pendientes
            </h2>
            {dashboardData.pendingOrders.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          Pedido: {formatDate(order.date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Entrega estimada: {formatDate(order.estimatedDelivery)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No tienes pedidos pendientes
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
