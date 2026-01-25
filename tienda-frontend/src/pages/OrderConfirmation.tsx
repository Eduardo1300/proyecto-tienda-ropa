import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

interface OrderConfirmationState {
  orderNumber: string;
  total: number;
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
  };
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as OrderConfirmationState;

  // Si no hay datos de la orden, redirigir
  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 relative overflow-hidden">
        {/* Floating Gradient Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-12">
            <div className="text-6xl mb-6">❓</div>
            <h1 className="text-3xl font-bold text-white mb-4">No se encontró información de la orden</h1>
            <p className="text-gray-300 mb-8">Parece que no hay información de orden disponible</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
            >
              🏠 Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 relative overflow-hidden">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div className="max-w-3xl mx-auto px-4 relative z-10">
        {/* Success Message */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 mb-8 text-center">
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-4xl font-bold text-green-400 mb-4">¡Orden Confirmada!</h1>
          <p className="text-xl text-gray-300 mb-6">
            Gracias por tu compra. Hemos recibido tu orden y está siendo procesada.
          </p>
          
          <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-6 mb-6">
            <div className="text-lg font-semibold text-green-400 mb-2">
              📦 Número de Orden: <span className="font-mono text-white">{state.orderNumber}</span>
            </div>
            <div className="text-green-300">
              💰 Total: <span className="text-xl font-bold text-white">S/ {state.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            Recibirás un email de confirmación en: <strong className="text-gray-300">{state.shippingInfo.email}</strong>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">📋 Detalles de la Orden</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shipping Information */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">🚚 Información de Envío</h3>
              <div className="space-y-2 text-gray-300">
                <p><strong>Nombre:</strong> {state.shippingInfo.firstName} {state.shippingInfo.lastName}</p>
                <p><strong>Email:</strong> {state.shippingInfo.email}</p>
                <p><strong>Dirección:</strong> {state.shippingInfo.address}</p>
                <p><strong>Ciudad:</strong> {state.shippingInfo.city}</p>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">⏰ Tiempo de Entrega</h3>
              <div className="space-y-2 text-gray-300">
                <p><strong>Estimado:</strong> 3-5 días hábiles</p>
                <p><strong>Envío:</strong> Incluido</p>
                <p><strong>Seguimiento:</strong> Te enviaremos el código de seguimiento por email</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">📋 Próximos Pasos</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-500/30 rounded-full p-2 mt-1 border border-purple-400/50">
                <span className="text-purple-300 text-xl">1️⃣</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Confirmación por Email</h3>
                <p className="text-gray-300">Recibirás un email con los detalles de tu orden en los próximos minutos.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-500/30 rounded-full p-2 mt-1 border border-purple-400/50">
                <span className="text-purple-300 text-xl">2️⃣</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Procesamiento</h3>
                <p className="text-gray-300">Preparamos tu pedido y lo empacamos con cuidado (1-2 días hábiles).</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-500/30 rounded-full p-2 mt-1 border border-purple-400/50">
                <span className="text-purple-300 text-xl">3️⃣</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Envío</h3>
                <p className="text-gray-300">Tu pedido sale de nuestro almacén y te enviamos el código de seguimiento.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-500/30 rounded-full p-2 mt-1 border border-purple-400/50">
                <span className="text-purple-300 text-xl">4️⃣</span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Entrega</h3>
                <p className="text-gray-300">Recibes tu pedido en la dirección indicada (3-5 días hábiles).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">💬 Soporte y Contacto</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
              <p className="text-sm text-gray-600">soporte@tienda.com</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl mb-2">📞</div>
              <h3 className="font-semibold text-gray-800 mb-2">Teléfono</h3>
              <p className="text-sm text-gray-600">+51 999 888 777</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold text-gray-800 mb-2">Chat</h3>
              <p className="text-sm text-gray-600">Lun-Vie 9am-6pm</p>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600 mb-4">
              ¿Tienes alguna pregunta sobre tu orden? No dudes en contactarnos.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-colors font-semibold text-center"
          >
            🛍️ Seguir Comprando
          </Link>
          
          <Link
            to="/profile"
            className="bg-gray-600 text-white px-8 py-4 rounded-xl hover:bg-gray-700 transition-colors font-semibold text-center"
          >
            📋 Ver Mis Órdenes
          </Link>
          
          <Link
            to="/"
            className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-center"
          >
            🏠 Ir al Inicio
          </Link>
        </div>

        {/* Social Sharing */}
        <div className="text-center mt-12">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">¡Comparte tu experiencia! 📱</h3>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors">
              📘 Facebook
            </button>
            <button className="bg-pink-500 text-white p-3 rounded-full hover:bg-pink-600 transition-colors">
              📷 Instagram
            </button>
            <button className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors">
              🐦 Twitter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
