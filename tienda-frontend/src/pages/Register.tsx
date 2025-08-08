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
      console.error('Registration error:', error);
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
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-white opacity-5 rounded-full animate-pulse-soft"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-300 opacity-10 rounded-full animate-pulse-soft" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-300 opacity-8 rounded-full animate-pulse-soft" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center animate-fade-in-up">
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-4xl font-extrabold text-white mb-2">
            ¡Únete a nosotros!
          </h2>
          <p className="text-xl text-purple-100">
            Crea tu cuenta y descubre la mejor moda
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                  👤 Nombre
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 focus:border-white transition-all duration-300"
                  placeholder="Juan"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                  👥 Apellido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 focus:border-white transition-all duration-300"
                  placeholder="Pérez"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                🏷️ Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 focus:border-white transition-all duration-300"
                placeholder="tu_usuario"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                📧 Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 focus:border-white transition-all duration-300"
                  placeholder="Mínimo 6 caracteres"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                🔐 Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-2xl text-white placeholder-purple-200 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 focus:border-white transition-all duration-300"
                  placeholder="Repite tu contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-200 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-purple-600 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 btn-modern"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  ⏳ Creando cuenta...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🌟 Crear cuenta
                </span>
              )}
            </button>

            <div className="text-center">
              <p className="text-purple-100">
                ¿Ya tienes cuenta?{' '}
                <Link 
                  to="/login" 
                  className="font-bold text-white hover:text-purple-200 transition-colors"
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
            className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
          >
            ⬅️ Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
