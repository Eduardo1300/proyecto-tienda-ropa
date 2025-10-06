import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { Button, Card, Input, Badge, Modal } from '../components/ui';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    imageUrl?: string;
  }>;
  trackingNumber?: string;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    birthDate: '',
    gender: '',
    bio: ''
  });

  // Verificar autenticación
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Cargar órdenes
  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      
      if (response?.data && Array.isArray(response.data)) {
        const transformedOrders = response.data.map((order: any) => ({
          id: order.id?.toString() || '',
          orderNumber: order.orderNumber || `ORD-${order.id}`,
          date: new Date(order.createdAt).toISOString().split('T')[0],
          status: order.status || 'pending',
          total: typeof order.total === 'number' ? order.total : parseFloat(order.total || '0'),
          items: order.items?.map((item: any) => ({
            id: item.id,
            name: item.product?.name || `Producto ${item.productId}`,
            quantity: item.quantity,
            price: typeof item.price === 'number' ? item.price : parseFloat(item.price || '0'),
            imageUrl: item.product?.imageUrl || item.product?.image || 'https://via.placeholder.com/80x80'
          })) || [],
          trackingNumber: order.trackingCode || order.trackingNumber
        }));
        
        setOrders(transformedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      setOrders([]);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      alert('✅ Perfil actualizado correctamente');
    } catch (error) {
      alert('❌ Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: Order['status']) => {
    const variants = {
      pending: 'warning' as const,
      processing: 'info' as const,
      shipped: 'primary' as const,
      delivered: 'success' as const,
      cancelled: 'danger' as const
    };
    return variants[status];
  };

  const getStatusText = (status: Order['status']) => {
    const texts = {
      pending: '⏳ Pendiente',
      processing: '⚙️ Procesando',
      shipped: '🚚 Enviado',
      delivered: '✅ Entregado',
      cancelled: '❌ Cancelado'
    };
    return texts[status];
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white" padding="none">
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl font-bold ring-4 ring-white/30">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">¡Hola, {user.username}! 👋</h1>
                  <p className="text-purple-100 text-lg">Gestiona tu cuenta y revisa tus pedidos</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-purple-200">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Cuenta verificada
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      {orders.length} pedidos
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="danger"
                icon="🚪"
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </Card>

        {/* Enhanced Tabs */}
        <Card className="mb-8" padding="none">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-1 px-6">
              {[
                { key: 'profile', label: 'Mi Perfil', icon: '👤', description: 'Información personal' },
                { key: 'orders', label: 'Mis Pedidos', icon: '📦', description: 'Historial de compras' },
                { key: 'addresses', label: 'Direcciones', icon: '📍', description: 'Direcciones de envío' },
                { key: 'security', label: 'Seguridad', icon: '🔒', description: 'Configuración de cuenta' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`relative py-6 px-4 text-center transition-all duration-200 group ${
                    activeTab === tab.key
                      ? 'text-purple-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                    {tab.icon}
                  </div>
                  <div className="font-medium text-sm">{tab.label}</div>
                  <div className="text-xs text-gray-400 hidden sm:block">{tab.description}</div>
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">👤 Información Personal</h2>
                    <p className="text-gray-600 mt-2">Gestiona tus datos personales y configuración de la cuenta</p>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="primary"
                      icon="✏️"
                    >
                      Editar Perfil
                    </Button>
                  ) : (
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="secondary"
                        icon="❌"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        loading={loading}
                        variant="success"
                        icon="💾"
                      >
                        Guardar Cambios
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="space-y-6" gradient>
                    <h3 className="text-xl font-semibold text-gray-800 border-b border-purple-100 pb-3">
                      Información Básica
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Nombre"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Tu nombre"
                        icon="👤"
                      />
                      <Input
                        label="Apellido"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Tu apellido"
                        icon="👤"
                      />
                    </div>
                    <Input
                      label="Nombre de Usuario"
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      disabled={!isEditing}
                      placeholder="Tu username"
                      icon="@"
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      placeholder="tu@email.com"
                      icon="📧"
                    />
                  </Card>

                  <Card className="space-y-6" gradient>
                    <h3 className="text-xl font-semibold text-gray-800 border-b border-purple-100 pb-3">
                      Información Adicional
                    </h3>
                    <Input
                      label="Teléfono"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      placeholder="+51 999 999 999"
                      icon="📱"
                    />
                    <Input
                      label="Fecha de Nacimiento"
                      type="date"
                      value={profileData.birthDate}
                      onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                      disabled={!isEditing}
                      icon="🎂"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Género
                      </label>
                      <select
                        value={profileData.gender}
                        onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 transition-all duration-200"
                      >
                        <option value="">Seleccionar género</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">Otro</option>
                        <option value="prefer-not-to-say">Prefiero no decir</option>
                      </select>
                    </div>
                  </Card>
                </div>

                {/* Account Statistics */}
                <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white" padding="lg">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    📊 Estadísticas de la Cuenta
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{orders.length}</div>
                      <div className="text-purple-100">Pedidos Totales</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">{user.role === 'admin' ? '👑' : '⭐'}</div>
                      <div className="text-purple-100">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">✅</div>
                      <div className="text-purple-100">Estado Activo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">🎉</div>
                      <div className="text-purple-100">Miembro desde Ago 2024</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">📦 Mis Pedidos</h2>
                    <p className="text-gray-600 mt-2">Historial completo de tus compras ({orders.length} pedidos)</p>
                  </div>
                  <Button
                    onClick={() => navigate('/products')}
                    variant="primary"
                    icon="🛍️"
                  >
                    Nueva Compra
                  </Button>
                </div>

                {orders.length === 0 ? (
                  <Card className="text-center py-16" gradient>
                    <div className="text-8xl mb-6">📦</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">¡Tu historial está vacío!</h3>
                    <p className="text-gray-500 mb-8 text-lg">Comienza explorando nuestros increíbles productos</p>
                    <Button
                      onClick={() => navigate('/products')}
                      variant="primary"
                      size="lg"
                      icon="🛍️"
                    >
                      Explorar Productos
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {orders.map((order) => (
                      <Card key={order.id} className="overflow-hidden" hover>
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                              📋 Pedido #{order.orderNumber}
                            </h3>
                            <p className="text-gray-600 flex items-center gap-2 mt-1">
                              📅 {new Date(order.date).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusVariant(order.status)} size="lg">
                              {getStatusText(order.status)}
                            </Badge>
                            <p className="text-2xl font-bold text-purple-600 mt-2">
                              S/ {order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                          <h4 className="font-semibold text-gray-800 mb-4">Productos ({order.items.length})</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-4 bg-white rounded-lg p-3">
                                <img
                                  src={item.imageUrl || 'https://via.placeholder.com/60x60'}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-gray-800">{item.name}</p>
                                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                </div>
                                <p className="font-bold text-purple-600">
                                  S/ {(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tracking */}
                        {order.trackingNumber && (
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                            <p className="text-sm text-blue-600 font-medium mb-1">🚚 Código de seguimiento:</p>
                            <p className="font-mono text-blue-800 font-bold">{order.trackingNumber}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            icon="📋"
                            onClick={() => navigate(`/orders/${order.id}`)}>
                              Ver Detalles
                            </Button>
                          {order.status === 'delivered' && (
                            <Button
                              variant="success"
                              size="sm"
                              icon="⭐"
                            >
                              Calificar
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button
                              variant="primary"
                              size="sm"
                              icon="🚚"
                            >
                              Rastrear
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            icon="🔄"
                            onClick={() => navigate('/products')}
                          >
                            Comprar de Nuevo
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">📍 Mis Direcciones</h2>
                    <p className="text-gray-600 mt-2">Gestiona tus direcciones de envío favoritas</p>
                  </div>
                  <Button
                    variant="primary"
                    icon="➕"
                  >
                    Agregar Dirección
                  </Button>
                </div>

                <Card className="text-center py-16" gradient>
                  <div className="text-8xl mb-6">📍</div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-4">Gestión de Direcciones</h3>
                  <p className="text-gray-500 mb-8 text-lg">Próximamente - Guarda tus direcciones favoritas</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
                      <div className="text-purple-600 text-2xl mb-3">🏠</div>
                      <h4 className="font-semibold text-gray-800">Casa</h4>
                      <p className="text-sm text-gray-600">Dirección principal</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
                      <div className="text-purple-600 text-2xl mb-3">🏢</div>
                      <h4 className="font-semibold text-gray-800">Oficina</h4>
                      <p className="text-sm text-gray-600">Dirección de trabajo</p>
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
                      <div className="text-purple-600 text-2xl mb-3">🎁</div>
                      <h4 className="font-semibold text-gray-800">Regalo</h4>
                      <p className="text-sm text-gray-600">Envío a terceros</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">🔒 Seguridad</h2>
                  <p className="text-gray-600 mt-2">Configuración de seguridad y privacidad de tu cuenta</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="space-y-6" gradient>
                    <h3 className="text-xl font-semibold text-gray-800 border-b border-purple-100 pb-3">
                      🔐 Contraseña
                    </h3>
                    <p className="text-gray-600">Cambia tu contraseña regularmente para mantener tu cuenta segura</p>
                    <Button variant="primary" icon="🔑" fullWidth>
                      Cambiar Contraseña
                    </Button>
                  </Card>

                  <Card className="space-y-6" gradient>
                    <h3 className="text-xl font-semibold text-gray-800 border-b border-purple-100 pb-3">
                      📱 Autenticación de Dos Factores
                    </h3>
                    <p className="text-gray-600">Agrega una capa extra de seguridad a tu cuenta</p>
                    <Button variant="success" icon="🛡️" fullWidth>
                      Activar 2FA
                    </Button>
                  </Card>

                  <Card className="space-y-6" gradient>
                    <h3 className="text-xl font-semibold text-gray-800 border-b border-purple-100 pb-3">
                      🔔 Notificaciones
                    </h3>
                    <p className="text-gray-600">Controla qué notificaciones quieres recibir</p>
                    <Button variant="outline" icon="⚙️" fullWidth>
                      Gestionar Notificaciones
                    </Button>
                  </Card>

                  <Card className="space-y-6" gradient>
                    <h3 className="text-xl font-semibold text-gray-800 border-b border-purple-100 pb-3">
                      📊 Privacidad
                    </h3>
                    <p className="text-gray-600">Configura la privacidad de tus datos personales</p>
                    <Button variant="outline" icon="🔒" fullWidth>
                      Configurar Privacidad
                    </Button>
                  </Card>
                </div>

                <Card className="bg-red-50 border border-red-200">
                  <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
                    ⚠️ Zona de Peligro
                  </h3>
                  <p className="text-red-700 mb-4">Acciones irreversibles que afectan permanentemente tu cuenta</p>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="danger" icon="🗑️">
                      Descargar Datos
                    </Button>
                    <Button variant="danger" icon="❌">
                      Eliminar Cuenta
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="¿Cerrar Sesión?"
        size="sm"
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🚪</div>
          <p className="text-gray-600 mb-6">¿Estás seguro de que quieres cerrar sesión?</p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => setShowLogoutModal(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmLogout}
              variant="danger"
              icon="🚪"
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
