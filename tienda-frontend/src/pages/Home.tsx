import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { productsAPI } from "../services/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching products from API...');
        const response = await productsAPI.getAll();
        console.log('✅ Products fetched:', response.data);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError('Error al cargar los productos del servidor');
        
        // Fallback a datos mock si falla la API
        const mockProducts: Product[] = [
          {
            id: 1,
            name: "Vestido Elegante",
            description: "Vestido negro elegante perfecto para ocasiones especiales",
            price: 89.99,
            image: "https://images.unsplash.com/photo-1566479179817-05b6f6baefb8?w=300&h=400&fit=crop",
            stock: 10
          },
          {
            id: 2,
            name: "Camisa Casual",
            description: "Camisa de algodón cómoda para el día a día",
            price: 45.50,
            image: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=400&fit=crop",
            stock: 15
          },
          {
            id: 3,
            name: "Jeans Premium",
            description: "Jeans de alta calidad con corte moderno",
            price: 79.99,
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop",
            stock: 8
          },
          {
            id: 4,
            name: "Chaqueta de Cuero",
            description: "Chaqueta de cuero genuino estilo motociclista",
            price: 199.99,
            image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop",
            stock: 5
          }
        ];
        console.log('🔄 Using fallback mock data');
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Cargando productos...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">⚠️ Aviso</p>
          <p>{error} - Mostrando productos de ejemplo</p>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-primary flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 text-center animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            ✨ Tienda de Moda
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Descubre tu estilo único con nuestra colección exclusiva
          </p>
          <Link
            to="/products"
            className="inline-block bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-50 transform hover:scale-105 transition-all duration-300 shadow-lg btn-modern"
          >
            🛍️ Explorar Colección
          </Link>
        </div>
        
        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse-soft"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-300 opacity-20 rounded-full animate-pulse-soft" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-pink-300 opacity-15 rounded-full animate-pulse-soft" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            🌟 Productos Destacados
          </h2>
          <p className="text-xl text-gray-600">
            Las últimas tendencias en moda seleccionadas especialmente para ti
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="relative overflow-hidden group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
                    ⭐ Nuevo
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-600">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    🛒 Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-secondary py-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-4">
            💎 Únete a nuestra comunidad de moda
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Sé el primero en conocer nuestras ofertas exclusivas y nuevas colecciones
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30"
            />
            <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 btn-modern">
              📧 Suscribirse
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg card-hover animate-fade-in-up">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Envío Gratis</h3>
              <p className="text-gray-600">En compras mayores a $50</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg card-hover animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Devoluciones</h3>
              <p className="text-gray-600">30 días para cambios</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg card-hover animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Compra Segura</h3>
              <p className="text-gray-600">Protección 100% garantizada</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
