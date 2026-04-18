<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Empty Cart -->
      <div v-if="cartStore.items.length === 0" class="max-w-2xl mx-auto text-center">
        <div class="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-12 border border-white/20">
          <div class="text-8xl mb-6 animate-bounce">🛒</div>
          <h1 class="text-4xl font-bold text-white mb-4">Tu carrito esta vacio</h1>
          <p class="text-gray-300 mb-8 text-lg">Agrega algunos productos antes de proceder al checkout</p>
          <RouterLink to="/products" class="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold">
            🛍️ Ir a comprar
          </RouterLink>
        </div>
      </div>

      <!-- Not Auth -->
      <div v-else-if="!authStore.isAuthenticated" class="max-w-2xl mx-auto text-center">
        <div class="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-12 border border-white/20">
          <div class="text-6xl mb-6">🔐</div>
          <h1 class="text-3xl font-bold text-white mb-4">Inicia sesion para continuar</h1>
          <p class="text-gray-300 mb-8">Necesitas iniciar sesion para proceder con tu compra</p>
          <div class="flex gap-4 justify-center">
            <RouterLink to="/login" class="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold">
              🔑 Iniciar Sesion
            </RouterLink>
            <RouterLink to="/register" class="px-8 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-semibold">
              📝 Registrarse
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- Checkout -->
      <div v-else>
        <h1 class="text-4xl font-bold text-white mb-8">Finalizar Compra</h1>
        
        <!-- Steps -->
        <div class="flex items-center justify-center mb-8">
          <div class="flex items-center">
            <div :class="currentStep >= 1 ? 'bg-purple-600' : 'bg-white/20'" class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">1</div>
            <span class="ml-2 text-white">Envío</span>
          </div>
          <div class="w-20 h-1 bg-white/20 mx-4"></div>
          <div class="flex items-center">
            <div :class="currentStep >= 2 ? 'bg-purple-600' : 'bg-white/20'" class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">2</div>
            <span class="ml-2 text-white">Pago</span>
          </div>
          <div class="w-20 h-1 bg-white/20 mx-4"></div>
          <div class="flex items-center">
            <div :class="currentStep >= 3 ? 'bg-purple-600' : 'bg-white/20'" class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">3</div>
            <span class="ml-2 text-white">Confirmación</span>
          </div>
        </div>

        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Form -->
          <div class="space-y-6">
            <!-- Shipping -->
            <div v-if="currentStep === 1" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 class="text-2xl font-bold text-white mb-6">Informacion de Envio</h2>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-gray-300 mb-2">Nombre *</label>
                  <input v-model="shipping.firstName" type="text" class="w-full px-4 py-3 bg-white/10 border rounded-xl text-white" :class="errors.firstName ? 'border-red-500' : 'border-white/20'" />
                  <p v-if="errors.firstName" class="text-red-400 text-xs mt-1">{{ errors.firstName }}</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-300 mb-2">Apellido *</label>
                  <input v-model="shipping.lastName" type="text" class="w-full px-4 py-3 bg-white/10 border rounded-xl text-white" :class="errors.lastName ? 'border-red-500' : 'border-white/20'" />
                  <p v-if="errors.lastName" class="text-red-400 text-xs mt-1">{{ errors.lastName }}</p>
                </div>
                <div class="col-span-2">
                  <label class="block text-sm text-gray-300 mb-2">Email *</label>
                  <input v-model="shipping.email" type="email" class="w-full px-4 py-3 bg-white/10 border rounded-xl text-white" :class="errors.email ? 'border-red-500' : 'border-white/20'" />
                  <p v-if="errors.email" class="text-red-400 text-xs mt-1">{{ errors.email }}</p>
                </div>
                <div class="col-span-2">
                  <label class="block text-sm text-gray-300 mb-2">Direccion *</label>
                  <input v-model="shipping.address" type="text" class="w-full px-4 py-3 bg-white/10 border rounded-xl text-white" :class="errors.address ? 'border-red-500' : 'border-white/20'" />
                  <p v-if="errors.address" class="text-red-400 text-xs mt-1">{{ errors.address }}</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-300 mb-2">Ciudad *</label>
                  <input v-model="shipping.city" type="text" class="w-full px-4 py-3 bg-white/10 border rounded-xl text-white" :class="errors.city ? 'border-red-500' : 'border-white/20'" />
                  <p v-if="errors.city" class="text-red-400 text-xs mt-1">{{ errors.city }}</p>
                </div>
                <div>
                  <label class="block text-sm text-gray-300 mb-2">Telefono</label>
                  <input v-model="shipping.phone" type="text" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white" />
                </div>
              </div>
              <button @click="goToPayment" class="mt-6 w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl">
                Continuar
              </button>
            </div>

            <!-- Payment -->
            <div v-if="currentStep === 2" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 class="text-2xl font-bold text-white mb-6">💳 Método de Pago</h2>
              <div class="space-y-4 mb-6">
                <label class="flex items-center p-4 bg-white/10 rounded-xl cursor-pointer border border-white/20">
                  <input type="radio" v-model="payment.method" value="card" class="w-5 h-5 text-purple-600" />
                  <span class="ml-3 text-white">💳 Tarjeta de Crédito/Débito</span>
                </label>
                <label class="flex items-center p-4 bg-white/10 rounded-xl cursor-pointer border border-white/20">
                  <input type="radio" v-model="payment.method" value="paypal" class="w-5 h-5 text-purple-600" />
                  <span class="ml-3 text-white">🅿️ PayPal</span>
                </label>
                <label class="flex items-center p-4 bg-white/10 rounded-xl cursor-pointer border border-white/20">
                  <input type="radio" v-model="payment.method" value="cash" class="w-5 h-5 text-purple-600" />
                  <span class="ml-3 text-white">💵 Efectivo contra entrega</span>
                </label>
              </div>
              
              <div class="flex gap-4">
                <button @click="currentStep = 1" class="px-6 py-3 bg-white/10 text-white rounded-xl">← Volver</button>
                <button @click="currentStep = 3" class="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl">
                  Continuar →
                </button>
              </div>
            </div>

            <!-- Confirmation -->
            <div v-if="currentStep === 3" class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h2 class="text-2xl font-bold text-white mb-6">✅ Confirmar Pedido</h2>
              <div class="space-y-3 text-gray-300 mb-6">
                <p><strong class="text-white">Nombre:</strong> {{ shipping.firstName }} {{ shipping.lastName }}</p>
                <p><strong class="text-white">Email:</strong> {{ shipping.email }}</p>
                <p><strong class="text-white">Dirección:</strong> {{ shipping.address }}, {{ shipping.city }}</p>
                <p><strong class="text-white">Teléfono:</strong> {{ shipping.phone }}</p>
                <p><strong class="text-white">Pago:</strong> {{ payment.method === 'card' ? 'Tarjeta' : payment.method === 'paypal' ? 'PayPal' : 'Efectivo' }}</p>
              </div>
              
              <div v-if="error" class="bg-red-500/20 text-red-300 p-4 rounded-xl mb-4">{{ error }}</div>
              
              <div class="flex gap-4">
                <button @click="currentStep = 2" class="px-6 py-3 bg-white/10 text-white rounded-xl">← Volver</button>
                <button @click="placeOrder" :disabled="loading" class="flex-1 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl disabled:opacity-50">
                  {{ loading ? 'Procesando...' : '✅ Confirmar Pedido' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 h-fit sticky top-24">
            <h3 class="text-2xl font-bold text-white mb-6">📋 Resumen del Pedido</h3>
            
            <div class="space-y-4 mb-6 max-h-64 overflow-y-auto">
              <div v-for="item in cartStore.items" :key="item.id" class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center text-3xl">
                  {{ getItemEmoji(item) }}
                </div>
                <div class="flex-1">
                  <p class="text-white font-semibold text-sm">{{ item.name }}</p>
                  <p class="text-gray-400 text-sm">Cantidad: {{ item.quantity }}</p>
                </div>
                <p class="text-white font-bold">S/ {{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>

            <div class="border-t border-white/20 pt-4 space-y-2">
              <div class="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>S/ {{ cartStore.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Impuesto (18%)</span>
                <span>S/ {{ cartStore.tax.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-300">
                <span>Envío</span>
                <span :class="cartStore.shipping === 0 ? 'text-green-400' : ''">{{ cartStore.shipping === 0 ? 'Gratis' : `S/ ${cartStore.shipping.toFixed(2)}` }}</span>
              </div>
              <div class="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/20">
                <span>Total</span>
                <span class="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">S/ {{ cartStore.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { ordersAPI } from '../api'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const currentStep = ref(1)
const loading = ref(false)
const error = ref('')

const errors = ref({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: ''
})

const validateShipping = (): boolean => {
  errors.value = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: ''
  }
  
  let isValid = true
  
  if (!shipping.value.firstName.trim()) {
    errors.value.firstName = 'El nombre es requerido'
    isValid = false
  }
  
  if (!shipping.value.lastName.trim()) {
    errors.value.lastName = 'El apellido es requerido'
    isValid = false
  }
  
  if (!shipping.value.email.trim()) {
    errors.value.email = 'El email es requerido'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.value.email)) {
    errors.value.email = 'Ingresa un email válido'
    isValid = false
  }
  
  if (!shipping.value.address.trim()) {
    errors.value.address = 'La dirección es requerida'
    isValid = false
  }
  
  if (!shipping.value.city.trim()) {
    errors.value.city = 'La ciudad es requerida'
    isValid = false
  }
  
  return isValid
}

const goToPayment = () => {
  if (validateShipping()) {
    currentStep.value = 2
  }
}

const shipping = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: ''
})

const payment = ref({
  method: 'card'
})

const getItemEmoji = (item: any): string => {
  const emojiMap: Record<string, string> = {
    hombre: String.fromCodePoint(0x1F455),
    mujer: String.fromCodePoint(0x1F457),
    shoes: String.fromCodePoint(0x1F45F),
    zapato: String.fromCodePoint(0x1F45F),
    accessories: String.fromCodePoint(0x1F6C1),
    accesorio: String.fromCodePoint(0x1F6C1),
    men: String.fromCodePoint(0x1F455),
    women: String.fromCodePoint(0x1F457),
  }
  return emojiMap[item.category?.toLowerCase()] || String.fromCodePoint(0x1F455)
}

const placeOrder = async () => {
  loading.value = true
  error.value = ''
  try {
    const userStr = localStorage.getItem('user')
    const userId = userStr ? JSON.parse(userStr).id : 1
    
    const items = cartStore.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: Number(item.price)
    }))
    
    const orderData = {
      userId: Number(userId),
      items: items,
      shippingAddress: shipping.value.address || 'Calle Principal 123',
      billingAddress: shipping.value.address || 'Calle Principal 123'
    }
    
    const response = await ordersAPI.create(orderData)
    const order = response.data
    
    cartStore.items = []
    
    const confirmationData = {
      orderNumber: order.orderNumber,
      total: order.total || cartStore.subtotal,
      orderId: order.id,
      items: items,
      createdAt: new Date().toISOString()
    }
    
    localStorage.setItem('lastOrder', JSON.stringify(confirmationData))
    
    router.push('/order-confirmation')
  } catch (err: any) {
    const errMsg = err.response?.data?.message || err.message || 'Error desconocido'
    error.value = errMsg
    console.error('Order error details:', err.response?.data)
    router.push('/order-confirmation')
  } finally {
    loading.value = false
  }
}
</script>