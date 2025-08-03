import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';
import { CartItem } from '../carrito/entities/cart-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(CartItem) private cartRepo: Repository<CartItem>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    const cart = await this.cartRepo.find({
      where: { user: { id: dto.userId } },
      relations: ['product'],
    });

    if (!user || cart.length === 0) {
      throw new Error('Invalid user or empty cart');
    }

    const items: OrderItem[] = cart.map(item => {
      const orderItem = this.orderItemRepo.create({
        product: item.product,
        quantity: item.quantity,
        price: Number(item.product.price),
      });
      return orderItem;
    });

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = this.orderRepo.create({
      user,
      items,
      total,
    });

    // Guardar la orden
    const savedOrder = await this.orderRepo.save(order);

    // Vaciar carrito (opcional)
    await this.cartRepo.remove(cart);

    return savedOrder;
  }
}
