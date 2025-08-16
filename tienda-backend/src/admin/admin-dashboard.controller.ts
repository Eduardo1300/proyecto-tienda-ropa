import { Controller, Get, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { 
  DashboardOverview,
  SalesDataPoint,
  ProductStat,
  CustomerStat,
  ReviewStat,
  InventoryAlertDto,
  OrdersStatsResponse 
} from './dto/dashboard.dto';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, AdminGuard)
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @Get('overview')
  async getOverview(@Query('period') period = '7d'): Promise<DashboardOverview> {
    return this.adminDashboardService.getOverview(period);
  }

  @Get('sales')
  async getSalesData(
    @Query('period') period = '30d',
    @Query('granularity') granularity = 'day'
  ): Promise<SalesDataPoint[]> {
    return this.adminDashboardService.getSalesData(period, granularity);
  }

  @Get('products')
  async getProductsStats(@Query('limit', ParseIntPipe) limit = 10): Promise<ProductStat[]> {
    return this.adminDashboardService.getProductsStats(limit);
  }

  @Get('customers')
  async getCustomersStats(@Query('limit', ParseIntPipe) limit = 10): Promise<CustomerStat[]> {
    return this.adminDashboardService.getCustomersStats(limit);
  }

  @Get('inventory')
  async getInventoryAlerts(): Promise<InventoryAlertDto[]> {
    return this.adminDashboardService.getInventoryAlerts();
  }

  @Get('reviews')
  async getReviewsStats(@Query('limit', ParseIntPipe) limit = 10): Promise<ReviewStat[]> {
    return this.adminDashboardService.getReviewsStats(limit);
  }

  @Get('orders')
  async getOrdersStats(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('status') status?: string
  ): Promise<OrdersStatsResponse> {
    return this.adminDashboardService.getOrdersStats(page, limit, status);
  }
}
