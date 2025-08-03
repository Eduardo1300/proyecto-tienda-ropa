import axios from 'axios';

// URL base del backend
const API_BASE_URL = 'http://localhost:3002';

// Configurar axios con la URL base
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Funciones para productos
export const productsAPI = {
  // Obtener todos los productos
  getAll: () => api.get('/products'),
  
  // Obtener un producto por ID
  getById: (id: number) => api.get(`/products/${id}`),
  
  // Crear un nuevo producto (admin)
  create: (product: any) => api.post('/products', product),
  
  // Actualizar un producto (admin)
  update: (id: number, product: any) => api.patch(`/products/${id}`, product),
  
  // Eliminar un producto (admin)
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Funciones para carrito
export const cartAPI = {
  // Obtener carrito de un usuario
  getByUserId: (userId: number) => api.get(`/cart/${userId}`),
  
  // Agregar item al carrito
  addItem: (item: any) => api.post('/cart', item),
  
  // Eliminar item del carrito
  removeItem: (id: number) => api.delete(`/cart/${id}`),
};

// Funciones para órdenes
export const ordersAPI = {
  // Crear una nueva orden
  create: (order: any) => api.post('/orders', order),
};

// Funciones para autenticación
export const authAPI = {
  // Login
  login: (credentials: any) => api.post('/auth/login', credentials),
  
  // Registro
  register: (userData: any) => api.post('/auth/register', userData),
  
  // Refresh token
  refresh: (refreshToken: string) => api.post('/auth/refresh', { refreshToken }),
  
  // Logout
  logout: () => api.post('/auth/logout'),
};

export default api;