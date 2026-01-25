import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productsAPI } from "../services/api";
import { Button, Card, Badge } from "../components/ui";
import ProductImage from "../components/ProductImage";
import type { Product } from "../types";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();
        
        // Procesar y limpiar datos del backend
        const backendProducts: any[] = response.data.data || response.data;
        
        // Filtrar duplicados por ID y limpiar datos
        const displayProducts: Product[] = backendProducts.length > 0 ? backendProducts : [
          {
            id: 1,
            name: "Vestido Elegante Negro",
            description: "Vestido negro elegante perfecto para ocasiones especiales",
            price: 89.99,
            imageUrl: "https://images.unsplash.com/photo-1566479179817-05b6f6baefb8?w=300&h=400&fit=crop",
            stock: 15,
            category: "vestidos"
          },
          {
            id: 2,
            name: "Camisa Casual Blanca",
            description: "Camisa de algodón cómoda y fresca para el día a día",
            price: 45.50,
            imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop",
            stock: 25,
            category: "camisas"
          },
          {
            id: 3,
            name: "Jeans Premium Azul",
            description: "Jeans de alta calidad con corte moderno y cómodo",
            price: 79.99,
            imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop",
            stock: 20,
            category: "pantalones"
          }
        ];
        
        setProducts(displayProducts);
      } catch (error) {
  setError('Conectando con el backend. Esto puede tardar unos segundos. Si el mensaje persiste, por favor recargue la página o revise su conexión.');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="primary" size="lg" className="mb-6">
              ✨ Nueva Colección 2024
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Moda que Inspira
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Descubre nuestra exclusiva colección de ropa diseñada para expresar tu personalidad única
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => navigate('/products')}
              size="lg"
              icon="👗"
              className="transform hover:scale-105"
            >
              Explorar Colección
            </Button>
            <Button
              onClick={() => navigate('/products')}
              variant="outline"
              size="lg"
              icon="🔥"
              className="transform hover:scale-105"
            >
              Ofertas Especiales
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '1000+', label: 'Productos', icon: '👗' },
              { number: '50+', label: 'Marcas', icon: '🏷️' },
              { number: '5000+', label: 'Clientes Felices', icon: '😊' },
              { number: '99%', label: 'Satisfacción', icon: '⭐' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ¿Por qué elegirnos? ✨
            </h2>
            <p className="text-xl text-gray-600">Compromiso con la calidad y tu satisfacción</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚚',
                title: 'Envío Gratis',
                description: 'Envío gratuito en pedidos superiores a S/100',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: '🔄',
                title: 'Devoluciones Fáciles',
                description: '30 días para cambios y devoluciones sin complicaciones',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: '💎',
                title: 'Calidad Premium',
                description: 'Materiales de la mejor calidad seleccionados cuidadosamente',
                color: 'from-purple-500 to-purple-600'
              }
            ].map((feature, index) => (
              <Card
                key={index}
                className={`text-center text-white bg-gradient-to-br ${feature.color} hover:scale-105 transition-all duration-300 group`}
                hover
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/90">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="warning" size="lg" className="mb-4">
              🔥 Productos Destacados
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Lo Más Popular
            </h2>
            <p className="text-xl text-gray-600">Descubre los favoritos de nuestros clientes</p>
          </div>

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {products.slice(0, 6).map((product, index) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden group hover:shadow-2xl transition-all duration-500"
                    hover
                    padding="none"
                  >
                    <div className="relative">
                      <ProductImage
                        src={product.imageUrl || 'https://via.placeholder.com/400x500'}
                        alt={product.name}
                        className="w-full h-64 group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Overlay with quick actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <div className="flex gap-3">
                          <Button
                            onClick={() => navigate(`/product/${product.id}`)}
                            variant="primary"
                            size="sm"
                            icon="👁️"
                            className="bg-white/90 text-gray-800 hover:bg-white"
                          >
                            Ver Detalles
                          </Button>
                          <Button
                            onClick={() => handleAddToCart(product)}
                            size="sm"
                            icon="🛒"
                            className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
                          >
                            Agregar
                          </Button>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4">
                        {index < 2 && <Badge variant="danger" size="sm">🔥 Popular</Badge>}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-3">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-purple-600">
                            S/ {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                          </span>
                        </div>
                        {(product.stock || 0) <= 5 && (product.stock || 0) > 0 && (
                          <Badge variant="warning" size="sm">
                            ¡Solo {product.stock} disponibles!
                          </Badge>
                        )}
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button
                          onClick={() => navigate(`/product/${product.id}`)}
                          variant="outline"
                          size="sm"
                          fullWidth
                          icon="👁️"
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          size="sm"
                          fullWidth
                          icon="🛒"
                          disabled={(product.stock || 0) <= 0}
                        >
                          {(product.stock || 0) <= 0 ? 'Agotado' : 'Agregar'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button
                  onClick={() => navigate('/products')}
                  variant="primary"
                  size="lg"
                  icon="🛍️"
                  className="transform hover:scale-105"
                >
                  Ver Todos los Productos ({products.length})
                </Button>
              </div>
            </>
          ) : (
            <Card className="text-center py-16">
              <div className="text-8xl mb-6">🛍️</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">¡Productos llegando pronto!</h3>
              <p className="text-gray-500 mb-8">Estamos preparando una increíble selección para ti</p>
              <Button variant="primary" icon="🔔">
                Notificarme cuando lleguen
              </Button>
            </Card>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white" padding="lg">
            <div className="text-6xl mb-6">💌</div>
            <h2 className="text-4xl font-bold mb-4">¡Mantente al día!</h2>
            <p className="text-xl mb-8 text-purple-100">
              Suscríbete a nuestro newsletter y recibe ofertas exclusivas y las últimas tendencias de moda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white/50 focus:outline-none"
              />
              <Button
                variant="success"
                icon="📧"
                className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
              >
                Suscribirse
              </Button>
            </div>
            <p className="text-sm text-purple-200 mt-4">
              * No spam. Puedes darte de baja cuando quieras.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">¿Listo para renovar tu estilo? ✨</h2>
          <p className="text-xl text-gray-300 mb-8">
            Únete a miles de personas que ya encontraron su look perfecto
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/products')}
              size="lg"
              icon="🛍️"
              className="transform hover:scale-105"
            >
              Comenzar a Comprar
            </Button>
            <Button
              onClick={() => navigate('/register')}
              variant="outline"
              size="lg"
              icon="👤"
              className="border-white/30 text-white hover:bg-white/10 transform hover:scale-105"
            >
              Crear Cuenta
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
