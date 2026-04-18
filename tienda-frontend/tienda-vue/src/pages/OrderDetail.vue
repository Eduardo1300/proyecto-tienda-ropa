<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-4xl mx-auto px-4 relative z-10">
      <RouterLink to="/orders" class="inline-flex items-center text-purple-300 hover:text-white transition-colors mb-6">
        ← Volver a Mis Pedidos
      </RouterLink>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
        <p class="mt-4 text-gray-300">Cargando detalles del pedido...</p>
      </div>

      <div v-else-if="error" class="bg-red-500/20 border border-red-400/50 rounded-xl p-6 text-center">
        <p class="text-red-300">{{ error }}</p>
        <RouterLink to="/orders" class="text-purple-300 hover:text-white mt-4 inline-block">Volver a pedidos</RouterLink>
      </div>

      <div v-else-if="order" class="space-y-6">
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-3xl font-bold text-white">Pedido #{{ order.orderNumber }}</h1>
              <p class="text-gray-400">{{ new Date(order.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
            </div>
            <div class="text-right">
              <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold" :class="getStatusColor(order.status)">
                {{ getStatusDisplayName(order.status) }}
              </span>
              <p class="text-3xl font-bold text-white mt-2">S/ {{ Number(order.total).toFixed(2) }}</p>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 class="font-semibold text-white mb-3">Información de Envío</h3>
              <div class="text-gray-300 space-y-1">
                <p v-if="order.shippingAddress">{{ order.shippingAddress.street }}, {{ order.shippingAddress.city }}</p>
                <p v-else class="text-gray-500">No disponible</p>
              </div>
            </div>
            <div class="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 class="font-semibold text-white mb-3">Información de Pago</h3>
              <div class="text-gray-300 space-y-1">
                <p>Método: {{ order.paymentMethod || 'Tarjeta' }}</p>
                <p>Estado: {{ order.paymentStatus || 'Pagado' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 class="text-2xl font-bold text-white mb-6">📦 Productos</h2>
          <div class="space-y-4">
            <div v-for="item in order.items" :key="item.id" class="flex items-center gap-4 py-4 border-b border-white/10">
              <div class="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center text-4xl">
                <span v-if="item.product">{{ getProductEmoji(item.product) }}</span>
                <span v-else>📦</span>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-white">{{ item.product?.name }}</h3>
                <p class="text-gray-400 text-sm">Cantidad: {{ item.quantity }} × S/ {{ Number(item.price).toFixed(2) }}</p>
              </div>
              <div class="text-right">
                <p class="font-bold text-white">S/ {{ (Number(item.price) * item.quantity).toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 class="text-2xl font-bold text-white mb-6">💰 Resumen</h2>
          <div class="space-y-3">
            <div class="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>S/ {{ Number(order.subtotal || order.total).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-300">
              <span>Envío</span>
              <span>S/ {{ Number(order.shipping || 0).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-300">
              <span>Impuestos</span>
              <span>S/ {{ Number(order.tax || 0).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-white font-bold text-xl pt-3 border-t border-white/20">
              <span>Total</span>
              <span>S/ {{ Number(order.total).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <RouterLink v-if="order.status !== 'delivered'" :to="`/order-tracking/${order.id}`" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all">
            📍 Rastrear Pedido
          </RouterLink>
          <RouterLink :to="`/orders/${order.id}`" class="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all">
            📋 Ver Detalle
          </RouterLink>
          <button v-if="order.status === 'delivered'" @click="router.push(`/return-request/${order.id}`)" class="bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-all">
            ↩️ Solicitar Devolución
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersAPI } from '../api'
import { useAuthStore } from '../stores/auth'
import type { Order } from '../types'

const route = useRoute()
const router = useRouter()
const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50',
    processing: 'bg-blue-500/30 text-blue-100 border border-blue-400/50',
    shipped: 'bg-purple-500/30 text-purple-100 border border-purple-400/50',
    delivered: 'bg-green-500/30 text-green-100 border border-green-400/50',
    cancelled: 'bg-red-500/30 text-red-100 border border-red-400/50',
  }
  return colors[status] || 'bg-gray-500/30 text-gray-100 border border-gray-400/50'
}

const getProductEmoji = (product: any): string => {
  const category = (product.category || '').toLowerCase()
  if (category.includes('hombre') || category.includes('men')) return String.fromCodePoint(0x1F455)
  if (category.includes('mujer') || category.includes('women')) return String.fromCodePoint(0x1F457)
  if (category.includes('shoes') || category.includes('zapato')) return String.fromCodePoint(0x1F45F)
  if (category.includes('accessories') || category.includes('accesorio')) return String.fromCodePoint(0x1F6C1)
  return String.fromCodePoint(0x1F455)
}

const getStatusDisplayName = (status: string) => {
  const names: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  }
  return names[status] || status
}

const downloadInvoice = async () => {
  if (!order.value) return
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`https://proyecto-tienda-ropa.onrender.com/orders/${order.value.id}/invoice`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `invoice-${order.value.orderNumber}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Error downloading invoice:', err)
  }
}

onMounted(async () => {
  try {
    const id = parseInt(route.params.orderId as string)
    const response = await ordersAPI.getById(id)
    order.value = response.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error loading order'
  } finally {
    loading.value = false
  }
})
</script>