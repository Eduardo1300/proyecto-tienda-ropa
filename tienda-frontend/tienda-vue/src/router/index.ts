import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('../pages/Products.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('../pages/ProductDetail.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../pages/Cart.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../pages/ForgotPassword.vue')
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('../pages/Checkout.vue')
  },
  {
    path: '/order-confirmation',
    name: 'OrderConfirmation',
    component: () => import('../pages/OrderConfirmation.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/Profile.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../pages/Admin.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../pages/Orders.vue')
  },
  {
    path: '/orders/:orderId',
    name: 'OrderDetail',
    component: () => import('../pages/OrderDetail.vue')
  },
  {
    path: '/order-tracking/:orderId',
    name: 'OrderTracking',
    component: () => import('../pages/OrderTracking.vue')
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: () => import('../pages/Wishlist.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue')
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../pages/Analytics.vue')
  },
  {
    path: '/loyalty',
    name: 'Loyalty',
    component: () => import('../pages/Loyalty.vue')
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../pages/Inventory.vue')
  },
  {
    path: '/return-request/:orderId',
    name: 'ReturnRequest',
    component: () => import('../pages/ReturnRequest.vue')
  },
  {
    path: '/suppliers',
    name: 'SupplierManagement',
    component: () => import('../pages/SupplierManagement.vue')
  },
  {
    path: '/product-images',
    name: 'ProductImageManager',
    component: () => import('../pages/ProductImageManager.vue')
  },
  {
    path: '/supplier',
    name: 'Supplier',
    component: () => import('../pages/SupplierManagement.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guard - only blocks admin pages when not admin
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  let userRole = 'user'
  
  if (userStr) {
    try {
      const userData = JSON.parse(userStr)
      userRole = userData.role || 'user'
    } catch {
      userRole = 'user'
    }
  }
  
  const isAuthenticated = !!(token && userStr)
  
  // Allow access to all public pages
  if (['Home', 'Products', 'ProductDetail', 'Cart', 'Login', 'Register', 'ForgotPassword', 'OrderTracking'].includes(to.name as string)) {
    next()
    return
  }
  
  // For protected pages, check if authenticated
  if (!isAuthenticated) {
    // Redirect to login with redirect parameter
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // For admin-only pages, check if user is admin
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    next({ name: 'Home' })
    return
  }
  
  // For role-specific pages, check if user has correct role
  if (to.meta.requiresRole) {
    const requiredRole = to.meta.requiresRole as string
    if (userRole !== requiredRole && userRole !== 'admin') {
      next({ name: 'Home' })
      return
    }
  }
  
  next()
})

export default router