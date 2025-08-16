import {
  Controller,
  Get,
  Post,
  Put,
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
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
// import { Role } from '../../users/entities/user.entity'; // Will be imported from auth module
import { 
  ProductReviewService, 
  CreateReviewDto, 
  UpdateReviewDto,
  ReviewFilters 
} from '../services/product-review.service';
import { ReviewStatus } from '../entities/product-review.entity';

@Controller('products/:productId/reviews')
export class ProductReviewController {
  constructor(private readonly reviewService: ProductReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createReviewDto: CreateReviewDto
  ) {
    return await this.reviewService.createReview(req.user.id, productId, createReviewDto);
  }

  @Get()
  async getProductReviews(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('rating') rating?: string,
    @Query('verified') verified?: string,
    @Query('sort') sort?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const sortBy = sort || 'newest';

    const filters: ReviewFilters = {};
    if (rating) filters.rating = parseInt(rating, 10);
    if (verified !== undefined) filters.verified = verified === 'true';

    return await this.reviewService.getProductReviews(productId, pageNum, limitNum, filters, sortBy);
  }

  @Get('summary')
  async getReviewSummary(@Param('productId', ParseIntPipe) productId: number) {
    return await this.reviewService.getReviewSummary(productId);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserReview(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number
  ) {
    return await this.reviewService.getUserReview(req.user.id, productId);
  }
}

@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ProductReviewService) {}

  @Put(':id')
  async updateReview(
    @Request() req,
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    return await this.reviewService.updateReview(req.user.id, reviewId, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(
    @Request() req,
    @Param('id', ParseIntPipe) reviewId: number
  ) {
    await this.reviewService.deleteReview(req.user.id, reviewId);
  }

  @Post(':id/helpful')
  @HttpCode(HttpStatus.OK)
  async markReviewHelpful(
    @Request() req,
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() body: { helpful: boolean }
  ) {
    await this.reviewService.markReviewHelpful(req.user.id, reviewId, body.helpful);
    return { message: 'Voto registrado exitosamente' };
  }

  @Get('my-reviews')
  async getUserReviews(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return await this.reviewService.getUserReviews(req.user.id, pageNum, limitNum);
  }

  // Admin routes
  @Get('pending')
  @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN, Role.MANAGER) // Temporarily disabled until Role enum is available
  async getPendingReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return await this.reviewService.getPendingReviews(pageNum, limitNum);
  }

  @Put(':id/moderate')
  @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN, Role.MANAGER) // Temporarily disabled until Role enum is available
  async moderateReview(
    @Request() req,
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() body: { status: ReviewStatus.APPROVED | ReviewStatus.REJECTED }
  ) {
    return await this.reviewService.moderateReview(reviewId, body.status, req.user.id);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  // @Roles(Role.ADMIN, Role.MANAGER) // Temporarily disabled until Role enum is available
  async getReviewStats() {
    return await this.reviewService.getReviewStats();
  }
}
