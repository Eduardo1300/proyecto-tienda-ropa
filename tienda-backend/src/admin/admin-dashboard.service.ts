import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../ordenes/entities/order.entity';
import { OrderItem } from '../ordenes/entities/order-item.entity';
import { Review } from '../reviews/entities/review.entity';
import { StockMovement } from '../inventory/entities/stock-movement.entity';
import { InventoryAlert, AlertStatus } from '../inventory/entities/inventory-alert.entity';
import { 
  DashboardOverview,
  SalesDataPoint,
  ProductStat,
  CustomerStat,
  ReviewStat,
  InventoryAlertDto,
  OrdersStatsResponse 
} from './dto/dashboard.dto';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(StockMovement)
    private readonly stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(InventoryAlert)
    private readonly inventoryAlertRepository: Repository<InventoryAlert>,
  ) {}

  async getOverview(period: string): Promise<DashboardOverview> {
    const days = this.parsePeriod(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const previousStartDate = new Date();
    previousStartDate.setDate(previousStartDate.getDate() - days * 2);

    // Current period data
    const [
      currentSales,
      currentOrders,
      currentCustomers,
      totalProducts,
      previousSales,
      previousOrders,
      previousCustomers,
    ] = await Promise.all([
      this.getSalesForPeriod(startDate),
      this.getOrdersForPeriod(startDate),
      this.getNewCustomersForPeriod(startDate),
      this.productRepository.count({ where: { isActive: true } }),
      this.getSalesForPeriod(previousStartDate, startDate),
      this.getOrdersForPeriod(previousStartDate, startDate),
      this.getNewCustomersForPeriod(previousStartDate, startDate),
    ]);

    const topCategories = await this.getTopCategories(startDate);

    return {
      totalSales: currentSales.total,
      salesGrowth: this.calculateGrowth(currentSales.total, previousSales.total),
      totalOrders: currentOrders.count,
      ordersGrowth: this.calculateGrowth(currentOrders.count, previousOrders.count),
      totalCustomers: currentCustomers,
      customersGrowth: this.calculateGrowth(currentCustomers, previousCustomers),
      totalProducts,
      productsGrowth: 0, // Could implement product growth tracking
      averageOrderValue: currentOrders.count > 0 ? currentSales.total / currentOrders.count : 0,
      conversionRate: 0, // Would need website visits data
      topSellingCategories: topCategories,
    };
  }

  async getSalesData(period: string, granularity: string): Promise<SalesDataPoint[]> {
    const days = this.parsePeriod(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const interval = granularity === 'day' ? '1 day' : granularity === 'week' ? '1 week' : '1 month';

    const salesData = await this.orderRepository
      .createQueryBuilder('order')
      .select([
        `DATE_TRUNC('${granularity}', order.createdAt) as date`,
        'SUM(order.total) as sales',
        'COUNT(order.id) as orders',
        'COUNT(DISTINCT order.userId) as customers'
      ])
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.status != :status', { status: 'cancelled' })
      .groupBy(`DATE_TRUNC('${granularity}', order.createdAt)`)
      .orderBy('date', 'ASC')
      .getRawMany();

    return salesData.map(data => ({
      date: data.date,
      sales: parseFloat(data.sales) || 0,
      orders: parseInt(data.orders) || 0,
      customers: parseInt(data.customers) || 0,
    }));
  }

  async getProductsStats(limit: number): Promise<ProductStat[]> {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.orderItems', 'orderItem')
      .leftJoinAndSelect('orderItem.order', 'order')
      .select([
        'product.id',
        'product.name',
        'product.stock',
        'product.viewCount',
        'COALESCE(SUM(orderItem.quantity), 0) as sales',
        'COALESCE(SUM(orderItem.quantity * orderItem.price), 0) as revenue'
      ])
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('(order.status != :status OR order.status IS NULL)', { status: 'cancelled' })
      .groupBy('product.id, product.name, product.stock, product.viewCount')
      .orderBy('revenue', 'DESC')
      .limit(limit)
      .getRawMany();

    return products.map(product => ({
      id: product.product_id,
      name: product.product_name,
      sales: parseInt(product.sales),
      revenue: parseFloat(product.revenue),
      stock: product.product_stock,
      views: product.product_viewCount || 0,
    }));
  }

  async getCustomersStats(limit: number): Promise<CustomerStat[]> {
    const customers = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.orders', 'order')
      .select([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'COUNT(order.id) as orders',
        'COALESCE(SUM(order.total), 0) as totalSpent',
        'MAX(order.createdAt) as lastOrder'
      ])
      .where('order.status != :status OR order.status IS NULL', { status: 'cancelled' })
      .groupBy('user.id, user.firstName, user.lastName, user.email')
      .orderBy('totalSpent', 'DESC')
      .limit(limit)
      .getRawMany();

    return customers.map(customer => ({
      id: customer.user_id,
      name: `${customer.user_firstName || ''} ${customer.user_lastName || ''}`.trim(),
      email: customer.user_email,
      orders: parseInt(customer.orders),
      totalSpent: parseFloat(customer.totalSpent),
      lastOrder: customer.lastOrder,
    }));
  }

  async getInventoryAlerts(): Promise<InventoryAlertDto[]> {
    const alerts = await this.inventoryAlertRepository.find({
      relations: ['product'],
      where: { status: AlertStatus.ACTIVE },
      order: { createdAt: 'DESC' },
      take: 20,
    });

    return alerts.map(alert => ({
      id: alert.id,
      type: alert.type,
      message: alert.message,
      productId: alert.product?.id,
      productName: alert.product?.name,
      priority: alert.priority,
      createdAt: alert.createdAt,
    }));
  }

  async getReviewsStats(limit: number): Promise<ReviewStat[]> {
    const reviews = await this.reviewRepository.find({
      relations: ['user', 'product'],
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return reviews.map(review => ({
      id: review.id,
      productName: review.product.name,
      customerName: `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim(),
      rating: review.rating,
      comment: review.comment.substring(0, 100) + (review.comment.length > 100 ? '...' : ''),
      createdAt: review.createdAt,
      needsResponse: !review.adminResponse && review.rating <= 3,
    }));
  }

  async getOrdersStats(page: number, limit: number, status?: string): Promise<OrdersStatsResponse> {
    const skip = (page - 1) * limit;
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (status) {
      queryBuilder.where('order.status = :status', { status });
    }

    const [orders, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('order.createdAt', 'DESC')
      .getManyAndCount();

    return {
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: `#${order.id.toString().padStart(6, '0')}`,
        customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
        customerEmail: order.user.email,
        total: order.total,
        status: order.status,
        itemsCount: order.items.length,
        createdAt: order.createdAt,
      })),
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    };
  }

  private parsePeriod(period: string): number {
    const match = period.match(/(\d+)([dwmy])/);
    if (!match) return 7; // default to 7 days

    const [, amount, unit] = match;
    const multipliers = { d: 1, w: 7, m: 30, y: 365 };
    return parseInt(amount) * (multipliers[unit as keyof typeof multipliers] || 1);
  }

  private async getSalesForPeriod(startDate: Date, endDate?: Date) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total)', 'total')
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.status != :status', { status: 'cancelled' });

    if (endDate) {
      queryBuilder.andWhere('order.createdAt < :endDate', { endDate });
    }

    const result = await queryBuilder.getRawOne();
    return { total: parseFloat(result.total) || 0 };
  }

  private async getOrdersForPeriod(startDate: Date, endDate?: Date) {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.status != :status', { status: 'cancelled' });

    if (endDate) {
      queryBuilder.andWhere('order.createdAt < :endDate', { endDate });
    }

    const count = await queryBuilder.getCount();
    return { count };
  }

  private async getNewCustomersForPeriod(startDate: Date, endDate?: Date): Promise<number> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.createdAt >= :startDate', { startDate });

    if (endDate) {
      queryBuilder.andWhere('user.createdAt < :endDate', { endDate });
    }

    return queryBuilder.getCount();
  }

  private async getTopCategories(startDate: Date) {
    const categories = await this.orderItemRepository
      .createQueryBuilder('orderItem')
      .leftJoin('orderItem.product', 'product')
      .leftJoin('orderItem.order', 'order')
      .select([
        'product.category as category',
        'SUM(orderItem.quantity * orderItem.price) as sales'
      ])
      .where('order.createdAt >= :startDate', { startDate })
      .andWhere('order.status != :status', { status: 'cancelled' })
      .groupBy('product.category')
      .orderBy('sales', 'DESC')
      .limit(5)
      .getRawMany();

    return categories.map(cat => ({
      category: cat.category,
      sales: parseFloat(cat.sales),
      growth: 0, // Would need historical data for growth calculation
    }));
  }

  private calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }
}
