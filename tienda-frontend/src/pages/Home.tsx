import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productsAPI } from "../services/api";
import { Button, Card, Badge } from "../components/ui";
import ProductImage from "../components/ProductImage";
import { getProductImage } from "../utils/productImages";
import type { Product } from "../types";
import SEO from "../components/SEO";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const categories = [
    { name: 'Camisetas', icon: '👕', color: 'from-blue-500 to-cyan-500' },
    { name: 'Pantalones', icon: '👖', color: 'from-purple-500 to-pink-500' },
    { name: 'Vestidos', icon: '👗', color: 'from-rose-500 to-red-500' },
    { name: 'Accesorios', icon: '👜', color: 'from-amber-500 to-orange-500' },
    { name: 'Zapatos', icon: '👟', color: 'from-green-500 to-emerald-500' },
    { name: 'Ofertas', icon: '🔥', color: 'from-red-500 to-orange-500' }
  ];

  const testimonials = [
    { name: 'María García', text: 'Excelente calidad y muy rápido el envío. ¡Volvería a comprar!', rating: 5 },
    { name: 'Juan López', text: 'Las mejores prendas que he comprado. Muy recomendado.', rating: 5 },
    { name: 'Sofia Martínez', text: 'Servicio impecable, productos hermosos. 10/10', rating: 5 }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();
        
        // Procesar productos del backend
        const backendProducts: Product[] = response.data.data || response.data || [];
        
        setProducts(backendProducts);
      } catch (error) {
  setError('Conectando con el backend. Esto puede tardar unos segundos. Si el mensaje persiste, por favor recargue la página o revise su conexión.');
        // No usar productos mock, mejor mostrar mensaje de error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl">Cargando productos increíbles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <Card className="text-center max-w-md">
          <div className="text-6xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Conectando con el backend</h2>
          <p className="text-gray-600 mb-6">Esto puede tardar unos segundos. Si el mensaje persiste, por favor recargue la página o revise su conexión.</p>
          <Button onClick={() => window.location.reload()} variant="primary" icon="🔄">
            Reintentar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Fashion Store - Ropa Premium y Moda Tendencia en Perú"
        description="Descubre la mejor colección de ropa premium en Perú. Camisetas, pantalones, vestidos, accesorios y más con envío rápido a todo el país. Calidad garantizada."
        keywords="ropa, moda, tienda de ropa, ropa premium, comprar ropa online, camisetas, vestidos, accesorios, Perú, lima, tendencias moda 2024"
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section - Premium */}
      <section className="relative z-10 overflow-hidden pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="primary" size="lg" className="mb-6 inline-block backdrop-blur-md">
                  ✨ Colección Premium 2024
                </Badge>
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight">
                  Estilo que
                  <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                    Define tu Ser
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                  Descubre ropa que refleja tu personalidad única. Diseños exclusivos, calidad premium y tendencias globales en un solo lugar.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => navigate('/products')}
                  size="lg"
                  icon="🛍️"
                  className="transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl hover:shadow-2xl"
                >
                  Explorar Colección
                </Button>
                <Button
                  onClick={() => navigate('/products')}
                  variant="outline"
                  size="lg"
                  icon="🔥"
                  className="transform hover:scale-105 transition-all duration-300 border-white/30 text-white hover:bg-white/10 font-bold backdrop-blur-md"
                >
                  Ver Ofertas
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                {[
                  { number: '2000+', label: 'Productos' },
                  { number: '5000+', label: 'Clientes' },
                  { number: '24h', label: 'Envío' }
                ].map((stat, index) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text group-hover:scale-110 transition-transform">
                      {stat.number}
                    </div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-pink-600/40 to-transparent rounded-3xl blur-3xl animate-pulse"></div>
              <div className="relative rounded-3xl overflow-hidden border border-white/20 backdrop-blur-xl h-96 md:h-96 lg:h-96 flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5">
                <div className="text-center space-y-4">
                  <div className="text-9xl animate-bounce" style={{animationDuration: '2s'}}>👗</div>
                  <p className="text-white/60 font-semibold">Moda Premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explora por Categoría
            </h2>
            <p className="text-gray-300 text-lg">Encuentra exactamente lo que buscas</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => navigate('/products')}
                className="cursor-pointer group"
              >
                <Card
                  className={`bg-gradient-to-br ${category.color} text-white transform hover:scale-110 transition-all duration-300`}
                  padding="md"
                >
                  <div className="text-center space-y-3">
                    <div className="text-5xl group-hover:scale-125 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-sm md:text-base">{category.name}</h3>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ventajas Exclusivas ⭐
            </h2>
            <p className="text-gray-300 text-lg">Porque tu satisfacción es nuestra prioridad</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🚚',
                title: 'Envío Rápido',
                description: 'Entregas en 24-48 horas',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: '💳',
                title: 'Compra Segura',
                description: 'Pagos encriptados y protegidos',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: '🔄',
                title: 'Devoluciones Gratis',
                description: '30 días sin preguntas',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: '💎',
                title: 'Calidad Premium',
                description: 'Materiales de primera calidad',
                color: 'from-orange-500 to-red-500'
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className={`text-white bg-gradient-to-br ${feature.color} hover:shadow-2xl transition-all duration-300 group border-0`}
                hover
              >
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-white/90 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="danger" size="lg" className="mb-4 inline-block">
              🔥 Tendencias Actuales
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Lo Más Popular Ahora
            </h2>
            <p className="text-gray-300 text-lg">Descubre lo que todos están comprando</p>
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {products.slice(0, 6).map((product, index) => (
                  <div key={product.id} className="group cursor-pointer">
                    <Card
                      className="overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white/10 backdrop-blur-md border border-white/20"
                      hover
                      padding="none"
                    >
                      <div className="relative">
                        <div className="relative h-72 bg-gradient-to-br from-purple-600/20 to-pink-600/20 overflow-hidden">
                          <ProductImage
                            src={getProductImage(product.name, product.category, product.imageUrl)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                        
                        {/* Overlay with quick actions */}
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <div className="flex gap-3">
                            <Button
                              onClick={() => navigate(`/product/${product.id}`)}
                              size="sm"
                              icon="👁️"
                              className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                            >
                              Ver
                            </Button>
                            <Button
                              onClick={() => handleAddToCart(product)}
                              size="sm"
                              icon="🛒"
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 font-semibold"
                            >
                              Agregar
                            </Button>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {index < 2 && <Badge variant="danger" size="sm">🔥 Popular</Badge>}
                          {(product.stock || 0) <= 5 && (product.stock || 0) > 0 && (
                            <Badge variant="warning" size="sm">¡Solo {product.stock}!</Badge>
                          )}
                        </div>
                      </div>

                      <div className="p-6 space-y-3">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all">
                            {product.name}
                          </h3>
                          <p className="text-gray-400 text-sm line-clamp-2">{product.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                            S/ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                          </span>
                          {(product.stock || 0) <= 0 && <Badge variant="danger" size="sm">Agotado</Badge>}
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => navigate(`/product/${product.id}`)}
                            variant="outline"
                            size="sm"
                            fullWidth
                            className="text-white border-white/30 hover:bg-white/10"
                          >
                            Detalles
                          </Button>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            size="sm"
                            fullWidth
                            icon="🛒"
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            disabled={(product.stock || 0) <= 0}
                          >
                            {(product.stock || 0) <= 0 ? 'Agotado' : 'Agregar'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={() => navigate('/products')}
                  size="lg"
                  icon="🛍️"
                  className="transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl hover:shadow-2xl"
                >
                  Ver Todos los Productos ({products.length})
                </Button>
              </div>
            </>
          ) : (
            <Card className="text-center py-16 bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-8xl mb-6">🛍️</div>
              <h3 className="text-2xl font-bold text-white mb-4">¡Productos llegando pronto!</h3>
              <p className="text-gray-300 mb-8">Estamos preparando una increíble selección para ti</p>
              <Button variant="primary" icon="🔔">
                Notificarme cuando lleguen
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Lo que Dicen Nuestros Clientes 💬
            </h2>
            <p className="text-gray-300 text-lg">Historias reales de personas satisfechas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-2xl">⭐</span>
                    ))}
                  </div>
                  <p className="text-white text-lg italic">"{testimonial.text}"</p>
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-purple-300 font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">Cliente Verificado</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white border-0 overflow-hidden" padding="lg">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            </div>
            <div className="relative space-y-6">
              <div className="text-6xl">💌</div>
              <div className="space-y-3">
                <h2 className="text-4xl font-bold">¡Mantente Actualizado!</h2>
                <p className="text-xl text-white/90">
                  Suscríbete y recibe ofertas exclusivas, nuevos diseños y consejos de moda directamente en tu inbox
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:outline-none font-semibold"
                />
                <Button
                  icon="📧"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-bold whitespace-nowrap"
                >
                  Suscribirse
                </Button>
              </div>
              <p className="text-sm text-white/80">
                ✓ Sin spam. Cancela cuando quieras. Recibirás ofertas exclusivas que no están disponibles en la web.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-24 px-4 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-black text-white">
              ¿Listo para 
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Transformar tu Estilo?
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Únete a miles de personas que ya descubrieron su look perfecto. ¡La moda que te define está esperándote!
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/products')}
              size="lg"
              icon="🛍️"
              className="transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-xl hover:shadow-2xl"
            >
              Comenzar a Comprar Ahora
            </Button>
            <Button
              onClick={() => navigate('/register')}
              variant="outline"
              size="lg"
              icon="👤"
              className="border-white/30 text-white hover:bg-white/10 font-bold backdrop-blur-md transform hover:scale-105 transition-all duration-300"
            >
              Crear Cuenta Gratis
            </Button>
          </div>
          <div className="pt-8 text-gray-400 text-sm">
            <p>Envío gratis en compras superiores a S/100 • Atención al cliente 24/7 • 100% satisfacción garantizada</p>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
