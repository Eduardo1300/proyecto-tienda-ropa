<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 -right-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-20 -left-20 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 relative z-10">
      <div class="mb-8 animate-fade-in-up">
        <h1 class="text-4xl md:text-5xl font-black text-white mb-4">
          Todos los <span class="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Productos</span>
        </h1>
        <p class="text-gray-400 text-lg">Descubre nuestra colección completa</p>
        
        <div class="flex flex-col md:flex-row gap-4 justify-between items-center mt-6">
          <div class="relative flex-1 max-w-md group">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar productos, marcas, categorías..."
              class="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all group-hover:bg-white/15"
            />
            <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:scale-110 transition-transform">🔍</span>
            <button v-if="searchTerm" @click="searchTerm = ''" class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">✕</button>
          </div>
          <div class="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button @click="viewMode = 'grid'" :class="viewMode === 'grid' ? 'bg-purple-600 shadow-lg' : 'hover:bg-white/10'" class="p-2 rounded-lg text-white transition-all duration-300 transform hover:scale-110" title="Vista en cuadrícula">⊞</button>
            <button @click="viewMode = 'list'" :class="viewMode === 'list' ? 'bg-purple-600 shadow-lg' : 'hover:bg-white/10'" class="p-2 rounded-lg text-white transition-all duration-300 transform hover:scale-110" title="Vista en lista">☰</button>
          </div>
        </div>
      </div>

      <div v-if="error" class="mb-8">
        <div class="bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-300 p-4 rounded-xl">
          <p class="font-medium flex items-center gap-2">⚠️ {{ error }}</p>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <aside class="w-full lg:w-64 flex-shrink-0">
          <ProductFilters
            :filters="filters"
            :filter-options="filterOptions"
            @update="handleFiltersChange"
            @clear="clearFilters"
          />
        </aside>

        <main class="w-full lg:flex-1 min-w-0">
          <div class="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 flex-wrap">
            <div class="flex items-center gap-4 flex-1">
              <select
                v-model="sortBy"
                class="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none pr-8"
                :style="sortSelectStyle"
              >
                <option value="name">📝 Nombre A-Z</option>
                <option value="price-low">💰 Precio: Menor a Mayor</option>
                <option value="price-high">💎 Precio: Mayor a Menor</option>
                <option value="rating">⭐ Mejor Calificados</option>
                <option value="newest">🆕 Más Nuevos</option>
              </select>

              <div v-if="getActiveFiltersCount > 0" class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full">
                  {{ getActiveFiltersCount }} filtro{{ getActiveFiltersCount !== 1 ? 's' : '' }} activo{{ getActiveFiltersCount !== 1 ? 's' : '' }}
                </span>
                <button @click="clearFilters" class="text-sm text-purple-400 hover:text-purple-300 font-medium">Limpiar</button>
              </div>
            </div>

            <div class="text-sm text-gray-400">
              {{ filteredProducts.length }} producto{{ filteredProducts.length !== 1 ? 's' : '' }} encontrado{{ filteredProducts.length !== 1 ? 's' : '' }}
            </div>
          </div>

          <div v-if="error" class="mb-6">
            <div class="bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-300 p-4 rounded-xl">
              <p class="font-medium flex items-center gap-2">⚠️ {{ error }}</p>
            </div>
          </div>

          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="i in 8" :key="i" class="animate-pulse">
              <div class="bg-white/10 rounded-2xl overflow-hidden border border-white/20">
                <div class="aspect-square bg-white/5"></div>
                <div class="p-5 space-y-3">
                  <div class="h-4 bg-white/10 rounded w-3/4"></div>
                  <div class="h-3 bg-white/5 rounded w-full"></div>
                  <div class="h-6 bg-white/10 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="filteredProducts.length === 0" class="text-center py-16 animate-fade-in-up">
            <div class="bg-white/5 rounded-2xl p-12 border border-white/10">
              <div class="text-6xl mb-4">🔍</div>
              <h3 class="text-2xl font-bold text-white mb-2">No se encontraron productos</h3>
              <p class="text-gray-400 mb-6">Intenta cambiar los filtros o el término de búsqueda</p>
              <Button @click="clearFilters" icon="🔄" class="transform hover:scale-105">Limpiar Filtros</Button>
            </div>
          </div>

          <div v-else :class="viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'">
            <ProductCard
              v-for="(product, index) in filteredProducts"
              :key="product.id"
              :product="product"
              :view-mode="viewMode"
              :is-in-comparison="comparisonItems.some(item => item.id === product.id)"
              @add-to-cart="addToCart"
              @quick-view="openQuickView"
              @add-to-comparison="addToComparison"
              @navigate="navigateToProduct"
              :style="{ animationDelay: `${index * 50}ms` }"
            />
          </div>

          <div v-if="filteredProducts.length > 0" class="mt-8 flex justify-center gap-2 animate-fade-in-up">
            <Button variant="outline" @click="prevPage" :disabled="currentPage === 1">Anterior</Button>
            <span class="px-4 py-2 bg-white/10 text-white rounded-lg font-medium">
              Página {{ currentPage }}
            </span>
            <Button @click="nextPage">Siguiente</Button>
          </div>
        </main>
      </div>
    </div>

    <ProductQuickView
      :product="quickViewProduct"
      @close="closeQuickView"
      @add-to-cart="addToCart"
      @navigate="navigateToProduct"
    />

    <ProductComparison
      v-if="comparisonItems.length > 0"
      :items="comparisonItems"
      @remove="removeFromComparison"
      @navigate="navigateToProduct"
      @clear="clearComparison"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { productsAPI } from '../api'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types'
import ProductCard from '../components/ProductCard.vue'
import ProductQuickView from '../components/ProductQuickView.vue'
import ProductFilters from '../components/ProductFilters.vue'
import ProductComparison from '../components/ProductComparison.vue'
import { getProductImage } from '../utils/productImages'
import Button from '../components/ui/Button.vue'

const router = useRouter()
const cartStore = useCartStore()

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')
const searchTerm = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const quickViewProduct = ref<Product | null>(null)
const comparisonItems = ref<Product[]>([])
const currentPage = ref(1)

const filters = ref({
  category: '',
  priceRange: 1000,
  inStock: false
})

const filterOptions = computed(() => {
  const categories = Array.from(new Set(products.value.map(p => p.category).filter(Boolean)))
  const prices = products.value.map(p => p.price).filter(p => p > 0)
  const priceRange: [number, number] = prices.length > 0
    ? [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
    : [0, 1000]

  return {
    categories: categories.length > 0 ? categories : ['hombre', 'mujer', 'zapatos', 'accesorios'],
    priceRange
  }
})

const filteredProducts = computed(() => {
  let filtered = [...products.value]

  if (searchTerm.value) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      (product.brand || '').toLowerCase().includes(searchTerm.value.toLowerCase())
    )
  }

  if (filters.value.category) {
    filtered = filtered.filter(p => p.category === filters.value.category)
  }

  if (filters.value.inStock) {
    filtered = filtered.filter(p => p.stock > 0)
  }

  filtered = filtered.filter(p => p.price >= filterOptions.value.priceRange[0] && p.price <= filters.value.priceRange)

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'price-low': return a.price - b.price
      case 'price-high': return b.price - a.price
      case 'rating': return ((b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0))
      case 'newest': return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      default: return a.name.localeCompare(b.name)
    }
  })

  return filtered
})

const sortBy = ref('name')

const getActiveFiltersCount = computed(() => {
  let count = 0
  if (filters.value.category) count++
  if (filters.value.inStock) count++
  if (filters.value.priceRange !== filterOptions.value.priceRange[1]) count++
  return count
})

const sortSelectStyle = computed(() => ({
  backgroundImage: 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>\')',
  backgroundPosition: 'right 0.75rem center',
  backgroundSize: '1.25rem',
  backgroundRepeat: 'no-repeat',
  webkitAppearance: 'none',
  mozAppearance: 'none',
  paddingRight: '2.5rem'
}))

const handleFiltersChange = (newFilters: any) => {
  filters.value = newFilters
  currentPage.value = 1
}

const clearFilters = () => {
  filters.value = {
    category: '',
    priceRange: filterOptions.value.priceRange[1],
    inStock: false
  }
  searchTerm.value = ''
  currentPage.value = 1
}

const addToCart = (product: Product) => {
  cartStore.addItem(product, 1)
}

const openQuickView = (product: Product) => {
  quickViewProduct.value = product
}

const closeQuickView = () => {
  quickViewProduct.value = null
}

const addToComparison = (product: Product) => {
  if (comparisonItems.value.length < 3 && !comparisonItems.value.find(item => item.id === product.id)) {
    comparisonItems.value.push(product)
  }
}

const removeFromComparison = (productId: number) => {
  comparisonItems.value = comparisonItems.value.filter(item => item.id !== productId)
}

const clearComparison = () => {
  comparisonItems.value = []
}

const navigateToProduct = (id: number) => {
  router.push(`/product/${id}`)
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  // pagination logic here
}

const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await productsAPI.getAll()
    const backendProducts = response.data || []
    products.value = backendProducts.map(product => ({
      ...product,
      price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
      stock: typeof product.stock === 'string' ? parseInt(product.stock) : (product.stock || 0),
      imageUrl: getProductImage(product.name, product.category, product.imageUrl || product.image),
      brand: product.brand || 'Sin marca',
      colors: product.colors || [],
      sizes: product.sizes || [],
      isNew: product.isNew || false,
      isFeatured: product.isFeatured || false,
      isOnSale: product.isOnSale || false,
      isBestseller: product.isBestseller || false,
      rating: product.rating || 0,
      averageRating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0
    }))
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

watch(() => filterOptions.value.priceRange, (newRange) => {
  if (filters.value.priceRange === filterOptions.value.priceRange[1] || filters.value.priceRange > newRange[1]) {
    filters.value.priceRange = newRange[1]
  }
}, { immediate: true })
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

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
</style>