import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button, Card, Badge } from "../components/ui";
import { getProductImage } from "../utils/productImages";

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-16 px-4">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
            🛒 Tu 
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Carrito de Compras
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            {totalItems > 0 
              ? (
                <span className="flex items-center justify-center gap-2">
                  Tienes <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-2xl">{totalItems}</span> 
                  {totalItems === 1 ? ' producto' : ' productos'} en tu carrito
                </span>
              )
              : 'Tu carrito está vacío'
            }
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <Card className="text-center py-20 bg-white/10 backdrop-blur-md border border-white/20">
            <div className="text-9xl mb-8 animate-bounce" style={{animationDuration: '2s'}}>🛒</div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Tu carrito está listo para llenarse
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              ¡Descubre nuestros increíbles productos y encuentra algo que te encante! 
              Tenemos las mejores ofertas esperándote.
            </p>
            <Link to="/products">
              <Button
                variant="primary"
                size="lg"
                icon="🛍️"
                className="transform hover:scale-105 shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold"
              >
                Explorar Productos
              </Button>
            </Link>
            
            {/* Feature highlights */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/50 hover:border-purple-400 transition-all">
                <div className="text-4xl mb-3">🚚</div>
                <h3 className="font-semibold text-white">Envío Gratis</h3>
                <p className="text-sm text-gray-300">En compras mayores a S/100</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/50 hover:border-purple-400 transition-all">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="font-semibold text-white">Compra Segura</h3>
                <p className="text-sm text-gray-300">Protección SSL garantizada</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/50 hover:border-purple-400 transition-all">
                <div className="text-4xl mb-3">↩️</div>
                <h3 className="font-semibold text-white">Devoluciones</h3>
                <p className="text-sm text-gray-300">30 días sin preguntas</p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2">
              <Card className="space-y-6 bg-white/10 backdrop-blur-md border border-white/20">
                <div className="flex items-center justify-between border-b border-white/20 pb-4">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    📦 Productos
                    <span className="text-2xl text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">{totalItems}</span>
                  </h2>
                  <Button
                    onClick={clearCart}
                    variant="danger"
                    size="sm"
                    icon="🗑️"
                    className="bg-red-600/80 hover:bg-red-700 text-white"
                  >
                    Vaciar
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card
                      key={item.id}
                      className="hover:border-white/40 transition-all duration-300 border border-white/20 bg-white/5 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <img
                            src={getProductImage(item.product?.name || 'Producto', item.product?.category || '', item.product?.imageUrl || '/placeholder.jpg')}
                            alt={item.product?.name || 'Producto'}
                            className="w-24 h-24 object-cover rounded-xl shadow-md hover:scale-110 transition-transform"
                          />
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                            {item.quantity}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {item.product?.name || 'Producto sin nombre'}
                          </h3>
                          <p className="text-gray-400 mb-3 text-sm">
                            Moda premium de calidad
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                              S/ {item.product?.price || 0}
                            </span>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2 bg-white/10 rounded-full p-1 border border-white/20">
                              <button
                                onClick={() => updateQuantity?.(item.product?.id || item.id, Math.max(1, item.quantity - 1))}
                                className="w-7 h-7 rounded-full bg-purple-600/50 hover:bg-purple-600 text-white flex items-center justify-center transition-all font-bold"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-semibold text-white text-sm">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity?.(item.product?.id || item.id, item.quantity + 1)}
                                className="w-7 h-7 rounded-full bg-pink-600/50 hover:bg-pink-600 text-white flex items-center justify-center transition-all font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-3">
                            S/ {((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            onClick={() => removeFromCart(item.product?.id || item.id)}
                            variant="danger"
                            size="sm"
                            icon="🗑️"
                            className="bg-red-600/60 hover:bg-red-700"
                          >
                            Quitar
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <Card className="sticky top-8 bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-red-600/30 border border-white/20 backdrop-blur-md">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  💰 Resumen del Pedido
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-300">Subtotal ({totalItems} productos)</span>
                    <span className="font-semibold text-white">S/ {total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-300">Envío</span>
                    <Badge variant="success" icon="🚚">GRATIS</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-300">Impuestos (15%)</span>
                    <span className="font-semibold text-white">S/ {(total * 0.15).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t-2 border-white/20 pt-4 bg-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-white">Total</span>
                      <span className="text-3xl font-black text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                        S/ {(total * 1.15).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link to="/checkout">
                  <Button
                    variant="success"
                    size="lg"
                    fullWidth
                    icon="💳"
                    className="mb-6 shadow-xl"
                  >
                    Finalizar Compra
                  </Button>
                </Link>

                {/* Security Badges */}
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-3">Compra 100% segura</p>
                  <div className="flex justify-center gap-4">
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
                      <span className="text-2xl" title="Compra segura">🔒</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
                      <span className="text-2xl" title="SSL Certificado">🛡️</span>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
                      <span className="text-2xl" title="Garantía">✅</span>
                    </div>
                  </div>
                </div>

                {/* Continue Shopping */}
                <Link to="/products">
                  <Button
                    variant="outline"
                    fullWidth
                    icon="⬅️"
                  >
                    Seguir Comprando
                  </Button>
                </Link>

                {/* Promo Code */}
                <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-3">🎫 Código de Descuento</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ingresa tu código"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                    <Button variant="outline" size="sm">
                      Aplicar
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
