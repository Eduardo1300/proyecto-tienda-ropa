<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>

    <div v-if="!authStore.isAuthenticated" class="max-w-2xl mx-auto text-center py-12 animate-fade-in-up relative z-10">
      <Card class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-lg mx-auto">
        <div class="text-6xl mb-4 animate-bounce">🔐</div>
        <p class="text-gray-400 text-xl mb-4">Debes iniciar sesion para solicitar una devolucion</p>
        <RouterLink to="/login" class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105">Iniciar Sesion</RouterLink>
      </Card>
    </div>

    <div v-else-if="loading" class="max-w-4xl mx-auto relative z-10">
      <div class="animate-pulse space-y-8">
        <div class="bg-white/10 rounded-2xl p-8">
          <div class="h-8 bg-white/20 rounded w-1/3 mb-6"></div>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="i in 4" :key="i" class="h-48 bg-white/5 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error && !order" class="max-w-4xl mx-auto text-center py-20 animate-fade-in-up relative z-10">
      <Card class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-lg mx-auto">
        <div class="text-8xl mb-6">⚠️</div>
        <h2 class="text-3xl font-bold text-white mb-4">No se pudo cargar el pedido</h2>
        <p class="text-gray-300 mb-8">{{ error }}</p>
        <RouterLink to="/orders">
          <Button class="transform hover:scale-105 shadow-xl">← Ver Mis Pedidos</Button>
        </RouterLink>
      </Card>
    </div>

    <div v-else-if="!order.canBeReturned" class="max-w-4xl mx-auto text-center py-20 animate-fade-in-up relative z-10">
      <Card class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-lg mx-auto">
        <div class="text-8xl mb-6">❌</div>
        <h2 class="text-3xl font-bold text-white mb-4">No se puede devolver este pedido</h2>
        <p class="text-gray-300 mb-8">Solo se pueden devolver pedidos entregados y dentro de los 30 días.</p>
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
            <h1 class="text-3xl font-bold text-white mb-2">Solicitar Devolución</h1>
            <p class="text-gray-400">Pedido #{{ order.orderNumber }} - {{ formatDate(order.createdAt) }}</p>
          </div>
          <Badge :class="getStatusClass(order.status)" class="text-lg px-4 py-2">
            {{ getStatusDisplayName(order.status) }}
          </Badge>
        </div>

        <form @submit.prevent="submitReturn" class="space-y-8">
          <div class="bg-blue-500/20 border border-blue-400/30 rounded-2xl p-6">
            <h3 class="text-white font-semibold text-lg mb-4 flex items-center gap-2">📋 Información</h3>
            <p class="text-blue-300">Solo se aceptan devoluciones dentro de los 30 días posteriores a la entrega. Los productos deben estar en su estado original con etiquetas.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Motivo de la devolucion *</label>
              <select v-model="returnData.reason" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="">Selecciona un motivo</option>
                <option value="defective">Producto defectuoso o dañado</option>
                <option value="wrong_size">Talla incorrecta</option>
                <option value="wrong_item">Producto equivocado</option>
                <option value="not_as_described">No coincide con la descripción</option>
                <option value="changed_mind">Cambie de opinion</option>
                <option value="other">Otro</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Tipo de reembolso *</label>
              <select v-model="returnData.refundType" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value="original">Mismo metodo de pago</option>
                <option value="store_credit">Credito en tienda</option>
                <option value="exchange">Cambio por otro producto</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-400 mb-2">Descripcion detallada *</label>
            <textarea
              v-model="returnData.description"
              rows="4"
              placeholder="Describe el problema con detalle..."
              class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div class="border-t border-white/20 pt-6">
            <h3 class="text-xl font-bold text-white mb-4">📦 Artículos a devolver</h3>
            <div v-for="item in order.items" :key="item.id" class="bg-white/5 rounded-xl p-4 border border-white/10 mb-4">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-3xl">
                    📦
                  </div>
                  <div>
                    <h4 class="font-bold text-white">{{ item.product?.name || item.name || `Producto #${item.productId}` }}</h4>
                    <p class="text-gray-400 text-sm">Precio: S/ {{ Number(item.price).toFixed(2) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" v-model="selectedItems[item.id]" class="w-4 h-4 text-purple-600 accent-purple-500" />
                    <span class="text-white">Incluir en devolucion</span>
                  </label>
                  <select v-model="returnQuantities[item.id]" class="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option v-for="n in item.quantity" :key="n" :value="n">{{ n }}</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <label class="block text-gray-400 mb-1">Condicion</label>
                  <select v-model="itemConditions[item.id]" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="new">Nuevo (sin usar, con etiquetas)</option>
                    <option value="used">Usado (con signos de uso)</option>
                    <option value="damaged">Dañado</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-400 mb-1">Motivo especifico</label>
                  <select v-model="itemReasons[item.id]" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">Selecciona...</option>
                    <option value="defective">Defectuoso</option>
                    <option value="wrong_size">Talla incorrecta</option>
                    <option value="wrong_color">Color incorrecto</option>
                    <option value="not_as_described">No coincide con la descripción</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-400 mb-1">Comentario adicional</label>
                  <input v-model="itemComments[item.id]" type="text" placeholder="Opcional" class="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-4 pt-6 border-t border-white/20">
            <Button type="button" @click="cancel" variant="outline" class="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20">
              Cancelar
            </Button>
            <Button type="submit" :disabled="submitting" class="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50">
              {{ submitting ? 'Enviando...' : 'Enviar Solicitud de Devolucion' }}
            </Button>
          </div>
        </form>
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
import { useAuthStore } from '../stores/auth'
import { ordersAPI } from '../api'
import type { Order } from '../types'
import { Card, Badge, Button, RouterLink } from '../components/ui'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref('')
const submitting = ref(false)

const returnData = ref({
  reason: '',
  refundType: 'original',
  description: ''
})

const selectedItems = ref<Record<number, boolean>>({})
const returnQuantities = ref<Record<number, number>>({})
const itemConditions = ref<Record<number, string>>({})
const itemReasons = ref<Record<number, string>>({})
const itemComments = ref<Record<number, string>>({})

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

const cancel = () => {
  router.push('/orders')
}

const submitReturn = async () => {
  if (!returnData.value.reason || !returnData.value.description) {
    error.value = 'Por favor completa todos los campos requeridos'
    return
  }

  const itemsToReturn = order.value?.items.filter(item => selectedItems.value[item.id]) || []
  if (itemsToReturn.length === 0) {
    error.value = 'Debes seleccionar al menos un artículo para devolver'
    return
  }

  submitting.value = true
  error.value = ''

  try {
    const items = itemsToReturn.map(item => ({
      orderItemId: item.id,
      quantity: returnQuantities.value[item.id] || 1,
      condition: itemConditions.value[item.id] || 'new',
      reason: itemReasons.value[item.id] || returnData.value.reason,
      notes: itemComments.value[item.id] || ''
    }))

    await ordersAPI.createReturn(order.value!.id, {
      reason: returnData.value.reason,
      description: returnData.value.description,
      refundType: returnData.value.refundType,
      items
    })

    router.push('/orders')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Error al enviar la solicitud'
  } finally {
    submitting.value = false
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

    if (order.value?.items) {
      order.value.items.forEach(item => {
        selectedItems.value[item.id] = true
        returnQuantities.value[item.id] = 1
        itemConditions.value[item.id] = 'new'
      })
    }
  } catch (err) {
    error.value = 'Error al cargar el pedido'
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

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce { animation: bounce 2s ease-in-out infinite; }
</style>