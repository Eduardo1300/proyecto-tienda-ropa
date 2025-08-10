import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

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

  // Agrega un item al carrito validando disponibilidad e inventario
  async addToCart(dto: CreateCartItemDto): Promise<CartItem> {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    const product = await this.productRepository.findOneBy({ id: dto.productId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Validaciones de inventario
    if (product.isActive === false || product.stock <= 0) {
      throw new BadRequestException('Product is out of stock');
    }

    if (dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException('Insufficient stock for this product');
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
