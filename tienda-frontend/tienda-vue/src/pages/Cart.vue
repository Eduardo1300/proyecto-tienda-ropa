<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-4xl font-bold text-white mb-8">🛒 Carrito de Compras</h1>

      <!-- Empty Cart -->
      <div v-if="cartStore.items.length === 0" class="text-center py-12">
        <div class="text-8xl mb-6">🛒</div>
        <h2 class="text-3xl font-bold text-white mb-4">Tu carrito esta vacio</h2>
        <p class="text-gray-400 text-lg mb-8">Agrega algunos productos para empezar!</p>
        <RouterLink 
          to="/products" 
          class="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Ver Productos
        </RouterLink>
      </div>

      <!-- Cart with Items -->
      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <div v-for="item in cartStore.items" :key="item.id" 
            class="bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 flex items-center gap-4 hover:shadow-xl transition-all"
          >
            <!-- Image -->
            <RouterLink :to="`/product/${item.productId}`">
              <div class="w-24 h-24 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center">
                <span class="text-4xl">{{ getItemEmoji(item) }}</span>
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
                class="w-10 h-10 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                -
              </button>
              <span class="w-12 text-center text-white font-bold">{{ item.quantity }}</span>
              <button 
                @click="updateQuantity(item.id!, item.quantity + 1)" 
                class="w-10 h-10 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                +
              </button>
            </div>

            <!-- Total & Remove -->
            <div class="text-right">
              <p class="text-xl font-bold text-white">S/ {{ (Number(item.price) * item.quantity).toFixed(2) }}</p>
              <button 
                @click="removeItem(item.id!)" 
                class="text-red-400 text-sm hover:text-red-300 mt-2"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 h-fit sticky top-24">
          <h3 class="text-2xl font-bold text-white mb-6">Resumen del Pedido</h3>
          
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-gray-300">
              <span>Subtotal ({{ cartStore.itemCount }} items)</span>
              <span>S/ {{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-300">
              <span>Impuesto (18%)</span>
              <span>S/ {{ cartStore.tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-gray-300">
              <span>Envio</span>
              <span :class="cartStore.shipping === 0 ? 'text-green-400' : ''">
                {{ cartStore.shipping === 0 ? 'Gratis' : `S/ ${cartStore.shipping.toFixed(2)}` }}
              </span>
            </div>
            <div v-if="cartStore.subtotal < 100" class="text-sm text-gray-400">
              Agrega S/ {{ (100 - cartStore.subtotal).toFixed(2) }} mas para envio gratis
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
            class="block w-full py-4 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl"
          >
            Proceder al Pago
          </RouterLink>

          <RouterLink 
            to="/products"
            class="block text-center mt-4 text-purple-400 hover:text-purple-300"
          >
            Seguir Comprando
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart'

const cartStore = useCartStore()

const updateQuantity = (itemId: number, quantity: number) => {
  cartStore.updateQuantity(itemId, quantity)
}

const removeItem = (itemId: number) => {
  cartStore.removeItem(itemId)
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