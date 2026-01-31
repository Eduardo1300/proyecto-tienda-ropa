import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ordersAPI } from '../services/api';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  method: 'card' | 'paypal' | 'cash';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

const CheckoutPage: React.FC = () => {
  const { cart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Perú'
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    method: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  // Verificar si hay productos en el carrito
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-12 border border-white/20">
            <div className="text-8xl mb-6 animate-bounce" style={{animationDuration: '2s'}}>🛒</div>
            <h1 className="text-4xl font-bold text-white mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-300 mb-8 text-lg">Agrega algunos productos antes de proceder al checkout</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold transform hover:scale-105 shadow-lg"
            >
              🛍️ Ir a comprar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verificar si el usuario está logueado
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-6xl mb-6">🔐</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Inicia sesión para continuar</h1>
            <p className="text-gray-600 mb-8">Necesitas iniciar sesión para proceder con tu compra</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/login')}
                className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
              >
                🔑 Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/register')}
                className="bg-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-colors font-semibold"
              >
                📝 Registrarse
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = 15.00;
  const tax = subtotal * 0.18; // 18% IGV en Perú
  const total = subtotal + shipping + tax;

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {

      // Crear la orden real en el backend
      const orderData = {
        userId: user?.id || 0,
        items: cart.map(item => ({
          productId: item.product?.id || item.id,
          quantity: item.quantity,
          price: item.product?.price || 0
        })),
        shippingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}`,
        billingAddress: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.zipCode}`,
        notes: `Order placed by ${shippingInfo.firstName} ${shippingInfo.lastName}`,
        shippingCost: 0,
        tax: 0
      };
      
      
      const response = await ordersAPI.create(orderData as any);
      
      // Limpiar carrito
      clearCart();
      
      // Redirigir a página de confirmación
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: response.data.orderNumber || `ORD-${response.data.id}`,
          total: total,
          shippingInfo
        }
      });

    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al procesar la orden');
    } finally {
      setLoading(false);
    }
  };

  const validateStep1 = () => {
    return shippingInfo.firstName && 
           shippingInfo.lastName && 
           shippingInfo.email && 
           shippingInfo.phone && 
           shippingInfo.address && 
           shippingInfo.city && 
           shippingInfo.zipCode;
  };

  const validateStep2 = () => {
    if (paymentInfo.method === 'cash') return true;
    return paymentInfo.cardNumber && 
           paymentInfo.expiryDate && 
           paymentInfo.cvv && 
           paymentInfo.cardName;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge variant="primary" size="lg" className="mb-4 inline-block backdrop-blur-md">
            🛒 Checkout Seguro
          </Badge>
          <h1 className="text-5xl font-black text-white mb-4">
            Completa Tu
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Compra Segura
            </span>
          </h1>
          <p className="text-gray-300 text-lg">Proceso de pago 100% protegido</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: 1, title: 'Envío', icon: '📦' },
              { step: 2, title: 'Pago', icon: '💳' },
              { step: 3, title: 'Confirmación', icon: '✅' }
            ].map((item, index) => (
              <React.Fragment key={item.step}>
                <div className={`flex items-center space-x-2 ${currentStep >= item.step ? 'text-purple-400' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    currentStep >= item.step 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                      : 'bg-white/10 text-gray-400'
                  }`}>
                    {currentStep > item.step ? '✓' : item.step}
                  </div>
                  <span className="font-medium hidden sm:inline">{item.icon} {item.title}</span>
                </div>
                {index < 2 && (
                  <div className={`w-16 h-1 rounded-full transition-all duration-300 ${currentStep > item.step ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-white/20'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-6">
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    📦 Información de Envío
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Tu nombre"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Tu apellido"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                      <input
                        type="tel"
                        required
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="+51 999 999 999"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Av. Principal 123, Distrito"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="Lima"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                      <input
                        type="text"
                        required
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        placeholder="15001"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">💳 Información de Pago</h2>
                  
                  {/* Payment Methods */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Método de Pago</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: 'card', label: 'Tarjeta de Crédito/Débito', icon: '💳' },
                        { value: 'paypal', label: 'PayPal', icon: '🅿️' },
                        { value: 'cash', label: 'Pago Contraentrega', icon: '💵' }
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                            paymentInfo.method === method.value
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.value}
                            checked={paymentInfo.method === method.value}
                            onChange={(e) => setPaymentInfo({...paymentInfo, method: e.target.value as any})}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-2">{method.icon}</div>
                            <div className="font-medium text-sm">{method.label}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Card Information */}
                  {paymentInfo.method === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número de Tarjeta</label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre en la Tarjeta</label>
                        <input
                          type="text"
                          required
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          placeholder="JUAN PEREZ"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Vencimiento</label>
                          <input
                            type="text"
                            required
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="MM/AA"
                            maxLength={5}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                          <input
                            type="text"
                            required
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentInfo.method === 'paypal' && (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🅿️</div>
                      <p className="text-gray-600">Serás redirigido a PayPal para completar el pago</p>
                    </div>
                  )}

                  {paymentInfo.method === 'cash' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">💵</span>
                        <h3 className="text-lg font-semibold text-yellow-800">Pago Contraentrega</h3>
                      </div>
                      <p className="text-yellow-700">
                        Pagarás en efectivo cuando recibas tu pedido. Ten el monto exacto listo: <strong>S/ {total.toFixed(2)}</strong>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Order Confirmation */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">✅ Confirmar Orden</h2>
                  
                  <div className="space-y-6">
                    {/* Shipping Info Review */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">📦 Información de Envío</h3>
                      <p className="text-gray-600">
                        {shippingInfo.firstName} {shippingInfo.lastName}<br />
                        {shippingInfo.address}<br />
                        {shippingInfo.city}, {shippingInfo.zipCode}<br />
                        📞 {shippingInfo.phone}<br />
                        📧 {shippingInfo.email}
                      </p>
                    </div>

                    {/* Payment Info Review */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">💳 Método de Pago</h3>
                      <p className="text-gray-600">
                        {paymentInfo.method === 'card' && '💳 Tarjeta terminada en ' + paymentInfo.cardNumber.slice(-4)}
                        {paymentInfo.method === 'paypal' && '🅿️ PayPal'}
                        {paymentInfo.method === 'cash' && '💵 Pago Contraentrega'}
                      </p>
                    </div>

                    {/* Products Review */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">🛍️ Productos ({cart.length})</h3>
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">{item.product?.name || 'Producto'}</span>
                              <span className="text-gray-500 ml-2">x{item.quantity}</span>
                            </div>
                            <span className="font-semibold">S/ {((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 1 && !validateStep1()) ||
                      (currentStep === 2 && !validateStep2())
                    }
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {loading ? '⏳ Procesando...' : '🎉 Confirmar Pedido'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Resumen del Pedido</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.length} productos)</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span>S/ {shipping.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>IGV (18%)</span>
                  <span>S/ {tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-800">
                    <span>Total</span>
                    <span className="text-purple-600">S/ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {cart.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.product?.imageUrl || 'https://via.placeholder.com/60x60'}
                      alt={item.product?.name || 'Producto'}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.product?.name || 'Producto'}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                
                {cart.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{cart.length - 3} productos más
                  </p>
                )}
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
                  <span>🔒</span>
                  <span>Compra 100% segura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
