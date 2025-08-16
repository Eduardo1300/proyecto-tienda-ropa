import { IsOptional, IsNumber, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para parámetros de consulta del dashboard
export class DashboardQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

  @IsOptional()
  @IsString()
  period?: 'week' | 'month' | 'year' = 'month';
}

// DTO para parámetros de historial de órdenes
export class OrderHistoryQueryDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

// Interfaces para las respuestas del dashboard
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  loyaltyPoints: number;
  memberSince: Date;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  wishlistItems: number;
}

export interface RecentOrder {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  date: Date;
  itemCount: number;
}

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  discount: number;
  imageUrl?: string;
}

export interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  discount: number;
  imageUrl?: string;
  totalPurchased: number;
}

export interface RecentlyViewedProduct {
  id: number;
  name: string;
  price: number;
  discount: number;
  imageUrl?: string;
}

export interface PendingOrder {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  date: Date;
  estimatedDelivery: Date;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface OrderHistoryItem {
  id: number;
  orderNumber: string;
  status: string;
  total: number;
  date: Date;
  items: OrderItem[];
}

// Response DTOs
export interface UserDashboardResponse {
  user: UserInfo;
  stats: UserStats;
  recentOrders: RecentOrder[];
  wishlist: WishlistItem[];
  favoriteProducts: FavoriteProduct[];
  recentlyViewed: RecentlyViewedProduct[];
  pendingOrders: PendingOrder[];
}

export interface OrderHistoryResponse {
  orders: OrderHistoryItem[];
  total: number;
  pages: number;
  currentPage: number;
}
