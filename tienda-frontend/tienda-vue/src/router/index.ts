import { createRouter, createWebHistory } from 'vue-router'
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
    component: () => import('../pages/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order-confirmation',
    name: 'OrderConfirmation',
    component: () => import('../pages/OrderConfirmation.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../pages/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../pages/Admin.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../pages/Orders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/:orderId',
    name: 'OrderDetail',
    component: () => import('../pages/OrderDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order-tracking/:orderId',
    name: 'OrderTracking',
    component: () => import('../pages/OrderTracking.vue')
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: () => import('../pages/Wishlist.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('../pages/Analytics.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/loyalty',
    name: 'Loyalty',
    component: () => import('../pages/Loyalty.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../pages/Inventory.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next({ name: 'Home' })
    return
  }
  
  next()
})

export default router