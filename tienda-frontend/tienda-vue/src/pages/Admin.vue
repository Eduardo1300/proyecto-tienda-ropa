<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-12 relative z-10">
      <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl mb-12">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div class="flex items-center gap-6">
            <span class="text-6xl drop-shadow-lg">⚙️</span>
            <div>
              <h1 class="text-5xl font-extrabold drop-shadow-md">Panel de Administración</h1>
              <p class="text-blue-100 text-lg mt-2">Gestiona tu tienda en un solo lugar</p>
            </div>
          </div>
          <div class="flex gap-3 flex-wrap">
            <RouterLink to="/inventory" class="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all">
              📦 Inventario
            </RouterLink>
            <RouterLink to="/analytics" class="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-all">
              📊 Analytics
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Productos</p>
              <p class="text-3xl font-bold text-indigo-400">{{ stats.products }}</p>
            </div>
            <div class="text-4xl">{{ String.fromCodePoint(0x1F4E6) }}</div>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Pedidos</p>
              <p class="text-3xl font-bold text-green-400">{{ stats.orders }}</p>
            </div>
            <div class="text-4xl">{{ String.fromCodePoint(0x1F6D2) }}</div>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Usuarios</p>
              <p class="text-3xl font-bold text-purple-400">{{ stats.users }}</p>
            </div>
            <div class="text-4xl">{{ String.fromCodePoint(0x1F465) }}</div>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-400 text-sm">Ingresos</p>
              <p class="text-3xl font-bold text-yellow-400">${{ stats.revenue.toFixed(2) }}</p>
            </div>
            <div class="text-4xl">{{ String.fromCodePoint(0x1F4B0) }}</div>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-6">
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>📋</span>Pedidos Recientes
          </h2>
          <div v-if="recentOrders.length > 0" class="space-y-3">
            <div v-for="order in recentOrders" :key="order.id" class="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-white font-semibold">{{ order.orderNumber }}</span>
                  <p class="text-gray-400 text-sm">{{ new Date(order.createdAt).toLocaleDateString('es-ES') }}</p>
                </div>
                <div class="text-right">
                  <span class="text-indigo-400 font-bold">${{ Number(order.total).toFixed(2) }}</span>
                  <p class="text-gray-400 text-xs">{{ order.status }}</p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-400">No hay pedidos recientes</div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-2xl">
          <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <span>⚠️</span>Stock Bajo
          </h2>
          <div v-if="lowStockProducts.length > 0" class="space-y-3">
            <div v-for="product in lowStockProducts" :key="product.id" class="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-white font-semibold">{{ product.name }}</span>
                  <p class="text-gray-400 text-sm">{{ product.sku }}</p>
                </div>
                <div class="text-right">
                  <span class="text-red-400 font-bold">{{ product.stock }} unidades</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-8 text-gray-400">No hay productos con stock bajo</div>
        </div>
      </div>

      <div class="mt-8 flex gap-4">
        <RouterLink to="/loyalty" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all">
          🏆 Programa de Lealtad
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productsAPI, ordersAPI, usersAPI } from '../api'

const stats = ref({ products: 0, orders: 0, users: 0, revenue: 0 })
const recentOrders = ref<any[]>([])
const lowStockProducts = ref<any[]>([])

onMounted(async () => {
  try {
    const [productsRes, ordersRes, usersRes] = await Promise.all([
      productsAPI.getAll(),
      ordersAPI.getAll(),
      usersAPI.getAll().catch(() => ({ data: [] }))
    ])
    
    const products = productsRes.data || []
    const orders = ordersRes.data || []
    const users = usersRes.data || []
    
    stats.value = {
      products: products.length,
      orders: orders.length,
      users: users.length,
      revenue: orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0)
    }
    
    recentOrders.value = orders.slice(0, 5)
    lowStockProducts.value = products.filter((p: any) => p.stock < 10).slice(0, 5)
  } catch (err) {
    console.error('Error loading admin data:', err)
  }
})
</script>