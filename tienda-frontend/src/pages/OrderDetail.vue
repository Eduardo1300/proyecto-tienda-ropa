<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>

    <div v-if="loading" class="max-w-4xl mx-auto relative z-10">
      <div class="animate-pulse space-y-8">
        <div class="bg-white/10 rounded-2xl p-8">
          <div class="h-8 bg-white/20 rounded w-1/3 mb-6"></div>
          <div class="grid grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="h-12 bg-white/10 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!order" class="max-w-4xl mx-auto text-center py-20 animate-fade-in-up relative z-10">
      <Card class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-lg mx-auto">
        <div class="text-8xl mb-6">😕</div>
        <h2 class="text-3xl font-bold text-white mb-4">Pedido no encontrado</h2>
        <p class="text-gray-300 mb-8">El pedido que buscas no existe o no tienes acceso.</p>
        <RouterLink to="/orders">
          <Button class="transform hover:scale-105 shadow-xl">← Ver Mis Pedidos</Button>
        </RouterLink>
      </Card>
    </div>

    <div v-else class="max-w-4xl mx-auto relative z-10">
      <div class="mb-6 animate-fade-in-up">
        <RouterLink to="/orders" class="text-purple-400 hover:text-purple-300 hover:underline transition-colors inline-flex items-center gap-2">
          ← Volver a pedidos
        </RouterLink>
      </div>

      <Card class="animate-fade-in-up" style="animation-delay: 0.1s;">
        <div class="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-bold text-white mb-2">Pedido #{{ order.orderNumber }}</h1>
            <p class="text-gray-400">{{ formatDate(order.createdAt) }}</p>
          </div>
          <Badge :class="getStatusClass(order.status)" class="text-lg px-4 py-2">
            {{ getStatusDisplayName(order.status) }}
          </Badge>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white/10 rounded-xl p-6 text-center border border-white/10">
            <p class="text-gray-400 text-sm mb-1">Total</p>
            <p class="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              S/ {{ Number(order.total).toFixed(2) }}
            </p>
          </div>
          <div class="bg-white/10 rounded-xl p-6 text-center border border-white/10">
            <p class="text-gray-400 text-sm mb-1">Estado</p>
            <p class="text-2xl font-bold text-white">{{ getStatusDisplayName(order.status) }}</p>
          </div>
          <div class="bg-white/10 rounded-xl p-6 text-center border border-white/10">
            <p class="text-gray-400 text-sm mb-1">Artículos</p>
            <p class="text-2xl font-bold text-white">{{ order.items?.length || 0 }}</p>
          </div>
        </div>

        <div class="border-t border-white/20 mb-6 pt-6">
          <h2 class="text-2xl font-bold text-white mb-4">📦 Detalles del Envío</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="order.shippingAddress" class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-white font-semibold mb-3 flex items-center gap-2">📍 Dirección de Envío</h3>
              <p class="text-gray-300 whitespace-pre-line">{{ order.shippingAddress }}</p>
            </div>
            <div v-if="order.billingAddress" class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-white font-semibold mb-3 flex items-center gap-2">💳 Dirección de Facturación</h3>
              <p class="text-gray-300 whitespace-pre-line">{{ order.billingAddress }}</p>
            </div>
          </div>
        </div>

        <div v-if="order.trackingCode" class="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-400/50 rounded-2xl p-6 mb-6">
          <h3 class="text-white font-semibold text-lg mb-4 flex items-center gap-2">📍 Rastreo</h3>
          <div class="flex items-center gap-4 flex-wrap">
            <p class="text-blue-300"><strong>Código:</strong> {{ order.trackingCode }}</p>
            <p v-if="order.shippingCarrier" class="text-blue-300"><strong>Transportista:</strong> {{ order.shippingCarrier }}</p>
            <RouterLink v-if="order.trackingCode" :to="`/order-tracking/${order.id}`" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm">
              📍 Rastrear Envío
            </RouterLink>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-white mb-4">🛍️ Artículos del Pedido</h2>
        <div class="space-y-4">
          <div v-for="item in order.items" :key="item.id" class="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col md:flex-row items-center md:items-start gap-4">
            <div class="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-3xl flex-shrink-0">
              📦
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-white">{{ item.product?.name || item.name || `Producto #${item.productId}` }}</h4>
              <p class="text-gray-400 text-sm">Cantidad: {{ item.quantity }} × S/ {{ Number(item.price).toFixed(2) }}</p>
            </div>
            <div class="text-right">
              <p class="text-white font-bold text-lg">S/ {{ (Number(item.price) * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div class="mt-8 border-t border-white/20 pt-6">
          <h2 class="text-xl font-bold text-white mb-4">💰 Resumen de Pagos</h2>
          <div class="space-y-3">
            <div class="flex justify-between text-gray-300">
              <span>Subtotal</span>
              <span>S/ {{ (Number(order.total) / 1.15).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-300">
              <span>Impuestos (15%)</span>
              <span>S/ {{ (Number(order.total) * 0.15 / 1.15).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-300">
              <span>Envío</span>
              <Badge variant="success" icon="🚚">GRATIS</Badge>
            </div>
            <div class="flex justify-between text-xl font-bold text-white pt-3 border-t border-white/20">
              <span>Total Pagado</span>
              <span class="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">S/ {{ Number(order.total).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div v-if="order.status === 'delivered' && order.actualDeliveryDate" class="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
          <p class="text-green-300 text-center">
            ✅ Entregado el {{ formatDate(order.actualDeliveryDate) }}
          </p>
        </div>

        <div v-if="order.status === 'cancelled'" class="mt-6 p-4 bg-red-500/20 border border-red-400/30 rounded-xl">
          <p class="text-red-300 text-center">
            ❌ Pedido cancelado: {{ order.cancellationReason || 'Sin razón especificada' }}
          </p>
        </div>
      </Card>

      <div class="mt-6 text-center animate-fade-in-up" style="animation-delay: 0.3s;">
        <RouterLink to="/orders" class="px-6 py-3 bg-white/10 border border-white/30 text-white rounded-xl hover:bg-white/20 transition-all font-semibold">
          ← Volver a Mis Pedidos
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersAPI } from '../api'
import type { Order } from '../types'
import { Card, Badge, RouterLink } from '../components/ui'

const route = useRoute()
const router = useRouter()

const order = ref<Order | null>(null)
const loading = ref(true)

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    delivered: 'bg-green-500/20 text-green-300 border border-green-400/30',
    shipped: 'bg-purple-500/20 text-purple-300 border border-purple-400/30',
    processing: 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30',
    pending: 'bg-gray-500/20 text-gray-300 border border-gray-400/30',
    cancelled: 'bg-red-500/20 text-red-300 border border-red-400/30',
  }
  return classes[status] || 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
}

const getStatusDisplayName = (status: string) => {
  const names: Record<string, string> = {
    delivered: 'Entregado',
    shipped: 'Enviado',
    processing: 'Procesando',
    pending: 'Pendiente',
    cancelled: 'Cancelado',
  }
  return names[status] || status
}

onMounted(async () => {
  try {
    const idParam = route.params.orderId as string
    const id = parseInt(idParam)
    if (isNaN(id)) {
      router.push('/orders')
      return
    }
    const response = await ordersAPI.getById(id)
    order.value = response.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
</style>