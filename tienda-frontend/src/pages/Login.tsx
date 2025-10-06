import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-white opacity-60 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-purple-300 opacity-40 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-32 left-40 w-2 h-2 bg-pink-300 opacity-50 rounded-full animate-bounce" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-40 right-20 w-1 h-1 bg-blue-300 opacity-70 rounded-full animate-bounce" style={{animationDelay: '2.5s'}}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in-up">
          {/* Enhanced logo/icon with gradient */}
          <div className="relative mb-6">
            <div className="text-7xl mb-4 relative">
              <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                �️
              </span>
            </div>
            <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">✨</div>
          </div>
          
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-3">
            ¡Bienvenido de vuelta!
          </h2>
          <p className="text-lg text-purple-100/80">
            Inicia sesión para continuar tu experiencia de compra
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fade-in-up hover:shadow-3xl transition-all duration-500">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-2xl animate-fade-in-up shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚠️</span>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                  <span className="text-lg">📧</span>
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-white/15 border border-white/30 rounded-2xl text-white placeholder-purple-200/70 focus:outline-none focus:ring-4 focus:ring-purple-400/30 focus:border-purple-300/50 focus:bg-white/20 transition-all duration-300 group-hover:border-white/40"
                  placeholder="Ingresa tu email"
                />
              </div>

              <div className="group">
                <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                  <span className="text-lg">🔒</span>
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-4 pr-12 bg-white/15 border border-white/30 rounded-2xl text-white placeholder-purple-200/70 focus:outline-none focus:ring-4 focus:ring-purple-400/30 focus:border-purple-300/50 focus:bg-white/20 transition-all duration-300 group-hover:border-white/40"
                    placeholder="Ingresa tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-200/80 hover:text-white transition-all duration-200 p-1 rounded-lg hover:bg-white/10"
                  >
                    <span className="text-lg">{showPassword ? '🙈' : '👁️'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 bg-white/20 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="ml-3 text-sm text-purple-100/90 group-hover:text-white transition-colors">Recordarme</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-purple-200/90 hover:text-white transition-colors font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-white to-purple-50 text-purple-700 py-4 rounded-2xl font-bold text-lg hover:from-purple-50 hover:to-white focus:outline-none focus:ring-4 focus:ring-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-700"></div>
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span className="text-xl">🚀</span>
                  Iniciar Sesión
                </span>
              )}
            </button>

            <div className="text-center">
              <p className="text-purple-100/80">
                ¿No tienes cuenta?{' '}
                <Link 
                  to="/register" 
                  className="font-bold text-white hover:text-purple-200 transition-colors underline decoration-2 underline-offset-2"
                >
                  Regístrate gratis
                </Link>
              </p>
            </div>

            {/* Enhanced Demo credentials */}
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-5 border border-purple-400/20">
              <p className="text-sm text-center text-purple-100/90 mb-3 font-semibold flex items-center justify-center gap-2">
                <span className="text-lg">💡</span>
                Credenciales de prueba
              </p>
              <div className="space-y-2 text-xs text-purple-200/80">
                <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">Usuario:</span> prueba@gmail.com
                  </div>
                  <div>
                    <span className="font-semibold text-white">Pass:</span> 123456
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">Admin:</span> admin@example.com
                  </div>
                  <div>
                    <span className="font-semibold text-white">Pass:</span> password123
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Back to home */}
        <div className="text-center animate-fade-in-up">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-purple-200/80 hover:text-white transition-all duration-300 font-medium bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm"
          >
            <span className="text-lg">⬅️</span>
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;