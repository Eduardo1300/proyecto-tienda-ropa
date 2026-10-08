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
              <Badge variant="primary" size="lg" class="mb-6 inline-block backdrop-blur-md animate-float">
                ✨ Colección Premium 2024
              </Badge>
              <h1 class="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
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
              <Button
                @click="navigateToProducts"
                size="lg"
                icon="🛍️"
                class="transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl hover:shadow-2xl"
              >
                Explorar Colección
              </Button>
              <Button
                @click="navigateToProducts"
                variant="outline"
                size="lg"
                icon="🔥"
                class="transform hover:scale-105 transition-all duration-300 border-white/30 text-white hover:bg-white/10 font-bold backdrop-blur-md"
              >
                Ver Ofertas
              </Button>
            </div>

            <div class="grid grid-cols-3 gap-6 pt-8">
              <div v-for="(stat, index) in stats" :key="index" class="group cursor-pointer">
                <div class="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text group-hover:scale-110 transition-transform">
                  {{ stat.number }}
                </div>
                <p class="text-gray-400 text-sm">{{ stat.label }}</p>
              </div>
            </div>
          </div>

          <div class="relative h-96 md:h-full animate-scale-in">
            <div class="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-600/40 to-transparent rounded-3xl blur-3xl animate-pulse"></div>
            <div class="relative rounded-3xl overflow-hidden border border-white/20 backdrop-blur-xl h-96 md:h-96 lg:h-96 flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 group">
              <div class="text-center space-y-4">
                <div class="text-9xl animate-bounce" style="animation-duration: 2s;">{{ String.fromCodePoint(0x1F457) }}</div>
                <p class="text-white/60 font-semibold">Moda Premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-10 py-16 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Explora por Categoría
          </h2>
          <p class="text-gray-300 text-lg">Encuentra exactamente lo que buscas</p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div v-for="(category, index) in categories" :key="index" class="cursor-pointer group animate-fade-in-up" :style="{ animationDelay: `${index * 100}ms` }">
            <Card
              class="bg-gradient-to-br text-white transform hover:scale-110 transition-all duration-300"
              :class="category.color"
              padding="md"
            >
              <div class="text-center space-y-3">
                <div class="text-5xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                  {{ category.icon }}
                </div>
                <h3 class="font-bold text-sm md:text-base">{{ category.name }}</h3>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-10 py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Ventajas Exclusivas ⭐
          </h2>
          <p class="text-gray-300 text-lg">Porque tu satisfacción es nuestra prioridad</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            v-for="(feature, index) in features"
            :key="index"
            :class="`text-white bg-gradient-to-br ${feature.color} hover:shadow-2xl transition-all duration-300 group border-0`"
            hover
          >
            <div class="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
              {{ feature.icon }}
            </div>
            <h3 class="text-lg font-bold mb-2">{{ feature.title }}</h3>
            <p class="text-white/90 text-sm">{{ feature.description }}</p>
          </Card>
        </div>
      </div>
    </section>

    <section class="relative z-10 py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 animate-fade-in-up">
          <Badge variant="danger" size="lg" class="mb-4 inline-block animate-pulse">
            🔥 Tendencias Actuales
          </Badge>
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Lo Más Popular Ahora
          </h2>
          <p class="text-gray-300 text-lg">Descubre lo que todos están comprando</p>
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
          <Card class="text-center py-16 bg-white/10 backdrop-blur-md border border-white/20">
            <div class="text-8xl mb-6">🌐</div>
            <h2 class="text-3xl font-bold text-white mb-4">Servidor Desconectado</h2>
            <p class="text-gray-300 mb-8 text-lg">El servidor está iniciando. Esto puede tomar 1-2 minutos.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <Button @click="fetchProducts" icon="🔄" class="transform hover:scale-105 shadow-xl">
                Reintentar
              </Button>
              <RouterLink to="/products">
                <Button variant="outline" icon="🛍️" class="transform hover:scale-105">
                  Explorar Productos
                </Button>
              </RouterLink>
            </div>
          </Card>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div v-for="(product, index) in products.slice(0, 6)" :key="product.id" class="group cursor-pointer animate-fade-in-up" :style="{ animationDelay: `${index * 100}ms` }">
            <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/30 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2">
              <div class="relative h-72 bg-gradient-to-br from-purple-600/20 to-pink-600/20 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                <img
                  :src="getProductImageUrl(product)"
                  :alt="product.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2">
                  <Badge v-if="product.stock <= 5 && product.stock > 0" variant="warning" size="sm">¡Solo {{ product.stock }}!</Badge>
                  <Badge v-if="product.stock === 0" variant="danger" size="sm">Agotado</Badge>
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
                </div>

                <div class="flex gap-2 pt-2">
                  <RouterLink :to="`/product/${product.id}`" class="flex-1 px-4 py-2 border border-white/30 text-white text-center rounded-lg hover:bg-white/10 hover:border-purple-500/50 text-sm transition-all">
                    Detalles
                  </RouterLink>
                  <Button
                    @click.prevent="addToCart(product)"
                    :disabled="product.stock <= 0"
                    size="sm"
                    class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 transform hover:scale-105 transition-all"
                  >
                    {{ product.stock <= 0 ? 'Agotado' : 'Agregar' }}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center animate-fade-in-up">
          <Button
            @click="navigateToProducts"
            size="lg"
            icon="🛍️"
            class="transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl hover:shadow-2xl"
          >
            Ver Todos los Productos ({{ products.length }})
          </Button>
        </div>
      </div>
    </section>

    <section class="relative z-10 py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 animate-fade-in-up">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4">
            Lo que Dicen Nuestros Clientes 💬
          </h2>
          <p class="text-gray-300 text-lg">Historias reales de personas satisfechas</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 animate-fade-in-up"
            :style="{ animationDelay: `${index * 150}ms` }"
          >
            <div class="space-y-4">
              <div class="flex gap-1">
                <span v-for="i in testimonial.rating" :key="i" class="text-2xl">⭐</span>
              </div>
              <p class="text-white text-lg italic">"{{ testimonial.text }}"</p>
              <div class="pt-4 border-t border-white/10">
                <p class="text-purple-300 font-semibold">{{ testimonial.name }}</p>
                <p class="text-gray-400 text-sm">Cliente Verificado</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <section class="relative z-10 py-20 px-4">
      <div class="max-w-4xl mx-auto">
        <Card class="text-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white border-0 overflow-hidden" padding="lg">
          <div class="absolute inset-0 opacity-10 mix-blend-overlay">
            <div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          </div>
          <div class="relative space-y-6">
            <div class="text-6xl">💌</div>
            <div class="space-y-3">
              <h2 class="text-4xl font-bold">¡Mantente Actualizado!</h2>
              <p class="text-xl text-white/90">
                Suscríbete y recibe ofertas exclusivas, nuevos diseños y consejos de moda directamente en tu inbox
              </p>
            </div>
            <form class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                class="flex-1 px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:outline-none font-semibold"
              />
              <Button icon="📧" class="bg-white text-purple-600 hover:bg-gray-100 font-bold whitespace-nowrap">
                Suscribirse
              </Button>
            </form>
            <p class="text-sm text-white/80">
              ✓ Sin spam. Cancela cuando quieras. Recibirás ofertas exclusivas que no están disponibles en la web.
            </p>
          </div>
        </Card>
      </div>
    </section>

    <section class="relative z-10 py-24 px-4 border-t border-white/10">
      <div class="max-w-4xl mx-auto text-center space-y-8">
        <div class="space-y-4 animate-fade-in-up">
          <h2 class="text-5xl md:text-6xl font-black text-white">
            ¿Listo para 
            <span class="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transformar tu Estilo?
            </span>
          </h2>
          <p class="text-xl text-gray-300 max-w-2xl mx-auto">
            Únete a miles de personas que ya descubrieron su look perfecto. ¡La moda que te define está esperándote!
          </p>
        </div>
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style="animation-delay: 0.2s;">
          <Button
            @click="navigateToProducts"
            size="lg"
            icon="🛍️"
            class="transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl hover:shadow-2xl"
          >
            Comenzar a Comprar Ahora
          </Button>
          <Button
            @click="navigateToRegister"
            variant="outline"
            size="lg"
            icon="👤"
            class="border-white/30 text-white hover:bg-white/10 font-bold backdrop-blur-md transform hover:scale-105 transition-all duration-300"
          >
            Crear Cuenta Gratis
          </Button>
        </div>
        <div class="pt-8 text-gray-400 text-sm animate-fade-in-up" style="animation-delay: 0.4s;">
          <p>Envío gratis en compras superiores a S/100 • Atención al cliente 24/7 • 100% satisfacción garantizada</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { productsAPI } from '../api'
import { useCartStore } from '../stores/cart'
import type { Product } from '../types'
import { getProductImage } from '../utils/productImages'
import Button from '../components/ui/Button.vue'
import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'

const router = useRouter()
const cartStore = useCartStore()

const products = ref<Product[]>([])
const loading = ref(true)
const error = ref('')

const stats = [
  { number: '2000+', label: 'Productos' },
  { number: '5000+', label: 'Clientes' },
  { number: '24h', label: 'Envío' }
]

const categories = [
  { name: 'Camisetas', icon: String.fromCodePoint(0x1F455), color: 'from-blue-500 to-cyan-500' },
  { name: 'Pantalones', icon: String.fromCodePoint(0x1F456), color: 'from-purple-500 to-pink-500' },
  { name: 'Vestidos', icon: String.fromCodePoint(0x1F457), color: 'from-rose-500 to-red-500' },
  { name: 'Accesorios', icon: String.fromCodePoint(0x1F6C1), color: 'from-amber-500 to-orange-500' },
  { name: 'Zapatos', icon: String.fromCodePoint(0x1F45F), color: 'from-green-500 to-emerald-500' },
  { name: 'Ofertas', icon: String.fromCodePoint(0x1F525), color: 'from-red-500 to-orange-500' }
]

const features = [
  { icon: String.fromCodePoint(0x1F69A), title: 'Envío Rápido', description: 'Entregas en 24-48 horas', color: 'from-blue-500 to-cyan-500' },
  { icon: String.fromCodePoint(0x1F4B3), title: 'Compra Segura', description: 'Pagos encriptados y protegidos', color: 'from-green-500 to-emerald-500' },
  { icon: String.fromCodePoint(0x1F504), title: 'Devoluciones Gratis', description: '30 días sin preguntas', color: 'from-purple-500 to-pink-500' },
  { icon: String.fromCodePoint(0x1F48E), title: 'Calidad Premium', description: 'Materiales de primera calidad', color: 'from-orange-500 to-red-500' }
]

const testimonials = [
  { name: 'María García', text: 'Excelente calidad y muy rápido el envío. ¡Volvería a comprar!', rating: 5 },
  { name: 'Juan López', text: 'Las mejores prendas que he comprado. Muy recomendado.', rating: 5 },
  { name: 'Sofia Martínez', text: 'Servicio impecable, productos hermosos. 10/10', rating: 5 }
]

const getProductImageUrl = (product: Product): string => {
  return getProductImage(product.name, product.category, product.imageUrl)
}

const addToCart = (product: Product) => {
  cartStore.addItem(product, 1)
}

const navigateToProducts = () => {
  router.push('/products')
}

const navigateToRegister = () => {
  router.push('/register')
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
</style>