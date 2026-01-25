import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Temporal debug log
  console.log('Header - Current user:', user);

  const totalItems = getTotalItems();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-gradient-primary text-white shadow-2xl sticky top-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={() => setIsMenuOpen(false)}>
            <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
              👗
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Fashion Store
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className="relative py-2 px-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 group"
            >
              <span className="relative z-10 text-sm">🏠 Inicio</span>
            </Link>
            <Link 
              to="/products" 
              className="relative py-2 px-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 group"
            >
              <span className="relative z-10 text-sm">👕 Productos</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/analytics" 
                  className="relative py-2 px-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 group"
                  title="Ver estadísticas y métricas"
                >
                  <span className="relative z-10 text-sm">📊 Analytics</span>
                </Link>
                <Link 
                  to="/loyalty" 
                  className="relative py-2 px-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 group"
                  title="Programa de lealtad y puntos"
                >
                  <span className="relative z-10 text-sm">🏆 Lealtad</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    to="/inventory" 
                    className="relative py-2 px-3 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 group border border-yellow-300 bg-yellow-500 bg-opacity-20"
                    title="Solo administradores - Gestión de inventario"
                  >
                    <span className="relative z-10 text-sm">📦 Inventario</span>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart */}
            <Link 
              to="/cart"
              className="relative bg-white/20 hover:bg-white/30 p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h9a2 2 0 002-2v-.5" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Section Desktop */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full">
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-medium">
                    ¡Hola, {user?.username}!
                  </span>
                </div>
                
                {/* Profile & Admin Links */}
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/dashboard"
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg btn-modern"
                  >
                    📊 Dashboard
                  </Link>
                  
                  <Link 
                    to="/profile"
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg btn-modern"
                  >
                    👤 Perfil
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin"
                      className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg btn-modern"
                    >
                      👑 Admin
                    </Link>
                  )}
                  
                  <button 
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg btn-modern"
                  >
                    🚪 Salir
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login"
                className="bg-gradient-success text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 btn-modern"
              >
                🔐 Entrar
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-white p-2 hover:bg-white/20 rounded-full transition-all duration-300"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Mobile Cart & Theme Icons */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Mobile Cart */}
            <Link 
              to="/cart"
              className="relative bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h9a2 2 0 002-2v-.5" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold text-xs animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20 pt-4 animate-in fade-in slide-in-from-top-2">
            {/* Mobile Navigation Links */}
            <nav className="space-y-2 mb-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
              >
                🏠 Inicio
              </Link>
              <Link 
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
              >
                👕 Productos
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                    to="/analytics"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
                  >
                    📊 Analytics
                  </Link>
                  <Link 
                    to="/loyalty"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
                  >
                    🏆 Lealtad
                  </Link>
                  {user?.role === 'admin' && (
                    <Link 
                      to="/inventory"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm border border-yellow-300 bg-yellow-500/20"
                    >
                      📦 Inventario
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Mobile User Actions */}
            {isAuthenticated ? (
              <div className="space-y-2 border-t border-white/20 pt-4">
                <div className="px-4 py-2 bg-white/10 rounded-lg text-sm">
                  <span className="text-lg mr-2">👤</span>
                  ¡Hola, {user?.username}!
                </div>
                <Link 
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-sm font-semibold transition-all duration-300"
                >
                  📊 Dashboard
                </Link>
                <Link 
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm font-semibold transition-all duration-300"
                >
                  👤 Perfil
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-4 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-sm font-semibold transition-all duration-300"
                  >
                    👑 Admin
                  </Link>
                )}
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-semibold transition-all duration-300"
                >
                  🚪 Salir
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 px-4 rounded-lg bg-gradient-success text-white text-sm font-semibold text-center hover:shadow-lg transition-all duration-300"
              >
                🔐 Entrar
              </Link>
            )}
          </div>
        )}
      </div>
      
      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"></div>
    </header>
  );
};

export default Header;