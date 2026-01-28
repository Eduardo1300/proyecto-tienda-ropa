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

  const totalItems = getTotalItems();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-gray-50 dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group" onClick={() => setIsMenuOpen(false)}>
            <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300 text-primary">
              👗
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Fashion Store
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className="relative py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
            >
              <span className="relative z-10 text-sm">🏠 Inicio</span>
            </Link>
            <Link 
              to="/products" 
              className="relative py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
            >
              <span className="relative z-10 text-sm">👕 Productos</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/analytics" 
                  className="relative py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
                  title="Ver estadísticas y métricas"
                >
                  <span className="relative z-10 text-sm">📊 Analytics</span>
                </Link>
                <Link 
                  to="/loyalty" 
                  className="relative py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
                  title="Programa de lealtad y puntos"
                >
                  <span className="relative z-10 text-sm">🏆 Lealtad</span>
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    to="/inventory" 
                    className="relative py-2 px-3 rounded-full text-gray-600 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-all duration-300 group border border-accent-light dark:border-accent-dark bg-primary-light/10 dark:bg-accent-dark/20"
                    title="Solo administradores - Gestión de inventario"
                  >
                    <span className="relative z-10 text-sm">📦 Inventario</span>
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
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
              className="relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h9a2 2 0 002-2v-.5" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Auth Section Desktop */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full text-gray-700 dark:text-gray-200">
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-medium">
                    ¡Hola, {user?.username}!
                  </span>
                </div>
                
                {/* Profile & Admin Links */}
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/dashboard"
                    className="btn-modern btn-modern-primary bg-primary hover:bg-primary-dark"
                  >
                    📊 Dashboard
                  </Link>
                  
                  <Link 
                    to="/profile"
                    className="btn-modern bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
                  >
                    👤 Perfil
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin"
                      className="btn-modern bg-accent hover:bg-accent-dark"
                    >
                      👑 Admin
                    </Link>
                  )}
                  
                  <button 
                    onClick={logout}
                    className="btn-modern bg-gray-400 hover:bg-gray-500"
                  >
                    🚪 Salir
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login"
                className="btn-modern btn-modern-primary"
              >
                🔐 Entrar
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-full transition-all duration-300 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
              className="relative p-2 rounded-full transition-all duration-300 transform hover:scale-110 shadow-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V19a2 2 0 002 2h9a2 2 0 002-2v-.5" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold text-xs animate-pulse">
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
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4 animate-in fade-in slide-in-from-top-2">
            {/* Mobile Navigation Links */}
            <nav className="space-y-2 mb-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 px-4 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-sm"
              >
                🏠 Inicio
              </Link>
              <Link 
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 px-4 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-sm"
              >
                👕 Productos
              </Link>
              {isAuthenticated && (
                <>
                  <Link 
                    to="/analytics"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-4 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary-dark/20 hover:text-primary transition-all duration-300 text-sm"
                  >
                    📊 Analytics
                  </Link>
                  <Link 
                    to="/loyalty"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-4 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-sm"
                  >
                    🏆 Lealtad
                  </Link>
                  {user?.role === 'admin' && (
                                      <Link 
                                        to="/inventory"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block py-2 px-4 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary-dark/20 transition-all duration-300 text-sm border border-accent-light dark:border-accent-dark bg-primary-light/10 dark:bg-accent-dark/20"
                                      >
                                        📦 Inventario
                                      </Link>                  )}
                </>
              )}
            </nav>

            {/* Mobile User Actions */}
            {isAuthenticated ? (
              <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200">
                  <span className="text-lg mr-2">👤</span>
                  ¡Hola, {user?.username}!
                </div>
                <Link 
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 px-4 rounded-lg btn-modern-primary text-sm font-semibold"
                >
                  📊 Dashboard
                </Link>
                <Link 
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 px-4 rounded-lg btn-modern bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 text-sm font-semibold"
                >
                  👤 Perfil
                </Link>
                {user?.role === 'admin' && (
                  <Link 
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-2 px-4 rounded-lg btn-modern bg-accent hover:bg-accent-dark text-sm font-semibold"
                  >
                    👑 Admin
                  </Link>
                )}
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 rounded-lg btn-modern bg-gray-400 hover:bg-gray-500 text-sm font-semibold"
                >
                  🚪 Salir
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 px-4 rounded-lg btn-modern-primary text-sm font-semibold text-center"
              >
                🔐 Entrar
              </Link>
            )}
          </div>
        )}
      </div>
      
    </header>
  );
};

export default Header;