import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';
import { Button, Card, Badge } from '../components/ui';
import { getProductImage } from '../utils/productImages';

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
        const response = await fetch(`${API_BASE_URL}/users/${user.id}/dashboard`, {
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success" icon="✅">Entregado</Badge>;
      case 'shipped':
        return <Badge variant="primary" icon="🚚">Enviado</Badge>;
      case 'processing':
        return <Badge variant="warning" icon="⏳">Procesando</Badge>;
      case 'pending':
        return <Badge variant="secondary" icon="⏸️">Pendiente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        {/* Floating Gradient Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <Card className="text-center p-12">
            <div className="text-8xl mb-6 animate-spin">⚙️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Cargando tu dashboard</h2>
            <p className="text-gray-600 text-lg">Preparando tu experiencia personalizada...</p>
            <div className="mt-8 w-64 bg-gray-200 rounded-full h-2 mx-auto">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <Card className="text-center max-w-md p-12">
            <div className="text-8xl mb-6">😔</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">¡Ups! Algo salió mal</h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button onClick={() => window.location.reload()} variant="primary" icon="🔄">
              Intentar de nuevo
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <Card className="text-center max-w-md p-12">
            <div className="text-8xl mb-6">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard no disponible</h2>
            <p className="text-gray-600 mb-8">No se pudieron cargar los datos de tu dashboard</p>
            <Button onClick={() => window.location.reload()} variant="primary" icon="🔄">
              Reintentar
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 min-h-screen">
        {/* Enhanced Header */}
        <Card className="mb-8 overflow-hidden" padding="none">
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl">
                    {dashboardData.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    ¡Hola, {dashboardData.user.name}! 👋
                  </h1>
                  <p className="text-purple-100 text-lg mb-2">
                    Miembro desde {formatDate(dashboardData.user.memberSince)}
                  </p>
                  <Badge variant="primary" className="bg-white/20 text-white" size="lg">
                    ✨ {dashboardData.stats.loyaltyPoints} puntos de fidelidad
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" icon="👤">
                  Ver Perfil
                </Button>
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30" icon="🛒">
                  Nueva Compra
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Pedidos</p>
                <p className="text-3xl font-bold">{dashboardData.stats.totalOrders}</p>
                <p className="text-blue-200 text-xs mt-1">Pedidos realizados</p>
              </div>
              <div className="text-4xl opacity-80">📦</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Total Gastado</p>
                <p className="text-3xl font-bold">{formatPrice(dashboardData.stats.totalSpent)}</p>
                <p className="text-green-200 text-xs mt-1">En compras</p>
              </div>
              <div className="text-4xl opacity-80">💰</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Puntos Fidelidad</p>
                <p className="text-3xl font-bold">{dashboardData.stats.loyaltyPoints}</p>
                <p className="text-purple-200 text-xs mt-1">Disponibles</p>
              </div>
              <div className="text-4xl opacity-80">✨</div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium mb-1">Lista de Deseos</p>
                <p className="text-3xl font-bold">{dashboardData.stats.wishlistItems}</p>
                <p className="text-pink-200 text-xs mt-1">Productos guardados</p>
              </div>
              <div className="text-4xl opacity-80">❤️</div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Recent Orders */}
          <Card gradient>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">📋 Pedidos Recientes</h2>
                <p className="text-gray-600">Tus últimas compras</p>
              </div>
              <Button variant="outline" size="sm" icon="👀">
                Ver todos
              </Button>
            </div>

            {dashboardData.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <Card key={order.id} className="bg-white/80 backdrop-blur-sm" hover padding="md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-800">#{order.orderNumber}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          📅 {formatDate(order.date)}
                        </p>
                        <p className="text-sm text-gray-600">
                          📦 {order.itemCount} artículos
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-gray-800">
                          {formatPrice(order.total)}
                        </p>
                        <Button variant="outline" size="sm" className="mt-2" icon="👁️">
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No tienes pedidos recientes</h3>
                <p className="text-gray-500 mb-6">¡Es el momento perfecto para hacer tu primera compra!</p>
                <Button variant="primary" icon="🛒">
                  Explorar productos
                </Button>
              </div>
            )}
          </Card>

          {/* Enhanced Wishlist */}
          <Card gradient>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">❤️ Lista de Deseos</h2>
                <p className="text-gray-600">Productos que te encantan</p>
              </div>
              <Button variant="outline" size="sm" icon="👀">
                Ver todos
              </Button>
            </div>

            {dashboardData.wishlist.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {dashboardData.wishlist.slice(0, 4).map((item) => (
                  <Card key={item.id} className="bg-white/80 backdrop-blur-sm group" hover padding="sm">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                      {item.imageUrl ? (
                        <img
                          src={getProductImage(item.name, (item as any).category || '', item.imageUrl)}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">👕</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="primary" size="sm" className="rounded-full w-8 h-8 p-0">
                          🛒
                        </Button>
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-1">
                      {item.name}
                    </h3>
                    <Badge variant="primary" size="sm">
                      {formatPrice(item.price)}
                    </Badge>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">Tu lista de deseos está vacía</h3>
                <p className="text-gray-500 mb-6">Guarda productos que te gusten para comprarlos más tarde</p>
                <Button variant="primary" icon="🔍">
                  Explorar productos
                </Button>
              </div>
            )}
          </Card>

          {/* Enhanced Favorite Products */}
          <Card gradient>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">⭐ Productos Favoritos</h2>
                <p className="text-gray-600">Los que más has comprado</p>
              </div>
            </div>

            {dashboardData.favoriteProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {dashboardData.favoriteProducts.map((product) => (
                  <Card key={product.id} className="bg-white/80 backdrop-blur-sm group" hover padding="sm">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                      {product.imageUrl ? (
                        <img
                          src={getProductImage(product.name, (product as any).category || '', product.imageUrl)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl">👕</span>
                        </div>
                      )}
                      <Badge 
                        variant="warning" 
                        className="absolute top-2 left-2" 
                        size="sm"
                      >
                        ⭐ {product.totalPurchased}x
                      </Badge>
                    </div>
                    <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    <Badge variant="primary" size="sm">
                      {formatPrice(product.price)}
                    </Badge>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No tienes productos favoritos aún</h3>
                <p className="text-gray-500 mb-6">Compra productos para que aparezcan aquí</p>
                <Button variant="primary" icon="🛒">
                  Ir de compras
                </Button>
              </div>
            )}
          </Card>

          {/* Enhanced Pending Orders */}
          <Card gradient>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">⏳ Pedidos Pendientes</h2>
                <p className="text-gray-600">Siguimiento de envíos</p>
              </div>
            </div>

            {dashboardData.pendingOrders.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.pendingOrders.map((order) => (
                  <Card key={order.id} className="bg-white/80 backdrop-blur-sm" hover padding="md">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-800">#{order.orderNumber}</h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          📅 Pedido: {formatDate(order.date)}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          🚚 Llegada: {formatDate(order.estimatedDelivery)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-gray-800 mb-2">
                          {formatPrice(order.total)}
                        </p>
                        <Button variant="primary" size="sm" icon="📍">
                          Rastrear
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No tienes pedidos pendientes</h3>
                <p className="text-gray-500 mb-6">Todos tus pedidos han sido entregados</p>
                <Button variant="success" icon="✅">
                  Hacer nuevo pedido
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions Section */}
        <Card className="mt-8" gradient>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">⚡ Acciones Rápidas</h2>
            <p className="text-gray-600">Todo lo que necesitas en un solo lugar</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="primary" fullWidth icon="🛒" size="lg" className="h-20 flex-col">
              <span className="font-bold">Comprar</span>
              <span className="text-sm opacity-90">Explorar productos</span>
            </Button>
            <Button variant="success" fullWidth icon="📋" size="lg" className="h-20 flex-col">
              <span className="font-bold">Mis Pedidos</span>
              <span className="text-sm opacity-90">Ver historial</span>
            </Button>
            <Button variant="outline" fullWidth icon="❤️" size="lg" className="h-20 flex-col">
              <span className="font-bold">Favoritos</span>
              <span className="text-sm opacity-90">Lista de deseos</span>
            </Button>
            <Button variant="secondary" fullWidth icon="👤" size="lg" className="h-20 flex-col">
              <span className="font-bold">Perfil</span>
              <span className="text-sm opacity-90">Mi cuenta</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
