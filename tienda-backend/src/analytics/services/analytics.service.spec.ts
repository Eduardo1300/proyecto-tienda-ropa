import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsEvent, EventType } from '../entities/analytics-event.entity';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let analyticsRepo: jest.Mocked<Repository<AnalyticsEvent>>;

  const mockEvent: Partial<AnalyticsEvent> = {
    id: 1,
    eventType: EventType.PAGE_VIEW,
    userId: 1,
    sessionId: 'session-123',
    productId: 1,
    orderId: 1,
    value: 99.99,
    currency: 'USD',
    page: '/products/1',
  };

  beforeEach(async () => {
    const mockAnalyticsRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(AnalyticsEvent),
          useValue: mockAnalyticsRepo,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    analyticsRepo = module.get(getRepositoryToken(AnalyticsEvent));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('trackEvent', () => {
    it('should create and save an event', async () => {
      analyticsRepo.create.mockReturnValue(mockEvent as AnalyticsEvent);
      analyticsRepo.save.mockResolvedValue(mockEvent as AnalyticsEvent);

      const eventData = {
        eventType: EventType.PAGE_VIEW,
        userId: 1,
        page: '/products/1',
      };

      const result = await service.trackEvent(eventData);

      expect(analyticsRepo.create).toHaveBeenCalledWith(eventData);
      expect(analyticsRepo.save).toHaveBeenCalledWith(mockEvent);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('getDashboardMetrics', () => {
    it('should return dashboard metrics', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawOne: jest.fn()
          .mockResolvedValueOnce({ count: '100' })
          .mockResolvedValueOnce({ total: '10000' }),
        getRawMany: jest.fn().mockResolvedValue([
          { productId: '1', views: '50' },
        ]),
      };
      analyticsRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);
      analyticsRepo.count.mockResolvedValue(1000);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      const result = await service.getDashboardMetrics(startDate, endDate);

      expect(result.totalPageViews).toBe(1000);
      expect(result.uniqueVisitors).toBe(100);
      expect(result.totalPurchases).toBe(1000);
      expect(result.totalRevenue).toBe(10000);
    });

    it('should handle zero visitors', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        getRawOne: jest.fn()
          .mockResolvedValueOnce({ count: '0' })
          .mockResolvedValueOnce({ total: '0' }),
        getRawMany: jest.fn().mockResolvedValue([]),
      };
      analyticsRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);
      analyticsRepo.count.mockResolvedValue(0);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      const result = await service.getDashboardMetrics(startDate, endDate);

      expect(result.conversionRate).toBe(0);
      expect(result.averageOrderValue).toBe(0);
    });
  });

  describe('getUserBehaviorFunnel', () => {
    it('should return funnel metrics', async () => {
      analyticsRepo.count
        .mockResolvedValueOnce(10000)
        .mockResolvedValueOnce(5000)
        .mockResolvedValueOnce(1000)
        .mockResolvedValueOnce(200);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      const result = await service.getUserBehaviorFunnel(startDate, endDate);

      expect(result.pageViews).toBe(10000);
      expect(result.productViews).toBe(5000);
      expect(result.addToCarts).toBe(1000);
      expect(result.purchases).toBe(200);
    });

    it('should handle zero page views', async () => {
      analyticsRepo.count.mockResolvedValue(0);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      const result = await service.getUserBehaviorFunnel(startDate, endDate);

      expect(result.funnelRates.viewToProduct).toBe(0);
      expect(result.funnelRates.overallConversion).toBe(0);
    });
  });

  describe('getSearchAnalytics', () => {
    it('should return search analytics', async () => {
      analyticsRepo.count.mockResolvedValue(100);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      const result = await service.getSearchAnalytics(startDate, endDate);

      expect(result.totalSearches).toBe(100);
      expect(result.topSearchTerms).toBeDefined();
    });
  });

  describe('getCouponAnalytics', () => {
    it('should return coupon analytics', async () => {
      analyticsRepo.count.mockResolvedValue(50);

      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-01-31');

      const result = await service.getCouponAnalytics(startDate, endDate);

      expect(result.totalCouponUsage).toBe(50);
      expect(result.topCoupons).toBeDefined();
    });
  });
});
