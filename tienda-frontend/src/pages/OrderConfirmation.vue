<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-3xl mx-auto px-4 relative z-10">
      <div v-if="!orderData" class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-12 text-center">
        <div class="text-6xl mb-6">Orden</div>
        <h1 class="text-3xl font-bold text-white mb-4">No se encontro informacion de la orden</h1>
        <p class="text-gray-300 mb-8">Parece que no hay informacion de orden disponible</p>
        <RouterLink to="/" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold">
          Ir al Inicio
        </RouterLink>
      </div>

      <template v-else>
        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 mb-8 text-center">
          <div class="text-8xl mb-6 animate-bounce">Exito</div>
          <h1 class="text-4xl font-bold text-green-400 mb-4">Orden Confirmada!</h1>
          <p class="text-xl text-gray-300 mb-6">Gracias por tu compra. Hemos recibido tu orden y esta siendo procesada.</p>
          
          <div class="bg-green-500/10 border border-green-400/30 rounded-xl p-6 mb-6">
            <div class="text-lg font-semibold text-green-400 mb-2">
              Numero de Orden: <span class="font-mono text-white">{{ orderData.orderNumber }}</span>
            </div>
            <div class="text-green-300">
              Total: <span class="text-xl font-bold text-white">S/ {{ Number(orderData.total).toFixed(2) }}</span>
            </div>
          </div>

          <div v-if="orderData.orderId">
          <div class="text-sm text-gray-400">
            Tu pedido ha sido procesado correctamente. Puedes verificar el estado en la seccion de pedidos.
          </div>
        </div>
        <div v-else class="text-sm text-gray-400">
            Recibiras un email de confirmacion pronto.
        </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-white mb-6">Detalles de la Orden</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-lg font-semibold text-white mb-4">Informacion del Pedido</h3>
              <div class="space-y-2 text-gray-300">
                <p><strong>Orden:</strong> {{ orderData.orderNumber }}</p>
                <p><strong>Fecha:</strong> {{ new Date(orderData.createdAt).toLocaleDateString() }}</p>
                <p><strong>Items:</strong> {{ orderData.items?.length || 0 }} productos</p>
              </div>
            </div>

            <div class="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 class="text-lg font-semibold text-white mb-4">Tiempo de Entrega</h3>
              <div class="space-y-2 text-gray-300">
                <p><strong>Estimado:</strong> 3-5 dias habiles</p>
                <p><strong>Envio:</strong> Incluido</p>
                <p><strong>Seguimiento:</strong> Via email</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-white mb-6">Proximos Pasos</h2>
          
          <div class="space-y-4">
            <div class="flex items-start space-x-4">
              <div class="bg-purple-500/30 rounded-full p-2 mt-1 border border-purple-400/50">
                <span class="text-purple-300 text-xl">1</span>
              </div>
              <div>
                <h3 class="font-semibold text-white">Confirmacion por Email</h3>
                <p class="text-gray-300">Recibiras un email con los detalles de tu orden en los proximos minutos.</p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="bg-purple-500/30 rounded-full p-2 mt-1 border border-purple-400/50">
                <span class="text-purple-300 text-xl">2</span>
              </div>
              <div>
                <h3 class="font-semibold text-white">Procesamiento</h3>
                <p class="text-gray-300">Preparamos tu pedido y lo empacamos con cuidado (1-2 dias habiles).</p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="bg-purple-500/30 rounded-full p-2 mt-1 border border-purple-400/50">
                <span class="text-purple-300 text-xl">3</span>
              </div>
              <div>
                <h3 class="font-semibold text-white">Envío</h3>
                <p class="text-gray-300">Tu pedido sale de nuestro almacén y te enviamos el código de seguimiento.</p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div class="bg-purple-500/30 rounded-full p-2 mt-1 border border-purple-400/50">
                <span class="text-purple-300 text-xl">4</span>
              </div>
              <div>
                <h3 class="font-semibold text-white">Entrega</h3>
                <p class="text-gray-300">Recibes tu pedido en la direccion indicada (3-5 dias habiles).</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Soporte y Contacto</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center p-4 bg-gray-50 rounded-xl">
              <div class="text-3xl mb-2">Email</div>
              <h3 class="font-semibold text-gray-800 mb-2">Email</h3>
              <p class="text-sm text-gray-600">soporte@tienda.com</p>
            </div>

            <div class="text-center p-4 bg-gray-50 rounded-xl">
              <div class="text-3xl mb-2">Tel</div>
              <h3 class="font-semibold text-gray-800 mb-2">Telefono</h3>
              <p class="text-sm text-gray-600">+51 999 888 777</p>
            </div>

            <div class="text-center p-4 bg-gray-50 rounded-xl">
              <div class="text-3xl mb-2">Chat</div>
              <h3 class="font-semibold text-gray-800 mb-2">Chat</h3>
              <p class="text-sm text-gray-600">Lun-Vie 9am-6pm</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink to="/products" class="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors font-semibold text-center">
            Seguir Comprando
          </RouterLink>
          
          <RouterLink to="/orders" class="bg-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-colors font-semibold text-center">
            Ver Mis Ordenes
          </RouterLink>
          
          <RouterLink to="/" class="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-center">
            Ir al Inicio
          </RouterLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const orderData = ref<any>(null)

onMounted(() => {
  const savedOrder = localStorage.getItem('lastOrder')
  if (savedOrder) {
    try {
      orderData.value = JSON.parse(savedOrder)
      localStorage.removeItem('lastOrder')
    } catch (e) {
      console.error('Error parsing order data:', e)
    }
  }
})
</script>