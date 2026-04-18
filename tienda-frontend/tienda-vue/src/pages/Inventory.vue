<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-2 md:px-8 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="mb-12 relative z-10">
      <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div class="flex items-center gap-4">
            <span class="text-6xl drop-shadow-lg">📦</span>
            <div>
              <h1 class="text-5xl font-extrabold drop-shadow-md">Gestión de Inventario</h1>
              <p class="text-blue-100 text-lg mt-2">Control Total de tu Stock en Tiempo Real</p>
            </div>
          </div>
          <div class="flex gap-3 flex-wrap">
            <button @click="activeTab = 'overview'" :class="activeTab === 'overview' ? 'bg-white text-blue-600 shadow-lg' : 'bg-blue-500/30 text-white hover:bg-blue-500/50'" class="px-4 py-2 rounded-lg font-semibold transition-all duration-200">
              📊 Resumen
            </button>
            <button @click="activeTab = 'alerts'" :class="activeTab === 'alerts' ? 'bg-white text-blue-600 shadow-lg' : 'bg-blue-500/30 text-white hover:bg-blue-500/50'" class="px-4 py-2 rounded-lg font-semibold transition-all duration-200">
              🚨 Alertas
            </button>
            <button @click="activeTab = 'reports'" :class="activeTab === 'reports' ? 'bg-white text-blue-600 shadow-lg' : 'bg-blue-500/30 text-white hover:bg-blue-500/50'" class="px-4 py-2 rounded-lg font-semibold transition-all duration-200">
              📋 Reportes
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="transition-all duration-300 relative z-10 max-w-7xl mx-auto px-4">
      <div v-if="activeTab === 'overview'" class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-semibold text-blue-100 flex items-center gap-2"><span>💰</span>Valor Total</h2>
              <span class="text-4xl opacity-80">💰</span>
            </div>
            <div class="text-4xl font-extrabold mb-2">${{ inventoryValue.toFixed(2) }}</div>
            <p class="text-blue-100 text-sm">Valor del inventario</p>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-semibold text-green-100 flex items-center gap-2"><span>📦</span>Productos</h2>
              <span class="text-4xl opacity-80">📦</span>
            </div>
            <div class="text-4xl font-extrabold mb-2">{{ products.length }}</div>
            <p class="text-green-100 text-sm">En inventario</p>
          </div>

          <div class="bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-2xl p-6 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-semibold text-red-100 flex items-center gap-2"><span>🚨</span>Alertas</h2>
              <span class="text-4xl opacity-80">🚨</span>
            </div>
            <div class="text-4xl font-extrabold mb-2">{{ alerts.length }}</div>
            <p class="text-red-100 text-sm">Requieren atención</p>
          </div>

          <div class="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-6 shadow-xl">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-sm font-semibold text-amber-100 flex items-center gap-2"><span>⚠️</span>Stock Bajo</h2>
              <span class="text-4xl opacity-80">⚠️</span>
            </div>
            <div class="text-4xl font-extrabold mb-2">{{ lowStockProducts.length }}</div>
            <p class="text-amber-100 text-sm">Productos bajo mínimo</p>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2"><span>🚨</span>Alertas Recientes</h2>
          <div v-if="alerts.length > 0" class="space-y-2 max-h-[300px] overflow-y-auto">
            <div v-for="alert in alerts.slice(0, 8)" :key="alert.id" class="p-3 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"> 
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span>{{ getAlertIcon(alert.type) }}</span>
                  <div class="flex-1">
                    <div class="font-semibold text-white text-sm">{{ alert.message }}</div>
                    <div class="text-xs text-gray-400">{{ alert.product?.name || 'Producto' }} • {{ new Date(alert.createdAt).toLocaleDateString('es-ES') }}</div>
                  </div>
                </div>
                <span :class="getPriorityColor(alert.priority)" class="px-2 py-1 text-xs font-bold rounded">
                  {{ alert.priority }}
                </span>
              </div>
            </div>
          </div>
          <p v-else class="text-center text-gray-400 py-8">✅ No hay alertas - ¡Tu inventario está bajo control!</p>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2"><span>📦</span>Recomendaciones de Reorden</h2>
          <div v-if="lowStockProducts.length > 0" class="space-y-3">
            <div v-for="(product, i) in lowStockProducts.slice(0, 5)" :key="product.id" class="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <div class="flex items-center justify-between mb-2">
                <div class="font-semibold text-gray-800">{{ product.name }}</div>
                <span class="text-xs font-bold bg-yellow-200 text-yellow-800 px-2 py-1 rounded">URGENTE</span>
              </div>
              <div class="text-sm text-gray-700">
                <div>Stock Actual: <span class="font-bold">{{ product.stock || 0 }} unidades</span></div>
              </div>
            </div>
          </div>
          <p v-else class="text-center text-gray-400 py-8">No hay productos que requieran reorden</p>
        </div>
      </div>

      <div v-if="activeTab === 'alerts'" class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
        <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2"><span>🚨</span>Todas las Alertas</h2>
        <div v-if="alerts.length > 0" class="space-y-3">
          <div v-for="alert in alerts" :key="alert.id" class="p-4 border border-white/10 rounded-lg hover:shadow-md transition-shadow"> 
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3 flex-1">
                <span class="text-2xl">{{ getAlertIcon(alert.type) }}</span>
                <div>
                  <div class="font-semibold text-white">{{ alert.message }}</div>
                  <div class="text-sm text-gray-400">{{ alert.product?.name || 'Producto' }} • {{ new Date(alert.createdAt).toLocaleDateString('es-ES') }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span :class="getPriorityColor(alert.priority)" class="px-3 py-1 rounded-lg text-xs font-bold">
                  {{ alert.priority }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-center text-gray-400 py-12 text-lg">✅ No hay alertas disponibles - ¡Tu inventario está bajo control!</p>
      </div>

      <div v-if="activeTab === 'reports'" class="space-y-8">
        <div class="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-md">
          <h2 class="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2"><span>⚠️</span>Productos con Stock Bajo</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-amber-100">
                  <th class="text-left py-3 px-4 font-semibold">Producto</th>
                  <th class="text-left py-3 px-4 font-semibold">SKU</th>
                  <th class="text-right py-3 px-4 font-semibold">Stock</th>
                  <th class="text-center py-3 px-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="lowStockProducts.length > 0" v-for="product in lowStockProducts" :key="product.id" class="border-b border-gray-100 hover:bg-yellow-50 transition-all duration-150">
                  <td class="py-3 px-4 font-medium">{{ product.name }}</td>
                  <td class="py-3 px-4 text-gray-600">{{ product.sku }}</td>
                  <td class="py-3 px-4 text-right">{{ product.stock || 0 }}</td>
                  <td class="py-3 px-4 text-center">
                    <span class="bg-red-100 text-red-800 font-bold px-2 py-1 rounded-xl">Stock Bajo</span>
                  </td>
                </tr>
                <tr v-else>
                  <td colspan="4" class="py-8 text-center text-gray-500">No hay productos con stock bajo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productsAPI, inventoryAPI } from '../api'

const activeTab = ref('overview')
const products = ref<any[]>([])
const alerts = ref<any[]>([])
const lowStockProducts = ref<any[]>([])
const inventoryValue = ref(0)

const getPriorityColor = (severity: string) => {
  const colors: Record<string, string> = {
    CRITICAL: 'bg-red-500/30 text-red-200 border border-red-400/50',
    HIGH: 'bg-orange-500/30 text-orange-200 border border-orange-400/50',
    MEDIUM: 'bg-blue-500/30 text-blue-200 border border-blue-400/50',
    LOW: 'bg-green-500/30 text-green-200 border border-green-400/50',
  }
  return colors[severity] || 'bg-gray-500/30 text-gray-200 border border-gray-400/50'
}

const getAlertIcon = (type: string) => {
  const icons: Record<string, string> = {
    LOW_STOCK: '🔴',
    OUT_OF_STOCK: '🚨',
    EXPIRING_SOON: '⏰',
    EXPIRED: '❌',
    REORDER_POINT: '📦',
    OVERSTOCK: '📈',
  }
  return icons[type] || '⚠️'
}

onMounted(async () => {
  try {
    const productsRes = await productsAPI.getAll()
    products.value = productsRes.data || []
    
    lowStockProducts.value = products.value.filter((p: any) => p.stock < 10)
    inventoryValue.value = products.value.reduce((sum: number, p: any) => sum + (Number(p.price) * (p.stock || 0)), 0)
    
    const alertsRes = await inventoryAPI.getAlerts().catch(() => ({ data: [] }))
    alerts.value = alertsRes.data || []
  } catch (err) {
    console.error('Error loading inventory:', err)
  }
})
</script>