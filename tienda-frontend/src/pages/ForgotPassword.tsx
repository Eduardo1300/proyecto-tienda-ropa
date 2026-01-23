import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Por favor, ingresa tu email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, ingresa un email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await authAPI.forgotPassword(email);
      setMessage(response.data.data.message);
      
      // En desarrollo, mostramos el token para poder probarlo
      if (response.data.data.resetToken) {
        setResetToken(response.data.data.resetToken);
        setShowResetForm(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al enviar solicitud de recuperación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword(resetToken, newPassword);
      setMessage(response.data.data.message);
      setShowResetForm(false);
      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al resetear la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Floating Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in-up">
          <div className="text-8xl mb-4">{showResetForm ? '🔐' : '🔑'}</div>
          <h2 className="text-5xl font-black text-white mb-3">
            {showResetForm ? '🔐 Nueva Contraseña' : '🔑 Recuperar Acceso'}
          </h2>
          <p className="text-xl text-gray-300">
            {showResetForm ? 'Establece tu nueva contraseña segura' : 'Te enviaremos un enlace para recuperar tu cuenta'}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-500">
          {!showResetForm ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/30 backdrop-blur-sm border border-red-400/50 text-red-100 px-4 py-3 rounded-2xl animate-fade-in-up shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚠️</span>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {message && (
                <div className="bg-green-500/30 backdrop-blur-sm border border-green-400/50 text-green-100 px-4 py-3 rounded-2xl animate-fade-in-up shadow-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">✅</span>
                    <span className="font-medium">{message}</span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-white mb-2">
                  📧 Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  placeholder="tu@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    ⏳ Enviando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    📤 Enviar enlace de recuperación
                  </span>
                )}
              </button>

              <div className="text-center space-y-4">
                <div>
                  <Link 
                    to="/login" 
                    className="text-gray-300 hover:text-white transition-colors font-medium"
                  >
                    ⬅️ Volver al login
                  </Link>
                </div>
                
                <div>
                  <p className="text-gray-300">
                    ¿No tienes cuenta?{' '}
                    <Link 
                      to="/register" 
                      className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 transition-colors"
                    >
                      Regístrate gratis
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-2xl animate-fade-in-up">
                  <div className="flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {message && (
                <div className="bg-green-500 bg-opacity-20 border border-green-400 text-green-100 px-4 py-3 rounded-2xl animate-fade-in-up">
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>{message}</span>
                  </div>
                </div>
              )}

              <div className="bg-blue-500 bg-opacity-20 border border-blue-400 text-blue-100 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span>💡</span>
                  <span>Token de desarrollo: {resetToken.substring(0, 20)}...</span>
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-white mb-2">
                  🔒 Nueva contraseña
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 focus:border-white transition-all duration-300"
                  placeholder="Nueva contraseña (mín. 6 caracteres)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                  🔒 Confirmar contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 focus:border-white transition-all duration-300"
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-purple-600 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 btn-modern"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    ⏳ Reseteando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🔄 Resetear contraseña
                  </span>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(false);
                    setResetToken('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setError('');
                    setMessage('');
                  }}
                  className="text-purple-200 hover:text-white transition-colors font-medium"
                >
                  ⬅️ Volver a solicitar código
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back to home */}
        <div className="text-center animate-fade-in-up">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
          >
            🏠 Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
