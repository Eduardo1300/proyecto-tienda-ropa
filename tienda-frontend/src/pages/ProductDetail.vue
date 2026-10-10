<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="animate-pulse space-y-4">
          <div class="aspect-square bg-white/10 rounded-2xl"></div>
          <div class="grid grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="aspect-square bg-white/5 rounded-lg"></div>
          </div>
        </div>
        <div class="space-y-6 animate-pulse">
          <div class="h-8 bg-white/10 rounded w-1/3"></div>
          <div class="h-12 bg-white/10 rounded w-3/4"></div>
          <div class="h-10 bg-white/10 rounded w-1/4"></div>
          <div class="h-20 bg-white/5 rounded w-full"></div>
        </div>
      </div>

      <div v-else-if="!product" class="text-center py-20 animate-fade-in-up">
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-lg mx-auto">
          <div class="text-8xl mb-6">😕</div>
          <h2 class="text-3xl font-bold text-white mb-4">Producto no encontrado</h2>
          <p class="text-gray-300 mb-8">El producto que buscas no existe o fue eliminado.</p>
          <RouterLink to="/products" class="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
            ← Ver Productos
          </RouterLink>
        </div>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div class="space-y-4 animate-scale-in">
            <div class="aspect-square bg-white/10 rounded-2xl overflow-hidden flex items-center justify-center border border-white/20 hover:border-purple-500/50 transition-all duration-300 group">
              <img
                :src="productImages[activeImage] || product.imageUrl"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="grid grid-cols-4 gap-4">
              <button
                v-for="(img, index) in productImages"
                :key="index"
                @click="activeImage = index"
                class="aspect-square bg-white/10 rounded-lg flex items-center justify-center border border-white/20 hover:border-purple-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
                :class="{ 'border-purple-400 shadow-lg shadow-purple-500/50': activeImage === index }"
              >
                <img
                  :src="img || product.imageUrl"
                  :alt="`${product.name} ${index + 1}`"
                  class="w-full h-full object-cover rounded-lg"
                />
              </button>
            </div>
          </div>

          <div class="space-y-6 animate-fade-in-up" style="animation-delay: 0.2s;">
            <div>
              <span class="inline-block px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full text-sm mb-4 animate-pulse">
                {{ product.category }}
              </span>
              <h1 class="text-4xl md:text-5xl font-black text-white mb-4 hover:text-purple-400 transition-colors">{{ product.name }}</h1>
              <div class="flex items-center gap-4 flex-wrap">
                <span class="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  S/ {{ Number(product.price).toFixed(2) }}
                </span>
                <div v-if="product.reviewCount" class="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <div class="flex items-center">
                    <span class="text-yellow-400 text-xl">★</span>
                    <span class="text-white font-semibold ml-1">{{ Number(product.averageRating || 0).toFixed(1) }}</span>
                  </div>
                  <span class="text-gray-400">({{ product.reviewCount }} reseñas)</span>
                </div>
              </div>
              <div class="mt-4 flex items-center gap-2">
                <span v-if="product.stock > 0" class="text-green-400 flex items-center gap-2">
                  <span class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
                  En stock ({{ product.stock }} disponibles)
                </span>
                <span v-else class="text-red-400 flex items-center gap-2">
                  <span class="w-3 h-3 bg-red-400 rounded-full"></span>
                  Agotado
                </span>
              </div>
            </div>

            <p class="text-gray-300 text-lg leading-relaxed border-l-4 border-purple-500 pl-4">{{ product.description }}</p>

            <div class="flex items-center gap-4 flex-wrap">
              <div class="flex items-center border border-white/20 rounded-xl bg-white/5">
                <button @click="quantity > 1 && quantity--" class="px-4 py-3 text-white hover:bg-white/10 transition-colors rounded-l-xl">−</button>
                <span class="px-6 py-3 text-white font-semibold border-x border-white/10">{{ quantity }}</span>
                <button @click="quantity++" class="px-4 py-3 text-white hover:bg-white/10 transition-colors rounded-r-xl">+</button>
              </div>
              <Button
                @click="addToCart"
                :disabled="product.stock <= 0"
                class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 hover:shadow-lg"
              >
                🛒 Agregar al Carrito
              </Button>
              <Button
                @click="buyNow"
                :disabled="product.stock <= 0"
                variant="success"
                class="flex-1 py-3 px-6 rounded-xl font-bold hover:scale-105 transition-all"
              >
                💳 Comprar ahora
              </Button>
            </div>

            <div class="bg-white/5 rounded-xl p-6 space-y-3 border border-white/10 hover:border-purple-500/30 transition-all">
              <h3 class="text-white font-semibold text-lg flex items-center gap-2">
                <span>📋</span> Detalles del Producto
              </h3>
              <div class="grid grid-cols-2 gap-2 text-sm">
                <span class="text-gray-400">Categoría:</span>
                <span class="text-white">{{ product.category }}</span>
                <span v-if="product.sku" class="text-gray-400">SKU:</span>
                <span v-if="product.sku" class="text-white">{{ product.sku }}</span>
                <span v-if="product.brand" class="text-gray-400">Marca:</span>
                <span v-if="product.brand" class="text-white">{{ product.brand }}</span>
              </div>
            </div>

            <div class="bg-white/5 rounded-xl p-6 space-y-3 border border-white/10 hover:border-purple-500/30 transition-all">
              <h3 class="text-white font-semibold text-lg flex items-center gap-2">
                <span>🚚</span> Información de Envío
              </h3>
              <div class="space-y-3 text-gray-300 hover:text-white transition-colors">
                <div class="flex items-center gap-3"><span class="text-xl">📦</span> Envío en 24-48 horas</div>
                <div class="flex items-center gap-3"><span class="text-xl">🎁</span> Envío gratis en pedidos mayores a S/ 100</div>
                <div class="flex items-center gap-3"><span class="text-xl">🔄</span> 30 días para cambios y devoluciones</div>
                <div class="flex items-center gap-3"><span class="text-xl">🛡️</span> Compra protegida 100%</div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-12 border border-white/20 hover:border-purple-500/30 transition-all animate-fade-in-up" style="animation-delay: 0.4s;">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>⭐</span> Reseñas del Producto
          </h2>

          <div v-if="reviews.length === 0" class="text-center py-8">
            <div class="text-5xl mb-4">💬</div>
            <p class="text-gray-400">No hay reseñas aun. ¡Sé el primero en opinar!</p>
          </div>

          <div v-else class="space-y-6">
            <div v-for="review in reviews" :key="review.id" class="border-b border-white/10 pb-6 hover:bg-white/5 p-4 rounded-xl transition-all">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {{ (review.user?.name || review.user?.username || review.userId || 'U')[0].toUpperCase() }}
                  </div>
                  <span class="text-white font-semibold">{{ review.user?.name || review.user?.username || review.userId || 'Usuario' }}</span>
                  <span v-if="review.isVerified || review.purchaseVerified" class="text-green-400 text-sm flex items-center gap-1">✓ Verificado</span>
                </div>
                <div class="text-yellow-400 text-lg">
                  {{ '★'.repeat(review.rating || 5) }}{{ '☆'.repeat(5 - (review.rating || 5)) }}
                </div>
              </div>
              <h4 class="text-white font-medium mb-1">{{ review.title || 'Sin título' }}</h4>
              <p class="text-gray-300">{{ review.comment || 'Sin comentario' }}</p>
              <p class="text-gray-500 text-sm mt-2">{{ formatDate(review.createdAt) }}</p>
            </div>
          </div>

          <div v-if="isLoggedIn" class="mt-8 pt-6 border-t border-white/10">
            <h3 class="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <span>✍️</span> Escribir una Reseña
            </h3>
            <div class="space-y-4">
              <div>
                <label class="text-gray-400 text-sm mb-1 block">Calificación</label>
                <div class="flex gap-2">
                  <button
                    v-for="star in 5"
                    :key="star"
                    @click="newReview.rating = star"
                    class="text-3xl transition-transform hover:scale-125"
                    :class="star <= newReview.rating ? 'text-yellow-400' : 'text-gray-500'"
                  >
                    {{ star <= newReview.rating ? '★' : '☆' }}
                  </button>
                </div>
              </div>
              <div>
                <input
                  v-model="newReview.title"
                  placeholder="Título de tu reseña"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
              </div>
              <div>
                <textarea
                  v-model="newReview.comment"
                  placeholder="Escribe tu reseña..."
                  rows="3"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                ></textarea>
              </div>
              <Button
                @click="submitReview"
                class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all"
              >
                📤 Enviar Reseña
              </Button>
            </div>
          </div>
        </div>

        <div v-if="relatedProducts.length > 0" class="mb-12 animate-fade-in-up" style="animation-delay: 0.6s;">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>🔗</span> Productos Relacionados
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div
              v-for="related in relatedProducts"
              :key="related.id"
              class="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden border border-white/20 hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 group"
            >
              <div class="h-48 bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <img
                  :src="getProductImage(related.name, related.category, related.imageUrl)"
                  :alt="related.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div class="p-4">
                <h3 class="text-white font-semibold mb-1 line-clamp-1 group-hover:text-purple-400 transition-colors">{{ related.name }}</h3>
                <p class="text-purple-400 font-bold">S/ {{ Number(related.price).toFixed(2) }}</p>
                <RouterLink
                  :to="`/product/${related.id}`"
                  class="block mt-2 text-center py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-purple-600 transition-all"
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
import api from '../api'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import type { Product, Review } from '../types'
import { getProductImage, getProductImages } from '../utils/productImages'
import Button from '../components/ui/Button.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const quantity = ref(1)
const activeImage = ref(0)
const reviews = ref<Review[]>([])
const reviewsError = ref('')
const relatedProducts = ref<Product[]>([])
const newReview = ref({ rating: 5, title: '', comment: '' })
const isLoggedIn = computed(() => authStore.isAuthenticated)

const productImages = computed(() => {
  return product.value ? getProductImages(product.value.name, product.value.category, 4, product.value.imageUrl || product.value.image) : []
})

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
  }
}

const buyNow = () => {
  if (product.value && product.value.stock > 0) {
    cartStore.addItem(product.value, quantity.value)
    router.push('/checkout')
  }
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
    const response = await api.get(`/reviews`, { params: { productId: product.value.id, limit: 50 } })
    let reviewsData = []
    if (response.data?.reviews) reviewsData = response.data.reviews
    else if (response.data?.data) reviewsData = response.data.data
    else if (Array.isArray(response.data)) reviewsData = response.data
    reviews.value = reviewsData
  } catch (err: any) {
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
    }
  } catch (err) {
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
    activeImage.value = 0
    await Promise.all([loadReviews(), loadRelatedProducts()])
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-in { animation: scaleIn 0.6s ease-out forwards; opacity: 0; }
</style>