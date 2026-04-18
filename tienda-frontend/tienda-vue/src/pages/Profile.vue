<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Not Auth -->
      <div v-if="!authStore.isAuthenticated" class="text-center py-12">
        <div class="text-6xl mb-4">🔐</div>
        <p class="text-gray-400 text-xl mb-4">Debes iniciar sesion para ver tu perfil</p>
        <RouterLink to="/login" class="px-6 py-3 bg-purple-600 text-white rounded-lg">Iniciar Sesion</RouterLink>
      </div>

      <!-- Profile -->
      <div v-else class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 sticky top-24">
            <div class="text-center">
              <div class="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                👤
              </div>
              <h2 class="text-xl font-bold text-white">{{ authStore.user?.username }}</h2>
              <p class="text-gray-400 text-sm">{{ authStore.user?.email }}</p>
              <span class="inline-block mt-2 px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-sm capitalize">
                {{ authStore.user?.role }}
              </span>
            </div>

            <div class="mt-6 space-y-2">
              <button v-for="tab in tabs" :key="tab.id" 
                @click="activeTab = tab.id"
                :class="activeTab === tab.id ? 'bg-purple-600 text-white' : 'text-gray-300 hover:bg-white/10'"
                class="w-full py-3 px-4 rounded-xl text-left transition-colors flex items-center gap-3"
              >
                <span>{{ tab.name }}</span>
              </button>
              <button @click="logout" class="w-full py-3 px-4 rounded-xl text-left text-red-400 hover:bg-red-500/20 flex items-center gap-3">
                <span>Cerrar Sesion</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="lg:col-span-3">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 class="text-2xl font-bold text-white mb-6">Mi Perfil</h2>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Nombre de usuario</label>
                <input v-model="profile.username" type="text" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Email</label>
                <input v-model="profile.email" type="email" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Telefono</label>
                <input v-model="profile.phone" type="text" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Fecha de nacimiento</label>
                <input v-model="profile.birthDate" type="date" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl">
                Guardar Cambios
              </button>
            </div>
          </div>

          <!-- Orders Tab -->
          <div v-if="activeTab === 'orders'" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 class="text-2xl font-bold text-white mb-6">Mis Pedidos</h2>
            
            <div v-if="ordersLoading" class="text-center py-8">
              <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            
            <div v-else-if="orders.length === 0" class="text-center py-8 text-gray-400">
              <p>No tienes pedidos aun</p>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="order in orders" :key="order.id" class="bg-white/5 rounded-xl p-4 border border-white/10">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-white font-bold">{{ order.orderNumber }}</h3>
                    <p class="text-gray-400 text-sm">{{ formatDate(order.createdAt) }}</p>
                  </div>
                  <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                    {{ order.status }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-purple-400 font-bold">S/ {{ order.total }}</div>
                  <RouterLink :to="`/orders/${order.id}`" class="text-purple-400 hover:text-purple-300 text-sm">
                    Ver detalles
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Wishlist Tab -->
          <div v-if="activeTab === 'wishlist'" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 class="text-2xl font-bold text-white mb-6">Mi Wishlist</h2>
            <p class="text-gray-400">Proximamente...</p>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <h2 class="text-2xl font-bold text-white mb-6">Seguridad</h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Contrasena actual</label>
                <input type="password" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Nueva contrasena</label>
                <input type="password" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Confirmar contrasena</label>
                <input type="password" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
              </div>
              <button class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl">
                Actualizar Contrasena
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ordersAPI } from '../api'
import type { Order } from '../types'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('profile')
const orders = ref<Order[]>([])
const ordersLoading = ref(true)

const profile = ref({
  username: authStore.user?.username || '',
  email: authStore.user?.email || '',
  phone: '',
  birthDate: ''
})

const tabs = [
  { id: 'profile', name: 'Perfil' },
  { id: 'orders', name: 'Pedidos' },
  { id: 'wishlist', name: 'Favoritos' },
  { id: 'security', name: 'Seguridad' }
]

const formatDate = (date: string) => new Date(date).toLocaleDateString('es-PE')

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-purple-500/20 text-purple-400',
    delivered: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  }
  return classes[status] || 'bg-gray-500/20 text-gray-400'
}

const logout = () => {
  authStore.logout()
  router.push('/')
}

onMounted(async () => {
  try {
    const response = await ordersAPI.getAll()
    orders.value = response.data || []
  } catch (err) {
    console.error(err)
  } finally {
    ordersLoading.value = false
  }
})
</script>