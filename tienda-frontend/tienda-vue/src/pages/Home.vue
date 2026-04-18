<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div class="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
    </div>

    <section class="relative z-10 overflow-hidden pt-20 pb-32 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8 animate-fade-in-up">
            <div class="space-y-4">
              <div class="inline-block px-4 py-2 bg-purple-600/30 rounded-full text-purple-300 text-sm mb-6 backdrop-blur-md animate-float">
                Coleccion Premium 2024
              </div>
              <h1 class="text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight">
                Estilo que
                <span class="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent animate-gradient-x">
                  Define tu Ser
                </span>
              </h1>
              <p class="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                Descubre ropa que refleja tu personalidad única. Diseños exclusivos, calidad premium y tendencias globales en un solo lugar.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <RouterLink 
                to="/products"
                class="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full text-center overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105"
              >
                <span class="relative z-10">Explorar Coleccion</span>
                <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </RouterLink>
              <RouterLink 
                to="/products"
                class="group px-8 py-4 border border-white/30 text-white font-bold rounded-full text-center hover:bg-white/10 hover:border-purple-400 transition-all duration-300 backdrop-blur-md hover:shadow-lg"
              >
                <span class="inline-block">Ver Ofertas</span>
              </RouterLink>
            </div>

            <div class="grid grid-cols-3 gap-6 pt-8">
              <div class="cursor-pointer group">
                <div class="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text group-hover:scale-110 group-hover:text-purple-300 transition-all duration-300">
                  2000+
                </div>
                <p class="text-gray-400 text-sm group-hover:text-white transition-colors">Productos</p>
              </div>
              <div class="cursor-pointer group">
                <div class="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text group-hover:scale-110 group-hover:text-purple-300 transition-all duration-300">
                  5000+
                </div>
                <p class="text-gray-400 text-sm group-hover:text-white transition-colors">Clientes</p>
              </div>
              <div class="cursor-pointer group">
                <div class="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text group-hover:scale-110 group-hover:text-purple-300 transition-all duration-300">
                  24h
                </div>
                <p class="text-gray-400 text-sm group-hover:text-white transition-colors">Envio</p>
              </div>
            </div>
          </div>

          <div class="relative h-96 md:h-full animate-scale-in">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-600/40 to-transparent rounded-3xl blur-3xl animate-pulse"></div>
            <div class="relative rounded-3xl overflow-hidden border border-white/20 backdrop-blur-xl h-96 flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 group">
              <div class="text-center space-y-4 transform group-hover:scale-110 transition-transform duration-500">
                <div class="text-9xl animate-bounce">{{ String.fromCodePoint(0x1F457) }}</div>
                <p class="text-white/60 font-semibold">Moda Premium</p>
              </div>
              <div class="absolute inset-0 ring-1 ring-white/20 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-10 py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Explora por Categoria
          </h2>
          <p class="text-gray-300 text-lg">Encuentra exactamente lo que buscas</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div v-for="(category, index) in categories" :key="index" class="cursor-pointer group animate-fade-in-up"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div 
              class="bg-gradient-to-br rounded-xl p-6 text-white text-center transform hover:scale-110 hover:-translate-y-2 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 border border-transparent hover:border-white/20"
              :class="category.color"
            >
              <div class="text-5xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 mb-3">
                {{ category.icon }}
              </div>
              <h3 class="font-bold text-sm group-hover:text-white transition-colors">{{ category.name }}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-10 py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Ventajas Exclusivas
          </h2>
          <p class="text-gray-300 text-lg">Porque tu satisfaccion es nuestra prioridad</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(feature, index) in features" :key="index" 
            class="group bg-gradient-to-br rounded-xl p-6 text-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
            :class="feature.color"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <div class="text-4xl mb-4 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
              {{ feature.icon }}
            </div>
            <h3 class="text-lg font-bold mb-2 group-hover:text-white transition-colors">{{ feature.title }}</h3>
            <p class="text-white/90 text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-10 py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 animate-fade-in-up">
          <span class="inline-block px-4 py-2 bg-red-600/30 rounded-full text-red-300 text-sm mb-4 animate-pulse">
            Tendencias Actuales
          </span>
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Lo Mas Popular Ahora
          </h2>
          <p class="text-gray-300 text-lg">Descubre lo que todos estan comprando</p>
        </div>

        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden">
              <div class="h-72 bg-white/5"></div>
              <div class="p-6 space-y-3">
                <div class="h-6 bg-white/10 rounded w-3/4"></div>
                <div class="h-4 bg-white/5 rounded w-full"></div>
                <div class="flex justify-between pt-2">
                  <div class="h-8 bg-white/10 rounded w-24"></div>
                  <div class="h-8 bg-white/10 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="error" class="text-center py-16 animate-fade-in-up">
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 max-w-lg mx-auto">
            <div class="text-6xl mb-6 animate-wiggle">🌐</div>
            <h2 class="text-3xl font-bold text-white mb-4">Servidor Desconectado</h2>
            <p class="text-gray-300 mb-8 text-lg">El servidor está iniciando. Esto puede tomar 1-2 minutos.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button @click="fetchProducts" class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all">
                🔄 Reintentar
              </button>
              <RouterLink to="/products" class="px-8 py-4 border border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition-all">
                Explorar Productos
              </RouterLink>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div v-for="(product, index) in products.slice(0, 6)" :key="product.id" 
            class="group cursor-pointer animate-fade-in-up"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:shadow-2xl hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2">
              <div class="relative h-72 bg-gradient-to-br from-purple-600/20 to-pink-600/20 overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <span class="text-6xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-300">{{ getProductEmoji(product) }}</span>
                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2">
                  <span v-if="product.stock <= 5 && product.stock > 0" class="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
                    ¡Solo {{ product.stock }}!
                  </span>
                </div>
              </div>
              
              <div class="p-6 space-y-3">
                <h3 class="text-lg font-bold text-white line-clamp-2 group-hover:text-purple-400 transition-colors">
                  {{ product.name }}
                </h3>
                <p class="text-gray-400 text-sm line-clamp-2">{{ product.description }}</p>

                <div class="flex items-center justify-between pt-2 border-t border-white/10">
                  <div class="flex flex-col">
                    <span class="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                      S/ {{ typeof product.price === 'number' ? product.price.toFixed(2) : product.price }}
                    </span>
                    <div v-if="product.reviewCount" class="flex items-center gap-1 mt-1">
                      <span class="text-yellow-400 text-sm">★ {{ Number(product.averageRating || 0).toFixed(1) }}</span>
                      <span class="text-gray-500 text-xs">({{ product.reviewCount }})</span>
                    </div>
                  </div>
                  <span v-if="product.stock <= 0" class="px-2 py-1 bg-red-600 text-white text-xs rounded-full">Agotado</span>
                </div>

                <div class="flex gap-2 pt-2">
                  <RouterLink 
                    :to="`/product/${product.id}`"
                    class="flex-1 px-4 py-2 border border-white/30 text-white text-center rounded-lg hover:bg-white/10 hover:border-purple-500/50 text-sm transition-all"
                  >
                    Detalles
                  </RouterLink>
                  <button 
                    @click.prevent="addToCart(product)"
                    class="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 text-sm transform hover:scale-105 transition-all"
                  >
                    Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center animate-fade-in-up">
          <RouterLink 
            to="/products"
            class="group inline-block px-8 py-4 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            <span class="group-hover:scale-110 transition-transform inline-block">Ver Todos los Productos</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="relative z-10 py-20 px-4 bg-black/20">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Lo que dicen nuestros clientes
          </h2>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="(testimonial, index) in testimonials" :key="index" 
            class="group bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:border-purple-500/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <div class="text-yellow-400 mb-4 text-xl">★★★★★</div>
            <p class="text-gray-300 mb-4 group-hover:text-white transition-colors">"{{ testimonial.text }}"</p>
            <p class="font-semibold text-white group-hover:text-purple-400 transition-colors">- {{ testimonial.name }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { productsAPI } from '../api'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types'

const cartStore = useCartStore()
const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')

const categories = [
  { name: 'Camisetas', icon: String.fromCodePoint(0x1F455), color: 'from-blue-500 to-cyan-500' },
  { name: 'Pantalones', icon: String.fromCodePoint(0x1F456), color: 'from-purple-500 to-pink-500' },
  { name: 'Vestidos', icon: String.fromCodePoint(0x1F457), color: 'from-rose-500 to-red-500' },
  { name: 'Accesorios', icon: String.fromCodePoint(0x1F6C1), color: 'from-amber-500 to-orange-500' },
  { name: 'Zapatos', icon: String.fromCodePoint(0x1F45F), color: 'from-green-500 to-emerald-500' },
  { name: 'Ofertas', icon: String.fromCodePoint(0x1F525), color: 'from-red-500 to-orange-500' }
]

const features = [
  { icon: String.fromCodePoint(0x1F69A), title: 'Envio Rapido', description: 'Entregas en 24-48 horas', color: 'from-blue-500 to-cyan-500' },
  { icon: String.fromCodePoint(0x1F4B3), title: 'Compra Segura', description: 'Pagos encriptados y protegidos', color: 'from-green-500 to-emerald-500' },
  { icon: String.fromCodePoint(0x1F504), title: 'Devoluciones Gratis', description: '30 dias sin preguntas', color: 'from-purple-500 to-pink-500' },
  { icon: String.fromCodePoint(0x1F48E), title: 'Calidad Premium', description: 'Materiales de primera calidad', color: 'from-orange-500 to-red-500' }
]

const testimonials = [
  { name: 'Maria Garcia', text: 'Excelente calidad y muy rapido el envio. Volveria a comprar!' },
  { name: 'Juan Lopez', text: 'Las mejores prendas que he comprado. Muy recomendado.' },
  { name: 'Sofia Martinez', text: 'Servicio impecable, productos hermosos. 10/10' }
]

const getProductEmoji = (product: any): string => {
  const category = (product.category || '').toLowerCase()
  if (category.includes('hombre') || category.includes('men')) return String.fromCodePoint(0x1F455)
  if (category.includes('mujer') || category.includes('women')) return String.fromCodePoint(0x1F457)
  if (category.includes('shoes') || category.includes('zapato')) return String.fromCodePoint(0x1F45F)
  if (category.includes('accessories') || category.includes('accesorio')) return String.fromCodePoint(0x1F6C1)
  return String.fromCodePoint(0x1F455)
}

const addToCart = (product: Product) => {
  cartStore.addItem(product, 1)
}

const fetchProducts = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await productsAPI.getAll()
    products.value = response.data || []
  } catch (err) {
    error.value = 'Conectando con el backend. Esto puede tardar unos segundos.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

.animate-pulse {
  animation: pulse 3s ease-in-out infinite;
}

.delay-500 {
  animation-delay: 500ms;
}

.delay-1000 {
  animation-delay: 1000ms;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@keyframes gradientX {
  0%, 100% { background-size: 200% 200%; background-position: 0% 50%; }
  50% { background-size: 200% 200%; background-position: 100% 50%; }
}

.animate-gradient-x {
  animation: gradientX 3s ease infinite;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.animate-wiggle {
  animation: wiggle 0.5s ease-in-out infinite;
}
</style>