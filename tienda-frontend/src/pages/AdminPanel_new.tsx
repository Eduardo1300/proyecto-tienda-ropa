import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { adminApi } from '../services/adminApi';
import axios from 'axios';
import { Button, Card, Input, Badge, Modal } from '../components/ui';
import type { Product } from '../types';

interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  user?: { username: string; email: string };
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
}

interface OrderItem {
  id: number;
  productId: number;
  product?: { name: string; imageUrl: string };
  quantity: number;
  price: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  isActive: boolean;
}

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardData();
    } else if (activeTab === 'products') {
      loadProducts();
    } else if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        productsAPI.getAll(),
        adminApi.getAllOrders(),
        loadUsersData()
      ]);

      const productsData = productsRes.data.data || productsRes.data;
      const ordersData = ordersRes || [];
      const usersData = await usersRes;

      setStats({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalUsers: usersData.length,
        totalRevenue: ordersData.reduce((sum: number, order: any) => sum + (parseFloat(order.total) || 0), 0),
        pendingOrders: ordersData.filter((order: any) => order.status === 'pending').length,
        lowStockProducts: productsData.filter((product: any) => (product.stock || 0) < 5).length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data.data || response.data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await adminApi.getAllOrders();
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUsersData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/users/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error loading users data:', error);
      return [];
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await loadUsersData();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await productsAPI.delete(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto');
    }
  };

  if (!user || user.role !== 'admin') {
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
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-2xl">
                  🛠️
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Panel de Administración</h1>
                  <p className="text-purple-100 text-lg">Gestiona tu tienda de manera eficiente</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-purple-200 text-sm">Bienvenido/a</p>
                <p className="font-bold text-xl">{user.username}</p>
                <Badge variant="primary" className="mt-2 bg-white/20 text-white">
                  👑 Administrador
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Tabs */}
        <Card className="mb-8" padding="none">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-1 px-6">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: '📊', description: 'Resumen general' },
                { key: 'products', label: 'Productos', icon: '📦', description: 'Gestionar inventario' },
                { key: 'orders', label: 'Órdenes', icon: '📋', description: 'Pedidos de clientes' },
                { key: 'users', label: 'Usuarios', icon: '👥', description: 'Gestión de usuarios' }
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
            {activeTab === 'dashboard' && (
              <DashboardView stats={stats} loading={loading} />
            )}
            
            {activeTab === 'products' && (
              <ProductsManagement 
                products={products}
                loading={loading}
                onDelete={handleDeleteProduct}
                onEdit={setEditingProduct}
                onAdd={() => setShowAddModal(true)}
                onReload={loadProducts}
              />
            )}
            
            {activeTab === 'orders' && (
              <OrdersManagement 
                orders={orders}
                loading={loading}
                onReload={loadOrders}
              />
            )}
            
            {activeTab === 'users' && (
              <UsersManagement 
                users={users}
                loading={loading}
                onReload={loadUsers}
              />
            )}
          </div>
        </Card>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingProduct(null);
            loadProducts();
          }}
        />
      )}
    </div>
  );
};

// Dashboard Component
const DashboardView: React.FC<{ stats: DashboardStats; loading: boolean }> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 animate-spin">⚙️</div>
        <p className="text-gray-500 text-lg">Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">📊 Dashboard</h2>
        <p className="text-gray-600">Resumen general de tu tienda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Productos</p>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="text-4xl opacity-80">📦</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Órdenes</p>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </div>
            <div className="text-4xl opacity-80">📋</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Usuarios</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <div className="text-4xl opacity-80">👥</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Ingresos Totales</p>
              <p className="text-3xl font-bold">S/ {stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="text-4xl opacity-80">💰</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Órdenes Pendientes</p>
              <p className="text-3xl font-bold">{stats.pendingOrders}</p>
            </div>
            <div className="text-4xl opacity-80">⏳</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm font-medium">Stock Bajo</p>
              <p className="text-3xl font-bold">{stats.lowStockProducts}</p>
            </div>
            <div className="text-4xl opacity-80">⚠️</div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card gradient>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">⚡ Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="primary" fullWidth icon="➕">
            Agregar Producto
          </Button>
          <Button variant="success" fullWidth icon="📋">
            Ver Órdenes
          </Button>
          <Button variant="outline" fullWidth icon="👥">
            Gestionar Usuarios
          </Button>
          <Button variant="secondary" fullWidth icon="📊">
            Reportes
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card gradient>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">📈 Actividad Reciente</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-lg">📦</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Nuevo producto agregado</p>
              <p className="text-sm text-gray-600">Hace 2 horas</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-lg">📋</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">5 nuevas órdenes</p>
              <p className="text-sm text-gray-600">Hace 1 hora</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-lg">👤</span>
            </div>
            <div>
              <p className="font-medium text-gray-800">Nuevo usuario registrado</p>
              <p className="text-sm text-gray-600">Hace 3 horas</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Componente para gestión de productos (mejorado)
const ProductsManagement: React.FC<{
  products: Product[];
  loading: boolean;
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
  onAdd: () => void;
  onReload: () => void;
}> = ({ products, loading, onDelete, onEdit, onAdd, onReload: _onReload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 animate-bounce">📦</div>
        <p className="text-gray-500 text-lg">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">📦 Productos</h2>
          <p className="text-gray-600">Gestiona tu inventario ({filteredProducts.length} productos)</p>
        </div>
        <Button onClick={onAdd} variant="primary" icon="➕" size="lg">
          Agregar Producto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="🔍"
            className="md:w-80"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todas las categorías</option>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
            <option value="accesorios">Accesorios</option>
            <option value="zapatos">Zapatos</option>
          </select>
        </div>
      </Card>

      {filteredProducts.length === 0 ? (
        <Card className="text-center py-16" gradient>
          <div className="text-8xl mb-6">📦</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">No hay productos</h3>
          <p className="text-gray-500 mb-8 text-lg">
            {searchTerm || categoryFilter !== 'all' 
              ? 'No se encontraron productos con estos filtros'
              : 'Comienza agregando tu primer producto'
            }
          </p>
          <Button onClick={onAdd} variant="primary" size="lg" icon="➕">
            Agregar Producto
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden" hover>
              <div className="relative">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  {(product.stock || 0) < 5 && (
                    <Badge variant="warning" icon="⚠️">
                      Stock Bajo
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <Badge variant="primary" size="lg">
                    S/ {product.price}
                  </Badge>
                  <Badge variant="secondary">
                    Stock: {product.stock || 0}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => onEdit(product)}
                    variant="outline"
                    size="sm"
                    fullWidth
                    icon="✏️"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => onDelete(product.id)}
                    variant="danger"
                    size="sm"
                    fullWidth
                    icon="🗑️"
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Modal mejorado para productos
const ProductModal: React.FC<{
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category: product?.category || '',
    imageUrl: product?.imageUrl || '',
    stock: product?.stock || 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (product) {
        await productsAPI.update(product.id, formData);
      } else {
        await productsAPI.create(formData);
      }
      onSuccess();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={product ? '✏️ Editar Producto' : '➕ Agregar Producto'}
      size="lg"
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nombre del producto"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Ej: Camiseta Premium"
          icon="📝"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
            placeholder="Describe el producto..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              💰 Precio (S/)
            </label>
            <input
              type="number"
              value={formData.price.toString()}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📦 Stock
            </label>
            <input
              type="number"
              value={formData.stock.toString()}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              required
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Selecciona una categoría</option>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
            <option value="accesorios">Accesorios</option>
            <option value="zapatos">Zapatos</option>
          </select>
        </div>

        <Input
          label="URL de la imagen"
          type="text"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
          icon="🖼️"
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            fullWidth
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={loading}
            variant="primary"
            fullWidth
            icon={product ? "💾" : "➕"}
          >
            {product ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Componentes para Orders y Users (simplificados para este ejemplo)
const OrdersManagement: React.FC<{
  orders: Order[];
  loading: boolean;
  onReload: () => void;
}> = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 animate-bounce">📋</div>
        <p className="text-gray-500 text-lg">Cargando órdenes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">📋 Órdenes</h2>
        <p className="text-gray-600">Gestiona los pedidos de tus clientes ({orders.length} órdenes)</p>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-16" gradient>
          <div className="text-8xl mb-6">📋</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">No hay órdenes</h3>
          <p className="text-gray-500 text-lg">Las órdenes aparecerán aquí cuando los clientes realicen compras</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.slice(0, 5).map((order) => (
            <Card key={order.id} hover>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">#{order.orderNumber}</h3>
                  <p className="text-gray-600">Cliente: {order.user?.username}</p>
                </div>
                <div className="text-right">
                  <Badge variant="primary">
                    S/ {parseFloat(order.total.toString()).toFixed(2)}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const UsersManagement: React.FC<{
  users: User[];
  loading: boolean;
  onReload: () => void;
}> = ({ users, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 animate-bounce">👥</div>
        <p className="text-gray-500 text-lg">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">👥 Usuarios</h2>
        <p className="text-gray-600">Gestiona los usuarios de tu tienda ({users.length} usuarios)</p>
      </div>

      {users.length === 0 ? (
        <Card className="text-center py-16" gradient>
          <div className="text-8xl mb-6">👥</div>
          <h3 className="text-2xl font-bold text-gray-700 mb-4">No hay usuarios</h3>
          <p className="text-gray-500 text-lg">Los usuarios aparecerán aquí cuando se registren</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.slice(0, 6).map((user) => (
            <Card key={user.id} hover>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{user.username}</h3>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <Badge 
                    variant={user.role === 'admin' ? 'primary' : 'secondary'} 
                    size="sm"
                    className="mt-1"
                  >
                    {user.role === 'admin' ? '👑 Admin' : '👤 Usuario'}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
