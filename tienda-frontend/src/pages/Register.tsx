import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingresa un email válido');
      return;
    }

    try {
      const success = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      if (success) {
        navigate('/');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Error al crear la cuenta. Inténtalo de nuevo.';
      if (errorMessage.toLowerCase().includes('email is already in use') || 
          errorMessage.toLowerCase().includes('conflict')) {
        setError('Este email ya está registrado. Usa otro email o inicia sesión.');
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-purple-400 to-indigo-400 opacity-15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating particles */}
        <div className="absolute top-32 left-16 w-2 h-2 bg-white opacity-60 rounded-full animate-bounce"></div>
        <div className="absolute top-48 right-24 w-3 h-3 bg-purple-300 opacity-40 rounded-full animate-bounce" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-24 left-32 w-2 h-2 bg-pink-300 opacity-50 rounded-full animate-bounce" style={{animationDelay: '1.8s'}}></div>
        <div className="absolute bottom-48 right-16 w-1 h-1 bg-blue-300 opacity-70 rounded-full animate-bounce" style={{animationDelay: '2.8s'}}></div>
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
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                ✨
              </span>
            </div>
            <div className="absolute -top-2 -left-2 text-2xl animate-bounce">🎉</div>
          </div>
          
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent mb-3">
            ¡Únete a nosotros!
          </h2>
          <p className="text-lg text-purple-100/80">
            Crea tu cuenta y descubre la mejor moda
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

            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="firstName" className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                  <span className="text-lg">👤</span>
                  Nombre
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Juan"
                />
              </div>

              <div className="group">
                <label htmlFor="lastName" className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                  <span className="text-lg">👥</span>
                  Apellido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div className="group">
              <label htmlFor="username" className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                <span className="text-lg">🏷️</span>
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                placeholder="tu_usuario_cool"
              />
            </div>

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
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                placeholder="tu@email.com"
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
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Mínimo 6 caracteres"
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

            <div className="group">
              <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-semibold text-white/90 mb-2">
                <span className="text-lg">🔐</span>
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-4 pr-12 bg-white/10 border border-white/30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 backdrop-blur-sm"
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-200/80 hover:text-white transition-all duration-200 p-1 rounded-lg hover:bg-white/10"
                >
                  <span className="text-lg">{showConfirmPassword ? '🙈' : '👁️'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creando cuenta...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <span className="text-xl">🌟</span>
                  Crear cuenta
                </span>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-300">
                ¿Ya tienes cuenta?{' '}
                <Link 
                  to="/login" 
                  className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 transition-colors"
                >
                  Inicia sesión aquí
                </Link>
              </p>
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

export default Register;
