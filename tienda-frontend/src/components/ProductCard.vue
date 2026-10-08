<template>
  <div :class="computedClasses" class="group relative">
    <div class="relative h-72 bg-gradient-to-br from-purple-600/20 to-pink-600/20 overflow-hidden group-hover:scale-110 transition-transform duration-500">
      <img
        :src="getProductImageUrl(product)"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
        <div class="flex gap-3">
          <Button
            @click="$emit('quick-view', product)"
            size="sm"
            icon="👁️"
            class="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
          >
            Ver
          </Button>
          <Button
            @click="$emit('add-to-comparison', product)"
            size="sm"
            icon="⚖️"
            class="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-semibold"
          >
            Comparar
          </Button>
        </div>
      </div>

      <div class="absolute top-4 left-4 flex flex-col gap-2">
        <Badge v-if="product.isFeatured" variant="primary" size="sm">⭐ Destacado</Badge>
        <Badge v-if="product.isNew" variant="info" size="sm">🆕 Nuevo</Badge>
        <Badge v-if="product.isOnSale" variant="danger" size="sm">🏷️ Oferta</Badge>
        <Badge v-if="product.isBestseller" variant="warning" size="sm pulse">🔥 Bestseller</Badge>
        <Badge v-if="product.stock <= 5 && product.stock > 0" variant="warning" size="sm">¡Solo {{ product.stock }}!</Badge>
        <Badge v-if="product.stock === 0" variant="danger" size="sm">Agotado</Badge>
      </div>
    </div>

    <div class="p-6 space-y-3">
      <h3 class="text-lg font-bold text-white line-clamp-2 group-hover:text-purple-400 transition-colors cursor-pointer" @click="$emit('navigate', product.id)">
        {{ product.name }}
      </h3>
      <p class="text-gray-400 text-sm line-clamp-2">{{ product.description }}</p>

      <div class="flex items-center justify-between pt-2 border-t border-white/10">
        <span class="text-2xl font-bold font-mono tabular-nums text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
          S/ {{ typeof product.price === 'number' ? product.price.toFixed(2) : product.price }}
        </span>
        <div class="flex flex-col items-end">
          <span v-if="product.reviewCount" class="flex items-center gap-1">
            <span class="text-yellow-400 text-sm">★ {{ Number(product.averageRating || 0).toFixed(1) }}</span>
            <span class="text-gray-500 text-xs">({{ product.reviewCount }})</span>
          </span>
        </div>
      </div>

      <div class="flex gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          full-width
          class="text-white border-white/30 hover:bg-white/10"
          @click="$emit('navigate', product.id)"
        >
          Detalles
        </Button>
        <Button
          size="sm"
          full-width
          icon="🛒"
          class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          :disabled="product.stock <= 0"
          @click="$emit('add-to-cart', product)"
        >
          {{ product.stock <= 0 ? 'Agotado' : 'Agregar' }}
        </Button>
      </div>
    </div>

    <div v-if="isInComparison" class="absolute bottom-4 right-4">
      <Badge variant="primary" size="sm" icon="✓">En comparación</Badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '../types'
import Button from '../components/ui/Button.vue'
import Badge from '../components/ui/Badge.vue'
import { getProductImage } from '../utils/productImages'

interface Props {
  product: Product
  viewMode?: 'grid' | 'list'
  isInComparison?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'grid',
  isInComparison: false
})

const emit = defineEmits<{
  'add-to-cart': [product: Product]
  'quick-view': [product: Product]
  'add-to-comparison': [product: Product]
  navigate: [id: number]
}>()

const computedClasses = computed(() => {
  const base = 'bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:shadow-2xl hover:border-purple-500/50 transition-all duration-500 animate-fade-in-up'
  return props.viewMode === 'list' ? `${base} flex` : base
})

const getProductImageUrl = (product: Product): string => {
  return getProductImage(product.name, product.category, product.imageUrl)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

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