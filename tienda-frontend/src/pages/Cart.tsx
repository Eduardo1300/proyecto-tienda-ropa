import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button, Card, Badge } from "../components/ui";

const Cart = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            🛒 Tu Carrito
          </h1>
          <p className="text-xl text-gray-600">
            {totalItems > 0 
              ? (
                <span className="flex items-center justify-center gap-2">
                  Tienes <Badge variant="primary" size="lg">{totalItems}</Badge> 
                  {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
                </span>
              )
              : 'Tu carrito está vacío'
            }
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <Card className="text-center py-20" gradient>
            <div className="text-9xl mb-8 animate-bounce">🛒</div>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Tu carrito está esperando
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              ¡Descubre nuestros increíbles productos y encuentra algo que te encante! 
              Tenemos las mejores ofertas esperándote.
            </p>
            <Link to="/products">
              <Button
                variant="primary"
                size="lg"
                icon="🛍️"
                className="transform hover:scale-105 shadow-xl"
              >
                Explorar Productos
              </Button>
            </Link>
            
            {/* Feature highlights */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-200">
                <div className="text-purple-600 text-3xl mb-3">🚚</div>
                <h3 className="font-semibold text-gray-800">Envío Gratis</h3>
                <p className="text-sm text-gray-600">En compras mayores a $50</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-200">
                <div className="text-purple-600 text-3xl mb-3">🔒</div>
                <h3 className="font-semibold text-gray-800">Compra Segura</h3>
                <p className="text-sm text-gray-600">Protección SSL garantizada</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-200">
                <div className="text-purple-600 text-3xl mb-3">↩️</div>
                <h3 className="font-semibold text-gray-800">Devoluciones</h3>
                <p className="text-sm text-gray-600">30 días sin preguntas</p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="xl:col-span-2">
              <Card className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    📦 Productos
                    <Badge variant="primary" size="lg">{totalItems}</Badge>
                  </h2>
                  <Button
                    onClick={clearCart}
                    variant="danger"
                    size="sm"
                    icon="🗑️"
                  >
                    Vaciar Todo
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {cart.map((item) => (
                    <Card
                      key={item.id}
                      className="hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <img
                            src={item.product?.imageUrl || '/placeholder.jpg'}
                            alt={item.product?.name || 'Producto'}
                            className="w-24 h-24 object-cover rounded-xl shadow-md"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {item.product?.name || 'Producto sin nombre'}
                          </h3>
                          <p className="text-gray-600 mb-3">
                            Producto de calidad premium
                          </p>
                          
                          <div className="flex items-center gap-4">
                            <Badge variant="primary" size="lg">
                              S/ {item.product?.price || 0}
                            </Badge>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity?.(item.product?.id || item.id, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                              >
                                -
                              </button>
                              <span className="w-12 text-center font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity?.(item.product?.id || item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-2xl font-bold text-purple-600 mb-3">
                            S/ {((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            onClick={() => removeFromCart(item.product?.id || item.id)}
                            variant="danger"
                            size="sm"
                            icon="🗑️"
                          >
                            Eliminar
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
              <Card className="sticky top-8 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  💰 Resumen del Pedido
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Subtotal ({totalItems} productos)</span>
                    <span className="font-semibold">S/ {total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Envío</span>
                    <Badge variant="success" icon="🚚">GRATIS</Badge>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Impuestos (15%)</span>
                    <span className="font-semibold">S/ {(total * 0.15).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t-2 border-purple-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-purple-600">
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
