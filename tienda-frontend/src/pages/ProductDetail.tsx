import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import { ReviewsList } from '../components/ReviewsList';
import { getProductImage, getProductImages } from '../utils/productImages';
import type { Product } from '../types';

interface ExtendedProduct extends Product {
  features: string[];
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Generar galería de imágenes apropiadas para el producto
  const productImages = product ? getProductImages(product.name, product.category, 4) : [];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        navigate('/products');
        return;
      }

      try {
        setLoading(true);
        const response = await productsAPI.getById(parseInt(id));
        
        // Procesar datos del backend y agregar características por defecto
        const backendProduct = response.data.data || response.data;
        const extendedProduct: ExtendedProduct = {
          id: backendProduct.id,
          name: backendProduct.name?.replace(/�/g, 'á').replace(/�/g, 'ó').replace(/�/g, 'í') || backendProduct.name,
          description: backendProduct.description?.replace(/�/g, 'á').replace(/�/g, 'ó').replace(/�/g, 'í') || backendProduct.description,
          price: backendProduct.price || 0,
          category: backendProduct.category || 'general',
          stock: backendProduct.stock || 0,
          imageUrl: getProductImage(backendProduct.name, backendProduct.category, backendProduct.imageUrl),
          features: (backendProduct as any).features || [
            "Material de alta calidad",
            "Diseño moderno y elegante",
            "Cómodo para uso diario",
            "Fácil cuidado y mantenimiento",
            "Disponible en múltiples tallas"
          ]
        };
        
        setProduct(extendedProduct);
        setError(null);
      } catch (err) {
        setError('Error al cargar los detalles del producto. Redirigiendo...');
        
        // Redirigir a la página de productos después de 2 segundos
        setTimeout(() => navigate('/products'), 2000);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API call
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    setIsAddingToCart(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Cargando detalles del producto...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl mb-4">😞</div>
          <h2 className="text-3xl font-bold text-white mb-2">Error al cargar el producto</h2>
          <p className="text-gray-300 mb-6 text-lg">{error}</p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            ← Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl mb-4">🔍</div>
          <h2 className="text-3xl font-bold text-white mb-2">Producto no encontrado</h2>
          <p className="text-gray-300 mb-6 text-lg">El producto que buscas no existe o ha sido eliminado.</p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            ← Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-2 text-gray-300">
            <Link to="/" className="hover:text-purple-300 transition-colors">🏠 Inicio</Link>
            <span className="text-gray-400">›</span>
            <Link to="/products" className="hover:text-purple-300 transition-colors">Productos</Link>
            <span className="text-gray-400">›</span>
            <span className="text-white font-medium">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4 animate-fade-in-up">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={productImages[activeImage] || product.imageUrl}
                alt={product.name}
                className="w-full h-96 lg:h-[600px] object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-secondary text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                  ⭐ Nuevo
                </span>
              </div>
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex gap-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                    activeImage === index 
                      ? 'border-purple-400 shadow-lg shadow-purple-500/50' 
                      : 'border-white/20 hover:border-purple-400'
                  }`}
                >
                  <img
                    src={img || product.imageUrl}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <h1 className="text-5xl font-black text-white mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6 flex-wrap">
                <span className="text-4xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                  S/ {Number(product.price).toFixed(2)}
                </span>
                <span className="bg-green-500/30 text-green-200 px-4 py-2 rounded-full text-sm font-bold border border-green-400/50 backdrop-blur-sm">
                  ✅ En stock ({product.stock || 0} disponibles)
                </span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">
                📏 Talla
              </h3>
              <div className="flex gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-bold transition-all duration-300 ${
                      selectedSize === size
                        ? 'border-purple-400 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                        : 'border-white/30 text-white hover:border-purple-400 hover:bg-white/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">
                🔢 Cantidad
              </h3>
              <div className="flex items-center gap-4 bg-white/10 rounded-lg p-3 border border-white/20 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-purple-600/50 hover:bg-purple-600 text-white transition-all flex items-center justify-center font-bold text-lg"
                >
                  −
                </button>
                <span className="text-2xl font-black text-white px-6">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 0, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-pink-600/50 hover:bg-pink-600 text-white transition-all flex items-center justify-center font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="w-full bg-gradient-primary text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 btn-modern disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    ⏳ Agregando al carrito...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🛒 Agregar al carrito (S/ {(Number(product.price) * quantity).toFixed(2)})
                  </span>
                )}
              </button>
              
              <button className="w-full bg-gradient-success text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 btn-modern">
                💳 Comprar ahora
              </button>
            </div>

            {/* Product Features */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                ✨ Características
              </h3>
              <ul className="space-y-3">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-3 text-gray-200">
                    <span className="text-green-400 font-bold text-lg">✓</span>
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-white/20 backdrop-blur-md rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                🚚 Información de envío
              </h3>
              <div className="space-y-3 text-gray-200">
                <p className="flex items-center gap-2"><span>🎁</span> Envío gratis en compras mayores a S/ 150</p>
                <p className="flex items-center gap-2"><span>📦</span> Entrega en 2-3 días hábiles</p>
                <p className="flex items-center gap-2"><span>🔄</span> Devoluciones gratis hasta 30 días</p>
                <p className="flex items-center gap-2"><span>🛡️</span> Compra protegida 100%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <ReviewsList
              productId={product.id}
              productName={product.name}
              currentUserId={user?.id}
              onReviewAdded={() => {
                // No necesitamos recargar la página, el componente ReviewsList
                // ya se encarga de recargar las reviews automáticamente
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
