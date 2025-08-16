import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../ordenes/entities/order.entity';
import { 
  CreateReviewDto, 
  UpdateReviewDto, 
  ReviewFilterDto, 
  AdminReviewResponseDto,
  ReviewResponse,
  ReviewsListResponse 
} from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(userId: number, createReviewDto: CreateReviewDto): Promise<ReviewResponse> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el producto existe
    const product = await this.productRepository.findOne({ 
      where: { id: createReviewDto.productId },
      relations: ['images']
    });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Verificar si el usuario ya ha hecho una review de este producto
    const existingReview = await this.reviewRepository.findOne({
      where: { userId, productId: createReviewDto.productId }
    });
    if (existingReview) {
      throw new BadRequestException('Ya has hecho una review de este producto');
    }

    // Verificar si el usuario ha comprado el producto (opcional pero recomendado)
    const hasPurchased = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.items', 'item')
      .where('order.userId = :userId', { userId })
      .andWhere('item.productId = :productId', { productId: createReviewDto.productId })
      .andWhere('order.status = :status', { status: 'delivered' })
      .getCount();

    // Crear la review
    const review = this.reviewRepository.create({
      ...createReviewDto,
      userId,
      purchaseVerified: hasPurchased > 0,
      isVerified: true, // Por defecto verificada, admin puede cambiar después
    });

    const savedReview = await this.reviewRepository.save(review);

    // Actualizar las estadísticas del producto
    await this.updateProductRatingStats(createReviewDto.productId);

    return this.formatReviewResponse(savedReview);
  }

  async findAll(filters: ReviewFilterDto): Promise<ReviewsListResponse> {
    const { page = 1, limit = 10, productId, userId, rating, verified, sortBy = 'date', order = 'DESC' } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.product', 'product')
      .leftJoinAndSelect('product.images', 'images')
      .where('review.isActive = :isActive', { isActive: true });

    if (productId) {
      queryBuilder.andWhere('review.productId = :productId', { productId });
    }

    if (userId) {
      queryBuilder.andWhere('review.userId = :userId', { userId });
    }

    if (rating) {
      queryBuilder.andWhere('review.rating = :rating', { rating });
    }

    if (verified !== undefined) {
      queryBuilder.andWhere('review.isVerified = :verified', { verified });
    }

    // Ordenamiento
    switch (sortBy) {
      case 'rating':
        queryBuilder.orderBy('review.rating', order);
        break;
      case 'helpful':
        queryBuilder.orderBy('review.helpfulVotes', order);
        break;
      default:
        queryBuilder.orderBy('review.createdAt', order);
    }

    const [reviews, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const pages = Math.ceil(total / limit);

    // Calcular estadísticas si es para un producto específico
    let averageRating = 0;
    let ratingDistribution = {};

    if (productId) {
      const stats = await this.getProductReviewStats(productId);
      averageRating = stats.averageRating;
      ratingDistribution = stats.ratingDistribution;
    }

    return {
      reviews: reviews.map(review => this.formatReviewResponse(review)),
      total,
      pages,
      currentPage: page,
      averageRating,
      ratingDistribution,
    };
  }

  async findOne(id: number): Promise<ReviewResponse> {
    const review = await this.reviewRepository.findOne({
      where: { id, isActive: true },
      relations: ['user', 'product', 'product.images'],
    });

    if (!review) {
      throw new NotFoundException('Review no encontrada');
    }

    return this.formatReviewResponse(review);
  }

  async update(id: number, userId: number, updateReviewDto: UpdateReviewDto): Promise<ReviewResponse> {
    const review = await this.reviewRepository.findOne({
      where: { id, isActive: true },
      relations: ['user', 'product', 'product.images'],
    });

    if (!review) {
      throw new NotFoundException('Review no encontrada');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('No puedes editar una review que no es tuya');
    }

    // Actualizar la review
    const oldRating = review.rating;
    Object.assign(review, updateReviewDto);
    const updatedReview = await this.reviewRepository.save(review);

    // Si cambió el rating, actualizar las estadísticas del producto
    if (oldRating !== updateReviewDto.rating) {
      await this.updateProductRatingStats(review.productId);
    }

    return this.formatReviewResponse(updatedReview);
  }

  async remove(id: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException('Review no encontrada');
    }

    if (review.userId !== userId) {
      throw new ForbiddenException('No puedes eliminar una review que no es tuya');
    }

    // Soft delete
    await this.reviewRepository.update(id, { isActive: false });

    // Actualizar las estadísticas del producto
    await this.updateProductRatingStats(review.productId);
  }

  async addAdminResponse(id: number, adminResponseDto: AdminReviewResponseDto): Promise<ReviewResponse> {
    const review = await this.reviewRepository.findOne({
      where: { id, isActive: true },
      relations: ['user', 'product', 'product.images'],
    });

    if (!review) {
      throw new NotFoundException('Review no encontrada');
    }

    review.adminResponse = adminResponseDto.adminResponse;
    const updatedReview = await this.reviewRepository.save(review);

    return this.formatReviewResponse(updatedReview);
  }

  async voteReview(id: number, helpful: boolean): Promise<ReviewResponse> {
    const review = await this.reviewRepository.findOne({
      where: { id, isActive: true },
      relations: ['user', 'product', 'product.images'],
    });

    if (!review) {
      throw new NotFoundException('Review no encontrada');
    }

    if (helpful) {
      review.helpfulVotes += 1;
    } else {
      review.unhelpfulVotes += 1;
    }

    const updatedReview = await this.reviewRepository.save(review);
    return this.formatReviewResponse(updatedReview);
  }

  private async updateProductRatingStats(productId: number): Promise<void> {
    const stats = await this.reviewRepository
      .createQueryBuilder('review')
      .select([
        'AVG(review.rating) as avgRating',
        'COUNT(review.id) as totalReviews'
      ])
      .where('review.productId = :productId', { productId })
      .andWhere('review.isActive = :isActive', { isActive: true })
      .getRawOne();

    await this.productRepository.update(productId, {
      averageRating: parseFloat(stats.avgRating) || 0,
      reviewCount: parseInt(stats.totalReviews) || 0,
    });
  }

  private async getProductReviewStats(productId: number) {
    const reviews = await this.reviewRepository.find({
      where: { productId, isActive: true }
    });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
      : 0;

    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };

    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    return { averageRating, ratingDistribution };
  }

  private formatReviewResponse(review: Review): ReviewResponse {
    return {
      id: review.id,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      helpfulVotes: review.helpfulVotes,
      unhelpfulVotes: review.unhelpfulVotes,
      images: review.images || [],
      purchaseVerified: review.purchaseVerified || false,
      isVerified: review.isVerified,
      adminResponse: review.adminResponse,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: {
        id: review.user.id,
        name: `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() || review.user.username,
        avatarUrl: review.user.avatarUrl,
      },
      product: {
        id: review.product.id,
        name: review.product.name,
        imageUrl: review.product.images?.[0]?.url || review.product.imageUrl,
      },
    };
  }
}
