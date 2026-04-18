<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-10 relative z-10">
      <div class="mb-10 animate-fade-in-up">
        <h1 class="text-4xl font-black text-white mb-2 flex items-center gap-3">
          🎁 Programa de <span class="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">Lealtad</span>
        </h1>
        <p class="text-gray-300 text-lg">Gana puntos con cada compra y disfruta de beneficios exclusivos</p>
      </div>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="i in 3" :key="i" class="animate-pulse p-8 bg-white/10 rounded-2xl">
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            <div class="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-2xl p-8 shadow-xl">
            <div class="flex items-center gap-4 mb-4">
              <div class="text-5xl">{{ String.fromCodePoint(0x2B50) }}</div>
              <h2 class="text-lg font-semibold">Mis Puntos</h2>
            </div>
            <div class="text-4xl font-bold mb-2">{{ program?.availablePoints?.toLocaleString() || 0 }}</div>
            <p class="text-base text-purple-100">Puntos disponibles</p>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-2xl p-8 shadow-xl">
            <div class="flex items-center gap-4 mb-4">
              <div class="text-5xl">{{ String.fromCodePoint(0x1F3C5) }}</div>
              <h2 class="text-lg font-semibold">Nivel Actual</h2>
            </div>
            <div class="text-3xl font-bold mb-2">{{ program?.tier || 'Bronze' }}</div>
            <p class="text-base text-green-100">¡Sigue acumulando puntos!</p>
          </div>

          <div class="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl p-8 shadow-xl">
            <div class="flex items-center gap-4 mb-4">
              <div class="text-5xl">{{ String.fromCodePoint(0x1F389) }}</div>
              <h2 class="text-lg font-semibold">Puntos Totales</h2>
            </div>
            <div class="text-4xl font-bold mb-2">{{ program?.totalPoints?.toLocaleString() || 0 }}</div>
            <p class="text-base text-yellow-100">Ganados hasta ahora</p>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-10 shadow-lg">
          <h2 class="text-2xl font-bold mb-6 text-white flex items-center gap-2">🎁 Canjear Puntos</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="border border-purple-500/30 rounded-xl p-6 text-center bg-white/5 backdrop-blur-sm">
              <div class="text-xl font-semibold mb-2 text-white">Descuento 5%</div>
              <div class="text-base text-gray-300 mb-4">500 puntos</div>
              <button @click="handleRedeem(500, 'DISCOUNT')" :disabled="!program || (program.availablePoints || 0) < 500" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed font-bold">
                Canjear
              </button>
            </div>
            <div class="border border-purple-500/30 rounded-xl p-6 text-center bg-white/5 backdrop-blur-sm">
              <div class="text-xl font-semibold mb-2 text-white">Descuento 10%</div>
              <div class="text-base text-gray-300 mb-4">1,000 puntos</div>
              <button @click="handleRedeem(1000, 'DISCOUNT')" :disabled="!program || (program.availablePoints || 0) < 1000" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed font-bold">
                Canjear
              </button>
            </div>
            <div class="border border-purple-500/30 rounded-xl p-6 text-center bg-white/5 backdrop-blur-sm">
              <div class="text-xl font-semibold mb-2 text-white">Envío Gratis</div>
              <div class="text-base text-gray-300 mb-4">200 puntos</div>
              <button @click="handleRedeem(200, 'SHIPPING')" :disabled="!program || (program.availablePoints || 0) < 200" class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed font-bold">
                Canjear
              </button>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-8">
            <h2 class="text-2xl font-bold mb-6 text-white flex items-center gap-2">📜 Historial de Transacciones</h2>
            <div class="space-y-3 max-h-80 overflow-y-auto">
              <div v-if="transactions.length > 0" v-for="(transaction, index) in transactions" :key="index" class="flex justify-between items-center py-4 border-b border-white/10">
                <div>
                  <div class="text-base font-medium text-white">{{ transaction.description }}</div>
                  <div class="text-xs text-gray-400">{{ new Date(transaction.createdAt).toLocaleDateString('es-ES') }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <span :class="transaction.type === 'EARNED' ? 'bg-green-500/30 text-green-300 border border-green-400/30' : 'bg-red-500/30 text-red-300 border border-red-400/30'" class="px-2 py-1 rounded-lg text-xs font-bold">
                    {{ transaction.type === 'EARNED' ? '+' : '-' }}{{ transaction.points }}
                  </span>
                  <span class="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded-lg">{{ transaction.type }}</span>
                </div>
              </div>
              <p v-else class="text-center text-gray-400 py-8">No hay transacciones disponibles</p>
            </div>
          </div>

          <div class="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl p-8">
            <h2 class="text-2xl font-bold mb-6 text-white flex items-center gap-2">🏆 Tabla de Líderes</h2>
            <div class="space-y-3 max-h-80 overflow-y-auto">
              <div v-if="leaderboard.length > 0" v-for="(user, index) in leaderboard" :key="index" class="flex justify-between items-center py-4 border-b border-white/10">
                <div class="flex items-center gap-3">
                  <div :class="index === 0 ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/30' : index === 1 ? 'bg-gray-400/30 text-gray-300 border border-gray-400/30' : index === 2 ? 'bg-orange-500/30 text-orange-300 border border-orange-400/30' : 'bg-blue-500/30 text-blue-300 border border-blue-400/30'" class="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <div class="text-base font-medium text-white">Usuario {{ index + 1 }}</div>
                    <div class="text-xs text-gray-400">{{ user.tier || 'Bronze' }}</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-base font-bold text-white">{{ (user.currentPoints || 0).toLocaleString() }}</div>
                  <div class="text-xs text-gray-400">puntos</div>
                </div>
              </div>
              <p v-else class="text-center text-gray-400 py-8">No hay datos de leaderboard disponibles</p>
            </div>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mt-10">
          <h2 class="text-2xl font-bold mb-6 text-white flex items-center gap-2">✨ ¿Cómo Ganar Puntos?</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105 transform">
              <div class="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-3xl">🛒</div>
              <h3 class="font-semibold mb-1 text-white">Compras</h3>
              <p class="text-base text-gray-400">1 punto por S/ 1</p>
            </div>
            <div class="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105 transform">
              <div class="w-16 h-16 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-3xl">⭐</div>
              <h3 class="font-semibold mb-1 text-white">Reseñas</h3>
              <p class="text-base text-gray-400">50 puntos por reseña</p>
            </div>
            <div class="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105 transform">
              <div class="w-16 h-16 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-3xl">🤝</div>
              <h3 class="font-semibold mb-1 text-white">Referidos</h3>
              <p class="text-base text-gray-400">100 puntos por referido</p>
            </div>
            <div class="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105 transform">
              <div class="w-16 h-16 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-xl flex items-center justify-center mx-auto mb-3 text-3xl">🎂</div>
              <h3 class="font-semibold mb-1 text-white">Cumpleaños</h3>
              <p class="text-base text-gray-400">200 puntos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loyaltyAPI } from '../api'

const program = ref<any>(null)
const transactions = ref<any[]>([])
const leaderboard = ref<any[]>([])
const loading = ref(true)

const handleRedeem = async (points: number, type: string) => {
  try {
    await loyaltyAPI.redeem(points, type)
    alert('¡Puntos canjeados exitosamente!')
    fetchData()
  } catch (err) {
    console.error('Error al canjear:', err)
  }
}

const fetchData = async () => {
  try {
    loading.value = true
    const [programRes, transactionsRes, leaderboardRes] = await Promise.all([
      loyaltyAPI.getProgram().catch(() => ({ data: { availablePoints: 0, totalPoints: 0, tier: 'Bronze' } })),
      loyaltyAPI.getTransactions().catch(() => ({ data: [] })),
      loyaltyAPI.getLeaderboard().catch(() => ({ data: [] }))
    ])
    
    program.value = programRes.data
    transactions.value = transactionsRes.data || []
    leaderboard.value = leaderboardRes.data || []
  } catch (err) {
    console.error('Error loading loyalty data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => { fetchData() })
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }
</style>