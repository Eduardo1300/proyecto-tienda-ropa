import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException } from '@nestjs/common'; 

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private cartRepository: Repository<CartItem>,
    
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async addToCart(dto: CreateCartItemDto): Promise<CartItem> {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    const product = await this.productRepository.findOneBy({ id: dto.productId });

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

    return this.cartRepository.save(item);
  }

  async getCart(userId: number): Promise<CartItem[]> {
    return this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async removeFromCart(id: number): Promise<void> {
  const item = await this.cartRepository.findOne({ where: { id } });
  if (!item) {
    throw new NotFoundException('Cart item not found');
  }
  await this.cartRepository.remove(item);
  }
}
