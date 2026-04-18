import axios from 'axios'
import type { Product, CartItem, Order, LoginCredentials, RegisterData, ApiResponse, User, Review, Coupon, LoyaltyProgram, WishlistItem } from '../types'

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL
  if (envUrl) {
    return envUrl
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
      return 'http://localhost:3002'
    }
  }

  return 'https://proyecto-tienda-ropa.onrender.com'
}

export const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      const refreshToken = localStorage.getItem('refresh_token')
      if (refreshToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          })
          
          if (response.ok) {
            const data = await response.json()
            localStorage.setItem('access_token', data.access_token)
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`
            return api(originalRequest)
          }
        } catch (refreshError) {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials: LoginCredentials) => api.post<ApiResponse<{ access_token: string; refresh_token: string }>>('/auth/login', credentials),
  register: (userData: RegisterData) => api.post<ApiResponse<{ user: User }>>('/auth/register', userData),
  refresh: (refreshToken: string) => api.post<ApiResponse<{ access_token: string }>>('/auth/refresh', { refreshToken }),
  logout: () => api.post<ApiResponse<{ message: string }>>('/auth/logout'),
  forgotPassword: (email: string) => api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => api.post<ApiResponse<{ message: string }>>('/auth/reset-password', { token, newPassword }),
  getProfile: () => api.get<User>('/auth/profile'),
}

export const productsAPI = {
  getAll: (params?: any) => api.get<Product[]>('/products', { params }),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  search: (query: string) => api.get<Product[]>('/products/search', { params: { query } }),
  getByCategory: (category: string) => api.get<Product[]>('/products/category', { params: { category } }),
  create: (data: any) => api.post<Product>('/products', data),
  update: (id: number, data: any) => api.patch<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
}

export const ordersAPI = {
  getAll: (params?: any) => api.get<{ 
    data: Order[], 
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }>('/orders', { params }),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
  create: (data: any) => api.post<Order>('/orders', data),
  updateStatus: (id: number, status: string) => api.patch<Order>(`/orders/${id}/status`, { status }),
  createReturn: (orderId: number, data: any) => api.post(`/orders/${orderId}/returns`, data),
}

export const cartAPI = {
  get: () => api.get<CartItem[]>('/cart'),
  add: (item: any) => api.post<CartItem>('/cart', item),
  update: (id: number, quantity: number) => api.patch<CartItem>(`/cart/${id}`, { quantity }),
  remove: (id: number) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
}

export const couponsAPI = {
  getAll: () => api.get<Coupon[]>('/coupons'),
  validate: (code: string) => api.post<ApiResponse<{ coupon: Coupon; discount: number }>>('/coupons/validate', { code }),
}

export const loyaltyAPI = {
  getProgram: () => api.get<LoyaltyProgram>('/loyalty/program'),
  getTransactions: () => api.get<any[]>('/loyalty/transactions'),
  getLeaderboard: () => api.get<any[]>('/loyalty/leaderboard'),
  redeem: (points: number, type: string) => api.post<ApiResponse<{ message: string }>>('/loyalty/redeem', { points, type }),
}

export const inventoryAPI = {
  getAlerts: () => api.get<any[]>('/inventory/alerts'),
  getStockMovements: (params?: any) => api.get<any[]>('/inventory/movements', { params }),
  getSuppliers: () => api.get<any[]>('/inventory/suppliers'),
}

export const usersAPI = {
  getAll: () => api.get<any[]>('/users'),
  getById: (id: number) => api.get<any>(`/users/${id}`),
  update: (id: number, data: any) => api.patch<any>(`/users/${id}`, data),
}

export const wishlistAPI = {
  get: () => api.get<WishlistItem[]>('/wishlist'),
  add: (productId: number) => api.post<WishlistItem>('/wishlist', { productId }),
  remove: (productId: number) => api.delete(`/wishlist/${productId}`),
}

export const reviewsAPI = {
  create: (reviewData: any) => api.post<Review>('/reviews', reviewData),
  getAll: (filters?: any) => api.get<Review[]>('/reviews', { params: filters }),
  getByProduct: (productId: number) => api.get<Review[]>(`/reviews/product/${productId}`),
  update: (id: number, data: any) => api.patch<Review>(`/reviews/${id}`, data),
  delete: (id: number) => api.delete(`/reviews/${id}`),
}

export default api