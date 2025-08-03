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
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-white opacity-5 rounded-full animate-pulse-soft"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-300 opacity-10 rounded-full animate-pulse-soft" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-300 opacity-8 rounded-full animate-pulse-soft" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in-up">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            ¡Bienvenido de vuelta!
          </h2>
          <p className="text-xl text-purple-100">
            Inicia sesión para continuar tu experiencia de compra
          </p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 animate-fade-in-up">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-2xl animate-fade-in-up">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="space-y-4">
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

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  🔒 Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 focus:border-white transition-all duration-300"
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-200 hover:text-white transition-colors"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out"
                />
                <span className="ml-2 text-sm text-purple-100">Recordarme</span>
              </label>
              <a href="#" className="text-sm text-purple-200 hover:text-white transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-purple-600 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 btn-modern"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  ⏳ Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🚀 Iniciar Sesión
                </span>
              )}
            </button>

            <div className="text-center">
              <p className="text-purple-100">
                ¿No tienes cuenta?{' '}
                <a href="#" className="font-bold text-white hover:text-purple-200 transition-colors">
                  Regístrate gratis
                </a>
              </p>
            </div>

            {/* Demo credentials */}
            <div className="bg-purple-500 bg-opacity-20 rounded-2xl p-4 text-center">
              <p className="text-sm text-purple-100 mb-2">
                💡 <strong>Demo:</strong> Usa cualquier email y contraseña para probar
              </p>
              <div className="flex flex-col gap-1 text-xs text-purple-200">
                <span>📧 demo@ejemplo.com</span>
                <span>🔒 contraseña123</span>
              </div>
            </div>
          </form>
        </div>

        {/* Back to home */}
        <div className="text-center animate-fade-in-up">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
          >
            ⬅️ Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;