<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
        <h1 class="text-4xl font-extrabold flex items-center gap-3">
          📸 Gestión de Imágenes
        </h1>
        <p class="text-purple-100 text-lg mt-2">Administra las imágenes de tus productos</p>
      </div>

      <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-6">
        <div class="flex gap-4 mb-4">
          <input 
            v-model="searchQuery"
            placeholder="Buscar productos..."
            class="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400"
          />
          <select v-model="categoryFilter" class="bg-white/10 border border-white/20 rounded-xl p-3 text-white">
            <option value="" class="text-gray-900">Todas las categorías</option>
            <option value="hombre" class="text-gray-900">Hombre</option>
            <option value="mujer" class="text-gray-900">Mujer</option>
            <option value="zapato" class="text-gray-900">Zapatos</option>
            <option value="accesorio" class="text-gray-900">Accesorios</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id"
          class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden"
        >
          <div class="h-48 bg-white/5 flex items-center justify-center text-8xl">
            {{ getProductEmoji(product.category) }}
          </div>
          
          <div class="p-4">
            <h3 class="text-white font-bold text-lg mb-1">{{ product.name }}</h3>
            <p class="text-gray-400 text-sm mb-2">{{ product.category }}</p>
            <p class="text-purple-400 font-bold">S/ {{ Number(product.price).toFixed(2) }}</p>
            
            <div class="mt-4 flex gap-2">
              <button 
                @click="viewProductImages(product)"
                class="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                🔍 Ver
              </button>
              <button 
                @click="editProductImage(product)"
                class="flex-1 px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700"
              >
                ✏️ Editar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredProducts.length === 0 && !loading" class="text-center py-12">
        <div class="text-6xl mb-4">📦</div>
        <p class="text-gray-400 text-lg">No se encontraron productos</p>
      </div>

      <div v-if="selectedProduct" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-2xl font-bold text-white">{{ selectedProduct.name }}</h2>
            <button @click="selectedProduct = null" class="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>

          <div class="space-y-4">
            <div class="bg-white/5 rounded-xl p-4">
              <p class="text-gray-400 text-sm mb-2">Categoría</p>
              <p class="text-white">{{ selectedProduct.category }}</p>
            </div>
            
            <div class="bg-white/5 rounded-xl p-4">
              <p class="text-gray-400 text-sm mb-2">Precio</p>
              <p class="text-white">S/ {{ Number(selectedProduct.price).toFixed(2) }}</p>
            </div>

            <div class="bg-white/5 rounded-xl p-4">
              <p class="text-gray-400 text-sm mb-2">Descripción</p>
              <p class="text-white">{{ selectedProduct.description || 'Sin descripción' }}</p>
            </div>

            <div class="bg-white/5 rounded-xl p-4">
              <p class="text-gray-400 text-sm mb-2">Stock</p>
              <p class="text-white">{{ selectedProduct.stock }} unidades</p>
            </div>
          </div>

          <div class="mt-6 flex gap-4">
            <button 
              @click="selectedProduct = null"
              class="flex-1 px-4 py-2 border border-white/30 text-white rounded-xl hover:bg-white/10"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { productsAPI } from '../api'

interface Product {
  id: number
  name: string
  category: string
  price: number
  description?: string
  stock: number
  imageUrl?: string
}

const products = ref<Product[]>([])
const loading = ref(true)
const searchQuery = ref('')
const categoryFilter = ref('')
const selectedProduct = ref<Product | null>(null)

const getProductEmoji = (category?: string): string => {
  if (!category) return String.fromCodePoint(0x1F455)
  const cat = category.toLowerCase()
  if (cat.includes('hombre') || cat.includes('men')) return String.fromCodePoint(0x1F455)
  if (cat.includes('mujer') || cat.includes('women')) return String.fromCodePoint(0x1F457)
  if (cat.includes('shoes') || cat.includes('zapato')) return String.fromCodePoint(0x1F45F)
  if (cat.includes('accessories') || cat.includes('accesorio')) return String.fromCodePoint(0x1F6C1)
  return String.fromCodePoint(0x1F455)
}

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = !searchQuery.value || 
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || 
      product.category.toLowerCase().includes(categoryFilter.value.toLowerCase())
    return matchesSearch && matchesCategory
  })
})

const fetchProducts = async () => {
  try {
    const response = await productsAPI.getAll()
    products.value = response.data || []
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const viewProductImages = (product: Product) => {
  selectedProduct.value = product
}

const editProductImage = (product: Product) => {
  selectedProduct.value = product
}

onMounted(() => {
  fetchProducts()
})
</script>