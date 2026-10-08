<template>
  <Teleport to="body">
    <div v-if="product" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Vista Rápida</h2>
          <button @click="close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">✕</button>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
              <img
                :src="getProductImage(product.name, product.category, product.imageUrl)"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="grid grid-cols-4 gap-2">
              <div v-for="i in 4" :key="i" class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <img
                  :src="getProductImage(product.name, product.category, product.imageUrl)"
                  :alt="`${product.name} ${i}`"
                  class="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <span class="inline-block px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full text-sm">{{ product.category }}</span>
            <h3 class="text-4xl font-black text-gray-800 dark:text-white">{{ product.name }}</h3>
            <div class="flex items-center gap-4 flex-wrap">
              <span class="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                S/ {{ Number(product.price).toFixed(2) }}
              </span>
              <div v-if="product.reviewCount" class="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                <span class="text-yellow-400 text-xl">★</span>
                <span class="font-semibold">{{ Number(product.averageRating || 0).toFixed(1) }}</span>
                <span class="text-gray-500">({{ product.reviewCount }} reseñas)</span>
              </div>
            </div>
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ product.description }}</p>

            <div class="flex items-center gap-4">
              <span v-if="product.stock > 0" class="text-green-600 dark:text-green-400 flex items-center gap-2">
                <span class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                En stock ({{ product.stock }} disponibles)
              </span>
              <span v-else class="text-red-600 dark:text-red-400 flex items-center gap-2">
                <span class="w-3 h-3 bg-red-500 rounded-full"></span>
                Agotado
              </span>
            </div>

            <div class="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                @click="addToCart"
                :disabled="product.stock <= 0"
                size="lg"
                icon="🛒"
                class="flex-1"
              >
                {{ product.stock <= 0 ? 'Agotado' : 'Agregar al Carrito' }}
              </Button>
              <Button
                variant="outline"
                size="lg"
                @click="navigateToProduct"
              >
                Ver Detalles
              </Button>
            </div>

            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-3">Colores disponibles</h4>
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="color in product.colors || []"
                  :key="color"
                  class="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors"
                >
                  {{ color }}
                </button>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-gray-800 dark:text-gray-100 mb-3">Tallas disponibles</h4>
              <div class="flex gap-2 flex-wrap">
                <button
                  v-for="size in product.sizes || []"
                  :key="size"
                  class="w-12 h-12 border-2 rounded-lg font-bold transition-all duration-300 border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                >
                  {{ size }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '../types'
import Button from '../components/ui/Button.vue'
import { getProductImage } from '../utils/productImages'

interface Props {
  product: Product | null
  onClose: () => void
}

const props = defineProps<Props>()

const emit = defineEmits<{
  addToCart: [product: Product]
  navigate: [id: number]
}>()

const product = computed(() => props.product)

const addToCart = () => {
  if (product.value && product.value.stock > 0) {
    emit('addToCart', product.value)
  }
}

const navigateToProduct = () => {
  if (product.value) {
    emit('navigate', product.value.id)
  }
}

const close = () => {
  props.onClose()
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}
</style>