<template>
  <div :class="computedClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface CardProps {
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  gradient?: boolean
}

const props = withDefaults(defineProps<CardProps>(), {
  className: '',
  padding: 'md',
  shadow: 'lg',
  rounded: 'xl',
  hover: false,
  gradient: false
})

const baseClasses = 'bg-white dark:bg-gray-800 transition-all duration-200'

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}

const shadowClasses: Record<string, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl'
}

const roundedClasses: Record<string, string> = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl'
}

const computedClasses = computed(() => {
  const hoverClass = props.hover ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''
  const gradientClass = props.gradient ? 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-900' : ''
  return [
    baseClasses,
    paddingClasses[props.padding],
    shadowClasses[props.shadow],
    roundedClasses[props.rounded],
    hoverClass,
    gradientClass,
    props.className
  ].filter(Boolean).join(' ')
})
</script>