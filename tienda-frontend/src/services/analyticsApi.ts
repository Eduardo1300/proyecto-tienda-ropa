import api from './api';

// Types for Analytics
export interface AnalyticsDateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardMetrics {
  totalPageViews: number;
  uniqueVisitors: number;
  totalPurchases: number;
  totalRevenue: number;
  conversionRate: number;
  topProducts: Array<{
    productId: string;
    views: number;
  }>;
  topPages: Array<{
    page: string;
    views: number;
  }>;
  userRegistrations: number;
  averageOrderValue: number;
}

export interface RevenueByDay {
  date: string;
  revenue: number;
  orders: number;
}

export interface UserBehaviorFunnel {
  pageViews: number;
  productViews: number;
  addToCarts: number;
  purchases: number;
  funnelRates: {
    viewToProduct: number;
    productToCart: number;
    cartToPurchase: number;
    overallConversion: number;
  };
}

export interface SearchAnalytics {
  totalSearches: number;
  topSearchTerms: Array<{
    searchTerm: string;
    count: number;
  }>;
  averageResultsPerSearch: number;
  zeroResultSearches: number;
}

export interface CouponAnalytics {
  totalCouponUsage: number;
  topCoupons: Array<{
    couponCode: string;
    usage: number;
    totalDiscount: number;
  }>;
  totalDiscount: number;
  conversionRate: number;
}

export interface CustomerSegmentation {
  newCustomers: number;
  returningCustomers: number;
  vipCustomers: number;
  customerLifetimeValue: Array<{
    userId: string;
    totalValue: number;
    totalOrders: number;
    averageOrderValue: number;
  }>;
}

export interface TrackEventData {
  eventType: string;
  sessionId?: string;
  productId?: number;
  page?: string;
  value?: number;
  eventData?: any;
}

export interface AnalyticsDashboard {
  period: { startDate: Date; endDate: Date };
  overview: DashboardMetrics;
  revenue: RevenueByDay[];
  topProducts: any[];
  userBehavior: UserBehaviorFunnel;
  search: SearchAnalytics;
  coupons: CouponAnalytics;
  customers: CustomerSegmentation;
}

// Analytics API functions
export const analyticsAPI = {
  // Get complete dashboard
  getDashboard: (dateRange?: AnalyticsDateRange) => 
    api.get<{ success: boolean; data: AnalyticsDashboard }>('/analytics/dashboard', { params: dateRange }),

  // Get sales metrics
  getSalesMetrics: (dateRange?: AnalyticsDateRange) => 
    api.get<{ success: boolean; data: { overview: DashboardMetrics; revenueByDay: RevenueByDay[] } }>('/analytics/sales', { params: dateRange }),

  // Get user activity metrics
  getUserActivity: (dateRange?: AnalyticsDateRange) => 
    api.get<{ success: boolean; data: { behavior: UserBehaviorFunnel; segmentation: CustomerSegmentation } }>('/analytics/users', { params: dateRange }),

  // Get product performance
  getProductPerformance: (dateRange?: AnalyticsDateRange) => 
    api.get<{ success: boolean; data: { topProductsByRevenue: any[] } }>('/analytics/products', { params: dateRange }),

  // Get conversion funnel
  getConversionFunnel: (dateRange?: AnalyticsDateRange) => 
    api.get<{ success: boolean; data: UserBehaviorFunnel }>('/analytics/conversion', { params: dateRange }),

  // Get search analytics
  getSearchAnalytics: (dateRange?: AnalyticsDateRange) => 
    api.get<{ success: boolean; data: SearchAnalytics }>('/analytics/search', { params: dateRange }),

  // Get coupon analytics
  getCouponAnalytics: (dateRange?: AnalyticsDateRange) => 
    api.get<{ success: boolean; data: CouponAnalytics }>('/analytics/coupons', { params: dateRange }),

  // Get customer segmentation
  getCustomerSegmentation: (dateRange?: AnalyticsDateRange) => 
    api.get<{ success: boolean; data: CustomerSegmentation }>('/analytics/customers', { params: dateRange }),

  // Track events
  trackEvent: (eventData: TrackEventData) => 
    api.post<{ success: boolean; data: any; message: string }>('/analytics/track', eventData),

  // Track page view
  trackPageView: (data: { page: string; userId?: number; sessionId?: string }) => 
    api.post<{ success: boolean; data: any }>('/analytics/track/page-view', data),

  // Track product view
  trackProductView: (data: { productId: number; userId?: number; sessionId?: string }) => 
    api.post<{ success: boolean; data: any }>('/analytics/track/product-view', data),
};

export default analyticsAPI;
