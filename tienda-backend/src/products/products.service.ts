import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Review } from './entities/review.entity';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';

interface ProductFilters {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  brand?: string;
  category?: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    @InjectRepository(Review) private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Wishlist) private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  // Listar con filtros y búsqueda
  async findAll(filters: ProductFilters = {}): Promise<Product[]> {
    const where: any = { isActive: true };
    if (filters.q) where.name = ILike(`%${filters.q}%`);
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      // TypeORM query builder sería más flexible; simplificamos aquí
    }
    if (filters.size) where.size = filters.size;
    if (filters.color) where.color = filters.color;
    if (filters.brand) where.brand = filters.brand;
    if (filters.category) where.category = filters.category;
    return await this.productRepository.find({ where });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product with id ${id} not found`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }

  // Productos relacionados: misma categoría o marca
  async related(id: number): Promise<Product[]> {
    const base = await this.findOne(id);
    return this.productRepository.find({
      where: [
        { category: base.category, id: In([]) }, // placeholder: mejor con query builder excluyendo id
        { brand: base.brand },
      ],
      take: 8,
    });
  }

  // Wishlist
  async addToWishlist(userId: number, productId: number): Promise<Wishlist> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const product = await this.findOne(productId);
    if (!user) throw new NotFoundException('User not found');
    const existing = await this.wishlistRepository.findOne({ where: { user: { id: userId }, product: { id: productId } } });
    if (existing) return existing;
    const entry = this.wishlistRepository.create({ user, product });
    return this.wishlistRepository.save(entry);
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    const existing = await this.wishlistRepository.findOne({ where: { user: { id: userId }, product: { id: productId } } });
    if (existing) await this.wishlistRepository.remove(existing);
  }

  async getWishlist(userId: number): Promise<Product[]> {
    const rows = await this.wishlistRepository.find({ where: { user: { id: userId } }, relations: ['product'] });
    return rows.map((w) => w.product);
  }

  // Reviews
  async addReview(userId: number, productId: number, rating: number, comment?: string): Promise<Review> {
    if (rating < 1 || rating > 5) throw new BadRequestException('Invalid rating');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const product = await this.findOne(productId);
    if (!user) throw new NotFoundException('User not found');
    const review = this.reviewRepository.create({ user, product, rating, comment });
    const saved = await this.reviewRepository.save(review);
    await this.recalculateRating(productId);
    return saved;
  }

  async listReviews(productId: number): Promise<Review[]> {
    await this.findOne(productId);
    return this.reviewRepository.find({ where: { product: { id: productId } }, relations: ['user'] });
  }

  private async recalculateRating(productId: number): Promise<void> {
    const reviews = await this.reviewRepository.find({ where: { product: { id: productId } } });
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const avg = reviews.length ? sum / reviews.length : 0;
    await this.productRepository.update(productId, { averageRating: Number(avg.toFixed(2)), reviewsCount: reviews.length });
  }
}
