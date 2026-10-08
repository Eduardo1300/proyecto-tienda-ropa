<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" @click.self="onClose">
      <div :class="['bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full transform transition-all duration-300 scale-100', sizeClasses[size]]">
        <div v-if="title || showCloseButton" class="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 v-if="title" class="text-2xl font-bold text-gray-800 dark:text-gray-100">{{ title }}</h2>
          <button v-if="showCloseButton" @click="onClose" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <slot />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ModalProps {
  isOpen: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  isOpen: false,
  title: '',
  size: 'md',
  showCloseButton: true
})

const emit = defineEmits<{
  close: []
}>()

const onClose = () => {
  emit('close')
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl'
}
</script>