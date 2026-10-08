<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-15 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      
      <div class="absolute top-32 left-16 w-2 h-2 bg-white opacity-60 rounded-full animate-bounce"></div>
      <div class="absolute top-48 right-24 w-3 h-3 bg-purple-300 opacity-40 rounded-full animate-bounce" style="animation-delay: 0.8s"></div>
      <div class="absolute bottom-24 left-32 w-2 h-2 bg-pink-300 opacity-50 rounded-full animate-bounce" style="animation-delay: 1.8s"></div>
      <div class="absolute bottom-48 right-16 w-1 h-1 bg-blue-300 opacity-70 rounded-full animate-bounce" style="animation-delay: 2.8s"></div>
    </div>

    <div class="absolute inset-0 opacity-5">
      <div class="w-full h-full" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <div class="text-center animate-fade-in-up">
        <div class="relative mb-6">
          <div class="text-7xl mb-4 relative">
            <span class="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">✨</span>
          </div>
          <div class="absolute -top-2 -left-2 text-2xl animate-bounce">🎉</div>
        </div>
        
        <h2 class="text-4xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-3">
          ¡Únete a nosotros!
        </h2>
        <p class="text-lg text-purple-100/80">
          Crea tu cuenta y descubre la mejor moda
        </p>
      </div>

      <Card class="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in-up hover:shadow-3xl transition-all duration-500">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-2xl animate-fade-in-up shadow-lg">
            <div class="flex items-center gap-3">
              <span class="text-xl">⚠️</span>
              <span class="font-medium">{{ error }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="group">
              <label for="firstName" class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                <span class="text-lg">👤</span>
                Nombre
              </label>
              <input
                id="firstName"
                v-model="formData.firstName"
                type="text"
                required
                class="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                placeholder="Juan"
              />
            </div>

            <div class="group">
              <label for="lastName" class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                <span class="text-lg">👥</span>
                Apellido
              </label>
              <input
                id="lastName"
                v-model="formData.lastName"
                type="text"
                required
                class="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                placeholder="Pérez"
              />
            </div>
          </div>

          <div class="group">
            <label for="username" class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
              <span class="text-lg">🏷️</span>
              Nombre de usuario
            </label>
            <input
              id="username"
              v-model="formData.username"
              type="text"
              required
              class="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
              placeholder="tu_usuario_cool"
            />
          </div>

          <div class="group">
            <label for="email" class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
              <span class="text-lg">📧</span>
              Correo electrónico
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
              placeholder="tu@email.com"
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
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-4 pr-12 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                placeholder="Mínimo 6 caracteres"
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

          <div class="group">
            <label for="confirmPassword" class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
              <span class="text-lg">🔐</span>
              Confirmar contraseña
            </label>
            <div class="relative">
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                required
                class="w-full px-4 py-4 pr-12 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                placeholder="Repite tu contraseña"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-200/80 hover:text-white transition-all duration-200 p-1 rounded-lg hover:bg-white/10"
              >
                <span class="text-lg">{{ showConfirmPassword ? '🙈' : '👁️' }}</span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-3">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creando cuenta...
            </span>
            <span v-else class="flex items-center justify-center gap-3">
              <span class="text-xl">🌟</span>
              Crear cuenta
            </span>
          </Button>

          <div class="text-center">
            <p class="text-gray-300">
              ¿Ya tienes cuenta?{' '}
              <RouterLink to="/login" class="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 transition-colors">
                Inicia sesión aquí
              </RouterLink>
            </p>
          </div>
        </form>
      </Card>

      <div class="text-center animate-fade-in-up">
        <RouterLink to="/" class="inline-flex items-center gap-3 text-purple-200/80 hover:text-white transition-all duration-300 font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
          <span class="text-lg">⬅️</span>
          Volver al inicio
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { Button, Card } from '../components/ui'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

const handleSubmit = async (e: any) => {
  e.preventDefault()
  error.value = ''

  if (!formData.value.firstName || !formData.value.lastName || !formData.value.username || !formData.value.email || !formData.value.password) {
    error.value = 'Por favor, completa todos los campos'
    return
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (formData.value.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    error.value = 'Por favor, ingresa un email válido'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const success = await authStore.register({
      username: formData.value.username,
      email: formData.value.email,
      password: formData.value.password,
      firstName: formData.value.firstName,
      lastName: formData.value.lastName
    })

    if (success) {
      router.push('/')
    }
  } catch (err: any) {
    const errorMessage = err?.message || 'Error al crear la cuenta. Inténtalo de nuevo.'
    if (errorMessage.toLowerCase().includes('email is already in use') || 
        errorMessage.toLowerCase().includes('conflict')) {
      error.value = 'Este email ya está registrado. Usa otro email o inicia sesión.'
    } else {
      error.value = errorMessage
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce { animation: bounce 2s ease-in-out infinite; }
</style>