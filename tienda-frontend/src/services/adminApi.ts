import type { 
  DashboardOverviewData, 
  SalesDataPoint, 
  ProductStat, 
  CustomerStat, 
  InventoryAlert, 
  ReviewStat, 
  OrdersStat 
} from '../types/admin.types';

const API_BASE_URL = 'http://localhost:3002';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Helper function for API calls
const apiCall = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const adminApi = {
  // Dashboard Overview
  getOverview: async (period: string = '7d'): Promise<DashboardOverviewData> => {
    return apiCall<DashboardOverviewData>(`/admin/dashboard/overview?period=${period}`);
  },

  // Sales Data
  getSalesData: async (period: string = '30d', granularity: string = 'day'): Promise<SalesDataPoint[]> => {
    return apiCall<SalesDataPoint[]>(`/admin/dashboard/sales?period=${period}&granularity=${granularity}`);
  },

  // Products Stats
  getProductsStats: async (limit: number = 10): Promise<ProductStat[]> => {
    return apiCall<ProductStat[]>(`/admin/dashboard/products?limit=${limit}`);
  },

  // Customers Stats
  getCustomersStats: async (limit: number = 10): Promise<CustomerStat[]> => {
    return apiCall<CustomerStat[]>(`/admin/dashboard/customers?limit=${limit}`);
  },

  // Inventory Alerts
  getInventoryAlerts: async (): Promise<InventoryAlert[]> => {
    return apiCall<InventoryAlert[]>('/admin/dashboard/inventory');
  },

  // Reviews Stats
  getReviewsStats: async (limit: number = 10): Promise<ReviewStat[]> => {
    return apiCall<ReviewStat[]>(`/admin/dashboard/reviews?limit=${limit}`);
  },

  // Orders Stats
  getOrdersStats: async (page: number = 1, limit: number = 10, status?: string): Promise<OrdersStat> => {
    const statusParam = status ? `&status=${status}` : '';
    return apiCall<OrdersStat>(`/admin/dashboard/orders?page=${page}&limit=${limit}${statusParam}`);
  },
};
