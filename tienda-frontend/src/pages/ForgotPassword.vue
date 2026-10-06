<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-12 px-4 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <div class="text-center">
        <div class="text-8xl mb-4">{{ showResetForm ? '🔐' : '🔑' }}</div>
        <h2 class="text-5xl font-black text-white mb-3">
          {{ showResetForm ? '🔐 Nueva Contraseña' : '🔑 Recuperar Acceso' }}
        </h2>
        <p class="text-xl text-gray-300">
          {{ showResetForm ? 'Establece tu nueva contraseña segura' : 'Te enviaremos un enlace para recuperar tu cuenta' }}
        </p>
      </div>

      <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
        <form v-if="!showResetForm" @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="bg-red-500/30 backdrop-blur-sm border border-red-400/50 text-red-100 px-4 py-3 rounded-2xl">
            <div class="flex items-center gap-3">
              <span class="text-xl">⚠️</span>
              <span class="font-medium">{{ error }}</span>
            </div>
          </div>

          <div v-if="message" class="bg-green-500/30 backdrop-blur-sm border border-green-400/50 text-green-100 px-4 py-3 rounded-2xl">
            <div class="flex items-center gap-3">
              <span class="text-xl">✅</span>
              <span class="font-medium">{{ message }}</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-white mb-2">📧 Correo electrónico</label>
            <input v-model="email" type="email" required class="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm" placeholder="tu@email.com" />
          </div>

          <button type="submit" :disabled="isLoading" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <span v-if="isLoading" class="flex items-center justify-center gap-2">⏳ Enviando...</span>
            <span v-else class="flex items-center justify-center gap-2">📤 Enviar enlace de recuperación</span>
          </button>

          <div class="text-center space-y-4">
            <div>
              <RouterLink to="/login" class="text-gray-300 hover:text-white transition-colors font-medium">⬅️ Volver al login</RouterLink>
            </div>
            <div>
              <p class="text-gray-300">
                ¿No tienes cuenta? 
                <RouterLink to="/register" class="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 transition-colors">Regístrate gratis</RouterLink>
              </p>
            </div>
          </div>
        </form>

        <form v-else @submit.prevent="handleResetPassword" class="space-y-6">
          <div v-if="error" class="bg-red-500/30 backdrop-blur-sm border border-red-400/50 text-red-100 px-4 py-3 rounded-2xl">
            <div class="flex items-center gap-2">
              <span>⚠️</span>
              <span>{{ error }}</span>
            </div>
          </div>

          <div v-if="message" class="bg-green-500/30 backdrop-blur-sm border border-green-400/50 text-green-100 px-4 py-3 rounded-2xl">
            <div class="flex items-center gap-2">
              <span>✅</span>
              <span>{{ message }}</span>
            </div>
          </div>

          <div class="bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 text-blue-100 px-4 py-3 rounded-2xl">
            <div class="flex items-center gap-2">
              <span>💡</span>
              <span>Token de desarrollo: {{ resetToken.substring(0, 20) }}...</span>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">🔒 Nueva contraseña</label>
            <input v-model="newPassword" type="password" required class="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300" placeholder="Nueva contraseña (mín. 6 caracteres)" />
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">🔒 Confirmar contraseña</label>
            <input v-model="confirmPassword" type="password" required class="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300" placeholder="Confirma tu nueva contraseña" />
          </div>

          <button type="submit" :disabled="isLoading" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            <span v-if="isLoading" class="flex items-center justify-center gap-2">⏳ Reseteando...</span>
            <span v-else class="flex items-center justify-center gap-2">🔄 Resetear contraseña</span>
          </button>

          <div class="text-center">
            <button type="button" @click="resetForm" class="text-purple-200 hover:text-white transition-colors font-medium">⬅️ Volver a solicitar código</button>
          </div>
        </form>
      </div>

      <div class="text-center">
        <RouterLink to="/" class="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors">🏠 Volver al inicio</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { authAPI } from '../api'

const email = ref('')
const isLoading = ref(false)
const message = ref('')
const error = ref('')
const resetToken = ref('')
const showResetForm = ref(false)
const newPassword = ref('')
const confirmPassword = ref('')

const handleSubmit = async () => {
  error.value = ''
  message.value = ''

  if (!email.value) {
    error.value = 'Por favor, ingresa tu email'
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    error.value = 'Por favor, ingresa un email válido'
    return
  }

  isLoading.value = true
  try {
    const response = await authAPI.forgotPassword(email.value)
    message.value = response.data?.data?.message || 'Email de recuperación enviado'
    if (response.data?.data?.resetToken) {
      resetToken.value = response.data.data.resetToken
      showResetForm.value = true
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al enviar solicitud de recuperación'
  } finally {
    isLoading.value = false
  }
}

const handleResetPassword = async () => {
  error.value = ''
  message.value = ''

  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  if (newPassword.value.length < 6) {
    error.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  isLoading.value = true
  try {
    const response = await authAPI.resetPassword(resetToken.value, newPassword.value)
    message.value = response.data?.data?.message || 'Contraseña actualizada'
    resetForm()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al resetear la contraseña'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  showResetForm.value = false
  resetToken.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  error.value = ''
  message.value = ''
}
</script>