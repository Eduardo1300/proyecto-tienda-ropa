<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="container mx-auto px-4 max-w-md">
      <h1 class="text-2xl font-bold mb-6 dark:text-white">Rastrear Pedido</h1>
      <form @submit.prevent="trackOrder" class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <label class="block text-sm font-medium mb-2 dark:text-gray-300">Número de orden</label>
        <input v-model="orderNumber" required class="w-full p-3 border rounded-lg dark:bg-gray-700 mb-4" placeholder="Ej: ORD-20260404-0001" />
        <button type="submit" class="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Rastrear</button>
      </form>
      <div v-if="trackingResult" class="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 class="font-bold text-xl mb-4 dark:text-white">Estado: {{ trackingResult.status }}</h2>
        <p class="text-gray-600 dark:text-gray-300">{{ trackingResult.message }}</p>
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