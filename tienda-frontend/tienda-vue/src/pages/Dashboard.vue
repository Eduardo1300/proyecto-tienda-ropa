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
              <h1 class="text-4xl font-bold mb-2">¡Hola, {{ user?.name || 'Usuario' }}! 👋</h1>
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
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium mb-1">Total Pedidos</p>
              <p class="text-3xl font-bold">{{ stats.totalOrders }}</p>
              <p class="text-blue-200 text-xs mt-1">Pedidos realizados</p>
            </div>
            <div class="text-4xl opacity-80">📦</div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-sm font-medium mb-1">Total Gastado</p>
              <p class="text-3xl font-bold">${{ stats.totalSpent.toFixed(2) }}</p>
              <p class="text-green-200 text-xs mt-1">En compras</p>
            </div>
            <div class="text-4xl opacity-80">💰</div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium mb-1">Puntos Fidelidad</p>
              <p class="text-3xl font-bold">{{ stats.loyaltyPoints }}</p>
              <p class="text-purple-200 text-xs mt-1">Disponibles</p>
            </div>
            <div class="text-4xl opacity-80">✨</div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
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
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
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
            <div v-for="order in recentOrders" :key="order.id" class="bg-white/80 backdrop-blur-sm rounded-xl p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="font-bold text-gray-800">#{{ order.orderNumber }}</h3>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="getStatusBadge(order.status)">
                      {{ getStatusDisplayName(order.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-1">📅 {{ new Date(order.createdAt).toLocaleDateString('es-ES') }}</p>
                  <p class="text-sm text-gray-600">📦 {{ order.items?.length || 0 }} artículos</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-2xl text-gray-800">${{ Number(order.total).toFixed(2) }}</p>
                  <RouterLink :to="`/orders/${order.id}`" class="text-sm text-purple-600 hover:underline mt-2 block">Ver detalles</RouterLink>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-xl font-bold text-gray-700 mb-2">No tienes pedidos recientes</h3>
            <p class="text-gray-500 mb-6">¡Es el momento perfecto para hacer tu primera compra!</p>
            <RouterLink to="/products" class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Explorar productos
            </RouterLink>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
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
            <div v-for="item in wishlistItems.slice(0, 4)" :key="item.id" class="bg-white/80 backdrop-blur-sm rounded-xl p-3 group">
              <div class="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative flex items-center justify-center text-5xl">
                <span v-if="item.product">{{ getProductEmoji(item.product) }}</span>
                <span v-else>👕</span>
              </div>
              <h3 class="font-medium text-gray-800 text-sm mb-1 line-clamp-1">{{ item.product?.name }}</h3>
              <span class="text-sm font-bold text-purple-600">${{ item.product?.price }}</span>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="text-6xl mb-4">❤️</div>
            <h3 class="text-xl font-bold text-gray-700 mb-2">Tu lista de deseos está vacía</h3>
            <p class="text-gray-500 mb-6">Guarda productos que te gusten para comprarlos más tarde</p>
            <RouterLink to="/products" class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Explorar productos
            </RouterLink>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-white">⏳ Pedidos Pendientes</h2>
              <p class="text-gray-400">Siguimiento de envíos</p>
            </div>
          </div>

          <div v-if="pendingOrders.length > 0" class="space-y-4">
            <div v-for="order in pendingOrders" :key="order.id" class="bg-white/80 backdrop-blur-sm rounded-xl p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="font-bold text-gray-800">#{{ order.orderNumber }}</h3>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" :class="getStatusBadge(order.status)">
                      {{ getStatusDisplayName(order.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-1">📅 Pedido: {{ new Date(order.createdAt).toLocaleDateString('es-ES') }}</p>
                  <p class="text-sm text-green-600 font-medium">🚚 Llegada estimada: {{ order.estimatedDelivery }}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-xl text-gray-800 mb-2">${{ Number(order.total).toFixed(2) }}</p>
                  <RouterLink :to="`/orders/${order.id}/tracking`" class="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
                    📍 Rastrear
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-12">
            <div class="text-6xl mb-4">⏳</div>
            <h3 class="text-xl font-bold text-gray-700 mb-2">No tienes pedidos pendientes</h3>
            <p class="text-gray-500 mb-6">Todos tus pedidos han sido entregados</p>
            <RouterLink to="/products" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Hacer nuevo pedido
            </RouterLink>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
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

      <RouterLink to="/admin" class="inline-flex items-center px-6 py-3 mt-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all">
        Panel de Admin →
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { ordersAPI, loyaltyAPI, wishlistAPI } from '../api'

const authStore = useAuthStore()
const user = ref<any>(null)
const stats = ref({ totalOrders: 0, totalSpent: 0, loyaltyPoints: 0, wishlistItems: 0 })
const recentOrders = ref<any[]>([])
const wishlistItems = ref<any[]>([])
const pendingOrders = ref<any[]>([])
const memberSince = ref('')
const loyaltyPoints = ref(0)

const getStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    delivered: 'bg-green-100 text-green-800',
    shipped: 'bg-purple-100 text-purple-800',
    processing: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
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
  user.value = authStore.user
  if (user.value) {
    memberSince.value = new Date(user.value.createdAt || Date.now()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  
  try {
    const [ordersRes, loyaltyRes, wishlistRes] = await Promise.all([
      ordersAPI.getAll(),
      loyaltyAPI.getProgram().catch(() => ({ data: { availablePoints: 0, totalPoints: 0 } })),
      wishlistAPI.get().catch(() => ({ data: [] }))
    ])
    
    const orders = ordersRes.data || []
    recentOrders.value = orders.slice(0, 5)
    pendingOrders.value = orders.filter((o: any) => o.status === 'shipped' || o.status === 'processing')
    
    const totalSpent = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0)
    loyaltyPoints.value = loyaltyRes.data?.availablePoints || 0
    
    stats.value = {
      totalOrders: orders.length,
      totalSpent,
      loyaltyPoints: loyaltyPoints.value,
      wishlistItems: (wishlistRes.data || []).length
    }
  } catch (err) {
    console.error('Error loading dashboard:', err)
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
</script>