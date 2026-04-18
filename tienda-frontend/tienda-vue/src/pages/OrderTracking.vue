<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-md mx-auto px-4 relative z-10">
      <h1 class="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        📍 Rastrear Pedido
      </h1>
      
      <form @submit.prevent="trackOrder" class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <label class="text-gray-300 text-sm mb-2 block">Número de orden</label>
        <input v-model="orderNumber" required class="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 mb-4" placeholder="Ej: ORD-20260404-0001" />
        <button type="submit" class="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold">Rastrear</button>
      </form>
      
      <div v-if="trackingResult" class="mt-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <h2 class="font-bold text-xl text-white mb-2">Estado: {{ trackingResult.status }}</h2>
        <p class="text-gray-300">{{ trackingResult.message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ordersAPI } from '../api'

const orderNumber = ref('')
const trackingResult = ref<any>(null)

const trackOrder = async () => {
  try {
    const orders = (await ordersAPI.getAll()).data || []
    const order = orders.find((o: any) => o.orderNumber === orderNumber.value)
    if (order) trackingResult.value = { status: order.status, message: `Tu pedido está en estado: ${order.status}` }
    else trackingResult.value = { status: 'No encontrado', message: 'No se encontró el pedido' }
  } catch (err) { console.error(err) }
}
</script>