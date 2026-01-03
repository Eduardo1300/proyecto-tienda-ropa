import api from './api';

// Types for Inventory
export interface StockMovement {
  id: number;
  product: any; // Product entity
  type: 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'RESTOCK' | 'EXPIRED' | 'DAMAGED';
  reason: 'SALE' | 'PURCHASE' | 'RETURN_CUSTOMER' | 'RETURN_SUPPLIER' | 'DAMAGE' | 'EXPIRATION' | 'THEFT' | 'ADJUSTMENT' | 'RESTOCK' | 'PROMOTION' | 'TRANSFER';
  quantity: number;
  previousStock: number;
  newStock: number;
  unitCost?: number;
  totalCost?: number;
  batch?: string;
  expirationDate?: Date;
  location: string;
  notes: string;
  referenceNumber: string;
  createdBy: any; // User entity
  createdAt: Date;
}

export interface InventoryAlert {
  id: number;
  product: any; // Product entity
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'EXPIRED' | 'EXPIRING_SOON' | 'OVERSTOCK' | 'REORDER_POINT';
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  threshold?: number;
  currentValue: number;
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  acknowledgedBy?: any; // User entity
  acknowledgedAt?: Date;
  acknowledgedNotes?: string;
  resolvedBy?: any; // User entity
  resolvedAt?: Date;
  resolutionNotes?: string;
  expirationDate?: Date;
  emailSent: boolean;
  emailSentAt?: Date;
  createdAt: Date;
}

export interface InventoryValue {
  totalValue: number;
  totalCost: number;
  products: number;
}

export interface UpdateStockData {
  productId: number;
  quantity: number;
  type: 'PURCHASE' | 'SALE' | 'RETURN' | 'ADJUSTMENT' | 'RESTOCK' | 'EXPIRED' | 'DAMAGED';
  reason: 'SALE' | 'PURCHASE' | 'RETURN_CUSTOMER' | 'RETURN_SUPPLIER' | 'DAMAGE' | 'EXPIRATION' | 'THEFT' | 'ADJUSTMENT' | 'RESTOCK' | 'PROMOTION' | 'TRANSFER';
  unitCost?: number;
  batch?: string;
  expirationDate?: Date;
  location?: string;
  notes?: string;
  referenceNumber?: string;
}

export interface ReserveStockData {
  productId: number;
  quantity: number;
}

export interface AlertActionData {
  notes?: string;
}

export interface MovementFilters {
  productId?: number;
  startDate?: string;
  endDate?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

// Inventory API functions
export const inventoryAPI = {
  // Stock Management
  updateStock: (updateData: UpdateStockData) => 
    api.post<StockMovement>('/inventory/stock/update', updateData),

  reserveStock: (reserveData: ReserveStockData) => 
    api.post<{ message: string }>('/inventory/stock/reserve', reserveData),

  releaseStock: (reserveData: ReserveStockData) => 
    api.post<{ message: string }>('/inventory/stock/release', reserveData),

  // Inventory Reports
  getLowStockProducts: () => 
    api.get<any[]>('/inventory/reports/low-stock'),

  getExpiringProducts: (days?: number) => 
    api.get<any[]>('/inventory/reports/expiring', { params: days ? { days } : {} }),

  getExpiredProducts: () => 
    api.get<any[]>('/inventory/reports/expired'),

  getInventoryValue: () => 
    api.get<InventoryValue>('/inventory/reports/value'),

  getStockMovements: (filters?: MovementFilters) => 
    api.get<StockMovement[]>('/inventory/movements', { params: filters }),

  // Alert Management
  getActiveAlerts: () => 
    api.get<InventoryAlert[]>('/inventory/alerts'),

  acknowledgeAlert: (alertId: number, actionData?: AlertActionData) => 
    api.put<InventoryAlert>(`/inventory/alerts/${alertId}/acknowledge`, actionData || {}),

  resolveAlert: (alertId: number, actionData?: AlertActionData) => 
    api.put<InventoryAlert>(`/inventory/alerts/${alertId}/resolve`, actionData || {}),

  // Manual Tasks
  checkInventoryAlerts: () => 
    api.post<{ message: string }>('/inventory/alerts/check'),

  processAutoRestock: () => 
    api.post<{ message: string }>('/inventory/restock/process'),

  // Supplier Management
  getSuppliers: () => 
    api.get<any[]>('/suppliers'),
};

export default inventoryAPI;
