import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AnalyticsEvent, EventType } from '../entities/analytics-event.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AnalyticsEvent)
    private analyticsRepository: Repository<AnalyticsEvent>,
  ) {}

  async trackEvent(eventData: Partial<AnalyticsEvent>): Promise<AnalyticsEvent> {
    const event = this.analyticsRepository.create(eventData);
    return await this.analyticsRepository.save(event);
  }

  async getDashboardMetrics(startDate: Date, endDate: Date): Promise<{
    totalPageViews: number;
    uniqueVisitors: number;
    totalPurchases: number;
    totalRevenue: number;
    conversionRate: number;
    topProducts: any[];
    topPages: any[];
    userRegistrations: number;
    averageOrderValue: number;
  }> {
    const dateRange = Between(startDate, endDate);

    // Total page views
    const totalPageViews = await this.analyticsRepository.count({
      where: { eventType: EventType.PAGE_VIEW, createdAt: dateRange }
    });

    // Unique visitors
    const uniqueVisitorsResult = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.sessionId)', 'count')
      .where('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();
    const uniqueVisitors = parseInt(uniqueVisitorsResult.count);

    // Total purchases
    const totalPurchases = await this.analyticsRepository.count({
      where: { eventType: EventType.PURCHASE, createdAt: dateRange }
    });

    // Total revenue
    const revenueResult = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('SUM(event.value)', 'total')
      .where('event.eventType = :eventType', { eventType: EventType.PURCHASE })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();
    const totalRevenue = parseFloat(revenueResult.total) || 0;

    // Conversion rate
    const conversionRate = uniqueVisitors > 0 ? (totalPurchases / uniqueVisitors) * 100 : 0;

    // Average order value
    const averageOrderValue = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;

    // Top products
    const topProducts = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('event.productId', 'productId')
      .addSelect('COUNT(*)', 'views')
      .where('event.eventType = :eventType', { eventType: EventType.PRODUCT_VIEW })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('event.productId IS NOT NULL')
      .groupBy('event.productId')
      .orderBy('views', 'DESC')
      .limit(10)
      .getRawMany();

    // Top pages
    const topPages = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('event.page', 'page')
      .addSelect('COUNT(*)', 'views')
      .where('event.eventType = :eventType', { eventType: EventType.PAGE_VIEW })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('event.page IS NOT NULL')
      .groupBy('event.page')
      .orderBy('views', 'DESC')
      .limit(10)
      .getRawMany();

    // User registrations
    const userRegistrations = await this.analyticsRepository.count({
      where: { eventType: EventType.USER_REGISTRATION, createdAt: dateRange }
    });

    return {
      totalPageViews,
      uniqueVisitors,
      totalPurchases,
      totalRevenue,
      conversionRate,
      topProducts,
      topPages,
      userRegistrations,
      averageOrderValue
    };
  }

  async getRevenueByDay(startDate: Date, endDate: Date): Promise<any[]> {
    return await this.analyticsRepository
      .createQueryBuilder('event')
      .select('DATE(event.createdAt)', 'date')
      .addSelect('SUM(event.value)', 'revenue')
      .addSelect('COUNT(*)', 'orders')
      .where('event.eventType = :eventType', { eventType: EventType.PURCHASE })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('DATE(event.createdAt)')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  async getTopProductsByRevenue(startDate: Date, endDate: Date, limit: number = 10): Promise<any[]> {
    return await this.analyticsRepository
      .createQueryBuilder('event')
      .select('event.productId', 'productId')
      .addSelect('SUM(event.value)', 'revenue')
      .addSelect('COUNT(*)', 'purchases')
      .where('event.eventType = :eventType', { eventType: EventType.PURCHASE })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('event.productId IS NOT NULL')
      .groupBy('event.productId')
      .orderBy('revenue', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getUserBehaviorFunnel(startDate: Date, endDate: Date): Promise<{
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
  }> {
    const dateRange = Between(startDate, endDate);

    const pageViews = await this.analyticsRepository.count({
      where: { eventType: EventType.PAGE_VIEW, createdAt: dateRange }
    });

    const productViews = await this.analyticsRepository.count({
      where: { eventType: EventType.PRODUCT_VIEW, createdAt: dateRange }
    });

    const addToCarts = await this.analyticsRepository.count({
      where: { eventType: EventType.ADD_TO_CART, createdAt: dateRange }
    });

    const purchases = await this.analyticsRepository.count({
      where: { eventType: EventType.PURCHASE, createdAt: dateRange }
    });

    return {
      pageViews,
      productViews,
      addToCarts,
      purchases,
      funnelRates: {
        viewToProduct: pageViews > 0 ? (productViews / pageViews) * 100 : 0,
        productToCart: productViews > 0 ? (addToCarts / productViews) * 100 : 0,
        cartToPurchase: addToCarts > 0 ? (purchases / addToCarts) * 100 : 0,
        overallConversion: pageViews > 0 ? (purchases / pageViews) * 100 : 0
      }
    };
  }

  async getSearchAnalytics(startDate: Date, endDate: Date): Promise<{
    totalSearches: number;
    topSearchTerms: any[];
    averageResultsPerSearch: number;
    zeroResultSearches: number;
  }> {
    const dateRange = Between(startDate, endDate);

    const totalSearches = await this.analyticsRepository.count({
      where: { eventType: EventType.PRODUCT_SEARCH, createdAt: dateRange }
    });

    const topSearchTerms = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('event.eventData->>"$.searchTerm"', 'searchTerm')
      .addSelect('COUNT(*)', 'count')
      .where('event.eventType = :eventType', { eventType: EventType.PRODUCT_SEARCH })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('searchTerm')
      .orderBy('count', 'DESC')
      .limit(20)
      .getRawMany();

    const avgResultsResult = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('AVG(CAST(event.eventData->>"$.resultsCount" AS UNSIGNED))', 'average')
      .where('event.eventType = :eventType', { eventType: EventType.PRODUCT_SEARCH })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    const averageResultsPerSearch = parseFloat(avgResultsResult.average) || 0;

    const zeroResultSearches = await this.analyticsRepository
      .createQueryBuilder('event')
      .where('event.eventType = :eventType', { eventType: EventType.PRODUCT_SEARCH })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('CAST(event.eventData->>"$.resultsCount" AS UNSIGNED) = 0')
      .getCount();

    return {
      totalSearches,
      topSearchTerms,
      averageResultsPerSearch,
      zeroResultSearches
    };
  }

  async getCouponAnalytics(startDate: Date, endDate: Date): Promise<{
    totalCouponUsage: number;
    topCoupons: any[];
    totalDiscount: number;
    conversionRate: number;
  }> {
    const dateRange = Between(startDate, endDate);

    const totalCouponUsage = await this.analyticsRepository.count({
      where: { eventType: EventType.COUPON_APPLIED, createdAt: dateRange }
    });

    const topCoupons = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('event.eventData->>"$.couponCode"', 'couponCode')
      .addSelect('COUNT(*)', 'usage')
      .addSelect('SUM(CAST(event.eventData->>"$.discountAmount" AS DECIMAL(10,2)))', 'totalDiscount')
      .where('event.eventType = :eventType', { eventType: EventType.COUPON_APPLIED })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('couponCode')
      .orderBy('usage', 'DESC')
      .limit(10)
      .getRawMany();

    const totalDiscountResult = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('SUM(CAST(event.eventData->>"$.discountAmount" AS DECIMAL(10,2)))', 'total')
      .where('event.eventType = :eventType', { eventType: EventType.COUPON_APPLIED })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    const totalDiscount = parseFloat(totalDiscountResult.total) || 0;

    // Calcular tasa de conversión de cupones (simplificado)
    const purchasesWithCoupons = await this.analyticsRepository
      .createQueryBuilder('event')
      .where('event.eventType = :eventType', { eventType: EventType.PURCHASE })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('event.eventData->>"$.couponUsed" = "true"')
      .getCount();

    const conversionRate = totalCouponUsage > 0 ? (purchasesWithCoupons / totalCouponUsage) * 100 : 0;

    return {
      totalCouponUsage,
      topCoupons,
      totalDiscount,
      conversionRate
    };
  }

  async getCustomerSegmentation(startDate: Date, endDate: Date): Promise<{
    newCustomers: number;
    returningCustomers: number;
    vipCustomers: number;
    customerLifetimeValue: any[];
  }> {
    // Nuevos clientes (primera compra en el período)
    const newCustomers = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.userId)', 'count')
      .where('event.eventType = :eventType', { eventType: EventType.PURCHASE })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere(`event.userId NOT IN (
        SELECT DISTINCT e2.userId FROM analytics_events e2 
        WHERE e2.eventType = 'purchase' AND e2.createdAt < :startDate
      )`, { startDate })
      .getRawOne();

    // Clientes recurrentes
    const returningCustomers = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.userId)', 'count')
      .where('event.eventType = :eventType', { eventType: EventType.PURCHASE })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere(`event.userId IN (
        SELECT DISTINCT e2.userId FROM analytics_events e2 
        WHERE e2.eventType = 'purchase' AND e2.createdAt < :startDate
      )`, { startDate })
      .getRawOne();

    // Clientes VIP (más de $1000 en compras)
    const vipCustomers = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.userId)', 'count')
      .where('event.eventType = :eventType', { eventType: EventType.PURCHASE })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere(`event.userId IN (
        SELECT e2.userId FROM analytics_events e2 
        WHERE e2.eventType = 'purchase' 
        GROUP BY e2.userId 
        HAVING SUM(e2.value) > 1000
      )`)
      .getRawOne();

    // Customer Lifetime Value
    const customerLifetimeValue = await this.analyticsRepository
      .createQueryBuilder('event')
      .select('event.userId', 'userId')
      .addSelect('SUM(event.value)', 'totalValue')
      .addSelect('COUNT(*)', 'totalOrders')
      .addSelect('AVG(event.value)', 'averageOrderValue')
      .where('event.eventType = :eventType', { eventType: EventType.PURCHASE })
      .groupBy('event.userId')
      .orderBy('totalValue', 'DESC')
      .limit(100)
      .getRawMany();

    return {
      newCustomers: parseInt(newCustomers.count),
      returningCustomers: parseInt(returningCustomers.count),
      vipCustomers: parseInt(vipCustomers.count),
      customerLifetimeValue
    };
  }
}
