import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const total = cart.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCheckingOut(false);
    clearCart();
    alert('¡Compra realizada con éxito! 🎉');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🛒 Tu Carrito
          </h1>
          <p className="text-xl text-gray-600">
            {totalItems > 0 
              ? `Tienes ${totalItems} ${totalItems === 1 ? 'producto' : 'productos'} en tu carrito`
              : 'Tu carrito está vacío'
            }
          </p>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16 animate-fade-in-up">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Tu carrito está vacío
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              ¡Descubre nuestros increíbles productos y encuentra algo que te encante!
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-primary text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 btn-modern"
            >
              🛍️ Explorar Productos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  📦 Productos en tu carrito
                  <span className="ml-2 bg-gradient-primary text-white px-3 py-1 rounded-full text-sm">
                    {totalItems}
                  </span>
                </h2>
                
                <div className="space-y-4">
                  {cart.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {product.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-bold text-purple-600">
                              ${product.price}
                            </span>
                            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                              Cantidad: {product.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xl font-bold text-gray-800">
                          ${(product.price * product.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 font-medium transition-colors flex items-center gap-2"
                  >
                    🗑️ Vaciar carrito completo
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 animate-fade-in-up">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  💰 Resumen del pedido
                </h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} productos)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-600 font-medium">¡GRATIS!</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Impuestos</span>
                    <span>${(total * 0.15).toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold text-gray-800">
                      <span>Total</span>
                      <span className="text-purple-600">${(total * 1.15).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-gradient-success text-white py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 btn-modern disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center justify-center gap-2">
                      ⏳ Procesando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      💳 Finalizar Compra
                    </span>
                  )}
                </button>

                {/* Security Badges */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600 mb-3">Compra 100% segura</p>
                  <div className="flex justify-center gap-4 text-2xl">
                    <span title="Compra segura">🔒</span>
                    <span title="SSL Certificado">🛡️</span>
                    <span title="Garantía">✅</span>
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link
                    to="/products"
                    className="w-full block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105"
                  >
                    ⬅️ Seguir comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
