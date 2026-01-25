import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import { userAddressAPI, UserAddress, UserPreferences } from '../services/userAddressApi.ts';
import { Button, Card, Input, Badge, Modal } from '../components/ui';

console.log('✅ ProfilePage imports successful');
console.log('✅ userAddressAPI:', userAddressAPI);
console.log('✅ UserAddress:', UserAddress);
console.log('✅ UserPreferences:', UserPreferences);

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
  console.log('🚀 ProfilePage component rendering');
  
  const { user, logout } = useAuth();
  console.log('👤 User:', user);
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    type: 'home' as const,
    label: '',
  });
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  
  console.log('📍 State initialized');
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

  // Cargar perfil, órdenes, direcciones y preferencias
  useEffect(() => {
    if (user) {
      loadOrders();
      loadAddresses();
      loadPreferences();
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
      setOrders([]);
    }
  };

  const loadAddresses = async () => {
    try {
      const response = await userAddressAPI.getAddresses();
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const response = await userAddressAPI.getPreferences();
      if (response.data.success) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
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
      await userAddressAPI.updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        birthDate: profileData.birthDate,
        gender: profileData.gender,
        bio: profileData.bio,
      });
      
      setIsEditing(false);
      alert('✅ Perfil actualizado correctamente');
    } catch (error) {
      alert('❌ Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    setLoading(true);
    try {
      if (editingAddressId) {
        await userAddressAPI.updateAddress(editingAddressId, newAddress);
        alert('✅ Dirección actualizada correctamente');
      } else {
        await userAddressAPI.createAddress(newAddress);
        alert('✅ Dirección agregada correctamente');
      }
      
      setNewAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        type: 'home',
        label: '',
      });
      setEditingAddressId(null);
      setShowAddressModal(false);
      await loadAddresses();
    } catch (error) {
      alert('❌ Error al guardar la dirección');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address: UserAddress) => {
    setNewAddress({
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      type: address.type,
      label: address.label,
    });
    setEditingAddressId(address.id);
    setShowAddressModal(true);
  };

  const handleDeleteAddress = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta dirección?')) {
      try {
        await userAddressAPI.deleteAddress(id);
        alert('✅ Dirección eliminada correctamente');
        await loadAddresses();
      } catch (error) {
        alert('❌ Error al eliminar la dirección');
      }
    }
  };

  const handleSetDefaultAddress = async (id: number) => {
    try {
      await userAddressAPI.setDefaultAddress(id);
      alert('✅ Dirección establecida como predeterminada');
      await loadAddresses();
    } catch (error) {
      alert('❌ Error al establecer dirección predeterminada');
    }
  };

  const handleUpdatePreferences = async () => {
    if (!preferences) return;
    
    setLoading(true);
    try {
      await userAddressAPI.updatePreferences({
        emailNotifications: preferences.emailNotifications,
        orderNotifications: preferences.orderNotifications,
        promotionNotifications: preferences.promotionNotifications,
        weeklyNewsletter: preferences.weeklyNewsletter,
        profilePublic: preferences.profilePublic,
        showPurchaseHistory: preferences.showPurchaseHistory,
        allowDataCollection: preferences.allowDataCollection,
        twoFactorEnabled: preferences.twoFactorEnabled,
        twoFactorMethod: preferences.twoFactorMethod,
      });
      alert('✅ Preferencias actualizadas correctamente');
    } catch (error) {
      alert('❌ Error al actualizar las preferencias');
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

  console.log('✨ About to render ProfilePage JSX');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Biografía 📝
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        disabled={!isEditing}
                        placeholder="Cuéntanos sobre ti... (máximo 500 caracteres)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100 transition-all duration-200 resize-none h-24"
                        maxLength={500}
                      />
                      <p className="text-xs text-gray-500 mt-1">{profileData.bio.length}/500 caracteres</p>
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
                    onClick={() => setShowAddressModal(true)}
                  >
                    Agregar Dirección
                  </Button>
                </div>

                {/* Address List */}
                {addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {addresses.map((address) => (
                      <Card key={address.id} className="relative overflow-hidden hover:shadow-xl transition-all" gradient>
                        {address.isDefault && (
                          <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                            ⭐ Predeterminada
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">
                              {address.type === 'home' ? '🏠' : address.type === 'office' ? '🏢' : '🎁'}
                            </span>
                            <span className="font-semibold text-gray-800 capitalize">
                              {address.type === 'home' ? 'Casa' : address.type === 'office' ? 'Oficina' : 'Otro'}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <p className="text-gray-700 font-medium">{address.street}</p>
                            <p className="text-gray-600">{address.city}, {address.state}</p>
                            <p className="text-gray-600">{address.zipCode}, {address.country}</p>
                          </div>

                          <div className="flex gap-2 pt-4 border-t border-gray-200">
                            <Button
                              variant="secondary"
                              size="sm"
                              icon="✏️"
                              onClick={() => {
                                setEditingAddressId(address.id);
                                setNewAddress({
                                  street: address.street,
                                  city: address.city,
                                  state: address.state,
                                  zipCode: address.zipCode,
                                  country: address.country,
                                  type: address.type,
                                  label: address.label || '',
                                });
                                setShowAddressModal(true);
                              }}
                              className="flex-1"
                            >
                              Editar
                            </Button>
                            {!address.isDefault && (
                              <Button
                                variant="secondary"
                                size="sm"
                                icon="⭐"
                                onClick={() => handleSetDefaultAddress(address.id)}
                                className="flex-1"
                              >
                                Predeterminada
                              </Button>
                            )}
                            <Button
                              variant="danger"
                              size="sm"
                              icon="🗑️"
                              onClick={() => handleDeleteAddress(address.id)}
                              className="flex-1"
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-16" gradient>
                    <div className="text-8xl mb-6">📍</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-4">No hay direcciones guardadas</h3>
                    <p className="text-gray-500 mb-8 text-lg">Agrega tu primera dirección para agilizar tus compras</p>
                    <Button
                      variant="primary"
                      icon="➕"
                      onClick={() => setShowAddressModal(true)}
                    >
                      Agregar Mi Primera Dirección
                    </Button>
                  </Card>
                )}

                {/* Add Address Modal */}
                <Modal
                  isOpen={showAddressModal}
                  onClose={() => {
                    setShowAddressModal(false);
                    setEditingAddressId(null);
                    setNewAddress({
                      street: '',
                      city: '',
                      state: '',
                      zipCode: '',
                      country: '',
                      type: 'home',
                      label: '',
                    });
                  }}
                  title={editingAddressId ? '✏️ Editar Dirección' : '📍 Agregar Nueva Dirección'}
                  size="lg"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la Dirección (Opcional)</label>
                      <Input
                        type="text"
                        placeholder="Ej: Casa, Oficina, etc"
                        value={newAddress.label || ''}
                        onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Dirección</label>
                      <select
                        value={newAddress.type}
                        onChange={(e) => setNewAddress({...newAddress, type: e.target.value as any})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="home">🏠 Casa</option>
                        <option value="office">🏢 Oficina</option>
                        <option value="other">🎁 Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Calle *</label>
                      <Input
                        type="text"
                        placeholder="Ej: Calle Principal 123"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Ciudad *</label>
                        <Input
                          type="text"
                          placeholder="Ej: Madrid"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Estado/Región</label>
                        <Input
                          type="text"
                          placeholder="Ej: Madrid"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Código Postal *</label>
                        <Input
                          type="text"
                          placeholder="Ej: 28001"
                          value={newAddress.zipCode}
                          onChange={(e) => setNewAddress({...newAddress, zipCode: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">País</label>
                        <Input
                          type="text"
                          placeholder="Ej: España"
                          value={newAddress.country}
                          onChange={(e) => setNewAddress({...newAddress, country: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-6 border-t">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setShowAddressModal(false);
                          setEditingAddressId(null);
                          setNewAddress({
                            street: '',
                            city: '',
                            state: '',
                            zipCode: '',
                            country: '',
                            type: 'home',
                            label: '',
                          });
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleAddAddress}
                        loading={loading}
                        icon="✅"
                      >
                        {editingAddressId ? 'Actualizar' : 'Guardar'} Dirección
                      </Button>
                    </div>
                  </div>
                </Modal>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">🔒 Seguridad</h2>
                  <p className="text-gray-600 mt-2">Configuración de seguridad y privacidad de tu cuenta</p>
                </div>

                {preferences && (
                  <div className="space-y-8">
                    {/* Notifications Section */}
                    <Card className="space-y-6" gradient>
                      <h3 className="text-xl font-semibold text-gray-800 border-b border-purple-100 pb-3">
                        🔔 Notificaciones
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800">Notificaciones por Email</label>
                            <p className="text-xs text-gray-600 mt-1">Recibe actualizaciones sobre tu cuenta</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.emailNotifications || false}
                            onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800">Notificaciones de Pedidos</label>
                            <p className="text-xs text-gray-600 mt-1">Alertas sobre el estado de tus pedidos</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.orderNotifications || false}
                            onChange={(e) => setPreferences({...preferences, orderNotifications: e.target.checked})}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800">Notificaciones de Promociones</label>
                            <p className="text-xs text-gray-600 mt-1">Recibe ofertas y descuentos especiales</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.promotionNotifications || false}
                            onChange={(e) => setPreferences({...preferences, promotionNotifications: e.target.checked})}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800">Newsletter Semanal</label>
                            <p className="text-xs text-gray-600 mt-1">Resumen semanal de novedades y tendencias</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.weeklyNewsletter || false}
                            onChange={(e) => setPreferences({...preferences, weeklyNewsletter: e.target.checked})}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>
                      </div>
                    </Card>

                    {/* Privacy Section */}
                    <Card className="space-y-6" gradient>
                      <h3 className="text-xl font-semibold text-gray-800 border-b border-purple-100 pb-3">
                        📊 Privacidad
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800">Perfil Público</label>
                            <p className="text-xs text-gray-600 mt-1">Otros usuarios pueden ver tu perfil</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.profilePublic || false}
                            onChange={(e) => setPreferences({...preferences, profilePublic: e.target.checked})}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800">Mostrar Historial de Compras</label>
                            <p className="text-xs text-gray-600 mt-1">Otros usuarios pueden ver tus compras</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.showPurchaseHistory || false}
                            onChange={(e) => setPreferences({...preferences, showPurchaseHistory: e.target.checked})}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800">Compartir Datos para Análisis</label>
                            <p className="text-xs text-gray-600 mt-1">Nos ayuda a mejorar tu experiencia</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.allowDataCollection || false}
                            onChange={(e) => setPreferences({...preferences, allowDataCollection: e.target.checked})}
                            className="w-5 h-5 cursor-pointer"
                          />
                        </div>
                      </div>
                    </Card>

                    {/* Security Section */}
                    <Card className="space-y-6" gradient>
                      <h3 className="text-xl font-semibold text-gray-800 border-b border-purple-100 pb-3">
                        🔐 Seguridad
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800">Autenticación de Dos Factores</label>
                            <p className="text-xs text-gray-600 mt-1">
                              {preferences.twoFactorEnabled ? '✅ Activado' : '⚠️ Desactivado'}
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={preferences.twoFactorEnabled || false}
                            onChange={(e) => setPreferences({...preferences, twoFactorEnabled: e.target.checked})}
                            disabled
                            className="w-5 h-5 cursor-not-allowed opacity-50"
                          />
                        </div>

                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            <strong>Último cambio de contraseña:</strong> {preferences.lastPasswordChangeAt ? new Date(preferences.lastPasswordChangeAt).toLocaleDateString('es-ES') : 'Nunca'}
                          </p>
                        </div>

                        <Button variant="primary" icon="🔑" fullWidth>
                          Cambiar Contraseña
                        </Button>
                      </div>
                    </Card>

                    {/* Save Preferences Button */}
                    <Button
                      variant="success"
                      icon="💾"
                      fullWidth
                      onClick={handleUpdatePreferences}
                      loading={loading}
                    >
                      Guardar Preferencias
                    </Button>
                  </div>
                )}

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
