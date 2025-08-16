import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RecentlyViewedService } from '../services/recently-viewed.service';

@Controller('recently-viewed')
@UseGuards(JwtAuthGuard)
export class RecentlyViewedController {
  constructor(private readonly recentlyViewedService: RecentlyViewedService) {}

  @Post('track')
  @HttpCode(HttpStatus.OK)
  async trackView(@Request() req, @Body() body: { productId: number }) {
    await this.recentlyViewedService.trackView(req.user.id, body.productId);
    return { message: 'Vista registrada exitosamente' };
  }

  @Get()
  async getRecentlyViewed(
    @Request() req,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return await this.recentlyViewedService.getRecentlyViewed(req.user.id, limitNum);
  }

  @Get('products')
  async getRecentlyViewedProducts(
    @Request() req,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return await this.recentlyViewedService.getRecentlyViewedProducts(req.user.id, limitNum);
  }

  @Get('most-viewed')
  async getMostViewedProducts(
    @Request() req,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return await this.recentlyViewedService.getMostViewedProducts(req.user.id, limitNum);
  }

  @Get('stats')
  async getViewingStats(@Request() req) {
    return await this.recentlyViewedService.getViewingStats(req.user.id);
  }

  @Get('category/:categoryId')
  async getRecentlyViewedByCategory(
    @Request() req,
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return await this.recentlyViewedService.getRecentlyViewedByCategory(req.user.id, categoryId, limitNum);
  }

  @Get('recommendations')
  async getRecommendationsBasedOnViews(
    @Request() req,
    @Query('limit') limit?: string
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return await this.recentlyViewedService.getRecommendationsBasedOnViews(req.user.id, limitNum);
  }

  @Get('trends')
  async getViewingTrends(
    @Request() req,
    @Query('days') days?: string
  ) {
    const daysNum = days ? parseInt(days, 10) : 30;
    return await this.recentlyViewedService.getViewingTrends(req.user.id, daysNum);
  }

  @Delete('clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearRecentlyViewed(@Request() req) {
    await this.recentlyViewedService.clearRecentlyViewed(req.user.id);
  }

  @Delete('product/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromRecentlyViewed(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number
  ) {
    await this.recentlyViewedService.removeFromRecentlyViewed(req.user.id, productId);
  }
}
