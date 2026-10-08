<template>
  <header class="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 dark:bg-gray-900/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-indigo-500/30 dark:border-purple-500/30">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center space-x-2 group">
          <div class="text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 drop-shadow-lg">👗</div>
          <span class="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-orange-300 hover:from-purple-200 hover:via-pink-200 hover:to-orange-200 transition-all drop-shadow-lg">
            Fashion Store
          </span>
        </RouterLink>
        
        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-1">
          <RouterLink to="/" class="py-2 px-4 rounded-xl text-white/90 hover:bg-white/15 hover:text-white transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/10">
            🏠 Inicio
          </RouterLink>
          <RouterLink to="/products" class="py-2 px-4 rounded-xl text-white/90 hover:bg-white/15 hover:text-white transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/10">
            👕 Productos
          </RouterLink>
          
          <!-- Links visibles para todos (logueados o no) - muestran mensaje si no están logueados -->
          <RouterLink to="/orders" class="py-2 px-4 rounded-xl text-white/90 hover:bg-white/15 hover:text-white transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/10" @click.prevent="checkAuth($event, '/orders')">
            📦 Mis Pedidos
          </RouterLink>
          <RouterLink to="/profile" class="py-2 px-4 rounded-xl text-white/90 hover:bg-white/15 hover:text-white transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/10" @click.prevent="checkAuth($event, '/profile')">
            👤 Perfil
          </RouterLink>
          
          <!-- Solo admin -->
          <RouterLink v-if="hasLocalAuth && userRole === 'admin'" to="/dashboard" class="py-2 px-4 rounded-xl text-white/90 hover:bg-white/15 hover:text-white transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/10">
            📊 Dashboard
          </RouterLink>
          <RouterLink v-if="hasLocalAuth && userRole === 'admin'" to="/admin" class="py-2 px-4 rounded-xl text-white/90 hover:bg-white/15 hover:text-white transition-all duration-300 text-sm font-medium backdrop-blur-sm border border-white/10">
            ⚙️ Admin
          </RouterLink>

        </nav>
        
        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center space-x-4">
          <RouterLink to="/cart" class="relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white">
            🛒
            <span v-if="cartStore.itemCount > 0" class="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
              {{ cartStore.itemCount }}
            </span>
          </RouterLink>

          <div v-if="hasLocalAuth" class="flex items-center space-x-3">
            <div class="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 rounded-full text-white font-medium backdrop-blur-sm border border-white/10">
              <span class="text-lg">👤</span>
              <span class="text-sm font-medium">{{ getUserName() }}</span>
            </div>
            <button @click="handleLogout" class="p-3 rounded-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white transition-all duration-300 shadow-lg hover:shadow-xl" title="Cerrar sesion">
              🚪
            </button>
          </div>
          <div v-else class="flex items-center space-x-2">
            <RouterLink to="/login" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
              🔑 Login
            </RouterLink>
            <RouterLink to="/register" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
              📝 Registro
            </RouterLink>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden p-3 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300">
          <span class="text-2xl">☰</span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden mt-4 pb-4 animate-slide-down">
        <nav class="flex flex-col space-y-2">
          <RouterLink to="/" @click="isMenuOpen = false" class="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 font-medium backdrop-blur-sm border border-white/10">
            🏠 Inicio
          </RouterLink>
          <RouterLink to="/products" @click="isMenuOpen = false" class="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 font-medium backdrop-blur-sm border border-white/10">
            👕 Productos
          </RouterLink>
          <RouterLink to="/cart" @click="isMenuOpen = false" class="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 font-medium backdrop-blur-sm border border-white/10">
            🛒 Carrito ({{ cartStore.itemCount }})
          </RouterLink>
          <template v-if="hasLocalAuth">
            <RouterLink v-if="userRole === 'admin'" to="/dashboard" @click="isMenuOpen = false" class="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 font-medium backdrop-blur-sm border border-white/10">
              📊 Dashboard
            </RouterLink>
            <RouterLink to="/orders" @click="isMenuOpen = false" class="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 font-medium backdrop-blur-sm border border-white/10">
              📦 Pedidos
            </RouterLink>
            <RouterLink to="/profile" @click="isMenuOpen = false" class="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 font-medium backdrop-blur-sm border border-white/10">
              👤 Perfil
            </RouterLink>
            <RouterLink v-if="userRole === 'admin'" to="/admin" @click="isMenuOpen = false" class="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 font-medium backdrop-blur-sm border border-white/10">
              ⚙️ Admin
            </RouterLink>
            
            <button @click="handleLogout" class="py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 font-medium transition-all duration-300 shadow-lg">
              🚪 Cerrar Sesion
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" @click="isMenuOpen = false" class="py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-lg">
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