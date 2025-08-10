import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
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
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Mock product data
  const mockProducts: { [key: string]: ExtendedProduct } = {
    '1': {
      id: 1,
      name: "Vestido Elegante Negro",
      description: "Vestido negro elegante perfecto para ocasiones especiales y eventos formales. Confeccionado en tela de alta calidad con un corte que realza la figura.",
      price: 89.99,
      imageUrl: "https://images.unsplash.com/photo-1566479179817-05b6f6baefb8?w=600&h=800&fit=crop",
      category: "dresses",
      stock: 15,
      features: [
        "Material: 95% Poliéster, 5% Elastano",
        "Corte ajustado que realza la figura",
        "Cremallera trasera invisible",
        "Forro interior para mayor comodidad",
        "Lavado en seco recomendado"
      ]
    },
    '2': {
      id: 2,
      name: "Camisa Casual Blanca",
      description: "Camisa de algodón premium, cómoda y fresca para el día a día. Perfecta para looks casuales o semi-formales.",
      price: 45.50,
      imageUrl: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&h=800&fit=crop",
      category: "shirts",
      stock: 25,
      features: [
        "100% Algodón orgánico",
        "Corte clásico unisex",
        "Botones de alta calidad",
        "Cuello tipo polo",
        "Lavable en máquina"
      ]
    },
    '3': {
      id: 3,
      name: "Jeans Premium Azul",
      description: "Jeans de mezclilla premium con corte moderno y cómodo. Diseñados para durar y mantener su forma.",
      price: 79.99,
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
      category: "pants",
      stock: 18,
      features: [
        "98% Algodón, 2% Elastano",
        "Corte slim fit",
        "5 bolsillos funcionales",
        "Costura reforzada",
        "Pre-lavado para evitar encogimiento"
      ]
    },
    '4': {
      id: 4,
      name: "Chaqueta de Cuero Genuino",
      description: "Chaqueta de cuero genuino estilo motociclista. Un clásico atemporal que nunca pasa de moda.",
      price: 199.99,
      imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
      category: "jackets",
      stock: 8,
      features: [
        "100% Cuero genuino",
        "Forro interior acolchado",
        "Cremalleras YKK",
        "Bolsillos con cierre",
        "Tratamiento resistente al agua"
      ]
    }
  };

  const productImages = [
    product?.imageUrl,
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop"
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  useEffect(() => {
    if (id && mockProducts[id]) {
      setProduct(mockProducts[id]);
    } else {
      // If product not found, redirect to products page
      navigate('/products');
    }
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

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Cargando producto...</p>
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
                  S/ {product.price.toFixed(2)}
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
                    🛒 Agregar al carrito (S/ {(product.price * quantity).toFixed(2)})
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
      </div>
    </div>
  );
};

export default ProductDetail;
