import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Public } from '../../auth/decorators/public.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { RequestUser } from '../../common/types/user.types';
import { AnalyticsService } from '../services/analytics.service';
import { EventType } from '../entities/analytics-event.entity';

// DTOs
export class TrackEventDto {
  eventType: EventType;
  userId?: number;
  sessionId?: string;
  productId?: number;
  page?: string;
  value?: number;
  eventData?: any;
}

export class DateRangeDto {
  startDate: string;
  endDate: string;
}

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Endpoint de prueba sin autenticación (temporal para debugging)
  @Public()
  @Get('test')
  async testEndpoint() {
    return {
      success: true,
      message: 'Analytics API is working',
      timestamp: new Date().toISOString()
    };
  }

  // Endpoint público para ver datos de analytics (sin autenticación)
  @Public()
  @Get('public/dashboard')
  async getPublicDashboard(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string
  ) {
    try {
      const startDate = startDateStr 
        ? new Date(startDateStr) 
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = endDateStr 
        ? new Date(endDateStr) 
        : new Date();

      const [
        dashboardMetrics,
        revenueByDay,
        topProducts,
        userBehaviorFunnel,
        searchAnalytics,
        couponAnalytics,
        customerSegmentation
      ] = await Promise.all([
        this.analyticsService.getDashboardMetrics(startDate, endDate),
        this.analyticsService.getRevenueByDay(startDate, endDate),
        this.analyticsService.getTopProductsByRevenue(startDate, endDate),
        this.analyticsService.getUserBehaviorFunnel(startDate, endDate),
        this.analyticsService.getSearchAnalytics(startDate, endDate),
        this.analyticsService.getCouponAnalytics(startDate, endDate),
        this.analyticsService.getCustomerSegmentation(startDate, endDate)
      ]);

      return {
        success: true,
        data: {
          period: { startDate, endDate },
          overview: dashboardMetrics,
          revenue: revenueByDay,
          topProducts: topProducts,
          userBehavior: userBehaviorFunnel,
          search: searchAnalytics,
          coupons: couponAnalytics,
          customers: customerSegmentation
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener dashboard de analytics',
        error: error.message,
      };
    }
  }

  // Endpoint para crear datos de prueba
  @Public()
  @Post('test/create-sample-data')
  async createSampleData() {
    try {
      // Crear eventos de ejemplo
      const sampleEvents: any[] = [];
      
      // Page views
      for (let i = 0; i < 10; i++) {
        sampleEvents.push(await this.analyticsService.trackEvent({
          eventType: EventType.PAGE_VIEW,
          sessionId: `session_${i}`,
          page: `/page_${i % 3}`,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }));
      }

      // Product views
      for (let i = 0; i < 8; i++) {
        sampleEvents.push(await this.analyticsService.trackEvent({
          eventType: EventType.PRODUCT_VIEW,
          sessionId: `session_${i}`,
          productId: i + 1,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }));
      }

      // Purchases
      for (let i = 0; i < 5; i++) {
        sampleEvents.push(await this.analyticsService.trackEvent({
          eventType: EventType.PURCHASE,
          sessionId: `session_${i}`,
          userId: i + 1,
          orderId: i + 1001,
          value: Math.random() * 200 + 50,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
        }));
      }

      return {
        success: true,
        message: `Created ${sampleEvents.length} sample analytics events`,
        data: sampleEvents.length
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error creating sample data',
        error: error.message
      };
    }
  }

  @Post('track')
  @UseGuards(JwtAuthGuard)
  async trackEvent(
    @GetUser() user: RequestUser,
    @Body() trackData: TrackEventDto
  ) {
    try {
      const eventData = {
        eventType: trackData.eventType,
        userId: user.id,
        sessionId: trackData.sessionId,
        productId: trackData.productId,
        page: trackData.page,
        value: trackData.value,
        eventData: trackData.eventData,
        createdAt: new Date()
      };

      const event = await this.analyticsService.trackEvent(eventData);

      return {
        success: true,
        data: event,
        message: 'Evento registrado correctamente',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al registrar evento',
        error: error.message,
      };
    }
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async getDashboard(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string
  ) {
    try {
      const startDate = startDateStr 
        ? new Date(startDateStr) 
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 días atrás
      const endDate = endDateStr 
        ? new Date(endDateStr) 
        : new Date();

      const [
        dashboardMetrics,
        revenueByDay,
        topProducts,
        userBehaviorFunnel,
        searchAnalytics,
        couponAnalytics,
        customerSegmentation
      ] = await Promise.all([
        this.analyticsService.getDashboardMetrics(startDate, endDate),
        this.analyticsService.getRevenueByDay(startDate, endDate),
        this.analyticsService.getTopProductsByRevenue(startDate, endDate),
        this.analyticsService.getUserBehaviorFunnel(startDate, endDate),
        this.analyticsService.getSearchAnalytics(startDate, endDate),
        this.analyticsService.getCouponAnalytics(startDate, endDate),
        this.analyticsService.getCustomerSegmentation(startDate, endDate)
      ]);

      return {
        success: true,
        data: {
          period: { startDate, endDate },
          overview: dashboardMetrics,
          revenue: revenueByDay,
          topProducts: topProducts,
          userBehavior: userBehaviorFunnel,
          search: searchAnalytics,
          coupons: couponAnalytics,
          customers: customerSegmentation
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener dashboard de analytics',
        error: error.message,
      };
    }
  }

  @Get('sales')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getSalesMetrics(@Query() dateRange: DateRangeDto) {
    try {
      const startDate = dateRange.startDate 
        ? new Date(dateRange.startDate) 
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = dateRange.endDate 
        ? new Date(dateRange.endDate) 
        : new Date();

      const [dashboardMetrics, revenueByDay] = await Promise.all([
        this.analyticsService.getDashboardMetrics(startDate, endDate),
        this.analyticsService.getRevenueByDay(startDate, endDate)
      ]);

      return {
        success: true,
        data: {
          overview: dashboardMetrics,
          revenueByDay: revenueByDay
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener métricas de ventas',
        error: error.message,
      };
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUserActivity(
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string
  ) {
    try {
      const startDate = startDateStr 
        ? new Date(startDateStr) 
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = endDateStr 
        ? new Date(endDateStr) 
        : new Date();

      const [userBehavior, customerSegmentation] = await Promise.all([
        this.analyticsService.getUserBehaviorFunnel(startDate, endDate),
        this.analyticsService.getCustomerSegmentation(startDate, endDate)
      ]);

      return {
        success: true,
        data: {
          behavior: userBehavior,
          segmentation: customerSegmentation
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener actividad de usuarios',
        error: error.message,
      };
    }
  }

  @Get('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getProductPerformance(@Query() dateRange: DateRangeDto) {
    try {
      const startDate = dateRange.startDate 
        ? new Date(dateRange.startDate) 
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = dateRange.endDate 
        ? new Date(dateRange.endDate) 
        : new Date();

      const topProducts = await this.analyticsService.getTopProductsByRevenue(startDate, endDate, 20);

      return {
        success: true,
        data: {
          topProductsByRevenue: topProducts
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener rendimiento de productos',
        error: error.message,
      };
    }
  }

  @Get('conversion')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getConversionFunnel(@Query() dateRange: DateRangeDto) {
    try {
      const startDate = dateRange.startDate 
        ? new Date(dateRange.startDate) 
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = dateRange.endDate 
        ? new Date(dateRange.endDate) 
        : new Date();

      const conversionMetrics = await this.analyticsService.getUserBehaviorFunnel(startDate, endDate);

      return {
        success: true,
        data: conversionMetrics,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener métricas de conversión',
        error: error.message,
      };
    }
  }

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getSearchAnalytics(@Query() dateRange: DateRangeDto) {
    try {
      const startDate = dateRange.startDate 
        ? new Date(dateRange.startDate) 
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = dateRange.endDate 
        ? new Date(dateRange.endDate) 
        : new Date();

      const searchMetrics = await this.analyticsService.getSearchAnalytics(startDate, endDate);

      return {
        success: true,
        data: searchMetrics,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener analytics de búsquedas',
        error: error.message,
      };
    }
  }

  @Get('coupons')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getCouponAnalytics(@Query() dateRange: DateRangeDto) {
    try {
      const startDate = dateRange.startDate 
        ? new Date(dateRange.startDate) 
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = dateRange.endDate 
        ? new Date(dateRange.endDate) 
        : new Date();

      const couponMetrics = await this.analyticsService.getCouponAnalytics(startDate, endDate);

      return {
        success: true,
        data: couponMetrics,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener analytics de cupones',
        error: error.message,
      };
    }
  }

  @Get('customers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getCustomerSegmentation(@Query() dateRange: DateRangeDto) {
    try {
      const startDate = dateRange.startDate 
        ? new Date(dateRange.startDate) 
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = dateRange.endDate 
        ? new Date(dateRange.endDate) 
        : new Date();

      const customerMetrics = await this.analyticsService.getCustomerSegmentation(startDate, endDate);

      return {
        success: true,
        data: customerMetrics,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener segmentación de clientes',
        error: error.message,
      };
    }
  }

  // Endpoints públicos para tracking básico
  @Post('track/page-view')
  async trackPageView(@Body() data: { page: string; userId?: number; sessionId?: string }) {
    try {
      const eventData = {
        eventType: EventType.PAGE_VIEW,
        userId: data.userId,
        sessionId: data.sessionId,
        page: data.page,
        eventData: { page: data.page, timestamp: new Date() },
        createdAt: new Date()
      };

      const event = await this.analyticsService.trackEvent(eventData);

      return {
        success: true,
        data: event,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al registrar vista de página',
      };
    }
  }

  @Post('track/product-view')
  async trackProductView(@Body() data: { productId: number; userId?: number; sessionId?: string }) {
    try {
      const eventData = {
        eventType: EventType.PRODUCT_VIEW,
        userId: data.userId,
        sessionId: data.sessionId,
        productId: data.productId,
        eventData: { timestamp: new Date() },
        createdAt: new Date()
      };

      const event = await this.analyticsService.trackEvent(eventData);

      return {
        success: true,
        data: event,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al registrar vista de producto',
      };
    }
  }
}
