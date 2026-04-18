<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-10 relative z-10">
      <div class="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl mb-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex items-center gap-6">
            <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-5xl shadow-lg">📈</div>
            <div>
              <h1 class="text-4xl font-bold mb-2">Analytics Dashboard</h1>
              <p class="text-purple-100 text-lg">Panel de análisis de la tienda</p>
            </div>
          </div>
          <div class="flex flex-col items-end gap-2">
            <span v-if="connectionTest" class="inline-flex items-center px-4 py-2 bg-green-500/20 text-green-100 text-base rounded-full">
              ✅ API Conectada - {{ connectionTest.message }}
            </span>
            <span v-else class="inline-flex items-center px-4 py-2 bg-red-500/20 text-red-100 text-base rounded-full">
              ❌ API No disponible
            </span>
            <span v-if="error" class="inline-flex items-center px-4 py-2 bg-yellow-500/20 text-yellow-100 text-base rounded-full">
              ⚠️ {{ error }}
            </span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div class="bg-gradient-to-br from-blue-500/30 to-indigo-500/30 border border-blue-400/30 text-white rounded-2xl p-8 shadow-xl backdrop-blur-sm">
          <div class="flex items-center gap-4 mb-4">
            <div class="text-5xl">{{ String.fromCodePoint(0x1F441) }}</div>
            <h3 class="text-lg font-semibold">Visitas Totales</h3>
          </div>
          <div class="text-4xl font-bold mb-2">{{ (data.overview?.totalPageViews || 0).toLocaleString() }}</div>
          <p class="text-base text-blue-200">Páginas vistas</p>
        </div>

        <div class="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl p-8 shadow-xl">
<div class="flex items-center gap-4 mb-4">
            <div class="text-5xl">{{ String.fromCodePoint(0x1F465) }}</div>
            <h3 class="text-lg font-semibold">Visitantes Unicos</h3>
          </div>
          <div class="text-4xl font-bold mb-2">{{ (data.overview?.uniqueVisitors || 0).toLocaleString() }}</div>
          <p class="text-base text-green-100">Usuarios únicos</p>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-8 shadow-xl">
          <div class="flex items-center gap-4 mb-4">
            <div class="text-5xl">{{ String.fromCodePoint(0x1F4B8) }}</div>
            <h3 class="text-lg font-semibold">Ventas Totales</h3>
          </div>
          <div class="text-4xl font-bold mb-2">${{ (data.overview?.totalRevenue || 0).toLocaleString() }}</div>
          <p class="text-base text-pink-100">{{ data.overview?.totalPurchases || 0 }} órdenes</p>
        </div>

        <div class="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl p-8 shadow-xl">
<div class="flex items-center gap-4 mb-4">
            <div class="text-5xl">{{ String.fromCodePoint(0x1F4CA) }}</div>
            <h3 class="text-lg font-semibold">Tasa de Conversion</h3>
          </div>
          <div class="text-4xl font-bold mb-2">{{ ((data.overview?.conversionRate || 0)).toFixed(1) }}%</div>
          <p class="text-base text-yellow-100">Conversión de visitas</p>
        </div>
      </div>

      <div class="bg-white/80 shadow-lg rounded-2xl p-8 mb-10">
        <h2 class="text-2xl font-bold mb-6 text-indigo-700 flex items-center gap-2">💰 Ingresos por Día</h2>
        <div v-if="data.revenue && data.revenue.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(day, index) in data.revenue" :key="index" class="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow">
            <div class="text-lg font-semibold text-indigo-700">{{ day.date }}</div>
            <div class="flex items-center gap-6">
              <span class="text-base text-gray-600">{{ day.orders }} órdenes</span>
              <span class="text-2xl font-bold text-indigo-900">${{ (day.revenue || 0).toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">No hay datos de ingresos disponibles</div>
      </div>

      <div class="bg-white/80 shadow-lg rounded-2xl p-8 mb-10">
        <h2 class="text-2xl font-bold mb-6 text-pink-700 flex items-center gap-2">🏆 Productos Más Vendidos</h2>
        <div v-if="data.topProducts && data.topProducts.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="(product, index) in data.topProducts" :key="index" class="flex justify-between items-center py-4 px-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl shadow">
            <div>
              <div class="text-lg font-semibold text-pink-700">Producto #{{ product.productId }}</div>
              <div class="text-xs text-gray-500">{{ product.views }} vistas</div>
            </div>
            <div class="flex items-center gap-6">
              <span class="text-base text-gray-600">{{ product.purchases }} ventas</span>
              <span class="text-2xl font-bold text-pink-900">${{ (product.revenue || 0).toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-8">No hay datos de productos disponibles</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const connectionTest = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const data = ref<any>({
  overview: { totalPageViews: 1234, uniqueVisitors: 567, totalPurchases: 89, totalRevenue: 4567.89, conversionRate: 15.7, averageOrderValue: 51.32, userRegistrations: 23 },
  revenue: [
    { date: '2025-09-02', revenue: 234.50, orders: 5 },
    { date: '2025-09-03', revenue: 456.78, orders: 8 },
    { date: '2025-09-04', revenue: 123.45, orders: 3 },
    { date: '2025-09-05', revenue: 678.90, orders: 12 },
    { date: '2025-09-06', revenue: 345.67, orders: 7 },
  ],
  topProducts: [
    { productId: 1, views: 234, revenue: 1200.50, purchases: 15 },
    { productId: 2, views: 189, revenue: 890.25, purchases: 12 },
    { productId: 3, views: 156, revenue: 675.00, purchases: 9 }
  ]
})

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const API_BASE_URL = 'https://proyecto-tienda-ropa.onrender.com'
    
    const testResponse = await fetch(`${API_BASE_URL}/analytics/test`).catch(() => null)
    if (testResponse?.ok) {
      connectionTest.value = await testResponse.json()
      
      if (token) {
        const endDate = new Date()
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - 30)
        
        const dashboardResponse = await fetch(`${API_BASE_URL}/analytics/dashboard?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        
        if (dashboardResponse.ok) {
          const response = await dashboardResponse.json()
          const dashboardData = response.data || response
          data.value = {
            overview: { ...data.value.overview, ...dashboardData.overview },
            revenue: (dashboardData.revenue || []).map((item: any) => ({ date: new Date(item.date).toISOString().split('T')[0], revenue: parseFloat(item.revenue) || 0, orders: parseInt(item.orders) || 0 })),
            topProducts: (dashboardData.overview?.topProducts || []).map((item: any) => ({ productId: item.productId, views: parseInt(item.views) || 0, purchases: item.purchases || 0, revenue: item.revenue || 0 }))
          }
        }
      }
    }
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>