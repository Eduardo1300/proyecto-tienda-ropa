<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-15 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
      
      <div class="absolute top-20 left-20 w-2 h-2 bg-white opacity-60 rounded-full animate-bounce"></div>
      <div class="absolute top-40 right-32 w-3 h-3 bg-purple-300 opacity-40 rounded-full animate-bounce" style="animation-delay: 0.5s"></div>
      <div class="absolute bottom-32 left-40 w-2 h-2 bg-pink-300 opacity-50 rounded-full animate-bounce" style="animation-delay: 1.5s"></div>
      <div class="absolute bottom-40 right-20 w-1 h-1 bg-blue-300 opacity-70 rounded-full animate-bounce" style="animation-delay: 2.5s"></div>
    </div>

    <div class="absolute inset-0 opacity-5">
      <div class="w-full h-full" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <div class="text-center animate-fade-in-up">
        <div class="relative mb-6">
          <div class="text-7xl mb-4 relative">
            <span class="text-7xl mb-4 relative">🔐</span>
          </div>
          <div class="absolute -top-2 -right-2 text-2xl animate-spin-slow">🔑</div>
        </div>
        
        <h2 class="text-4xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-3">
          Recuperar Contraseña
        </h2>
        <p class="text-lg text-purple-100/80">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <Card class="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in-up hover:shadow-3xl hover:shadow-purple-500/20 hover:border-purple-400/30 transition-all duration-500">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="success" class="bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-100 px-4 py-4 rounded-2xl animate-fade-in-up shadow-lg">
            <div class="flex items-center gap-3">
              <span class="text-xl">✅</span>
              <span class="font-medium">{{ success }}</span>
            </div>
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
                placeholder="Ingresa tu email registrado"
              />
            </div>
          </div>

          <Button
            type="submit"
            :disabled="isLoading || success"
            class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
          >
            {{ isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación' }}
          </Button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-purple-100/80">
            ¿Recordaste tu contraseña?
            <RouterLink to="/login" class="text-white font-semibold hover:underline">
              Iniciar Sesión
            </RouterLink>
          </p>
        </div>
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
import { authAPI } from '../api'
import { Button, Card } from '../components/ui'

const router = useRouter()

const email = ref('')
const error = ref('')
const success = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!email.value) {
    error.value = 'Por favor ingresa tu email'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = 'Por favor ingresa un email válido'
    return
  }

  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    await authAPI.forgotPassword(email.value)
    success.value = 'Se ha enviado un enlace de recuperación a tu email. Revisa tu bandeja de entrada y spam.'
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al enviar el correo. Intenta de nuevo.'
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

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
.animate-pulse { animation: pulse 3s ease-in-out infinite; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce { animation: bounce 2s ease-in-out infinite; }

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow { animation: spin-slow 8s linear infinite; }
</style>