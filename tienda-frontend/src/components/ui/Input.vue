<template>
  <div :class="fullWidth ? 'w-full' : ''">
    <label v-if="label" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-500 dark:text-red-400 ml-1">*</span>
    </label>
    <div class="relative">
      <div v-if="icon" class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
        {{ icon }}
      </div>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @change="$emit('change', $event)"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
      />
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
      <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'date' | 'number'
  placeholder?: string
  modelValue?: string
  disabled?: boolean
  required?: boolean
  className?: string
  label?: string
  error?: string
  icon?: string
  fullWidth?: boolean
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  placeholder: '',
  modelValue: '',
  disabled: false,
  required: false,
  className: '',
  label: '',
  error: '',
  icon: '',
  fullWidth: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [event: Event]
}>()

const baseClasses = 'border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-900 dark:text-white bg-white dark:bg-gray-800'

const inputClasses = computed(() => {
  const errorClasses = props.error ? 'border-red-500 dark:border-red-400 focus:ring-red-500' : ''
  const iconPadding = props.icon ? 'pl-12' : ''
  const widthClass = props.fullWidth ? 'w-full' : ''
  return `${baseClasses} ${errorClasses} ${iconPadding} ${widthClass} ${props.className}`
})
</script>