<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
    
    <div class="container mx-auto px-4 py-12 relative z-10">
      <div class="mb-12 animate-fade-in-up">
        <h1 class="text-5xl font-black text-white mb-3">💝 Mi Lista de <span class="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Deseos</span></h1>
        <p class="text-gray-300 text-lg">
          {{ items.length }} {{ items.length === 1 ? 'producto' : 'productos' }} guardados
        </p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="animate-pulse bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden">
          <div class="h-64 bg-white/5"></div>
          <div class="p-6 space-y-3">
            <div class="h-6 bg-white/10 rounded w-3/4"></div>
            <div class="h-4 bg-white/5 rounded w-full"></div>
            <div class="flex justify-between pt-2">
              <div class="h-8 bg-white/10 rounded w-24"></div>
              <div class="h-8 bg-white/10 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-400 text-6xl mb-4">😞</div>
        <h2 class="text-3xl font-bold text-white mb-3">Error</h2>
        <p class="text-gray-300 mb-8 text-lg">{{ error }}</p>
        <button @click="fetchWishlist" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg">
          🔄 Reintentar
        </button>
      </div>

      <div v-else-if="items.length === 0" class="text-center py-20">
        <div class="text-8xl mb-6">💝</div>
        <h1 class="text-5xl font-bold text-white mb-4">Tu Lista de Deseos está Vacía</h1>
        <p class="text-gray-300 mb-8 max-w-md mx-auto text-lg">
          ¡Empieza a agregar productos que te gusten! Explora nuestra colección y guarda tus favoritos.
        </p>
        <RouterLink to="/products" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
          🛍️ Explorar Productos
        </RouterLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="item in items" :key="item.id" class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl hover:border-white/40 transition-all duration-300 transform hover:scale-105 group">
          <div class="relative overflow-hidden h-64 bg-white/5 flex items-center justify-center">
            <span v-if="item.product" class="text-7xl">{{ getProductEmoji(item.product) }}</span>
            <span v-else class="text-6xl">👕</span>
            <div class="absolute top-3 right-3 bg-red-500/30 backdrop-blur-md border border-red-400/50 rounded-full p-2 hover:bg-red-500/50 transition-all">
              <button @click="removeFromWishlist(item.productId)" class="text-red-200 hover:text-red-100 transition-colors" title="Eliminar de favoritos">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
          
          <div class="p-6">
            <h3 class="text-lg font-bold text-white mb-2 line-clamp-2">{{ item.product?.name }}</h3>
            <p class="text-gray-300 text-sm mb-4 line-clamp-2">{{ item.product?.description }}</p>
            
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-2">
                <span class="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">S/ {{ item.product?.price }}</span>
              </div>
              <div class="flex items-center gap-1 bg-white/10 border border-white/20 rounded-full px-3 py-1">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                <span class="text-sm text-gray-300 font-semibold">{{ item.product?.averageRating || 0 }}</span>
              </div>
            </div>

            <RouterLink :to="`/product/${item.productId}`" class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl block text-center">
              👁️ Ver Detalles
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { wishlistAPI } from '../api'
import type { WishlistItem } from '../types'

const items = ref<WishlistItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchWishlist = async () => {
  try {
    loading.value = true
    error.value = null
    const response = await wishlistAPI.get()
    items.value = response.data || []
  } catch (err: any) {
    if (err.response?.status === 401) {
      error.value = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
    } else {
      error.value = 'Error al cargar favoritos. Por favor, intenta de nuevo más tarde.'
      items.value = []
    }
  } finally {
    loading.value = false
  }
}

const removeFromWishlist = async (productId: number) => {
  try {
    await wishlistAPI.remove(productId)
    items.value = items.value.filter(i => i.productId !== productId)
  } catch (err) {
    console.error('Error al eliminar de favoritos:', err)
  }
}

onMounted(() => { fetchWishlist() })

const getProductEmoji = (product: any): string => {
  const category = (product.category || '').toLowerCase()
  if (category.includes('hombre') || category.includes('men')) return String.fromCodePoint(0x1F455)
  if (category.includes('mujer') || category.includes('women')) return String.fromCodePoint(0x1F457)
  if (category.includes('shoes') || category.includes('zapato')) return String.fromCodePoint(0x1F45F)
  if (category.includes('accessories') || category.includes('accesorio')) return String.fromCodePoint(0x1F6C1)
  return String.fromCodePoint(0x1F455)
}
</script>