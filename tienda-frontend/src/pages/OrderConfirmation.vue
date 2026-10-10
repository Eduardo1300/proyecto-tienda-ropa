<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="max-w-3xl mx-auto relative z-10">
      <div class="text-center animate-fade-in-up">
        <div class="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl shadow-green-500/50 animate-scale-in">
          ✅
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-white mb-4">
          ¡Pedido Confirmado! 🎉
        </h1>
        <p class="text-xl text-gray-300 mb-8">
          Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
        </p>
      </div>

      <Card v-if="orderData" class="bg-white/10 backdrop-blur-md border border-white/20 animate-fade-in-up" style="animation-delay: 0.2s;">
        <div class="mb-6 p-6 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl text-center">
          <p class="text-gray-300 mb-1">Número de Pedido</p>
          <p class="text-3xl font-bold text-white font-mono">{{ orderData.orderNumber }}</p>
          <p class="text-purple-300 text-sm mt-2">Realizado el {{ formatDate(orderData.createdAt) }}</p>
        </div>

        <div class="space-y-4 mb-6">
          <div v-for="item in orderData.items" :key="item.productId" class="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <div class="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center text-3xl">
              📦
            </div>
            <div class="flex-1">
              <h4 class="font-bold text-white">{{ item.name || `Producto #${item.productId}` }}</h4>
              <p class="text-gray-400 text-sm">Cantidad: {{ item.quantity }}</p>
            </div>
            <p class="text-white font-bold">S/ {{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        </div>

        <div class="border-t border-white/20 pt-6 space-y-3">
          <div class="flex justify-between text-gray-300">
            <span>Subtotal</span>
            <span>S/ {{ (Number(orderData.total) / 1.15).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-300">
            <span>Impuestos (15%)</span>
            <span>S/ {{ (Number(orderData.total) * 0.15 / 1.15).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-300">
            <span>Envío</span>
            <Badge variant="success" icon="🚚">GRATIS</Badge>
          </div>
          <div class="flex justify-between text-2xl font-bold text-white pt-3 border-t border-white/20">
            <span>Total</span>
            <span class="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">S/ {{ Number(orderData.total).toFixed(2) }}</span>
          </div>
        </div>

        <div class="mt-6 p-4 bg-green-500/20 border border-green-400/30 rounded-xl">
          <p class="text-green-300 text-center">
            📧 Se ha enviado la confirmación a tu email con los detalles del envío.
          </p>
        </div>
      </Card>

      <div class="mt-8 grid grid-cols-2 gap-4 animate-fade-in-up" style="animation-delay: 0.4s;">
        <RouterLink to="/orders">
          <Button variant="outline" full-width class="py-3">
            📋 Ver Mis Pedidos
          </Button>
        </RouterLink>
        <RouterLink to="/products">
          <Button full-width class="py-3 bg-gradient-to-r from-purple-600 to-pink-600">
            🛍️ Seguir Comprando
          </Button>
        </RouterLink>
      </div>

      <div class="mt-8 text-center animate-fade-in-up" style="animation-delay: 0.6s;">
        <p class="text-gray-400">
          ¿Necesitas ayuda? 
          <RouterLink to="/profile" class="text-purple-400 hover:text-purple-300 font-medium">Ver tu perfil</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Card, Badge, RouterLink } from '../components/ui'

const router = useRouter()
const orderData = ref<any>(null)

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

onMounted(() => {
  const saved = localStorage.getItem('lastOrder')
  if (saved) {
    try {
      orderData.value = JSON.parse(saved)
    } catch {
      orderData.value = null
    }
  }
  
  if (!orderData.value) {
    router.push('/products')
  }
})
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; }

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
.animate-scale-in { animation: scaleIn 0.4s ease-out forwards; }
</style>