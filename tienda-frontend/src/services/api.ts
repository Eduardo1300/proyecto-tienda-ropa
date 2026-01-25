import axios from 'axios';
import type { Product, CartItem, Order, LoginCredentials, RegisterData, ApiResponse, User } from '../types';

// URL base del backend - Detecta automáticamente
const getApiBaseUrl = (): string => {
  // Si está compilado con VITE_API_URL específico, úsalo
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.includes('tienda-backend')) {
    return envUrl;
  }

  // Si está en producción (Render), detecta automáticamente
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Si estamos en Render (hostname contiene .onrender.com)
    if (hostname.includes('onrender.com')) {
      // La URL del backend en Render es tienda-backend-n67b.onrender.com
      return `${protocol}//tienda-backend-n67b.onrender.com`;
    }
    
    // Si estamos en localhost o IP local, usa localhost:3002
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      return 'http://localhost:3002';
    }
  }

  // Default
  return envUrl || 'http://localhost:3002';
};

const API_BASE_URL = getApiBaseUrl();

// Configurar axios con la URL base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Aumentado a 15s para Render (puede tardar al despertar)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log para debugging
if (typeof window !== 'undefined') {
}

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores y refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });
          
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            
            // Reintentar la request original con el nuevo token
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
        }
      }
      
      // Si no se puede refresh, limpiar tokens y redirigir a login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Funciones para productos
export const productsAPI = {
  // Obtener todos los productos
  getAll: () => api.get<ApiResponse<Product[]>>('/products'),
  
  // Obtener un producto por ID
  getById: (id: number) => api.get<ApiResponse<Product>>(`/products/${id}`),
  
  // Crear un nuevo producto (admin)
  create: (product: Omit<Product, 'id'>) => api.post<ApiResponse<Product>>('/products', product),
  
  // Actualizar un producto (admin)
  update: (id: number, product: Partial<Product>) => api.patch<ApiResponse<Product>>(`/products/${id}`, product),
  
  // Eliminar un producto (admin)
  delete: (id: number) => api.delete<ApiResponse<void>>(`/products/${id}`),
};

// Funciones para carrito
export const cartAPI = {
  // Obtener carrito de un usuario
  getByUserId: (userId: number) => api.get<ApiResponse<CartItem[]>>(`/cart/${userId}`),
  
  // Agregar item al carrito
  addItem: (item: { productId: number; quantity: number; userId: number }) => api.post<ApiResponse<CartItem>>('/cart', item),
  
  // Eliminar item del carrito
  removeItem: (id: number) => api.delete<ApiResponse<void>>(`/cart/${id}`),
};

// Funciones para órdenes
export const ordersAPI = {
  // Get user's orders
  getAll: () => api.get<Order[]>('/orders'),
  // Crear una nueva orden
  create: (order: Omit<Order, 'id' | 'createdAt'>) => api.post<Order>('/orders', order),
  // Get order by ID
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
  // Update order status (admin only)
  updateStatus: (id: number, status: string) => api.put<Order>(`/orders/${id}/status`, { status }),
};

// Funciones para autenticación
export const authAPI = {
  // Login
  login: (credentials: LoginCredentials) => api.post<ApiResponse<{ access_token: string; refresh_token: string }>>('/auth/login', credentials),
  
  // Registro
  register: (userData: RegisterData) => api.post<ApiResponse<{ user: User }>>('/auth/register', userData),
  
  // Refresh token
  refresh: (refreshToken: string) => api.post<ApiResponse<{ access_token: string }>>('/auth/refresh', { refreshToken }),
  
  // Logout
  logout: () => api.post<ApiResponse<{ message: string }>>('/auth/logout'),

  // Olvidé mi contraseña
  forgotPassword: (email: string) => api.post<ApiResponse<{ message: string; resetToken?: string }>>('/auth/forgot-password', { email }),

  // Resetear contraseña
  resetPassword: (token: string, newPassword: string) => api.post<ApiResponse<{ message: string }>>('/auth/reset-password', { token, newPassword }),
};

// Funciones para reviews
export const reviewsAPI = {
  // Crear nueva review
  create: (reviewData: any) => api.post<any>('/reviews', reviewData),
  
  // Obtener todas las reviews
  getAll: (filters?: any) => api.get<any>('/reviews', { params: filters }),
  
  // Obtener reviews de un producto específico
  getByProduct: (productId: number, filters?: any) => api.get<any>(`/reviews/product/${productId}`, { params: filters }),
  
  // Obtener reviews de un usuario específico
  getByUser: (userId: number, filters?: any) => api.get<any>(`/reviews/user/${userId}`, { params: filters }),
  
  // Obtener una review específica
  getById: (id: number) => api.get<any>(`/reviews/${id}`),
  
  // Actualizar una review
  update: (id: number, reviewData: any) => api.patch<any>(`/reviews/${id}`, reviewData),
  
  // Eliminar una review
  delete: (id: number) => api.delete<any>(`/reviews/${id}`),
  
  // Votar una review (útil/no útil)
  vote: (id: number, helpful: boolean) => api.post<any>(`/reviews/${id}/vote`, { helpful }),
  
  // Responder como admin
  adminResponse: (id: number, response: string) => api.post<any>(`/reviews/${id}/admin-response`, { response }),
};

// Exportar API_BASE_URL explícitamente
export { API_BASE_URL };

export default api;