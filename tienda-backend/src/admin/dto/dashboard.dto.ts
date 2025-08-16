export interface DashboardOverview {
  totalSales: number;
  salesGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
  totalProducts: number;
  productsGrowth: number;
  averageOrderValue: number;
  conversionRate: number;
  topSellingCategories: Array<{
    category: string;
    sales: number;
    growth: number;
  }>;
}

export interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
  customers: number;
}

export interface ProductStat {
  id: number;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
  views: number;
}

export interface CustomerStat {
  id: number;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: Date;
}

export interface ReviewStat {
  id: number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  needsResponse: boolean;
}

export interface InventoryAlertDto {
  id: number;
  type: string;
  message: string;
  productId?: number;
  productName?: string;
  priority: string;
  createdAt: Date;
}

export interface OrdersStatsResponse {
  orders: Array<{
    id: number;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: string;
    itemsCount: number;
    createdAt: Date;
  }>;
  total: number;
  pages: number;
  currentPage: number;
}
