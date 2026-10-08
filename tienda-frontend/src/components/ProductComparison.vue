<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Comparar Productos ({{ items.length }}/3)
          </h2>
          <div class="flex items-center gap-4">
            <Button @click="$emit('clear')" variant="outline" size="sm">Limpiar todo</Button>
            <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl">✕</button>
          </div>
        </div>

        <div v-if="items.length > 0" class="flex items-center gap-4 flex-wrap">
          <span class="font-semibold text-gray-700 dark:text-gray-200">Comparando:</span>
          <div class="flex gap-2 flex-wrap">
            <div v-for="item in items" :key="item.id" class="flex items-center bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full text-sm">
              <span>{{ item.name }}</span>
              <button @click="$emit('remove', item.id)" class="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800">✕</button>
            </div>
          </div>
          <Button @click="$emit('navigate', items[0].id)" variant="primary" size="sm" class="ml-auto">Ver Detalle</Button>
        </div>
      </div>

      <div v-if="items.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">⚖️</div>
        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">No hay productos para comparar</h3>
        <p class="text-gray-500 dark:text-gray-400">Agrega productos usando el botón de comparación en las tarjetas</p>
      </div>

      <div v-else class="overflow-x-auto p-6">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200 dark:border-gray-700">
              <th class="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">Característica</th>
              <th v-for="product in items" :key="product.id" class="text-center p-4 min-w-[200px]">
                <div class="flex flex-col items-center">
                  <img
                    :src="getProductImage(product.name, product.category, product.imageUrl)"
                    :alt="product.name"
                    class="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                    loading="lazy"
                  />
                  <h4 class="font-semibold text-sm text-gray-800 dark:text-gray-100">{{ product.name }}</h4>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <td class="p-4 font-medium text-gray-700 dark:text-gray-300">Precio</td>
              <td v-for="product in items" :key="product.id" class="text-center p-4">
                <span class="text-xl font-bold text-purple-600 dark:text-purple-400">S/ {{ Number(product.price).toFixed(2) }}</span>
              </td>
            </tr>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <td class="p-4 font-medium text-gray-700 dark:text-gray-300">Marca</td>
              <td v-for="product in items" :key="product.id" class="text-center p-4 text-gray-600 dark:text-gray-400">{{ product.brand || 'N/A' }}</td>
            </tr>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <td class="p-4 font-medium text-gray-700 dark:text-gray-300">Categoría</td>
              <td v-for="product in items" :key="product.id" class="text-center p-4 text-gray-600 dark:text-gray-400 capitalize">{{ product.category }}</td>
            </tr>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <td class="p-4 font-medium text-gray-700 dark:text-gray-300">Stock</td>
              <td v-for="product in items" :key="product.id" class="text-center p-4">
                <span :class="product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  {{ product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock' }}
                </span>
              </td>
            </tr>
            <tr class="border-b border-gray-100 dark:border-gray-800">
              <td class="p-4 font-medium text-gray-700 dark:text-gray-300">Calificación</td>
              <td v-for="product in items" :key="product.id" class="text-center p-4">
                <div class="flex justify-center items-center gap-1">
                  <span class="text-yellow-400">★</span>
                  <span>{{ Number(product.averageRating || product.rating || 0).toFixed(1) }}</span>
                  <span v-if="product.reviewCount" class="text-gray-500 text-sm">({{ product.reviewCount }})</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="p-4 font-medium text-gray-700 dark:text-gray-300">Acciones</td>
              <td v-for="product in items" :key="product.id" class="text-center p-4">
                <div class="flex flex-col gap-2">
                  <Button @click="$emit('navigate', product.id)" size="sm" class="w-full">Ver Detalles</Button>
                  <Button @click="$emit('remove', product.id)" variant="danger" size="sm" class="w-full">Quitar</Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '../types'
import Button from '../components/ui/Button.vue'
import { getProductImage } from '../utils/productImages'

interface Props {
  items: Product[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  remove: [id: number]
  navigate: [id: number]
  clear: []
  close: []
}>()
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
</style>