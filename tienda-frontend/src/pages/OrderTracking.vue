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
          <div class="h-64 bg-white/5 rounded-2xl"></div>
        </div>
      </div>
    </div>

    <div v-else-if="!order" class="max-w-4xl mx-auto text-center py-20 animate-fade-in-up relative z-10">
      <Card class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-lg mx-auto">
        <div class="text-8xl mb-6">🔍</div>
        <h2 class="text-3xl font-bold text-white mb-4">Pedido no encontrado</h2>
        <p class="text-gray-300 mb-8">No se encontró información de rastreo para este pedido.</p>
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
            <h1 class="text-3xl font-bold text-white mb-2">Rastreo de Pedido #{{ order.orderNumber }}</h1>
            <p class="text-gray-400">Realizado el {{ formatDate(order.createdAt) }}</p>
          </div>
          <Badge :class="getStatusClass(order.status)" class="text-lg px-4 py-2">
            {{ getStatusDisplayName(order.status) }}
          </Badge>
        </div>

        <div v-if="order.trackingCode" class="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border border-blue-400/50 rounded-2xl p-6 mb-8">
          <h2 class="text-2xl font-bold text-white mb-4 flex items-center gap-2">📍 Información de Rastreo</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div class="bg-white/10 rounded-xl p-4 text-center border border-white/10">
              <p class="text-blue-300 text-sm mb-1">Código de Rastreo</p>
              <p class="text-white font-bold text-lg font-mono break-all">{{ order.trackingCode }}</p>
            </div>
            <div class="bg-white/10 rounded-xl p-4 text-center border border-white/10">
              <p class="text-blue-300 text-sm mb-1">Transportista</p>
              <p class="text-white font-semibold">{{ order.shippingCarrier || 'Por asignar' }}</p>
            </div>
            <div class="bg-white/10 rounded-xl p-4 text-center border border-white/10">
              <p class="text-blue-300 text-sm mb-1">Entrega Estimada</p>
              <p class="text-white font-semibold">{{ order.estimatedDeliveryDate ? formatDate(order.estimatedDeliveryDate) : 'Por confirmar' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-4 flex-wrap">
            <Button variant="outline" class="flex-1 bg-white/10 hover:bg-white/20">📋 Copiar Código</Button>
            <Button icon="🔄" @click="refreshTracking" class="flex-1 bg-blue-600 hover:bg-blue-700">Actualizar</Button>
          </div>
        </div>

        <div class="mb-8">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">📦 Estado del Envío</h2>
          
          <div class="relative">
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-white/20"></div>
            
            <div v-for="(step, index) in trackingSteps" :key="step.status" class="relative pl-16 pb-8 last:pb-0">
              <div class="absolute left-4 top-0 flex items-center justify-center">
                <div :class="[
                  'w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 transition-all',
                  step.completed ? 'bg-green-500 border-green-500' : 
                  step.current ? 'bg-purple-500 border-purple-500 animate-pulse' : 
                  'bg-white/10 border-white/20'
                ]">
                  <span v-if="step.completed" class="text-white text-sm font-bold">✓</span>
                  <span v-else-if="step.current" class="w-2 h-2 bg-white/50 rounded-full animate-pulse"></span>
                  <span v-else class="w-4 h-4 bg-white/20 rounded-full"></span>
                </div>
              </div>
              <div :class="['bg-white/5 rounded-xl p-4 border-l-4 transition-all', step.completed ? 'border-green-500' : step.current ? 'border-purple-500 bg-purple-500/10' : 'border-white/10']">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-2xl">{{ step.icon }}</span>
                  <h3 class="text-white font-bold text-lg">{{ step.title }}</h3>
                  <Badge v-if="step.current" variant="primary" size="sm">Actual</Badge>
                  <Badge v-else-if="step.completed" variant="success" size="sm">Completado</Badge>
                </div>
                <p class="text-gray-400">{{ step.description }}</p>
                <p v-if="step.date" class="text-purple-300 text-sm mt-1">{{ formatDateTime(step.date) }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="order.status === 'delivered' && order.actualDeliveryDate" class="bg-green-500/20 border border-green-400/30 rounded-2xl p-6">
          <p class="text-green-300 text-center text-lg">
            ✅ Pedido entregado el {{ formatDate(order.actualDeliveryDate) }}
          </p>
        </div>

        <div v-if="order.status === 'cancelled'" class="bg-red-500/20 border border-red-400/30 rounded-2xl p-6">
          <p class="text-red-300 text-center text-lg">
            ❌ Pedido cancelado: {{ order.cancellationReason || 'Sin razón especificada' }}
          </p>
        </div>
      </Card>

      <Card class="mt-6 animate-fade-in-up" style="animation-delay: 0.2s;">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">📦 Artículos del Pedido</h2>
        <div class="space-y-4">
          <div v-for="item in order.items" :key="item.id" class="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col md:flex-row items-center md:items-start gap-4">
            <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-3xl flex-shrink-0">
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
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersAPI } from '../api'
import type { Order } from '../types'
import { Card, Badge, Button, RouterLink } from '../components/ui'

const route = useRoute()
const router = useRouter()

const order = ref<Order | null>(null)
const loading = ref(true)

const trackingSteps = computed(() => {
  if (!order.value) return []
  
  const baseSteps = [
    { status: 'pending', title: 'Pedido Confirmado', description: 'Tu pedido ha sido recibido y está siendo procesado', icon: '📋', date: order.value?.createdAt },
    { status: 'processing', title: 'En Preparación', description: 'Estamos preparando tu pedido para envío', icon: '📦', date: order.value?.createdAt ? new Date(new Date(order.value.createdAt).getTime() + 24 * 60 * 60 * 1000).toISOString() : null },
    { status: 'shipped', title: 'Enviado', description: 'Tu pedido está en camino', icon: '🚚', date: order.value?.estimatedDeliveryDate ? new Date(new Date(order.value.estimatedDeliveryDate).getTime() - 24 * 60 * 60 * 1000).toISOString() : null },
    { status: 'delivered', title: 'Entregado', description: 'Tu pedido ha sido entregado', icon: '✅', date: order.value?.actualDeliveryDate },
  ]

  const currentStatusIndex = baseSteps.findIndex(s => s.status === order.value?.status)
  
  return baseSteps.map((step, index) => ({
    ...step,
    completed: index < currentStatusIndex,
    current: index === currentStatusIndex,
  }))
})

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'Pendiente'
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

const formatDateTime = (dateStr: string | null) => {
  if (!dateStr) return 'Pendiente'
  try {
    return new Date(dateStr).toLocaleString('es-ES', { 
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

const refreshTracking = () => {
  // Reload order data
  const idParam = route.params.orderId as string
  const id = parseInt(idParam)
  if (!isNaN(id)) {
    ordersAPI.getById(id).then(response => {
      order.value = response.data
    })
  }
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