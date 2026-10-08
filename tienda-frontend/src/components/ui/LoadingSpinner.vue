<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <svg class="animate-spin" :class="sizeClass" fill="none" viewBox="0 0 24 24" :style="{ color: color }">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
    <span v-if="text" class="ml-3 text-gray-600 dark:text-gray-300">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  text?: string
  containerClass?: string
}

const props = withDefaults(defineProps<LoadingSpinnerProps>(), {
  size: 'md',
  color: '#8b5cf6',
  text: '',
  containerClass: ''
})

const sizeClass = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  return sizes[props.size] || sizes.md
})
</script>