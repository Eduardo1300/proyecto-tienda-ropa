export interface DashboardOverviewData {
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
  category?: string;
  sales: number;
  revenue: number;
  stock: number;
  views: number;
  rating?: number;
  image?: string;
  trend?: 'up' | 'down';
  trendPercent?: number;
}

export interface CustomerStat {
  id: number;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  lastOrder: Date;
  avatar?: string;
  loyaltyTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  location?: string;
}

export interface InventoryAlert {
  id: number;
  productName: string;
  productSku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  alertType: 'low_stock' | 'out_of_stock' | 'reorder' | 'overstock';
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastRestocked: Date;
  supplier: string;
  estimatedRestockDate?: Date;
  unitCost: number;
  averageSales: number;
  category: string;
  location: string;
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

export interface OrdersStat {
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
