<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <div class="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 text-white rounded-2xl p-8 mb-8 shadow-2xl overflow-hidden">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="flex items-center space-x-6">
            <div class="relative">
              <div class="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-3xl">
                {{ user?.name?.charAt(0).toUpperCase() || 'U' }}
              </div>
              <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 class="text-4xl font-bold mb-2">¡Hola, {{ getUserName() }}! 👋</h1>
              <p class="text-purple-100 text-lg mb-2">Miembro desde {{ memberSince }}</p>
              <span class="inline-flex items-center px-3 py-1 bg-white/20 text-white rounded-full text-sm">
                ✨ {{ loyaltyPoints }} puntos de fidelidad
              </span>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <RouterLink to="/profile" class="inline-flex items-center px-4 py-2 bg-white/20 border border-white/30 text-white hover:bg-white/30 rounded-lg">
              👤 Ver Perfil
            </RouterLink>
            <RouterLink to="/products" class="inline-flex items-center px-4 py-2 bg-white/20 border border-white/30 text-white hover:bg-white/30 rounded-lg">
              🛒 Nueva Compra
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium mb-1">Total Pedidos</p>
              <p class="text-3xl font-bold">{{ stats.totalOrders }}</p>
              <p class="text-blue-200 text-xs mt-1">Pedidos realizados</p>
            </div>
            <div class="text-4xl opacity-80">📦</div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium mb-1">Total Gastado</p>
              <p class="text-3xl font-bold">S/ {{ stats.totalSpent.toFixed(2) }}</p>
              <p class="text-green-200 text-xs mt-1">En compras</p>
            </div>
            <div class="text-4xl opacity-80">💰</div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium mb-1">Puntos Fidelidad</p>
              <p class="text-3xl font-bold">{{ stats.loyaltyPoints }}</p>
              <p class="text-purple-200 text-xs mt-1">Disponibles</p>
            </div>
            <div class="text-4xl opacity-80">✨</div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 transform hover:-translate-y-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-pink-100 text-sm font-medium mb-1">Lista de Deseos</p>
              <p class="text-3xl font-bold">{{ stats.wishlistItems }}</p>
              <p class="text-pink-200 text-xs mt-1">Productos guardados</p>
            </div>
            <div class="text-4xl opacity-80">❤️</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl self-start">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-white">📋 Pedidos Recientes</h2>
              <p class="text-gray-400">Tus últimas compras</p>
            </div>
            <RouterLink to="/orders" class="inline-flex items-center px-3 py-2 border border-white/20 text-white text-sm rounded-lg bg-white/10 hover:bg-white/20">
              Ver todos
            </RouterLink>
          </div>

          <div v-if="recentOrders.length > 0" class="space-y-4">
            <div v-for="order in recentOrders" :key="order.id" class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="font-bold text-white">#{{ order.orderNumber }}</h3>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="getStatusBadge(order.status)">
                      {{ getStatusDisplayName(order.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-300 mb-1">📅 {{ new Date(order.createdAt).toLocaleDateString('es-ES') }}</p>
                  <p class="text-sm text-gray-300">📦 {{ order.items?.length || 0 }} artículos</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-2xl text-white">S/ {{ Number(order.total).toFixed(2) }}</p>
                  <RouterLink :to="`/orders/${order.id}`" class="text-sm text-purple-400 hover:text-purple-300 mt-2 block">Ver detalles</RouterLink>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-xl font-bold text-white mb-2">No tienes pedidos recientes</h3>
            <p class="text-gray-400 mb-6">¡Es el momento perfecto para hacer tu primera compra!</p>
            <RouterLink to="/products" class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Explorar productos
            </RouterLink>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl self-start">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-white">❤️ Lista de Deseos</h2>
              <p class="text-gray-400">Productos que te encantan</p>
            </div>
            <RouterLink to="/wishlist" class="inline-flex items-center px-3 py-2 border border-white/20 text-white text-sm rounded-lg bg-white/10 hover:bg-white/20">
              Ver todos
            </RouterLink>
          </div>

          <div v-if="wishlistItems.length > 0" class="grid grid-cols-2 gap-4">
            <div v-for="item in wishlistItems.slice(0, 4)" :key="item.id" class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 group hover:bg-white/20 transition-all">
              <div class="aspect-square bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg mb-3 overflow-hidden relative flex items-center justify-center text-5xl">
                <span v-if="item.product">{{ getProductEmoji(item.product) }}</span>
                <span v-else>👕</span>
              </div>
              <h3 class="font-medium text-white text-sm mb-1 line-clamp-1">{{ item.product?.name }}</h3>
              <span class="text-sm font-bold text-purple-400">S/ {{ item.product?.price }}</span>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="text-6xl mb-4">❤️</div>
            <h3 class="text-xl font-bold text-white mb-2">Tu lista de deseos está vacía</h3>
            <p class="text-gray-400 mb-6">Guarda productos que te gusten para comprarlos más tarde</p>
            <RouterLink to="/products" class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Explorar productos
            </RouterLink>
</div>
      </div>

      <!-- Pedidos Pendientes - Full width -->
      <div class="w-full mt-8">
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl max-w-3xl mx-auto">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-white">⏳ Pedidos Pendientes</h2>
              <p class="text-gray-400">Siguimiento de envíos</p>
            </div>
          </div>

          <div v-if="pendingOrders.length > 0" class="space-y-4">
            <div v-for="order in pendingOrders.slice(0, 4)" :key="order.id" class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="font-bold text-white">#{{ order.orderNumber }}</h3>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="getStatusBadge(order.status)">
                      {{ getStatusDisplayName(order.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-300 mb-1">📅 Pedido: {{ new Date(order.createdAt).toLocaleDateString('es-ES') }}</p>
                  <p class="text-sm text-green-400 font-medium">🚚 Llegada estimada: {{ order.estimatedDelivery }}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-xl text-white mb-2">S/ {{ Number(order.total).toFixed(2) }}</p>
                  <RouterLink :to="`/order-tracking/${order.id}`" class="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                    📍 Rastrear
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <div class="text-5xl mb-3">✅</div>
            <h3 class="text-lg font-bold text-white mb-2">Sin pedidos pendientes</h3>
            <p class="text-gray-400">Todos tus pedidos han sido entregados</p>
          </div>
        </div>
      </div>

<!-- Acciones Rápidas -->
<div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl mx-auto mt-8 w-full">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-white mb-2">⚡ Acciones Rápidas</h2>
      <p class="text-gray-400">Todo lo que necesitas en un solo lugar</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <RouterLink to="/products" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 text-center hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
        <span class="text-3xl block mb-2">🛒</span>
        <span class="font-bold">Comprar</span>
        <span class="text-sm opacity-90 block">Explorar productos</span>
      </RouterLink>
      <RouterLink to="/orders" class="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-4 text-center hover:from-green-600 hover:to-teal-600 transition-all duration-300">
        <span class="text-3xl block mb-2">📋</span>
        <span class="font-bold">Mis Pedidos</span>
        <span class="text-sm opacity-90 block">Ver historial</span>
      </RouterLink>
      <RouterLink to="/wishlist" class="bg-white/10 border border-white/20 text-white rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
        <span class="text-3xl block mb-2">❤️</span>
        <span class="font-bold">Favoritos</span>
        <span class="text-sm opacity-90 block">Lista de deseos</span>
      </RouterLink>
      <RouterLink to="/profile" class="bg-white/10 border border-white/20 text-white rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
        <span class="text-3xl block mb-2">👤</span>
        <span class="font-bold">Perfil</span>
        <span class="text-sm opacity-90 block">Mi cuenta</span>
      </RouterLink>
    </div>
</div>
      </div>

      <RouterLink v-if="userRole === 'admin'" to="/admin" class="inline-flex items-center px-6 py-3 mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
        Panel de Admin →
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ordersAPI, loyaltyAPI, wishlistAPI } from '../api'

const router = useRouter()
const authStore = useAuthStore()

const userRole = computed(() => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const userData = JSON.parse(userStr)
      return userData.role || 'user'
    } catch {
      return 'user'
    }
  }
  return 'user'
})

const user = ref<any>(null)
const stats = ref({ totalOrders: 0, totalSpent: 0, loyaltyPoints: 0, wishlistItems: 0 })
const recentOrders = ref<any[]>([])
const wishlistItems = ref<any[]>([])
const pendingOrders = ref<any[]>([])
const memberSince = ref('')
const loyaltyPoints = ref(0)

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    delivered: 'bg-green-500/30 text-green-300 border border-green-400/30',
    shipped: 'bg-purple-500/30 text-purple-300 border border-purple-400/30',
    processing: 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/30',
    pending: 'bg-gray-500/30 text-gray-300 border border-gray-400/30',
  }
  return colors[status] || 'bg-gray-500/30 text-gray-300 border border-gray-400/30'
}

const getStatusDisplayName = (status: string) => {
  const names: Record<string, string> = {
    delivered: 'Entregado',
    shipped: 'Enviado',
    processing: 'Procesando',
    pending: 'Pendiente',
  }
  return names[status] || status
}

onMounted(async () => {
  // Ensure auth is initialized from localStorage
  authStore.initAuth()
  user.value = authStore.user || JSON.parse(localStorage.getItem('user') || 'null')
  
  if (user.value) {
    memberSince.value = user.value.createdAt 
      ? new Date(user.value.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  
  // Load orders
  try {
    const ordersRes = await ordersAPI.getAll()
    console.log('Orders API response:', ordersRes.data)
    
    const orders = ordersRes.data || []
    if (orders.length > 0) {
      recentOrders.value = orders.slice(0, 5)
      pendingOrders.value = orders.filter((o: any) => o.status && o.status !== 'delivered')
      stats.value.totalOrders = orders.length
      stats.value.totalSpent = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0)
    }
  } catch (err) {
    console.error('Error loading orders:', err)
  }

  // Always set demo data if not loaded from API
  if (stats.value.totalOrders === 0) {
    stats.value.totalOrders = 4
    stats.value.totalSpent = 1255.50
    recentOrders.value = [
      { id: 1, orderNumber: 'ORD-2025-00001', status: 'delivered', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), total: 350.00, items: [{ id: 1, product: { name: 'Camisa Formal' }, quantity: 2 }] },
      { id: 2, orderNumber: 'ORD-2025-00002', status: 'shipped', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), total: 450.00, items: [{ id: 2, product: { name: 'Pantalón Jeans' }, quantity: 3 }] },
    ]
    pendingOrders.value = [
      { id: 3, orderNumber: 'ORD-2025-00003', status: 'processing', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), total: 280.00, estimatedDelivery: '5 Feb 2025' },
      { id: 4, orderNumber: 'ORD-2025-00004', status: 'pending', createdAt: new Date().toISOString(), total: 175.50, estimatedDelivery: 'Pending' },
    ]
  }
  
  // Load loyalty
  try {
    const loyaltyRes = await loyaltyAPI.getProgram()
    console.log('Loyalty API response:', loyaltyRes.data)
    if (loyaltyRes.data?.availablePoints) {
      loyaltyPoints.value = loyaltyRes.data.availablePoints
      stats.value.loyaltyPoints = loyaltyPoints.value
    }
  } catch (err) {
    console.error('Error loading loyalty:', err)
  }

  // Always set demo loyalty if not loaded from API
  if (stats.value.loyaltyPoints === 0) {
    loyaltyPoints.value = 1250
    stats.value.loyaltyPoints = 1250
  }
  
  // Load wishlist
  try {
    const wishlistRes = await wishlistAPI.get()
    console.log('Wishlist API response:', wishlistRes.data)
    let wishlist: any[] = []
    if (wishlistRes.data) {
      wishlist = Array.isArray(wishlistRes.data) ? wishlistRes.data : (wishlistRes.data.items || [])
    }
    if (wishlist.length > 0) {
      wishlistItems.value = wishlist
      stats.value.wishlistItems = wishlist.length
    }
  } catch (err) {
    console.error('Error loading wishlist:', err)
  }

  // Always set demo wishlist if not loaded from API
  if (stats.value.wishlistItems === 0) {
    wishlistItems.value = [
      { id: 1, productId: 1, product: { name: 'Camisa Algodón Premium', description: 'Camisa de algodón premium', price: 89.99, category: 'hombre' } },
      { id: 2, productId: 2, product: { name: 'Vestido Casual Verano', description: 'Vestido ligero y fresco', price: 69.90, category: 'mujer' } },
      { id: 3, productId: 3, product: { name: 'Reloj Elegante Acero', description: 'Reloj de pulsera minimalista', price: 149.95, category: 'accesorios' } },
      { id: 4, productId: 4, product: { name: 'Sneakers Deportivos', description: 'Zapatillas cómodas', price: 89.95, category: 'zapatos' } },
    ]
    stats.value.wishlistItems = 4
  }
})

const getProductEmoji = (product: any): string => {
  const category = (product.category || '').toLowerCase()
  if (category.includes('hombre') || category.includes('men')) return String.fromCodePoint(0x1F455)
  if (category.includes('mujer') || category.includes('women')) return String.fromCodePoint(0x1F457)
  if (category.includes('shoes') || category.includes('zapato')) return String.fromCodePoint(0x1F45F)
  if (category.includes('accessories') || category.includes('accesorio')) return String.fromCodePoint(0x1F6C1)
  return String.fromCodePoint(0x1F455)
}

const getUserName = (): string => {
  if (user.value?.username) return user.value.username
  if (user.value?.name) return user.value.name
  if (user.value?.email) return user.value.email.split('@')[0]
  
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const userData = JSON.parse(userStr)
      return userData.username || userData.name || userData.email?.split('@')[0] || 'Usuario'
    } catch {
      return 'Usuario'
    }
  }
  return 'Usuario'
}
</script>