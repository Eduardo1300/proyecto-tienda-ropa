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
        console.log('🔄 Fetching product details for ID:', id);
        const response = await productsAPI.getById(parseInt(id));
        console.log('✅ Product details fetched:', response.data);
        
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
        console.error('❌ Error fetching product details:', err);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Cargando detalles del producto...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar el producto</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/products"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no existe o ha sido eliminado.</p>
          <Link
            to="/products"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            ← Volver a productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-2 text-gray-600">
            <Link to="/" className="hover:text-purple-600 transition-colors">🏠 Inicio</Link>
            <span>›</span>
            <Link to="/products" className="hover:text-purple-600 transition-colors">Productos</Link>
            <span>›</span>
            <span className="text-gray-800 font-medium">{product.name}</span>
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
                      ? 'border-purple-500 shadow-lg' 
                      : 'border-gray-200 hover:border-purple-300'
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
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-purple-600">
                  S/ {Number(product.price).toFixed(2)}
                </span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✅ En stock ({product.stock || 0} disponibles)
                </span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📏 Talla
              </h3>
              <div className="flex gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-medium transition-all duration-300 ${
                      selectedSize === size
                        ? 'border-purple-500 bg-purple-500 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🔢 Cantidad
              </h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center font-bold"
                >
                  −
                </button>
                <span className="text-xl font-semibold px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 0, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center font-bold"
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
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ✨ Características
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🚚 Información de envío
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>🎁 Envío gratis en compras mayores a S/ 150</p>
                <p>📦 Entrega en 2-3 días hábiles</p>
                <p>🔄 Devoluciones gratis hasta 30 días</p>
                <p>🛡️ Compra protegida 100%</p>
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
                console.log('✅ Review agregada, la lista se actualizará automáticamente');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
