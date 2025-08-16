import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    birthDate: '',
    gender: ''
  });

  // Verificar autenticación
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Cargar órdenes simuladas
  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    // Simular carga de órdenes
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        date: '2024-08-08',
        status: 'delivered',
        total: 89.90,
        items: [
          { id: 1, name: 'Camiseta Premium', quantity: 2, price: 29.95, imageUrl: 'https://via.placeholder.com/80x80' },
          { id: 2, name: 'Jeans Clásicos', quantity: 1, price: 59.90, imageUrl: 'https://via.placeholder.com/80x80' }
        ],
        trackingNumber: 'TRK123456789'
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        date: '2024-08-05',
        status: 'shipped',
        total: 45.50,
        items: [
          { id: 3, name: 'Zapatos Deportivos', quantity: 1, price: 45.50, imageUrl: 'https://via.placeholder.com/80x80' }
        ],
        trackingNumber: 'TRK987654321'
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        date: '2024-08-03',
        status: 'processing',
        total: 125.00,
        items: [
          { id: 4, name: 'Chaqueta Elegante', quantity: 1, price: 125.00, imageUrl: 'https://via.placeholder.com/80x80' }
        ]
      }
    ];
    setOrders(mockOrders);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      alert('✅ Perfil actualizado correctamente');
    } catch (error: unknown) {
      alert('❌ Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status];
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

  // Handlers para las acciones de órdenes
  const handleViewOrderDetails = (order: Order) => {
    // Navegar a página de detalles de orden o mostrar modal
    navigate(`/orders/${order.id}`);
  };

  const handleRateOrder = (order: Order) => {
    // Mostrar modal de calificación o navegar a página de reseña
    alert(`🌟 Función de calificación para orden ${order.orderNumber}\n\nEsta funcionalidad permitirá:\n- Calificar productos comprados\n- Escribir reseñas\n- Subir fotos del producto`);
  };

  const handleTrackOrder = (order: Order) => {
    if (order.trackingNumber) {
      // Mostrar información de rastreo o navegar a página de tracking
      alert(`🚚 Rastreando orden ${order.orderNumber}\n\nCódigo: ${order.trackingNumber}\n\nEsta funcionalidad mostrará:\n- Estado actual del envío\n- Ubicación en tiempo real\n- Historial de movimientos\n- Fecha estimada de entrega`);
    } else {
      alert('⚠️ Esta orden aún no tiene código de seguimiento asignado.');
    }
  };

  const handleAddAddress = () => {
    // Mostrar modal o navegar a formulario de nueva dirección
    alert(`📍 Agregar Nueva Dirección\n\nEsta funcionalidad permitirá:\n- Guardar direcciones de envío\n- Establecer dirección predeterminada\n- Gestionar múltiples direcciones\n- Validación de códigos postales`);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">👋 Hola, {user.username}!</h1>
                <p className="text-gray-600">Gestiona tu cuenta y revisa tus pedidos</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors font-semibold"
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'profile', label: '👤 Mi Perfil', icon: '👤' },
                { key: 'orders', label: '📦 Mis Órdenes', icon: '📦' },
                { key: 'addresses', label: '📍 Direcciones', icon: '📍' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">👤 Información Personal</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
                    >
                      ✏️ Editar Perfil
                    </button>
                  ) : (
                    <div className="space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-colors font-semibold"
                      >
                        ❌ Cancelar
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={loading}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                      >
                        {loading ? '⏳ Guardando...' : '💾 Guardar'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      placeholder="Tu apellido"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de Usuario</label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      placeholder="Tu username"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                      placeholder="+51 999 999 999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      value={profileData.birthDate}
                      onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                    <select
                      value={profileData.gender}
                      onChange={(e) => setProfileData({...profileData, gender: e.target.value})}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-gray-100"
                    >
                      <option value="">Seleccionar género</option>
                      <option value="male">Masculino</option>
                      <option value="female">Femenino</option>
                      <option value="other">Otro</option>
                      <option value="prefer-not-to-say">Prefiero no decir</option>
                    </select>
                  </div>
                </div>

                {/* Account Info */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🔐 Información de la Cuenta</h3>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Rol:</span>
                        <span className="ml-2 font-medium">{user.role === 'admin' ? '👑 Administrador' : '👤 Usuario'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Miembro desde:</span>
                        <span className="ml-2 font-medium">Agosto 2024</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Órdenes totales:</span>
                        <span className="ml-2 font-medium">{orders.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Estado:</span>
                        <span className="ml-2 font-medium text-green-600">✅ Activo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">📦 Mis Órdenes ({orders.length})</h2>
                  <button
                    onClick={() => navigate('/products')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
                  >
                    🛍️ Nueva Compra
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tienes órdenes aún</h3>
                    <p className="text-gray-500 mb-6">¡Comienza explorando nuestros productos!</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      🛍️ Explorar Productos
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-gray-50 rounded-xl p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              📋 Orden #{order.orderNumber}
                            </h3>
                            <p className="text-gray-600">📅 {new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                            <p className="text-lg font-bold text-purple-600 mt-2">S/ {order.total.toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 mb-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4">
                              <img
                                src={item.imageUrl || 'https://via.placeholder.com/60x60'}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.name}</p>
                                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-gray-800">S/ {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>

                        {/* Tracking */}
                        {order.trackingNumber && (
                          <div className="bg-white rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-600 mb-1">🚚 Código de seguimiento:</p>
                            <p className="font-mono text-purple-600 font-semibold">{order.trackingNumber}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-3">
                          <button 
                            onClick={() => handleViewOrderDetails(order)}
                            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm hover:shadow-lg transform hover:scale-105"
                          >
                            📋 Ver Detalles
                          </button>
                          {order.status === 'delivered' && (
                            <button 
                              onClick={() => handleRateOrder(order)}
                              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm hover:shadow-lg transform hover:scale-105"
                            >
                              ⭐ Calificar
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button 
                              onClick={() => handleTrackOrder(order)}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm hover:shadow-lg transform hover:scale-105"
                            >
                              🚚 Rastrear
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">📍 Mis Direcciones</h2>
                  <button 
                    onClick={handleAddAddress}
                    className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold hover:shadow-lg transform hover:scale-105"
                  >
                    ➕ Agregar Dirección
                  </button>
                </div>

                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📍</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Gestión de Direcciones</h3>
                  <p className="text-gray-500">Próximamente - Guarda tus direcciones favoritas</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
