<template>
  <span :class="computedClasses">
    <span v-if="icon" class="mr-1">{{ icon }}</span>
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  icon?: string
  pulse?: boolean
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  size: 'md',
  className: '',
  icon: '',
  pulse: false
})

const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200'

const variantClasses: Record<string, string> = {
  default: 'bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  primary: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  secondary: 'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-700/20 dark:text-green-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-700/20 dark:text-amber-300',
  danger: 'bg-red-100 text-red-800 dark:bg-red-700/20 dark:text-red-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-700/20 dark:text-blue-300'
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base'
}

const computedClasses = computed(() => {
  const pulseClass = props.pulse ? 'animate-pulse' : ''
  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]} ${pulseClass} ${props.className}`
})
</script>