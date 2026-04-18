<template>
  <div :class="{ 'dark': isDarkMode }">
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useThemeStore } from './stores/theme'
import Header from './components/Header.vue'

const { isDarkMode } = useThemeStore()
</script>