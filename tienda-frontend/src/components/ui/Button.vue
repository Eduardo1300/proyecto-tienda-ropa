<template>
  <button
    :type="type"
    @click="handleClick"
    :disabled="disabled || loading"
    :class="computedClasses"
  >
    <span v-if="loading" class="flex items-center justify-center gap-2">
      <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span>Cargando...</span>
    </span>
    <span v-else class="flex items-center justify-center gap-2">
      <span v-if="icon" class="mr-2">{{ icon }}</span>
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  icon?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  className: '',
  type: 'button',
  icon: ''
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95'

const variantClasses: Record<string, string> = {
  primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-purple-500',
  secondary: 'bg-gray-700 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl focus:ring-gray-500 dark:bg-gray-600 dark:hover:bg-gray-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500',
  success: 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500',
  outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white focus:ring-purple-500 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-600',
  ghost: 'text-purple-600 hover:bg-purple-100/20 focus:ring-purple-500 dark:text-purple-400 dark:hover:bg-purple-900/20'
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg'
}

const computedClasses = computed(() => {
  const widthClass = props.fullWidth ? 'w-full' : ''
  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]} ${widthClass} ${props.className}`
})
</script>