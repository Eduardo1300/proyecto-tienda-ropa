<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <!-- Not Auth -->
      <div v-if="!authStore.isAuthenticated" class="text-center py-12 animate-fade-in-up">
        <div class="text-6xl mb-4 animate-bounce">🔐</div>
        <p class="text-gray-400 text-xl mb-4">Debes iniciar sesion para ver tu perfil</p>
        <RouterLink to="/login" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105">Iniciar Sesion</RouterLink>
      </div>

      <!-- Profile -->
      <div v-else class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 sticky top-24 hover:border-purple-500/30 transition-all animate-slide-in">
            <div class="text-center">
              <div class="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 transform hover:scale-110 transition-transform">
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
                :class="activeTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-300 hover:bg-white/10'"
                class="w-full py-3 px-4 rounded-xl text-left transition-all flex items-center gap-3 hover:scale-105 transform"
              >
                <span>{{ tab.icon }} {{ tab.name }}</span>
              </button>
              <!-- Addresses Tab -->
              <button 
                @click="activeTab = 'addresses'"
                :class="activeTab === 'addresses' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'text-gray-300 hover:bg-white/10'"
                class="w-full py-3 px-4 rounded-xl text-left transition-all flex items-center gap-3 hover:scale-105 transform"
              >
                <span>📍 Direcciones</span>
              </button>
              <button @click="showLogoutModal = true" class="w-full py-3 px-4 rounded-xl text-left text-red-400 hover:bg-red-500/20 flex items-center gap-3 transition-all hover:scale-105 transform">
                🚪 Cerrar Sesion
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="lg:col-span-3">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 animate-fade-in-up">
            <h2 class="text-2xl font-bold text-white mb-6">👤 Mi Perfil</h2>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Nombre de usuario</label>
                <input v-model="profile.username" type="text" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Email</label>
                <input v-model="profile.email" type="email" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Telefono</label>
                <input v-model="profile.phone" type="text" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Fecha de nacimiento</label>
                <input v-model="profile.birthDate" type="date" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
              </div>
            </div>

            <div class="mt-6 flex justify-end">
              <button class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
                💾 Guardar Cambios
              </button>
            </div>
          </div>

          <!-- Orders Tab -->
          <div v-if="activeTab === 'orders'" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 animate-fade-in-up">
            <h2 class="text-2xl font-bold text-white mb-6">📦 Mis Pedidos</h2>
            
            <div v-if="ordersLoading" class="text-center py-8">
              <div class="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            
            <div v-else-if="orders.length === 0" class="text-center py-8 text-gray-400">
              <div class="text-5xl mb-4">📦</div>
              <p>No tienes pedidos aun</p>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="order in orders" :key="order.id" class="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h3 class="text-white font-bold">#{{ order.orderNumber }}</h3>
                    <p class="text-gray-400 text-sm">{{ formatDate(order.createdAt) }}</p>
                  </div>
                  <span :class="getStatusClass(order.status)" class="px-3 py-1 rounded-full text-xs font-semibold">
                    {{ order.status }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <div class="text-purple-400 font-bold">S/ {{ Number(order.total).toFixed(2) }}</div>
                  <RouterLink :to="`/orders/${order.id}`" class="text-purple-400 hover:text-purple-300 text-sm hover:underline">
                    Ver detalles →
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <!-- Wishlist Tab -->
          <div v-if="activeTab === 'wishlist'" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 animate-fade-in-up">
            <h2 class="text-2xl font-bold text-white mb-6">❤️ Mi Wishlist</h2>
            <div class="text-center py-12 text-gray-400">
              <div class="text-5xl mb-4 animate-bounce">❤️</div>
              <p>Proximamente...</p>
            </div>
          </div>

          <!-- Security Tab -->
          <div v-if="activeTab === 'security'" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 animate-fade-in-up">
            <h2 class="text-2xl font-bold text-white mb-6">🔐 Seguridad</h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Contrasena actual</label>
                <input type="password" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Nueva contrasena</label>
                <input type="password" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-2">Confirmar contrasena</label>
                <input type="password" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
              </div>
              <button class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
                🔒 Actualizar Contrasena
              </button>
            </div>
          </div>

          <!-- Addresses Tab -->
          <div v-if="activeTab === 'addresses'" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 animate-fade-in-up">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-2xl font-bold text-white">📍 Mis Direcciones</h2>
              <button @click="openAddressModal()" class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm">
                + Agregar
              </button>
            </div>
            
            <div v-if="addresses.length === 0" class="text-center py-8 text-gray-400">
              <div class="text-5xl mb-4">📍</div>
              <p>No tienes direcciones guardadas</p>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="address in addresses" :key="address.id" class="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all">
                <div class="flex justify-between items-start">
                  <div>
                    <div class="flex items-center gap-2 mb-2">
                      <span class="text-white font-bold">{{ address.label }}</span>
                      <span class="px-2 py-0.5 bg-purple-600/30 text-purple-300 text-xs rounded-full capitalize">{{ address.type }}</span>
                    </div>
                    <p class="text-gray-300 text-sm">{{ address.street }}</p>
                    <p class="text-gray-400 text-sm">{{ address.city }}, {{ address.state }} {{ address.zipCode }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button @click="editAddress(address)" class="text-purple-400 hover:text-purple-300 text-sm">Editar</button>
                    <button @click="deleteAddress(address.id)" class="text-red-400 hover:text-red-300 text-sm">Eliminar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Logout Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-white mb-4">Confirmar Cierre de Sesion</h3>
        <p class="text-gray-300 mb-6">¿Estás seguro de que quieres cerrar sesion?</p>
        <div class="flex gap-4">
          <button @click="confirmLogout" class="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all">
            Si, Cerrar Sesion
          </button>
          <button @click="showLogoutModal = false" class="flex-1 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <!-- Address Modal -->
    <div v-if="showAddressModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4">
        <h3 class="text-xl font-bold text-white mb-4">{{ editingAddress ? 'Editar' : 'Agregar' }} Direccion</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Etiqueta</label>
            <input v-model="addressForm.label" type="text" placeholder="Casa, Oficina" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Direccion</label>
            <input v-model="addressForm.street" type="text" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Ciudad</label>
              <input v-model="addressForm.city" type="text" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Estado</label>
              <input v-model="addressForm.state" type="text" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Codigo Postal</label>
              <input v-model="addressForm.zipCode" type="text" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Tipo</label>
              <select v-model="addressForm.type" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white">
                <option value="home">Casa</option>
                <option value="work">Oficina</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>
        </div>
        <div class="flex gap-4 mt-6">
          <button @click="saveAddress" class="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
            Guardar
          </button>
          <button @click="closeAddressModal" class="flex-1 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all">
            Cancelar
          </button>
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
const showLogoutModal = ref(false)
const showAddressModal = ref(false)
const editingAddress = ref<any>(null)
const addresses = ref<any[]>([])

const profile = ref({
  username: authStore.user?.username || '',
  email: authStore.user?.email || '',
  phone: '',
  birthDate: ''
})

const addressForm = ref({
  label: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  type: 'home'
})

const tabs = [
  { id: 'profile', name: 'Perfil', icon: '👤' },
  { id: 'orders', name: 'Pedidos', icon: '📦' },
  { id: 'wishlist', name: 'Favoritos', icon: '❤️' },
  { id: 'security', name: 'Seguridad', icon: '🔐' }
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
  showLogoutModal.value = true
}

const confirmLogout = () => {
  authStore.logout()
  router.push('/')
}

const openAddressModal = () => {
  editingAddress.value = null
  addressForm.value = { label: '', street: '', city: '', state: '', zipCode: '', country: '', type: 'home' }
  showAddressModal.value = true
}

const editAddress = (address: any) => {
  editingAddress.value = address
  addressForm.value = { ...address }
  showAddressModal.value = true
}

const closeAddressModal = () => {
  showAddressModal.value = false
  editingAddress.value = null
}

const saveAddress = () => {
  if (editingAddress.value) {
    addresses.value = addresses.value.map(a => a.id === editingAddress.value.id ? { ...addressForm.value, id: a.id } : a)
  } else {
    addresses.value.push({ ...addressForm.value, id: Date.now() })
  }
  closeAddressModal()
}

const deleteAddress = (id: number) => {
  if (confirm('¿Eliminar esta dirección?')) {
    addresses.value = addresses.value.filter(a => a.id !== id)
  }
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

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
.animate-slide-in { animation: slideIn 0.6s ease-out forwards; opacity: 0; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce { animation: bounce 2s ease-in-out infinite; }
</style>