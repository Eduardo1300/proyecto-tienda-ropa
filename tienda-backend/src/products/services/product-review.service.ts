import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReview, ReviewStatus } from '../entities/product-review.entity';
import { Product } from '../entities/product.entity';
import { User } from '../../users/entities/user.entity';

export interface CreateReviewDto {
  rating: number;
  title: string;
  comment: string;
}

export interface UpdateReviewDto {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReviewFilters {
  rating?: number;
  verified?: boolean;
  status?: ReviewStatus;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

@Injectable()
export class ProductReviewService {
  constructor(
    @InjectRepository(ProductReview)
    private reviewRepository: Repository<ProductReview>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createReview(userId: number, productId: number, createReviewDto: CreateReviewDto): Promise<ProductReview> {
    const { rating, title, comment } = createReviewDto;

    // Validate rating
    if (rating < 1 || rating > 5) {
      throw new BadRequestException('La calificación debe estar entre 1 y 5');
    }

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Check if user has already reviewed this product
    const existingReview = await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId }
      }
    });

    if (existingReview) {
      throw new BadRequestException('Ya has escrito una reseña para este producto');
    }

    // TODO: Check if user has purchased this product (for verified purchase)
    // This would require integration with the orders system
    const isVerifiedPurchase = false; // For now, set to false

    // Create review
    const review = this.reviewRepository.create({
      user: { id: userId } as User,
      product,
      rating,
      title,
      comment,
      status: ReviewStatus.PENDING, // Reviews need approval by default
      isVerifiedPurchase,
      helpfulCount: 0,
      notHelpfulCount: 0
    });

    const savedReview = await this.reviewRepository.save(review);

    // Update product's average rating and review count
    await this.updateProductRatingStats(productId);

    return savedReview;
  }

  async getProductReviews(
    productId: number,
    page: number = 1,
    limit: number = 10,
    filters: ReviewFilters = {},
    sortBy: string = 'newest'
  ): Promise<{
    reviews: ProductReview[];
    total: number;
    hasMore: boolean;
  }> {
    const queryBuilder = this.reviewRepository.createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.productId = :productId', { productId })
      .andWhere('review.status = :status', { status: ReviewStatus.APPROVED });

    // Apply filters
    if (filters.rating) {
      queryBuilder.andWhere('review.rating = :rating', { rating: filters.rating });
    }

    if (filters.verified !== undefined) {
      queryBuilder.andWhere('review.isVerifiedPurchase = :verified', { verified: filters.verified });
    }

    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        queryBuilder.orderBy('review.createdAt', 'ASC');
        break;
      case 'rating-high':
        queryBuilder.orderBy('review.rating', 'DESC').addOrderBy('review.createdAt', 'DESC');
        break;
      case 'rating-low':
        queryBuilder.orderBy('review.rating', 'ASC').addOrderBy('review.createdAt', 'DESC');
        break;
      case 'helpful':
        queryBuilder.orderBy('review.helpfulCount', 'DESC').addOrderBy('review.createdAt', 'DESC');
        break;
      case 'newest':
      default:
        queryBuilder.orderBy('review.createdAt', 'DESC');
        break;
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [reviews, total] = await queryBuilder.getManyAndCount();

    return {
      reviews,
      total,
      hasMore: offset + reviews.length < total
    };
  }

  async getReviewSummary(productId: number): Promise<ReviewSummary> {
    const reviews = await this.reviewRepository.find({
      where: {
        product: { id: productId },
        status: ReviewStatus.APPROVED
      }
    });

    const summary: ReviewSummary = {
      averageRating: 0,
      totalReviews: reviews.length,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }
    };

    if (reviews.length > 0) {
      // Calculate rating distribution
      reviews.forEach(review => {
        summary.ratingDistribution[review.rating as keyof typeof summary.ratingDistribution]++;
      });

      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      summary.averageRating = Math.round((totalRating / reviews.length) * 10) / 10;
    }

    return summary;
  }

  async getUserReview(userId: number, productId: number): Promise<ProductReview | null> {
    return await this.reviewRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId }
      },
      relations: ['product']
    });
  }

  async updateReview(userId: number, reviewId: number, updateReviewDto: UpdateReviewDto): Promise<ProductReview> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'product']
    });

    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    if (review.user.id !== userId) {
      throw new ForbiddenException('No tienes permiso para editar esta reseña');
    }

    // Only allow editing if review is pending or approved
    if (review.status === ReviewStatus.REJECTED) {
      throw new BadRequestException('No puedes editar una reseña rechazada');
    }

    // Update fields
    if (updateReviewDto.rating !== undefined) {
      if (updateReviewDto.rating < 1 || updateReviewDto.rating > 5) {
        throw new BadRequestException('La calificación debe estar entre 1 y 5');
      }
      review.rating = updateReviewDto.rating;
    }

    if (updateReviewDto.title !== undefined) {
      review.title = updateReviewDto.title;
    }

    if (updateReviewDto.comment !== undefined) {
      review.comment = updateReviewDto.comment;
    }

    // Set status back to pending if it was approved (needs re-approval after edit)
    if (review.status === ReviewStatus.APPROVED) {
      review.status = ReviewStatus.PENDING;
    }

    review.updatedAt = new Date();

    const updatedReview = await this.reviewRepository.save(review);

    // Update product's average rating and review count
    await this.updateProductRatingStats(review.product.id);

    return updatedReview;
  }

  async deleteReview(userId: number, reviewId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user', 'product']
    });

    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    if (review.user.id !== userId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta reseña');
    }

    const productId = review.product.id;

    await this.reviewRepository.remove(review);

    // Update product's average rating and review count
    await this.updateProductRatingStats(productId);
  }

  async markReviewHelpful(userId: number, reviewId: number, helpful: boolean): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId }
    });

    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    // TODO: Implement a system to track which users have voted on which reviews
    // to prevent multiple votes from the same user
    // For now, we'll just increment the counters

    if (helpful) {
      review.helpfulCount++;
    } else {
      review.notHelpfulCount++;
    }

    await this.reviewRepository.save(review);
  }

  // Admin methods
  async moderateReview(reviewId: number, status: ReviewStatus.APPROVED | ReviewStatus.REJECTED, moderatorId: number): Promise<ProductReview> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['product']
    });

    if (!review) {
      throw new NotFoundException('Reseña no encontrada');
    }

    review.status = status;
    review.moderatedBy = { id: moderatorId } as User;
    review.moderatedAt = new Date();

    const updatedReview = await this.reviewRepository.save(review);

    // Update product's average rating and review count
    await this.updateProductRatingStats(review.product.id);

    return updatedReview;
  }

  async getPendingReviews(page: number = 1, limit: number = 20): Promise<{
    reviews: ProductReview[];
    total: number;
    hasMore: boolean;
  }> {
    const queryBuilder = this.reviewRepository.createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.product', 'product')
      .where('review.status = :status', { status: ReviewStatus.PENDING })
      .orderBy('review.createdAt', 'ASC');

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [reviews, total] = await queryBuilder.getManyAndCount();

    return {
      reviews,
      total,
      hasMore: offset + reviews.length < total
    };
  }

  async getUserReviews(userId: number, page: number = 1, limit: number = 10): Promise<{
    reviews: ProductReview[];
    total: number;
    hasMore: boolean;
  }> {
    const queryBuilder = this.reviewRepository.createQueryBuilder('review')
      .leftJoinAndSelect('review.product', 'product')
      .leftJoinAndSelect('product.images', 'images')
      .where('review.userId = :userId', { userId })
      .orderBy('review.createdAt', 'DESC');

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [reviews, total] = await queryBuilder.getManyAndCount();

    return {
      reviews,
      total,
      hasMore: offset + reviews.length < total
    };
  }

  private async updateProductRatingStats(productId: number): Promise<void> {
    const summary = await this.getReviewSummary(productId);
    
    await this.productRepository.update(productId, {
      averageRating: summary.averageRating,
      reviewCount: summary.totalReviews
    });
  }

  async getReviewStats(): Promise<{
    totalReviews: number;
    pendingReviews: number;
    approvedReviews: number;
    rejectedReviews: number;
    averageRating: number;
    verifiedPurchasePercentage: number;
  }> {
    const [
      totalReviews,
      pendingReviews,
      approvedReviews,
      rejectedReviews,
      allApprovedReviews
    ] = await Promise.all([
      this.reviewRepository.count(),
      this.reviewRepository.count({ where: { status: ReviewStatus.PENDING } }),
      this.reviewRepository.count({ where: { status: ReviewStatus.APPROVED } }),
      this.reviewRepository.count({ where: { status: ReviewStatus.REJECTED } }),
      this.reviewRepository.find({ where: { status: ReviewStatus.APPROVED } })
    ]);

    const averageRating = allApprovedReviews.length > 0
      ? Math.round((allApprovedReviews.reduce((sum, review) => sum + review.rating, 0) / allApprovedReviews.length) * 10) / 10
      : 0;

    const verifiedReviews = allApprovedReviews.filter(review => review.isVerifiedPurchase).length;
    const verifiedPurchasePercentage = allApprovedReviews.length > 0
      ? Math.round((verifiedReviews / allApprovedReviews.length) * 100)
      : 0;

    return {
      totalReviews,
      pendingReviews,
      approvedReviews,
      rejectedReviews,
      averageRating,
      verifiedPurchasePercentage
    };
  }
}
