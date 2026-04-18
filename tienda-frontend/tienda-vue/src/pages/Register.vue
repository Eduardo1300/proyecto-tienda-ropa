<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-15 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      <div class="absolute top-32 left-16 w-2 h-2 bg-white opacity-60 rounded-full animate-bounce"></div>
      <div class="absolute top-48 right-24 w-3 h-3 bg-purple-300 opacity-40 rounded-full animate-bounce" style="animation-delay: 0.8s"></div>
    </div>

    <!-- Grid pattern -->
    <div class="absolute inset-0 opacity-5">
      <div class="w-full h-full" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <div class="text-center animate-fade-in-up">
        <div class="relative mb-6">
          <div class="text-7xl mb-4">
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

      <div class="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in-up hover:shadow-3xl transition-all duration-500">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-2xl animate-fade-in-up">
            <div class="flex items-center gap-3">
              <span class="text-xl">⚠️</span>
              <span class="font-medium">{{ error }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="group">
              <label class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                <span class="text-lg">👤</span>
                Nombre
              </label>
              <input v-model="form.firstName" type="text" required
                class="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                placeholder="Juan" />
            </div>

            <div class="group">
              <label class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                <span class="text-lg">👤</span>
                Apellido
              </label>
              <input v-model="form.lastName" type="text" required
                class="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                placeholder="Pérez" />
            </div>
          </div>

          <div class="group">
            <label class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
              <span class="text-lg">🧑</span>
              Usuario
            </label>
            <input v-model="form.username" type="text" required
              class="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
              placeholder="juanperez123" />
          </div>

          <div class="group">
            <label class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
              <span class="text-lg">📧</span>
              Email
            </label>
            <input v-model="form.email" type="email" required
              class="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
              placeholder="juan@ejemplo.com" />
          </div>

          <div class="group">
            <label class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
              <span class="text-lg">🔒</span>
              Contraseña
            </label>
            <div class="relative">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required
                class="w-full px-4 py-4 pr-12 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                placeholder="••••••••" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="group">
            <label class="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
              <span class="text-lg">🔒</span>
              Confirmar Contraseña
            </label>
            <div class="relative">
              <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required
                class="w-full px-4 py-4 pr-12 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
                placeholder="••••••••" />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {{ showConfirmPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="flex items-center">
            <input type="checkbox" required class="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded" />
            <span class="ml-3 text-sm text-gray-300">
              Acepto los <a href="#" class="text-purple-400 hover:underline">Términos y Condiciones</a>
            </span>
          </div>

          <button type="submit" :disabled="isLoading"
            class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50">
            {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-purple-100/80">
            ¿Ya tienes cuenta?
            <RouterLink to="/login" class="text-white font-semibold hover:underline ml-1">
              Inicia sesión
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  error.value = ''
  
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  
  if (form.value.password.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }
  
  isLoading.value = true
  const success = await authStore.register({
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    firstName: form.value.firstName,
    lastName: form.value.lastName
  })
  isLoading.value = false
  
  if (success) {
    router.push('/')
  } else {
    error.value = authStore.error || 'Error al crear la cuenta'
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}
.animate-pulse { animation: pulse 3s ease-in-out infinite; }
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce { animation: bounce 2s ease-in-out infinite; }
</style>