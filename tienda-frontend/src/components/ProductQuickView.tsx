import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  imageUrl: string;
  category: string;
  brand?: string;
  color?: string;
  size?: string;
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  averageRating: number;
  reviewCount: number;
  tags: string[];
  specifications?: string;
  careInstructions?: string;
  shippingInfo?: string;
  returnPolicy?: string;
}

interface ProductVariant {
  id: number;
  name: string;
  sku: string;
  price: number;
  color?: string;
  size?: string;
  material?: string;
  stock: number;
  isDefault: boolean;
}

interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  isMain: boolean;
  type: string;
}

interface ProductQuickViewProps {
  product: Product;
  onClose: () => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProductDetails();
  }, [product.id]);

  const fetchProductDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      // Fetch variants
      const variantsResponse = await axios.get(`/api/products/${product.id}/variants`, config);
      setVariants(variantsResponse.data);
      
      // Set default variant
      const defaultVariant = variantsResponse.data.find((v: ProductVariant) => v.isDefault) || variantsResponse.data[0];
      setSelectedVariant(defaultVariant);
      
      // Fetch images
      const imagesResponse = await axios.get(`/api/products/${product.id}/images`, config);
      setImages(imagesResponse.data);
      
      // Check if in wishlist
      if (token) {
        try {
          const wishlistResponse = await axios.get('/api/wishlist', config);
          const isInList = wishlistResponse.data.some((item: any) => item.product.id === product.id);
          setIsInWishlist(isInList);
        } catch (error) {
        }
      }
    } catch (error) {
    }
  };

  const addToCart = async () => {
    try {
      setIsAddingToCart(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Debes iniciar sesión para agregar al carrito');
        return;
      }

      await axios.post('/api/cart/add', {
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity: quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert('Producto agregado al carrito');
      onClose();
    } catch (error) {
      alert('Error al agregar al carrito');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para gestionar favoritos');
        return;
      }

      if (isInWishlist) {
        await axios.delete(`/api/wishlist/product/${product.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInWishlist(false);
      } else {
        await axios.post('/api/wishlist', {
          productId: product.id,
          variantId: selectedVariant?.id
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInWishlist(true);
      }
    } catch (error) {
    }
  };

  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock || product.stock;
  const discountPercentage = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - currentPrice) / product.compareAtPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">☆</span>);
    }
    
    return stars;
  };

  const availableColors = [...new Set(variants.map(v => v.color).filter(Boolean))];
  const availableSizes = [...new Set(variants.map(v => v.size).filter(Boolean))];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">👀 Vista Rápida</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images Section */}
            <div>
              <div className="mb-4">
                <img
                  src={images[selectedImage]?.url || product.imageUrl || product.image}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>
              
              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.altText || `${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div>
              {/* Badges */}
              <div className="flex gap-2 mb-3">
                {product.isNew && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Nuevo</span>
                )}
                {product.isFeatured && (
                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">Destacado</span>
                )}
                {product.isBestseller && (
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">Bestseller</span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">-{discountPercentage}%</span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {product.brand && (
                <p className="text-lg text-gray-600 mb-3">{product.brand}</p>
              )}

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {renderStars(product.averageRating)}
                </div>
                <span className="text-sm text-gray-500">({product.reviewCount} reseñas)</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">${currentPrice.toFixed(2)}</span>
                {product.compareAtPrice && (
                  <span className="text-xl text-gray-500 line-through">${product.compareAtPrice.toFixed(2)}</span>
                )}
              </div>

              {/* Variants */}
              {availableColors.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color:</label>
                  <div className="flex gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          const variant = variants.find(v => v.color === color);
                          setSelectedVariant(variant || null);
                        }}
                        className={`px-3 py-1 rounded-md border ${
                          selectedVariant?.color === color
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {availableSizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Talla:</label>
                  <div className="flex gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          const variant = variants.find(v => v.size === size && (!selectedVariant?.color || v.color === selectedVariant.color));
                          setSelectedVariant(variant || null);
                        }}
                        className={`px-3 py-1 rounded-md border ${
                          selectedVariant?.size === size
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {currentStock > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-green-600">
                      {currentStock > 10 ? 'En stock' : `Solo ${currentStock} disponibles`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                    <span className="text-sm text-red-600">Sin stock</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={addToCart}
                  disabled={isAddingToCart || currentStock <= 0}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isAddingToCart ? 'Agregando...' : currentStock <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
                
                <button
                  onClick={toggleWishlist}
                  className={`px-4 py-3 rounded-md border ${
                    isInWishlist 
                      ? 'bg-red-50 text-red-600 border-red-200' 
                      : 'bg-white text-gray-600 border-gray-300 hover:border-red-300'
                  }`}
                >
                  {isInWishlist ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Product Details Tabs */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex border-b border-gray-200 mb-4">
                  {[
                    { id: 'description', name: 'Descripción', icon: '📝' },
                    { id: 'specifications', name: 'Especificaciones', icon: '📋' },
                    { id: 'shipping', name: 'Envío', icon: '🚚' },
                    { id: 'returns', name: 'Devoluciones', icon: '↩️' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.icon} {tab.name}
                    </button>
                  ))}
                </div>

                <div className="text-sm text-gray-600">
                  {activeTab === 'description' && (
                    <p>{product.description}</p>
                  )}
                  {activeTab === 'specifications' && (
                    <div>
                      {product.specifications ? (
                        <pre className="whitespace-pre-wrap">{product.specifications}</pre>
                      ) : (
                        <p>No hay especificaciones disponibles.</p>
                      )}
                    </div>
                  )}
                  {activeTab === 'shipping' && (
                    <div>
                      {product.shippingInfo ? (
                        <p>{product.shippingInfo}</p>
                      ) : (
                        <p>Envío estándar disponible. Los tiempos de entrega varían según la ubicación.</p>
                      )}
                    </div>
                  )}
                  {activeTab === 'returns' && (
                    <div>
                      {product.returnPolicy ? (
                        <p>{product.returnPolicy}</p>
                      ) : (
                        <p>Devoluciones aceptadas dentro de 30 días de la compra.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
