<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-4">Todos los Productos</h1>
        <div class="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div class="relative flex-1 max-w-md">
            <input 
              v-model="searchTerm"
              type="text" 
              placeholder="Buscar productos..."
              class="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          <div class="flex items-center gap-2">
            <button 
              @click="viewMode = 'grid'" 
              :class="viewMode === 'grid' ? 'bg-purple-600' : 'bg-white/10'"
              class="p-2 rounded-lg text-white"
            >
              ⊞
            </button>
            <button 
              @click="viewMode = 'list'" 
              :class="viewMode === 'list' ? 'bg-purple-600' : 'bg-white/10'"
              class="p-2 rounded-lg text-white"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Filters Sidebar -->
        <div class="w-full lg:w-1/4">
          <div class="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 sticky top-24">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-white text-lg">Filtros</h3>
              <button @click="clearFilters" class="text-purple-400 text-sm hover:text-purple-300">Limpiar</button>
            </div>
            
            <!-- Category Filter -->
            <div class="mb-6">
              <h4 class="text-sm font-semibold text-gray-300 mb-3">Categoría</h4>
              <div class="space-y-2">
                <label v-for="cat in categories" :key="cat" class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    :value="cat" 
                    v-model="selectedCategory"
                    class="w-4 h-4 text-purple-600 bg-white/10 border-white/30"
                  />
                  <span class="text-gray-300 text-sm capitalize">{{ cat }}</span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="mb-6">
              <h4 class="text-sm font-semibold text-gray-300 mb-3">Precio</h4>
              <input 
                type="range" 
                v-model="maxPrice" 
                min="0" 
                max="500" 
                class="w-full"
              />
              <div class="flex justify-between text-gray-400 text-sm mt-2">
                <span>S/ 0</span>
                <span>S/ {{ maxPrice }}</span>
              </div>
            </div>

            <!-- Availability -->
            <div>
              <h4 class="text-sm font-semibold text-gray-300 mb-3">Disponibilidad</h4>
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="showInStock"
                  class="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded"
                />
                <span class="text-gray-300 text-sm">Solo disponibles</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="w-full lg:w-3/4">
          <!-- Loading State -->
          <div v-if="loading" class="text-center py-12">
            <div class="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-400 text-xl">Cargando productos...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="text-center py-12">
            <h2 class="text-2xl font-bold text-white mb-2">Conectando con el backend</h2>
            <p class="text-gray-400 mb-6">{{ error }}</p>
            <button @click="fetchProducts" class="px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700">
              🔄 Reintentar
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
            <p class="text-gray-400 text-xl">No se encontraron productos</p>
          </div>

          <!-- Products Grid -->
          <div v-else :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'">
            <div v-for="product in filteredProducts" :key="product.id" 
              class="group relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all duration-500"
              :class="viewMode === 'list' ? 'flex' : ''"
            >
              <!-- Image -->
              <div :class="viewMode === 'grid' ? 'h-64' : 'w-48 h-48'" class="flex-shrink-0 overflow-hidden bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                <span class="text-6xl">{{ getProductEmoji(product) }}</span>
              </div>
                
              <!-- Badges -->
              <div class="absolute top-4 left-4 flex flex-col gap-2">
                <span v-if="product.stock <= 5 && product.stock > 0" class="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
                  ¡Solo {{ product.stock }}!
                </span>
                <span v-if="product.stock === 0" class="px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                  Agotado
                </span>
              </div>

              <!-- Quick Actions Overlay -->
              <div class="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                <RouterLink 
                  :to="`/product/${product.id}`"
                  class="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 font-semibold text-sm"
                >
                  👁️ Ver
                </RouterLink>
                <button 
                  @click.prevent="addToCart(product)"
                  class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold text-sm"
                >
                  🛒 Agregar
                </button>
              </div>

              <!-- Content -->
              <div class="p-4 flex-1">
                <RouterLink :to="`/product/${product.id}`">
                  <h3 class="font-bold text-white text-lg mb-1 line-clamp-2 group-hover:text-purple-400 transition-colors">
                    {{ product.name }}
                  </h3>
                </RouterLink>
                <p class="text-gray-400 text-sm mb-2 line-clamp-2">{{ product.description }}</p>
                
                <div class="flex items-center justify-between mt-3">
                  <span class="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                    S/ {{ typeof product.price === 'number' ? product.price.toFixed(2) : product.price }}
                  </span>
                  <div class="flex flex-col items-end">
                    <span class="text-gray-400 text-sm capitalize">{{ product.category }}</span>
                    <div v-if="product.reviewCount" class="flex items-center gap-1">
                      <span class="text-yellow-400 text-sm">★ {{ Number(product.averageRating || 0).toFixed(1) }}</span>
                      <span class="text-gray-500 text-xs">({{ product.reviewCount }})</span>
                    </div>
                  </div>
                </div>

                <div class="flex gap-2 mt-3">
                  <RouterLink 
                    :to="`/product/${product.id}`"
                    class="flex-1 px-4 py-2 border border-white/30 text-white text-center rounded-lg hover:bg-white/10 text-sm"
                  >
                    Detalles
                  </RouterLink>
                  <button 
                    @click.prevent="addToCart(product)"
                    :disabled="product.stock === 0"
                    class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 text-sm disabled:opacity-50"
                  >
                    🛒
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredProducts.length > 0" class="mt-8 flex justify-center gap-2">
            <button class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">Anterior</button>
            <button class="px-4 py-2 bg-purple-600 text-white rounded-lg">1</button>
            <button class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { productsAPI } from '../api'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types'

const cartStore = useCartStore()
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')

const searchTerm = ref('')
const selectedCategory = ref('')
const maxPrice = ref(500)
const showInStock = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')

const categories = ['hombre', 'mujer', 'zapatos', 'accesorios']

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = !searchTerm.value || 
      product.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || 
      product.category?.toLowerCase() === selectedCategory.value.toLowerCase()
    const matchesPrice = product.price <= maxPrice.value
    const matchesStock = !showInStock.value || product.stock > 0
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStock
  })
})

import { getProductImageUrl } from '../utils/images'

const getProductImage = (product: any): string => {
  return ''
}

const getProductEmoji = (product: any): string => {
  const category = (product.category || '').toLowerCase()
  if (category.includes('hombre') || category.includes('men')) return String.fromCodePoint(0x1F455)
  if (category.includes('mujer') || category.includes('women')) return String.fromCodePoint(0x1F457)
  if (category.includes('shoes') || category.includes('zapato')) return String.fromCodePoint(0x1F45F)
  if (category.includes('accessories') || category.includes('accesorio')) return String.fromCodePoint(0x1F6C1)
  return String.fromCodePoint(0x1F455)
}

const handleImageError = (e: Event, product: any) => {
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
  const parent = target.parentElement
  if (parent) {
    parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center"><span class="text-6xl">${getProductEmoji(product)}</span></div>`
  }
}

const addToCart = (product: Product) => {
  cartStore.addItem(product, 1)
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = ''
  maxPrice.value = 500
  showInStock.value = false
}

const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await productsAPI.getAll()
    products.value = response.data || []
  } catch (err) {
    error.value = 'Conectando con el backend. Esto puede tardar unos segundos.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>