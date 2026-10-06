<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-4xl mx-auto relative z-10">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white flex items-center gap-3">
          🔄 Solicitar Devolución
        </h1>
        <p v-if="order" class="text-gray-300 text-lg mt-2">Pedido #{{ order.orderNumber }}</p>
      </div>

      <div v-if="loading" class="animate-pulse space-y-6">
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div class="space-y-4">
            <div v-for="i in 3" :key="i" class="flex items-center justify-between p-4 bg-white/5 rounded-xl">
              <div class="flex items-center gap-4">
                <div class="w-5 h-5 bg-white/10 rounded"></div>
                <div class="w-12 h-12 bg-white/5 rounded"></div>
                <div class="space-y-2">
                  <div class="h-4 bg-white/5 rounded w-32"></div>
                  <div class="h-3 bg-white/5 rounded w-24"></div>
                </div>
              </div>
              <div class="h-4 bg-white/5 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="error && !order" class="bg-red-500/20 border border-red-500/50 rounded-2xl p-8 text-center">
        <div class="text-6xl mb-4">❌</div>
        <p class="text-red-300 text-lg">{{ error }}</p>
        <button @click="router.push('/orders')" class="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
          Volver a Mis Pedidos
        </button>
      </div>

      <form v-else-if="order" @submit.prevent="handleSubmit" class="space-y-6">
        <div v-if="submitError" class="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-300">
          {{ submitError }}
        </div>

        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 class="text-xl font-semibold text-white mb-4">Selecciona los productos a devolver</h3>
          
          <div class="space-y-3">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="flex items-center justify-between p-4 bg-white/5 rounded-xl"
            >
              <div class="flex items-center gap-4">
                <input 
                  type="checkbox" 
                  :id="`item-${item.id}`"
                  :checked="selectedItems.has(item.id)"
                  @change="toggleItem(item, ($event.target as HTMLInputElement).checked)"
                  class="w-5 h-5 rounded text-purple-500"
                />
                <div class="text-4xl">{{ getProductEmoji(item.product?.category) }}</div>
                <div>
                  <p class="text-white font-medium">{{ item.product?.name || 'Producto' }}</p>
                  <p class="text-gray-400 text-sm">Cantidad: {{ item.quantity }} - S/ {{ Number(item.price).toFixed(2) }}</p>
                </div>
              </div>
              <p class="text-purple-400 font-bold">S/ {{ (item.price * item.quantity).toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <div v-if="selectedItems.size > 0" class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <h3 class="text-xl font-semibold text-white mb-4">Detalles de la devolución</h3>
          
          <div class="space-y-4">
            <div>
              <label class="text-gray-300 text-sm mb-2 block">Motivo de la devolución *</label>
              <select v-model="returnReason" required class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white">
                <option value="" class="text-gray-900">Selecciona un motivo</option>
                <option value="defectuoso" class="text-gray-900">Producto defectuoso</option>
                <option value="talla" class="text-gray-900">Talla incorrecta</option>
                <option value="color" class="text-gray-900">Color diferente al mostrado</option>
                <option value="dañado" class="text-gray-900">Llegó dañado</option>
                <option value="no_necesito" class="text-gray-900">Ya no lo necesito</option>
                <option value="otro" class="text-gray-900">Otro motivo</option>
              </select>
            </div>

            <div>
              <label class="text-gray-300 text-sm mb-2 block">Descripción detallada *</label>
              <textarea 
                v-model="description" 
                required
                rows="4"
                class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400"
                placeholder="Describe el problema con el producto..."
              ></textarea>
            </div>

            <div class="flex items-center justify-between p-4 bg-purple-500/20 rounded-xl border border-purple-500/30">
              <span class="text-white font-semibold">Monto a reembolsar:</span>
              <span class="text-2xl font-bold text-purple-400">S/ {{ calculateRefund().toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="flex gap-4">
          <button 
            type="button" 
            @click="router.push('/orders')"
            class="flex-1 px-6 py-3 border border-white/30 text-white rounded-xl hover:bg-white/10"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            :disabled="submitting || selectedItems.size === 0"
            class="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 disabled:opacity-50"
          >
            {{ submitting ? 'Enviando...' : 'Enviar Solicitud' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ordersAPI } from '../api'

const route = useRoute()
const router = useRouter()

interface OrderItem {
  id: number
  quantity: number
  price: number
  product: {
    id: number
    name: string
    category?: string
    imageUrl?: string
  }
}

interface Order {
  id: number
  orderNumber: string
  status: string
  total: number
  items: OrderItem[]
  canBeReturned: boolean
}

interface SelectedItem {
  orderItemId: number
  quantity: number
  condition?: string
  notes?: string
}

const order = ref<Order | null>(null)
const loading = ref(true)
const submitting = ref(false)
const submitError = ref('')
const returnReason = ref('')
const description = ref('')
const selectedItems = ref<Map<number, SelectedItem>>(new Map())

const getProductEmoji = (category?: string): string => {
  if (!category) return String.fromCodePoint(0x1F455)
  const cat = category.toLowerCase()
  if (cat.includes('hombre') || cat.includes('men')) return String.fromCodePoint(0x1F455)
  if (cat.includes('mujer') || cat.includes('women')) return String.fromCodePoint(0x1F457)
  if (cat.includes('shoes') || cat.includes('zapato')) return String.fromCodePoint(0x1F45F)
  if (cat.includes('accessories') || cat.includes('accesorio')) return String.fromCodePoint(0x1F6C1)
  return String.fromCodePoint(0x1F455)
}

const toggleItem = (item: OrderItem, selected: boolean) => {
  if (selected) {
    selectedItems.value.set(item.id, {
      orderItemId: item.id,
      quantity: item.quantity,
      condition: '',
      notes: ''
    })
  } else {
    selectedItems.value.delete(item.id)
  }
}

const calculateRefund = (): number => {
  let total = 0
  selectedItems.value.forEach((returnItem, orderItemId) => {
    const orderItem = order.value?.items.find(i => i.id === orderItemId)
    if (orderItem) {
      total += orderItem.price * returnItem.quantity
    }
  })
  return total
}

const fetchOrder = async () => {
  try {
    const orderId = route.params.orderId
    const response = await ordersAPI.getById(Number(orderId))
    order.value = response.data
    
    if (!response.data.canBeReturned) {
      submitError.value = 'Este pedido no puede ser devuelto'
    }
  } catch (err: any) {
    submitError.value = err.response?.data?.message || 'Error al cargar el pedido'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (selectedItems.value.size === 0) {
    submitError.value = 'Debes seleccionar al menos un producto para devolver'
    return
  }
  
  if (!returnReason.value || !description.value.trim()) {
    submitError.value = 'Debes completar todos los campos obligatorios'
    return
  }

  submitting.value = true
  submitError.value = ''

  try {
    const orderId = route.params.orderId as string
    await ordersAPI.createReturn(Number(orderId), {
      reason: returnReason.value,
      description: description.value.trim(),
      items: Array.from(selectedItems.value.values())
    })

    router.push('/orders')
  } catch (err: any) {
    submitError.value = err.response?.data?.message || 'Error al crear la solicitud de devolución'
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchOrder()
})
</script>