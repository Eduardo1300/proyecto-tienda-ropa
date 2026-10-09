<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="onClose">
      <div :class="['bg-gray-900 dark:bg-gray-900 rounded-2xl shadow-2xl w-full transform transition-all duration-300 scale-100 border border-gray-700/50', sizeClasses[size]]">
        <div v-if="title || showCloseButton" class="flex items-center justify-between p-6 border-b border-gray-700/50">
          <h2 v-if="title" class="text-2xl font-bold text-white">{{ title }}</h2>
          <button v-if="showCloseButton" @click="onClose" class="text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-800 rounded-lg">
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