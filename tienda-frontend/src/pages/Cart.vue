<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-black text-white mb-4">
          🛒 Tu 
          <span class="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Carrito de Compras
          </span>
        </h1>
        <div v-if="totalItems > 0" class="text-xl text-gray-300">
          <span class="flex items-center justify-center gap-2">
            Tienes <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-2xl">{{ totalItems }}</span> 
            {{ totalItems === 1 ? ' producto' : ' productos' }} en tu carrito
          </span>
        </div>
        <p v-else class="text-xl text-gray-300">Tu carrito está vacío</p>
      </div>

      <div v-if="cart.length === 0" class="animate-fade-in-up">
        <Card class="text-center py-20 bg-white/10 backdrop-blur-md border border-white/20">
          <div class="text-9xl mb-8 animate-bounce" style="animation-duration: 2s;">🛒</div>
          <h2 class="text-4xl font-bold text-white mb-6">Tu carrito está listo para llenarse</h2>
          <p class="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">¡Descubre nuestros increíbles productos y encuentra algo que te encante! Tenemos las mejores ofertas esperándote.</p>
          <RouterLink to="/products">
            <Button variant="primary" size="lg" icon="🛍️" class="transform hover:scale-105 shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold">
              Explorar Productos
            </Button>
          </RouterLink>
          
          <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/50 hover:border-purple-400 transition-all">
              <div class="text-4xl mb-3">🚚</div>
              <h3 class="font-semibold text-white">Envío Gratis</h3>
              <p class="text-sm text-gray-300">En compras mayores a S/100</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/50 hover:border-purple-400 transition-all">
              <div class="text-4xl mb-3">🔒</div>
              <h3 class="font-semibold text-white">Compra Segura</h3>
              <p class="text-sm text-gray-300">Protección SSL garantizada</p>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/50 hover:border-purple-400 transition-all">
              <div class="text-4xl mb-3">↩️</div>
              <h3 class="font-semibold text-white">Devoluciones</h3>
              <p class="text-sm text-gray-300">30 días sin preguntas</p>
            </div>
          </div>
        </Card>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div class="xl:col-span-2">
            <Card class="space-y-6 bg-white/10 backdrop-blur-md border border-white/20">
              <div class="flex items-center justify-between border-b border-white/20 pb-4">
                <h2 class="text-3xl font-bold text-white flex items-center gap-3">
                  📦 Productos
                  <span class="text-2xl text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">{{ totalItems }}</span>
                </h2>
                <Button @click="clearCart" variant="danger" size="sm" icon="🗑️" class="bg-red-600/80 hover:bg-red-700 text-white">
                  Vaciar
                </Button>
              </div>
              
              <div class="space-y-4">
                <div v-for="item in cart" :key="item.id" class="group">
                  <Card class="hover:border-white/40 transition-all duration-300 border border-white/20 bg-white/5 backdrop-blur-sm">
                    <div class="flex items-center gap-6">
                      <div class="relative">
                        <img
                          :src="getProductImage(item.product?.name || 'Producto', item.product?.category || '', item.product?.imageUrl || '/placeholder.jpg')"
                          :alt="item.product?.name || 'Producto'"
                          class="w-24 h-24 object-cover rounded-xl shadow-md hover:scale-110 transition-transform"
                        />
                        <div class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                          {{ item.quantity }}
                        </div>
                      </div>
                      
                      <div class="flex-1">
                        <h3 class="text-xl font-bold text-white mb-2">{{ item.product?.name || 'Producto sin nombre' }}</h3>
                        <p class="text-gray-400 mb-3 text-sm">Moda premium de calidad</p>
                        
                        <div class="flex items-center gap-4">
                          <span class="text-lg font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                            S/ {{ item.product?.price || 0 }}
                          </span>
                          
                          <div class="flex items-center gap-2 bg-white/10 rounded-full p-1 border border-white/20">
                            <button @click="updateQuantity(item.product?.id || item.id, Math.max(1, item.quantity - 1))" class="w-7 h-7 rounded-full bg-purple-600/50 hover:bg-purple-600 text-white flex items-center justify-center transition-all font-bold">−</button>
                            <span class="w-8 text-center font-semibold text-white text-sm">{{ item.quantity }}</span>
                            <button @click="updateQuantity(item.product?.id || item.id, item.quantity + 1)" class="w-7 h-7 rounded-full bg-pink-600/50 hover:bg-pink-600 text-white flex items-center justify-center transition-all font-bold">+</button>
                          </div>
                        </div>
                      </div>
                      
                      <div class="text-right">
                        <p class="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-3">
                          S/ {{ ((item.product?.price || 0) * item.quantity).toFixed(2) }}
                        </p>
                        <Button @click="removeFromCart(item.product?.id || item.id)" variant="danger" size="sm" icon="🗑️" class="bg-red-600/60 hover:bg-red-700">
                          Quitar
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </div>

          <div class="xl:col-span-1">
            <Card class="sticky top-8 bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-red-600/30 border border-white/20 backdrop-blur-md">
              <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">💰 Resumen del Pedido</h2>
              
              <div class="space-y-4 mb-6">
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span class="text-gray-300">Subtotal ({{ totalItems }} productos)</span>
                  <span class="font-semibold text-white">S/ {{ total.toFixed(2) }}</span>
                </div>
                
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span class="text-gray-300">Envío</span>
                  <Badge variant="success" icon="🚚">GRATIS</Badge>
                </div>
                
                <div class="flex justify-between items-center py-2 border-b border-white/10">
                  <span class="text-gray-300">Impuestos (15%)</span>
                  <span class="font-semibold text-white">S/ {{ (total * 0.15).toFixed(2) }}</span>
                </div>
                
                <div class="border-t-2 border-white/20 pt-4 bg-white/5 rounded-lg p-4">
                  <div class="flex justify-between items-center">
                    <span class="text-xl font-bold text-white">Total</span>
                    <span class="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                      S/ {{ (total * 1.15).toFixed(2) }}
                    </span>
                  </div>
                </div>
              </div>

              <RouterLink to="/checkout">
                <Button variant="success" size="lg" full-width icon="💳" class="mb-6 shadow-xl">
                  Finalizar Compra
                </Button>
              </RouterLink>

              <div class="text-center mb-6">
                <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">Compra 100% segura</p>
                <div class="flex justify-center gap-4">
                  <div class="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-gray-200"><span class="text-2xl" title="Compra segura">🔒</span></div>
                  <div class="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-gray-200"><span class="text-2xl" title="SSL Certificado">🛡️</span></div>
                  <div class="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-gray-200"><span class="text-2xl" title="Garantía">✅</span></div>
                </div>
              </div>

              <RouterLink to="/products">
                <Button variant="outline" full-width icon="⬅️">Seguir Comprando</Button>
              </RouterLink>

              <div class="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                <h3 class="font-semibold text-gray-800 mb-3">🎫 Código de Descuento</h3>
                <div class="flex gap-2">
                  <input type="text" placeholder="Ingresa tu código" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm" />
                  <Button variant="outline" size="sm">Aplicar</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { Button, Card, Badge } from '../components/ui'
import { getProductImage } from '../utils/productImages'

const cartStore = useCartStore()

const cart = computed(() => cartStore.items)
const total = computed(() => cartStore.subtotal)
const totalItems = computed(() => cartStore.itemCount)

const updateQuantity = (productId: number, quantity: number) => {
  cartStore.updateQuantity(productId, quantity)
}

const removeFromCart = (productId: number) => {
  cartStore.removeItem(productId)
}

const clearCart = () => {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cartStore.clearCart()
  }
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>