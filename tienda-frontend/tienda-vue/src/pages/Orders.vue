<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-12 relative z-10">
      <div class="mb-12">
        <h1 class="text-5xl font-bold text-white mb-3">📋 Mis Pedidos</h1>
        <p class="text-gray-300 text-lg">Gestiona y rastrea todos tus pedidos</p>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
        <p class="mt-4 text-gray-300">Cargando pedidos...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <p class="text-red-700">{{ error }}</p>
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-20">
        <div class="text-gray-400 text-6xl mb-4">📦</div>
        <h3 class="text-xl font-medium text-white mb-2">No tienes pedidos aún</h3>
        <p class="text-gray-400 mb-6">Cuando realices tu primer pedido, aparecerá aquí</p>
        <RouterLink to="/products" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
          Explorar Productos
        </RouterLink>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div class="p-6">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-lg font-medium text-white">
                  Pedido #{{ order.orderNumber }}
                </h3>
                <p class="text-sm text-gray-400">
                  {{ new Date(order.createdAt).toLocaleDateString('es-ES') }}
                </p>
              </div>
              <div class="flex items-center space-x-4">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" :class="getStatusColor(order.status)">
                  {{ getStatusDisplayName(order.status) }}
                </span>
                <span class="text-lg font-bold text-white">
                  S/ {{ Number(order.total).toFixed(2) }}
                </span>
              </div>
            </div>

            <div class="border-t border-white/10 pt-4 mb-4">
              <div class="space-y-3">
                <div v-for="item in order.items" :key="item.id" class="flex items-center space-x-4">
                  <div class="flex-shrink-0 w-16 h-16 bg-white/10 rounded-md flex items-center justify-center text-2xl">
                    <span v-if="item.product">{{ getProductEmoji(item.product) }}</span>
                    <span v-else class="text-gray-400 text-xs">📦</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-white truncate">
                      {{ item.product?.name }}
                    </p>
                    <p class="text-sm text-gray-400">
                      Cantidad: {{ item.quantity }} × S/ {{ Number(item.price).toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-white/10">
              <div class="flex space-x-3">
                <RouterLink :to="`/order-tracking/${order.id}`" class="inline-flex items-center px-3 py-2 border border-white/20 text-sm leading-4 font-medium rounded-md text-white bg-white/10 hover:bg-white/20">
                  🔍 Rastrear
                </RouterLink>
                <RouterLink :to="`/orders/${order.id}`" class="inline-flex items-center px-3 py-2 border border-white/20 text-sm leading-4 font-medium rounded-md text-white bg-white/10 hover:bg-white/20">
                  📋 Ver Detalle
                </RouterLink>
                <RouterLink v-if="order.status === 'delivered'" :to="`/return-request/${order.id}`" class="inline-flex items-center px-3 py-2 border border-white/20 text-sm leading-4 font-medium rounded-md text-white bg-white/10 hover:bg-white/20">
                  ↩️ Devolver
                </RouterLink>
              </div>
              <button v-if="order.status === 'pending' || order.status === 'processing'" @click="openCancelModal(order)" class="inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-300 bg-red-500/20 hover:bg-red-500/30">
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showCancelModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-gray-900">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-white mb-4">
              Cancelar Pedido #{{ selectedOrder?.orderNumber }}
            </h3>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Motivo de cancelación *
              </label>
              <select v-model="cancelReason" class="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">Selecciona un motivo</option>
                <option value="changed_mind">Cambié de opinión</option>
                <option value="found_better_price">Encontré mejor precio</option>
                <option value="delivery_too_slow">Entrega muy lenta</option>
                <option value="ordered_by_mistake">Pedido por error</option>
                <option value="other">Otro motivo</option>
              </select>
            </div>
            <div class="flex space-x-3">
              <button @click="handleCancelOrder" :disabled="!cancelReason.trim() || cancelling" class="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {{ cancelling ? 'Cancelando...' : 'Confirmar Cancelación' }}
              </button>
              <button @click="closeCancelModal" class="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ordersAPI } from '../api'
import type { Order } from '../types'
import axios from 'axios'

const orders = ref<Order[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const showCancelModal = ref(false)
const selectedOrder = ref<Order | null>(null)
const cancelReason = ref('')
const cancelling = ref(false)

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/30 text-yellow-100 border border-yellow-400/50',
    processing: 'bg-blue-500/30 text-blue-100 border border-blue-400/50',
    shipped: 'bg-purple-500/30 text-purple-100 border border-purple-400/50',
    delivered: 'bg-green-500/30 text-green-100 border border-green-400/50',
    cancelled: 'bg-red-500/30 text-red-100 border border-red-400/50',
    returned: 'bg-orange-500/30 text-orange-100 border border-orange-400/50',
  }
  return colors[status] || 'bg-gray-500/30 text-gray-100 border border-gray-400/50'
}

const getStatusDisplayName = (status: string) => {
  const names: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
    returned: 'Devuelto',
  }
  return names[status] || status
}

const fetchOrders = async () => {
  try {
    loading.value = true
    const response = await ordersAPI.getAll()
    orders.value = response.data || []
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error fetching orders'
  } finally {
    loading.value = false
  }
}

const downloadInvoice = async (orderId: number, orderNumber: string) => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`https://proyecto-tienda-ropa.onrender.com/orders/${orderId}/invoice`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `invoice-${orderNumber}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Error downloading invoice:', err)
  }
}

const openCancelModal = (order: Order) => {
  selectedOrder.value = order
  showCancelModal.value = true
}

const closeCancelModal = () => {
  showCancelModal.value = false
  selectedOrder.value = null
  cancelReason.value = ''
}

const handleCancelOrder = async () => {
  if (!selectedOrder.value || !cancelReason.value.trim()) return
  try {
    cancelling.value = true
    const token = localStorage.getItem('token')
    await axios.put(`https://proyecto-tienda-ropa.onrender.com/orders/${selectedOrder.value.id}/cancel`, {
      reason: cancelReason.value,
      notes: 'Cancelled by customer'
    }, { headers: { Authorization: `Bearer ${token}` } })
    await fetchOrders()
    closeCancelModal()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error cancelling order'
  } finally {
    cancelling.value = false
  }
}

onMounted(() => { fetchOrders() })

const getProductEmoji = (product: any): string => {
  const category = (product.category || '').toLowerCase()
  if (category.includes('hombre') || category.includes('men')) return String.fromCodePoint(0x1F455)
  if (category.includes('mujer') || category.includes('women')) return String.fromCodePoint(0x1F457)
  if (category.includes('shoes') || category.includes('zapato')) return String.fromCodePoint(0x1F45F)
  if (category.includes('accessories') || category.includes('accesorio')) return String.fromCodePoint(0x1F6C1)
  return String.fromCodePoint(0x1F455)
}
</script>