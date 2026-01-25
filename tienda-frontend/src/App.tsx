import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { useTheme } from './context/ThemeContext';
import Header from './components/Header';
import NotificationContainer from './components/NotificationContainer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmation from './pages/OrderConfirmation';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';
import OrderDetail from './pages/OrderDetail';
import OrderManagement from './pages/OrderManagement';
import OrderTracking from './pages/OrderTracking';
import Wishlist from './pages/Wishlist';
import DashboardPage from './pages/DashboardPage';
import ProductImageManager from './pages/ProductImageManager';
import AnalyticsDashboardMock from './pages/AnalyticsDashboardMock';
import LoyaltyDashboard from './pages/LoyaltyDashboard';
import InventoryDashboard from './pages/InventoryDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
            <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/favoritos" element={<Wishlist />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            
            {/* Analytics Dashboard - Protected Route */}
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <AnalyticsDashboardMock />
                </ProtectedRoute>
              } 
            />
            
            {/* Loyalty Dashboard - Protected Route */}
            <Route 
              path="/loyalty" 
              element={
                <ProtectedRoute>
                  <LoyaltyDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Inventory Dashboard - Admin Only */}
            <Route 
              path="/inventory" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <InventoryDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/admin/product-images" element={<ProductImageManager />} />
          </Routes>
        </main>
        <NotificationContainer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <AppContent />
            </Router>
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
