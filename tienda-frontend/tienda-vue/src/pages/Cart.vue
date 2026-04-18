<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 -left-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <h1 class="text-4xl md:text-5xl font-black text-white mb-8 animate-fade-in-up">
        🛒 <span class="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Carrito</span> de Compras
      </h1>

      <!-- Empty Cart -->
      <div v-if="cartStore.items.length === 0" class="text-center py-12 animate-fade-in-up">
        <div class="text-8xl mb-6 animate-bounce">🛒</div>
        <h2 class="text-3xl font-bold text-white mb-4">Tu carrito esta vacio</h2>
        <p class="text-gray-400 text-lg mb-8">Agrega algunos productos para empezar!</p>
        <RouterLink 
          to="/products" 
          class="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 hover:shadow-lg"
        >
          Ver Productos
        </RouterLink>
      </div>

      <!-- Cart with Items -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div v-if="cartStore.items.length > 0" class="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <h2 class="text-2xl font-bold text-white flex items-center gap-3">
              📦 Productos
              <span class="text-xl text-purple-400">({{ cartStore.itemCount }})</span>
            </h2>
            <button 
              @click="clearCart" 
              class="px-4 py-2 bg-red-600/20 border border-red-400/30 text-red-400 rounded-lg hover:bg-red-600/40 transition-all text-sm"
            >
              🗑️ Vaciar Carrito
            </button>
          </div>
          <div v-for="(item, index) in cartStore.items" :key="item.id" 
            class="group bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 flex items-center gap-4 hover:shadow-xl hover:border-purple-500/50 transition-all duration-300 animate-fade-in-up"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <!-- Image -->
            <RouterLink :to="`/product/${item.productId}`">
              <div class="w-24 h-24 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span class="text-4xl transform group-hover:rotate-12 transition-transform duration-300">{{ getItemEmoji(item) }}</span>
              </div>
            </RouterLink>
            
            <!-- Info -->
            <div class="flex-1">
              <RouterLink :to="`/product/${item.productId}`">
                <h3 class="font-bold text-white text-lg hover:text-purple-400 transition-colors">{{ item.name }}</h3>
              </RouterLink>
              <p class="text-gray-400 text-sm">{{ item.category }}</p>
              <p class="text-purple-400 font-bold mt-1">S/ {{ Number(item.price).toFixed(2) }}</p>
            </div>

            <!-- Quantity Controls -->
            <div class="flex items-center gap-2">
              <button 
                @click="updateQuantity(item.id!, item.quantity - 1)" 
                class="w-10 h-10 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 hover:border-purple-500/50 transition-all"
              >
                −
              </button>
              <span class="w-12 text-center text-white font-bold bg-white/5 rounded-lg py-1">{{ item.quantity }}</span>
              <button 
                @click="updateQuantity(item.id!, item.quantity + 1)" 
                class="w-10 h-10 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 hover:border-purple-500/50 transition-all"
              >
                +
              </button>
            </div>

            <!-- Total & Remove -->
            <div class="text-right">
              <p class="text-xl font-bold text-white">S/ {{ (Number(item.price) * item.quantity).toFixed(2) }}</p>
              <button 
                @click="removeItem(item.id!)" 
                class="text-red-400 text-sm hover:text-red-300 mt-2 hover:underline transition-all"
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 h-fit sticky top-24 hover:border-purple-500/30 transition-all animate-slide-in">
          <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📋</span> Resumen del Pedido
          </h3>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-gray-300 hover:text-white transition-colors">
              <span>Subtotal ({{ cartStore.itemCount }} items)</span>
              <span>S/ {{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div v-if="cartStore.discountPercent > 0" class="flex justify-between text-green-400">
              <span>Descuento ({{ cartStore.discountPercent }}%)</span>
              <span>-S/ {{ cartStore.discountAmount.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-300 hover:text-white transition-colors">
              <span>Impuesto (18%)</span>
              <span>S/ {{ cartStore.tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-300 hover:text-white transition-colors">
              <span>Envio</span>
              <span :class="cartStore.shipping === 0 ? 'text-green-400 font-bold' : ''">
                {{ cartStore.shipping === 0 ? '🎉 Gratis' : `S/ ${cartStore.shipping.toFixed(2)}` }}
              </span>
            </div>
            <div v-if="cartStore.subtotal < 100 && cartStore.discountPercent === 0" class="text-sm text-yellow-400 animate-pulse">
              ✨ Agrega S/ {{ (100 - cartStore.subtotal).toFixed(2) }} mas para envio gratis!
            </div>
            <div class="border-t border-white/20 pt-3 flex justify-between">
              <span class="text-xl font-bold text-white">Total</span>
              <span class="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                S/ {{ cartStore.total.toFixed(2) }}
              </span>
            </div>
          </div>

          <RouterLink 
            to="/checkout"
            class="block w-full py-4 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl transform hover:scale-105 hover:shadow-2xl"
          >
            💳 Proceder al Pago
          </RouterLink>

          <RouterLink 
            to="/products"
            class="block text-center mt-4 text-purple-400 hover:text-purple-300 hover:underline transition-all"
          >
            ← Seguir Comprando
          </RouterLink>

          <!-- Promo Code -->
          <div class="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <h3 class="font-semibold text-white mb-3 flex items-center gap-2">🎫 Código de Descuento</h3>
            <div class="flex gap-2">
              <input
                v-model="promoCode"
                type="text"
                placeholder="Ingresa tu código"
                class="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button 
                @click="applyPromoCode"
                class="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 text-sm transition-all"
              >
                Aplicar
              </button>
            </div>
            <p v-if="promoMessage" :class="promoSuccess ? 'text-green-400' : 'text-red-400'" class="text-xs mt-2">
              {{ promoMessage }}
            </p>
          </div>

          <!-- Security Badges -->
          <div class="text-center mt-6">
            <p class="text-sm text-gray-400 mb-3">Compra 100% segura</p>
            <div class="flex justify-center gap-3">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <span class="text-xl" title="Compra segura">🔒</span>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <span class="text-xl" title="SSL Certificado">🛡️</span>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                <span class="text-xl" title="Garantía">✅</span>
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
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()
const promoCode = ref('')
const promoMessage = ref('')
const promoSuccess = ref(false)

const updateQuantity = (itemId: number, quantity: number) => {
  cartStore.updateQuantity(itemId, quantity)
}

const removeItem = (itemId: number) => {
  cartStore.removeItem(itemId)
}

const clearCart = () => {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cartStore.clearCart()
  }
}

const applyPromoCode = () => {
  if (!promoCode.value.trim()) {
    promoMessage.value = 'Ingresa un código'
    promoSuccess.value = false
    return
  }
  
  // Simulación de códigos de descuento
  const codes: Record<string, number> = {
    'DESCUENTO10': 10,
    'BIENVENIDO': 15,
    'VERANO20': 20,
  }
  
  const discount = codes[promoCode.value.toUpperCase()]
  if (discount) {
    promoMessage.value = `¡Código aplicado! -${discount}% de descuento`
    promoSuccess.value = true
    cartStore.applyDiscount(discount)
  } else {
    promoMessage.value = 'Código inválido'
    promoSuccess.value = false
  }
}

const getItemEmoji = (item: any): string => {
  const category = (item.category || '').toLowerCase()
  if (category.includes('hombre') || category.includes('men')) return String.fromCodePoint(0x1F455)
  if (category.includes('mujer') || category.includes('women')) return String.fromCodePoint(0x1F457)
  if (category.includes('shoes') || category.includes('zapato')) return String.fromCodePoint(0x1F45F)
  if (category.includes('accessories') || category.includes('accesorio')) return String.fromCodePoint(0x1F6C1)
  return String.fromCodePoint(0x1F455)
}

const getCartItemImage = (item: any): string => {
  if (item.imageUrl) return item.imageUrl
  if (item.image) return item.image
  if (item.url) return item.url
  
  const category = item.category?.toLowerCase() || ''
  const images: Record<string, string> = {
    hombre: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    men: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    mujer: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=100&h=100&fit=crop',
    women: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=100&h=100&fit=crop',
    shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    zapato: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop',
    accessories: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
    accesorio: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
  }
  
  return images[category] || 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=100&h=100&fit=crop'
}
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.6s ease-out 0.3s forwards;
  opacity: 0;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}
</style>