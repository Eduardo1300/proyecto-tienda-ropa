<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Enhanced Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <!-- Animated gradient orbs -->
      <div class="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-15 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      
      <!-- Floating particles -->
      <div class="absolute top-20 left-20 w-2 h-2 bg-white opacity-60 rounded-full animate-bounce"></div>
      <div class="absolute top-40 right-32 w-3 h-3 bg-purple-300 opacity-40 rounded-full animate-bounce" style="animation-delay: 0.5s"></div>
      <div class="absolute bottom-32 left-40 w-2 h-2 bg-pink-300 opacity-50 rounded-full animate-bounce" style="animation-delay: 1.5s"></div>
      <div class="absolute bottom-40 right-20 w-1 h-1 bg-blue-300 opacity-70 rounded-full animate-bounce" style="animation-delay: 2.5s"></div>
    </div>

    <!-- Grid pattern overlay -->
    <div class="absolute inset-0 opacity-5">
      <div class="w-full h-full" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <div class="text-center animate-fade-in-up">
        <!-- Enhanced logo/icon with gradient -->
        <div class="relative mb-6">
          <div class="text-7xl mb-4 relative">
            <span class="text-7xl mb-4 relative">👤</span>
          </div>
          <div class="absolute -top-2 -right-2 text-2xl">✨</div>
        </div>
        
        <h2 class="text-4xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-3">
          ¡Bienvenido de vuelta!
        </h2>
        <p class="text-lg text-purple-100/80">
          Inicia sesión para continuar tu experiencia de compra
        </p>
      </div>

      <div class="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in-up hover:shadow-3xl hover:shadow-purple-500/20 hover:border-purple-400/30 transition-all duration-500">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Demo credentials -->
          <div class="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-400/30 mb-4 shadow-xl">
            <p class="text-sm text-center text-purple-100/90 mb-2 font-bold flex items-center justify-center gap-2">
              <span class="text-xl">🔑</span>
              <span class="text-base">Credenciales de prueba</span>
            </p>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm text-white bg-white/10 rounded-lg px-3 py-2">
                <span class="flex items-center gap-2"><span class="text-base">👤</span> Usuario:</span>
                <span class="font-mono">prueba@gmail.com</span>
                <span class="font-mono ml-2">password123</span>
              </div>
              <div class="flex items-center justify-between text-sm text-white bg-white/10 rounded-lg px-3 py-2">
                <span class="flex items-center gap-2"><span class="text-base">🛡️</span> Admin:</span>
                <span class="font-mono">admin@example.com</span>
                <span class="font-mono ml-2">password123</span>
              </div>
            </div>
            <div class="mt-2 text-xs text-purple-100 text-center">Usa las credenciales según el rol que quieras probar.</div>
          </div>

          <div v-if="error" class="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-2xl animate-fade-in-up shadow-lg">
            <div class="flex items-center gap-3">
              <span class="text-xl">⚠️</span>
              <span class="font-medium">{{ error }}</span>
            </div>
          </div>

          <div class="space-y-5">
            <div class="group">
              <label for="email" class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                <span class="text-lg">📧</span>
                Correo electrónico
              </label>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-4 bg-white/15 border border-white/30 rounded-2xl text-white placeholder-purple-200/70 focus:outline-none focus:ring-4 focus:ring-purple-400/30 focus:border-purple-300/50 focus:bg-white/20 transition-all duration-300 group-hover:border-white/40"
                placeholder="Ingresa tu email"
              />
            </div>

            <div class="group">
              <label for="password" class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                <span class="text-lg">🔒</span>
                Contraseña
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-4 pr-12 bg-white/15 border border-white/30 rounded-2xl text-white placeholder-purple-200/70 focus:outline-none focus:ring-4 focus:ring-purple-400/30 focus:border-purple-300/50 focus:bg-white/20 transition-all duration-300 group-hover:border-white/40"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-200/80 hover:text-white transition-all duration-200 p-1 rounded-lg hover:bg-white/10"
                >
                  <span class="text-lg">{{ showPassword ? '🙈' : '👁️' }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between mb-6">
            <label class="flex items-center group cursor-pointer">
              <input type="checkbox" class="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500 focus:ring-2" />
              <span class="ml-3 text-sm text-purple-100/90 group-hover:text-white transition-colors">Recordarme</span>
            </label>
            <RouterLink to="/forgot-password" class="text-sm text-purple-200/90 hover:text-white transition-colors font-medium">
              ¿Olvidaste tu contraseña?
            </RouterLink>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
          >
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-purple-100/80">
            ¿No tienes cuenta?
            <RouterLink to="/register" class="text-white font-semibold hover:underline">
              Regístrate aquí
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('admin@example.com')
const password = ref('password123')
const showPassword = ref(false)
const error = ref('')

const isLoading = ref(false)

const handleSubmit = async () => {
  console.log('Attempting login with:', email.value)
  error.value = ''
  isLoading.value = true
  
  // Limpiar sesión anterior antes de hacer login
  localStorage.removeItem('access_token')
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user')
  
  const success = await authStore.login({ email: email.value, password: password.value })
  
  console.log('Login success:', success)
  console.log('Auth store user after login:', authStore.user)
  console.log('Auth store isAuthenticated:', authStore.isAuthenticated)
  
  isLoading.value = false
  
  if (success) {
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } else {
    error.value = authStore.error || 'Credenciales inválidas'
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animate-pulse {
  animation: pulse 3s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}
</style>