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

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card class="bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-xs font-medium mb-0.5">Total Pedidos</p>
              <p class="text-2xl font-bold">{{ stats.totalOrders }}</p>
              <p class="text-blue-200 text-[10px] mt-0.5">Pedidos realizados</p>
            </div>
            <div class="text-3xl opacity-80">📦</div>
          </div>
        </Card>

        <Card class="bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl hover:shadow-green-500/25 transition-all duration-300 transform hover:-translate-y-0.5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-green-100 text-xs font-medium mb-0.5">Total Gastado</p>
              <p class="text-2xl font-bold">S/ {{ stats.totalSpent.toFixed(2) }}</p>
              <p class="text-green-200 text-[10px] mt-0.5">En compras</p>
            </div>
            <div class="text-3xl opacity-80">💰</div>
          </div>
        </Card>

        <Card class="bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:shadow-xl hover:shadow-amber-500/25 transition-all duration-300 transform hover:-translate-y-0.5">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-amber-100 text-xs font-medium mb-0.5">Pedidos Pendientes</p>
              <p class="text-2xl font-bold">{{ pendingOrders.length }}</p>
              <p class="text-amber-200 text-[10px] mt-0.5">En proceso</p>
            </div>
            <div class="text-3xl opacity-80">⏳</div>
          </div>
        </Card>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <Card class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl self-start">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-white">📋 Pedidos Recientes</h2>
              <p class="text-gray-400">Tus últimas compras</p>
            </div>
            <RouterLink to="/orders" class="inline-flex items-center px-3 py-2 border border-white/20 text-white text-sm rounded-lg bg-white/10 hover:bg-white/20">
              Ver todos
            </RouterLink>
          </div>

          <div v-if="recentOrders.length > 0" class="space-y-3">
            <div v-for="order in recentOrders" :key="order.id" class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-all">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold text-white">#{{ order.orderNumber }}</h3>
                    <Badge :class="getStatusBadge(order.status)">{{ getStatusDisplayName(order.status) }}</Badge>
                  </div>
                  <p class="text-xs text-gray-300 mb-0.5">📅 {{ new Date(order.createdAt).toLocaleDateString('es-ES') }}</p>
                  <p class="text-xs text-gray-300">📦 {{ order.items?.length || 0 }} artículos</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-lg text-white">S/ {{ Number(order.total).toFixed(2) }}</p>
                  <RouterLink :to="`/orders/${order.id}`" class="text-xs text-purple-400 hover:text-purple-300 mt-1 block">Ver detalles</RouterLink>
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
        </Card>

        <Card class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl self-start">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h2 class="text-2xl font-bold text-white">⏳ Pedidos Pendientes</h2>
              <p class="text-gray-400">Siguimiento de envíos</p>
            </div>
          </div>

          <div v-if="pendingOrders.length > 0" class="space-y-3">
            <div v-for="order in pendingOrders.slice(0, 4)" :key="order.id" class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 hover:bg-white/20 transition-all">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold text-white">#{{ order.orderNumber }}</h3>
                    <Badge :class="getStatusBadge(order.status)">{{ getStatusDisplayName(order.status) }}</Badge>
                  </div>
                  <p class="text-xs text-gray-300 mb-0.5">📅 Pedido: {{ new Date(order.createdAt).toLocaleDateString('es-ES') }}</p>
                  <p class="text-xs text-green-400 font-medium">🚚 Llegada estimada: {{ order.estimatedDelivery || 'Por confirmar' }}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-lg text-white mb-1">S/ {{ Number(order.total).toFixed(2) }}</p>
                  <RouterLink :to="`/order-tracking/${order.id}`" class="inline-flex items-center px-2 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700">
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
        </Card>
      </div>

      <div class="w-full mt-8">
        <Card class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl mx-auto mt-8 w-full">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-white mb-2">⚡ Acciones Rápidas</h2>
            <p class="text-gray-400">Todo lo que necesitas en un solo lugar</p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <RouterLink to="/products" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-3 text-center hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
              <span class="text-2xl block mb-1">🛒</span>
              <span class="font-semibold text-sm">Comprar</span>
              <span class="text-xs opacity-90 block">Explorar productos</span>
            </RouterLink>
            <RouterLink to="/orders" class="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl p-3 text-center hover:from-green-600 hover:to-teal-600 transition-all duration-300">
              <span class="text-2xl block mb-1">📋</span>
              <span class="font-semibold text-sm">Mis Pedidos</span>
              <span class="text-xs opacity-90 block">Ver historial</span>
            </RouterLink>

            <RouterLink to="/profile" class="bg-white/10 border border-white/20 text-white rounded-xl p-3 text-center hover:bg-white/20 transition-all duration-300">
              <span class="text-2xl block mb-1">👤</span>
              <span class="font-semibold text-sm">Perfil</span>
              <span class="text-xs opacity-90 block">Mi cuenta</span>
            </RouterLink>
          </div>
        </Card>
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
import { ordersAPI, api } from '../api'
import type { Order } from '../types'
import { Button, Card, Badge, RouterLink } from '../components/ui'
import { getProductImage } from '../utils/productImages'

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
const stats = ref({ totalOrders: 0, totalSpent: 0 })
const recentOrders = ref<Order[]>([])
const pendingOrders = ref<Order[]>([])
const memberSince = ref('')

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

const moveToCart = (item: any) => {
  // Use cart store to add item
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

onMounted(async () => {
  authStore.initAuth()
  user.value = authStore.user || JSON.parse(localStorage.getItem('user') || 'null')
  
  if (user.value) {
    memberSince.value = user.value.createdAt 
      ? new Date(user.value.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  }
  
  try {
    const ordersRes = await ordersAPI.getAll()
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
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce { animation: bounce 2s ease-in-out infinite; }

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
.animate-pulse { animation: pulse 3s ease-in-out infinite; }
</style>