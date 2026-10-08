<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-white text-lg flex items-center gap-2">
        <span class="text-xl">⚙️</span> Filtros
      </h3>
      <button @click="$emit('clear')" class="text-purple-400 text-sm hover:text-purple-300 hover:scale-105 transition-transform">Limpiar</button>
    </div>

    <!-- Categoría -->
    <div class="mb-4">
      <h4 class="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
        <span>📁</span> Categoría
      </h4>
      <div class="space-y-1.5">
        <label v-for="cat in filterOptions.categories" :key="cat" class="flex items-center gap-2 cursor-pointer group">
          <input
            type="radio"
            :value="cat"
            v-model="filters.category"
            class="w-4 h-4 text-purple-600 bg-white/10 border-white/30 accent-purple-500"
          />
          <span class="text-gray-300 text-sm capitalize group-hover:text-white transition-colors">{{ cat }}</span>
        </label>
      </div>
    </div>

    <!-- Precio -->
    <div class="mb-4">
      <h4 class="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
        <span>💰</span> Precio
      </h4>
      <input
        type="range"
        v-model="filters.priceRange"
        :min="filterOptions.priceRange[0]"
        :max="filterOptions.priceRange[1]"
        class="w-full accent-purple-500"
      />
      <div class="flex justify-between text-gray-400 text-xs mt-1">
        <span>S/ {{ filterOptions.priceRange[0] }}</span>
        <span class="text-purple-400 font-semibold">S/ {{ filters.priceRange }}</span>
      </div>
    </div>

    <!-- Disponibilidad -->
    <div>
      <h4 class="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
        <span>📦</span> Disponibilidad
      </h4>
      <label class="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          v-model="filters.inStock"
          class="w-4 h-4 text-purple-600 bg-white/10 border-white/30 rounded accent-purple-500"
        />
        <span class="text-gray-300 text-sm group-hover:text-white transition-colors">Solo disponibles</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface FilterOptions {
  categories: string[]
  priceRange: [number, number]
}

interface Filters {
  category: string
  priceRange: number
  inStock: boolean
}

const props = defineProps<{
  filters: Filters
  filterOptions: FilterOptions
}>()

const emit = defineEmits<{
  update: [filters: Filters]
  clear: []
}>()

const clearFilters = () => {
  emit('clear')
}
</script>

<style scoped>
input[type="radio"]:checked,
input[type="checkbox"]:checked {
  background-color: #a855f7;
  border-color: #a855f7;
}
</style>