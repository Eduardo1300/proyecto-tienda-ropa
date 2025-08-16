import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards,
  ParseIntPipe,
  ValidationPipe
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { 
  CreateReviewDto, 
  UpdateReviewDto, 
  ReviewFilterDto,
  VoteReviewDto,
  AdminReviewResponseDto,
  ReviewResponse,
  ReviewsListResponse 
} from './dto/review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() user: any,
    @Body(ValidationPipe) createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponse> {
    return this.reviewsService.create(user.id, createReviewDto);
  }

  @Get()
  async findAll(@Query(ValidationPipe) filters: ReviewFilterDto): Promise<ReviewsListResponse> {
    return this.reviewsService.findAll(filters);
  }

  @Get('product/:productId')
  async findByProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Query(ValidationPipe) filters: ReviewFilterDto,
  ): Promise<ReviewsListResponse> {
    const filtersWithProduct = { ...filters, productId };
    return this.reviewsService.findAll(filtersWithProduct);
  }

  @Get('user/:userId')
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query(ValidationPipe) filters: ReviewFilterDto,
  ): Promise<ReviewsListResponse> {
    const filtersWithUser = { ...filters, userId };
    return this.reviewsService.findAll(filtersWithUser);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ReviewResponse> {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body(ValidationPipe) updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponse> {
    return this.reviewsService.update(id, user.id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<{ message: string }> {
    await this.reviewsService.remove(id, user.id);
    return { message: 'Review eliminada correctamente' };
  }

  @Post(':id/vote')
  async voteReview(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) voteDto: VoteReviewDto,
  ): Promise<ReviewResponse> {
    return this.reviewsService.voteReview(id, voteDto.helpful);
  }

  @Post(':id/admin-response')
  @UseGuards(JwtAuthGuard)
  async addAdminResponse(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
    @Body(ValidationPipe) adminResponseDto: AdminReviewResponseDto,
  ): Promise<ReviewResponse> {
    // Verificar si el usuario es admin (esto se puede mejorar con roles)
    if (!user.isAdmin) {
      throw new Error('No tienes permisos para responder reviews');
    }
    
    return this.reviewsService.addAdminResponse(id, adminResponseDto);
  }
}
