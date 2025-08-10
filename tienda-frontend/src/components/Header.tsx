import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getTotalItems } = useCart();

  // Temporal debug log
  console.log('Header - Current user:', user);

  const totalItems = getTotalItems();

  return (
    <header className="bg-gradient-primary text-white shadow-2xl sticky top-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
              👗
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              Fashion Store
            </span>
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              to="/" 
              className="relative py-2 px-4 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 group"
            >
              <span className="relative z-10">🏠 Inicio</span>
            </Link>
            <Link 
              to="/products" 
              className="relative py-2 px-4 rounded-full hover:bg-white hover:bg-opacity-20 transition-all duration-300 group"
            >
              <span className="relative z-10">👕 Productos</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link 
              to="/carrito" 
              className="relative group"
            >
              <div className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105">
                <span className="text-xl">🛒</span>
                <span className="hidden sm:inline font-medium">Carrito</span>
                {totalItems > 0 && (
                  <span className="cart-badge bg-gradient-secondary text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>

            {/* Auth Section */}
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
          <button className="md:hidden text-white p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"></div>
    </header>
  );
};

export default Header;