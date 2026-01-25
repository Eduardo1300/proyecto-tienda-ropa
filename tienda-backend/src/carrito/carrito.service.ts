import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { AnalyticsService } from '../analytics/services/analytics.service';
import { EventType } from '../analytics/entities/analytics-event.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepository: Repository<CartItem>,

    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private analyticsService: AnalyticsService,
  ) {}

  async addToCart(dto: CreateCartItemDto): Promise<CartItem> {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    const product = await this.productRepository.findOneBy({
      id: dto.productId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const item = this.cartRepository.create({
      user,
      product,
      quantity: dto.quantity,
    });

    const savedItem = await this.cartRepository.save(item);

    // Track add to cart event
    try {
      await this.analyticsService.trackEvent({
        eventType: EventType.ADD_TO_CART,
        userId: user.id,
        productId: product.id,
        value: product.price * dto.quantity,
      });
      console.log('✅ Analytics event tracked for add to cart:', product.id);
    } catch (error) {
      console.error('⚠️ Failed to track analytics event:', error);
    }

    return savedItem;
  }

  async getCart(userId: number): Promise<CartItem[]> {
    return this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async removeFromCart(id: number): Promise<void> {
    const item = await this.cartRepository.findOne({ 
      where: { id },
      relations: ['product', 'user']
    });
    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepository.remove(item);

    // Track remove from cart event
    try {
      await this.analyticsService.trackEvent({
        eventType: EventType.REMOVE_FROM_CART,
        userId: item.user.id,
        productId: item.product.id,
      });
      console.log('✅ Analytics event tracked for remove from cart:', item.product.id);
    } catch (error) {
      console.error('⚠️ Failed to track analytics event:', error);
    }
  }
}
