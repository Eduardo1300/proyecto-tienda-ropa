<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Breadcrumb -->
      <div class="mb-6">
        <RouterLink to="/products" class="text-purple-400 hover:underline">Volver a productos</RouterLink>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto"></div>
        <p class="mt-4 text-gray-300">Cargando producto...</p>
      </div>

      <div v-else-if="!product" class="text-center py-12">
        <h2 class="text-2xl font-bold text-white mb-2">Producto no encontrado</h2>
        <RouterLink to="/products" class="text-purple-400 hover:underline">Volver a productos</RouterLink>
      </div>

      <div v-else>
        <!-- Product Main Info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <!-- Images -->
          <div class="space-y-4">
            <div class="aspect-square bg-white/10 rounded-2xl overflow-hidden flex items-center justify-center">
              <span class="text-9xl">{{ getProductEmoji(product) }}</span>
            </div>
            <div class="grid grid-cols-4 gap-4">
              <div 
                v-for="i in 4" 
                :key="i"
                class="aspect-square bg-white/10 rounded-lg flex items-center justify-center"
              >
                <span class="text-3xl">{{ getProductEmoji(product) }}</span>
              </div>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <div>
              <span class="inline-block px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full text-sm mb-4">
                {{ product.category }}
              </span>
              <h1 class="text-4xl font-bold text-white mb-2">{{ product.name }}</h1>
              <div class="flex items-center gap-4 flex-wrap">
                <span class="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  S/ {{ Number(product.price).toFixed(2) }}
                </span>
                <div v-if="product.reviewCount" class="flex items-center gap-2">
                  <div class="flex items-center">
                    <span class="text-yellow-400 text-xl">★</span>
                    <span class="text-white font-semibold ml-1">{{ Number(product.averageRating || 0).toFixed(1) }}</span>
                  </div>
                  <span class="text-gray-400">({{ product.reviewCount }} reseñas)</span>
                </div>
              </div>
              <div class="mt-2">
                <span v-if="product.stock > 0" class="text-green-400 flex items-center gap-1">
                  <span class="w-2 h-2 bg-green-400 rounded-full"></span>
                  En stock ({{ product.stock }} disponibles)
                </span>
                <span v-else class="text-red-400">Agotado</span>
              </div>
            </div>

            <p class="text-gray-300 text-lg">{{ product.description }}</p>

            <!-- Quantity & Add to Cart -->
            <div class="flex items-center gap-4">
              <div class="flex items-center border border-white/20 rounded-lg">
                <button @click="quantity > 1 && quantity--" class="px-4 py-2 text-white hover:bg-white/10">-</button>
                <span class="px-4 py-2 text-white">{{ quantity }}</span>
                <button @click="quantity++" class="px-4 py-2 text-white hover:bg-white/10">+</button>
              </div>
              <button 
                @click="addToCart" 
                :disabled="product.stock <= 0"
                class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Agregar al Carrito
              </button>
              <button 
                @click="toggleWishlist"
                class="p-3 border border-white/20 rounded-xl text-white hover:bg-white/10"
              >
                {{ isInWishlist ? 'Favorito' : 'Agregar a Favoritos' }}
              </button>
            </div>

            <!-- Product Details -->
            <div class="bg-white/5 rounded-xl p-6 space-y-3">
              <h3 class="text-white font-semibold text-lg">Detalles del Producto</h3>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <span class="text-gray-400">Categoria:</span>
                <span class="text-white">{{ product.category }}</span>
                <span v-if="product.sku" class="text-gray-400">SKU:</span>
                <span v-if="product.sku" class="text-white">{{ product.sku }}</span>
              </div>
            </div>

            <!-- Shipping Info -->
            <div class="bg-white/5 rounded-xl p-6 space-y-3">
              <h3 class="text-white font-semibold text-lg">Informacion de Envio</h3>
              <div class="flex items-center gap-3 text-gray-300">
                <span class="text-xl">Envio</span>
                <span>Envio en 24-48 horas</span>
              </div>
              <div class="flex items-center gap-3 text-gray-300">
                <span class="text-xl">Paquete</span>
                <span>Envio gratis en pedidos mayores a S/ 100</span>
              </div>
              <div class="flex items-center gap-3 text-gray-300">
                <span class="text-xl">Cambio</span>
                <span>30 dias para cambios y devoluciones</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Reviews Section -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Reseñas del Producto</h2>
          
          <div v-if="reviews.length === 0" class="text-center py-8">
            <p class="text-gray-400">No hay reseñas aun. Se el primero en opinar!</p>
          </div>

          <div v-else class="space-y-6">
            <div v-for="review in reviews" :key="review.id" class="border-b border-white/10 pb-6">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="text-white font-semibold">{{ review.user?.name || review.user?.username || review.userId || 'Usuario' }}</span>
                  <span v-if="review.isVerified || review.purchaseVerified" class="text-green-400 text-sm">Verificado</span>
                </div>
                <div class="text-yellow-400">
                  {{ '★'.repeat(review.rating || 5) }}{{ '☆'.repeat(5 - (review.rating || 5)) }}
                </div>
              </div>
              <h4 class="text-white font-medium mb-1">{{ review.title || 'Sin titulo' }}</h4>
              <p class="text-gray-300">{{ review.comment || 'Sin comentario' }}</p>
              <p class="text-gray-500 text-sm mt-2">{{ formatDate(review.createdAt) }}</p>
            </div>
            <div v-if="reviews.length === 0" class="text-center py-4">
              <p class="text-gray-400">No hay reseñas aún. ¡Sé el primero en opinar!</p>
            </div>
          </div>

          <!-- Add Review Form -->
          <div v-if="isLoggedIn && reviewsError === ''" class="mt-8 pt-6 border-t border-white/10">
            <h3 class="text-white font-semibold text-lg mb-4">Escribir una Resena</h3>
            <div class="space-y-4">
              <div>
                <label class="text-gray-400 text-sm mb-1 block">Calificacion</label>
                <div class="flex gap-2">
                  <button 
                    v-for="star in 5" 
                    :key="star"
                    @click="newReview.rating = star"
                    class="text-2xl"
                    :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-500'"
                  >
                    {{ star <= newReview.rating ? '★' : '☆' }}
                  </button>
                </div>
              </div>
              <div>
                <input 
                  v-model="newReview.title" 
                  placeholder="Titulo de tu resena"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                />
              </div>
              <div>
                <textarea 
                  v-model="newReview.comment" 
                  placeholder="Escribe tu resena..."
                  rows="3"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                ></textarea>
              </div>
              <button 
                @click="submitReview"
                class="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700"
              >
                Enviar Resena
              </button>
            </div>
          </div>
        </div>

        <!-- Related Products -->
        <div v-if="relatedProducts.length > 0" class="mb-12">
          <h2 class="text-2xl font-bold text-white mb-6">Productos Relacionados</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div 
              v-for="related in relatedProducts" 
              :key="related.id"
              class="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all"
            >
              <div class="h-48 bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                <span class="text-5xl">{{ getProductEmoji(related) }}</span>
              </div>
              <div class="p-4">
                <h3 class="text-white font-semibold mb-1 line-clamp-1">{{ related.name }}</h3>
                <p class="text-purple-400 font-bold">S/ {{ Number(related.price).toFixed(2) }}</p>
                <RouterLink 
                  :to="`/product/${related.id}`"
                  class="block mt-2 text-center py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20"
                >
                  Ver Detalle
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productsAPI, reviewsAPI } from '../api'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import type { Product, Review } from '../types'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const quantity = ref(1)
const reviews = ref<Review[]>([])
const reviewsError = ref('')
const relatedProducts = ref<Product[]>([])
const isInWishlist = ref(false)

const newReview = ref({
  rating: 5,
  title: '',
  comment: ''
})

const isLoggedIn = computed(() => authStore.isAuthenticated)

const getProductEmoji = (p: any): string => {
  const category = (p?.category || '').toLowerCase()
  if (category.includes('hombre') || category.includes('men')) return String.fromCodePoint(0x1F455)
  if (category.includes('mujer') || category.includes('women')) return String.fromCodePoint(0x1F457)
  if (category.includes('shoes') || category.includes('zapato')) return String.fromCodePoint(0x1F45F)
  if (category.includes('accessories') || category.includes('accesorio')) return String.fromCodePoint(0x1F6C1)
  return String.fromCodePoint(0x1F455)
}

const formatDate = (dateStr: any): string => {
  if (!dateStr) return 'Hace poco'
  try {
    if (typeof dateStr === 'string' && dateStr.includes('-')) {
      const parts = dateStr.split('-')
      if (parts[0].length === 4) {
        const date = new Date(dateStr)
        if (isNaN(date.getTime())) return 'Hace poco'
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
      }
    }
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return 'Hace poco'
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return 'Hace poco'
  }
}

const addToCart = () => {
  if (product.value && product.value.stock > 0) {
    cartStore.addItem(product.value, quantity.value)
    router.push('/cart')
  }
}

const toggleWishlist = () => {
  if (!isLoggedIn.value) {
    router.push('/login')
    return
  }
  isInWishlist.value = !isInWishlist.value
}

const submitReview = async () => {
  if (!product.value || !newReview.value.title || !newReview.value.comment) return
  
  try {
    await reviewsAPI.create({
      productId: product.value.id,
      rating: newReview.value.rating,
      title: newReview.value.title,
      comment: newReview.value.comment
    })
    newReview.value = { rating: 5, title: '', comment: '' }
    loadReviews()
  } catch (err) {
    console.error('Error submitting review:', err)
  }
}

const loadReviews = async () => {
  if (!product.value) return
  reviewsError.value = ''
  try {
    // Try different API approaches
    let reviewsData = []
    
    // Try with product ID directly
    const response1 = await api.get(`/reviews`, { params: { productId: product.value.id, limit: 50 } })
    console.log('API Response 1:', response1.data)
    
    if (response1.data?.data) {
      reviewsData = response1.data.data
    } else if (Array.isArray(response1.data)) {
      reviewsData = response1.data
    } else if (response1.data?.reviews) {
      reviewsData = response1.data.reviews
    }
    
    // If still empty, try direct endpoint
    if (reviewsData.length === 0) {
      const response2 = await api.get(`/products/${product.value.id}/reviews`)
      console.log('API Response 2:', response2.data)
      if (Array.isArray(response2.data)) {
        reviewsData = response2.data
      } else if (response2.data?.reviews) {
        reviewsData = response2.data.reviews
      }
    }
    
    reviews.value = reviewsData
    console.log('Final reviews data:', reviews.value)
  } catch (err: any) {
    console.error('Error loading reviews:', err)
    reviewsError.value = err.response?.status === 404 ? '' : 'No se pudieron cargar las reseñas'
    reviews.value = []
  }
}

const loadRelatedProducts = async () => {
  if (!product.value || !product.value.category) return
  try {
    const response = await productsAPI.getByCategory(product.value.category)
    if (response.data && Array.isArray(response.data)) {
      relatedProducts.value = response.data.filter((p: Product) => p.id !== product.value?.id).slice(0, 4)
    } else {
      relatedProducts.value = []
    }
  } catch (err) {
    console.error('Error loading related products:', err)
    relatedProducts.value = []
  }
}

onMounted(async () => {
  try {
    const idParam = route.params.id as string
    const id = parseInt(idParam)
    if (isNaN(id)) {
      console.error('Invalid product ID:', idParam)
      loading.value = false
      return
    }
    const response = await productsAPI.getById(id)
    product.value = response.data
    
    await Promise.all([loadReviews(), loadRelatedProducts()])
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>