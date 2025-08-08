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
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-white opacity-5 rounded-full animate-pulse-soft"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-300 opacity-10 rounded-full animate-pulse-soft" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-300 opacity-8 rounded-full animate-pulse-soft" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in-up">
          <div className="text-6xl mb-4">{showResetForm ? '🔐' : '🔑'}</div>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            {showResetForm ? 'Resetear contraseña' : '¿Olvidaste tu contraseña?'}
          </h2>
          <p className="text-xl text-purple-100">
            {showResetForm ? 'Ingresa tu nueva contraseña' : 'No te preocupes, te ayudamos a recuperarla'}
          </p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 animate-fade-in-up">
          {!showResetForm ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
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

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  📧 Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 focus:border-white transition-all duration-300"
                  placeholder="tu@email.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-purple-600 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 btn-modern"
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
                    className="text-purple-200 hover:text-white transition-colors font-medium"
                  >
                    ⬅️ Volver al login
                  </Link>
                </div>
                
                <div>
                  <p className="text-purple-100">
                    ¿No tienes cuenta?{' '}
                    <Link 
                      to="/register" 
                      className="font-bold text-white hover:text-purple-200 transition-colors"
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
