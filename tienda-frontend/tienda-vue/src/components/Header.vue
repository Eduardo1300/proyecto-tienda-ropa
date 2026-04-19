<template>
  <header class="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 dark:border-gray-700">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-2 group">
          <div class="text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">👗</div>
          <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 hover:from-indigo-700 hover:via-purple-600 hover:to-pink-600 transition-all">
            Fashion Store
          </span>
        </RouterLink>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-4">
          <RouterLink to="/" class="py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 text-sm">
            🏠 Inicio
          </RouterLink>
          <RouterLink to="/products" class="py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 text-sm">
            👕 Productos
          </RouterLink>
          
          <!-- Links visibles para todos (logueados o no) - muestran mensaje si no están logueados -->
          <RouterLink to="/orders" class="py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 text-sm" @click.prevent="checkAuth($event, '/orders')">
            📦 Mis Pedidos
          </RouterLink>
          <RouterLink to="/profile" class="py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 text-sm" @click.prevent="checkAuth($event, '/profile')">
            👤 Perfil
          </RouterLink>
          <RouterLink to="/loyalty" class="py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 text-sm" @click.prevent="checkAuth($event, '/loyalty')">
            🏆 Lealtad
          </RouterLink>
          
          <!-- Solo admin -->
          <RouterLink v-if="hasLocalAuth && userRole === 'admin'" to="/dashboard" class="py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 text-sm">
            📊 Dashboard
          </RouterLink>
          <RouterLink v-if="hasLocalAuth && userRole === 'admin'" to="/admin" class="py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 text-sm">
            ⚙️ Admin
          </RouterLink>
          <RouterLink v-if="hasLocalAuth && userRole === 'admin'" to="/inventory" class="py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 text-sm">
            📦 Inventario
          </RouterLink>
          <RouterLink v-if="hasLocalAuth && userRole === 'admin'" to="/analytics" class="py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 text-sm">
            📈 Analytics
          </RouterLink>
          
          <!-- Solo supplier -->
          <RouterLink v-if="hasLocalAuth && userRole === 'supplier'" to="/supplier" class="py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-indigo-100 hover:text-indigo-600 transition-all duration-300 text-sm">
            🚚 Proveedor
          </RouterLink>
        </nav>

        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center space-x-4">
          <RouterLink to="/cart" class="relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200">
            🛒
            <span v-if="cartStore.itemCount > 0" class="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
              {{ cartStore.itemCount }}
            </span>
          </RouterLink>

          <div v-if="hasLocalAuth" class="flex items-center space-x-3">
            <div class="hidden sm:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full text-gray-700 dark:text-gray-200">
              <span class="text-lg">👤</span>
              <span class="text-sm font-medium">{{ getUserName() }}</span>
            </div>
            <button @click="handleLogout" class="p-2 rounded-full bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-300 transition-all duration-300" title="Cerrar sesion">
              🚪
            </button>
          </div>
          <div v-else class="flex items-center space-x-2">
            <RouterLink to="/login" class="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-all duration-300">
              🔑 Login
            </RouterLink>
            <RouterLink to="/register" class="px-4 py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium transition-all duration-300">
              📝 Registro
            </RouterLink>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
          ☰
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden mt-4 pb-4">
        <nav class="flex flex-col space-y-2">
          <RouterLink to="/" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            🏠 Inicio
          </RouterLink>
          <RouterLink to="/products" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            👕 Productos
          </RouterLink>
          <RouterLink to="/cart" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            🛒 Carrito ({{ cartStore.itemCount }})
          </RouterLink>
          <template v-if="hasLocalAuth">
            <RouterLink v-if="userRole === 'admin'" to="/dashboard" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              📊 Dashboard
            </RouterLink>
            <RouterLink to="/orders" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              📦 Pedidos
            </RouterLink>
            <RouterLink to="/profile" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              👤 Perfil
            </RouterLink>
            <RouterLink v-if="userRole === 'user'" to="/loyalty" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              🏆 Lealtad
            </RouterLink>
            <RouterLink v-if="userRole === 'admin'" to="/admin" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              ⚙️ Admin
            </RouterLink>
            <RouterLink v-if="userRole === 'admin'" to="/inventory" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              📦 Inventario
            </RouterLink>
            <RouterLink v-if="userRole === 'admin'" to="/analytics" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
              📈 Analytics
            </RouterLink>
            <RouterLink v-if="userRole === 'supplier'" to="/supplier" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
              🚚 Proveedor
            </RouterLink>
            <button @click="handleLogout" class="py-2 px-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 text-left">
              🚪 Cerrar Sesion
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" @click="isMenuOpen = false" class="py-2 px-4 rounded-lg bg-indigo-600 text-white text-center">
              🔑 Login
            </RouterLink>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const isMenuOpen = ref(false)

const hasLocalAuth = computed(() => {
  // Use authStore for reactivity + localStorage fallback
  if (authStore.isAuthenticated) return true
  const token = localStorage.getItem('access_token') || localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  return !!(token && userStr)
})

const userRole = computed(() => {
  // Use authStore for reactivity + localStorage fallback
  if (authStore.user?.role) return authStore.user.role
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

const getUserName = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    try {
      const userData = JSON.parse(userStr)
      return userData.username || userData.email || 'Usuario'
    } catch {
      return 'Usuario'
    }
  }
  return 'Usuario'
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const checkAuth = (event: Event, path: string) => {
  if (!hasLocalAuth.value) {
    event.preventDefault()
    router.push({ name: 'Login', query: { redirect: path } })
  }
}
</script>