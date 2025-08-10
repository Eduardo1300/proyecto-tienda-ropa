import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from '../users/entities/user.entity';
import { CartItem } from '../carrito/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(CartItem) private cartRepo: Repository<CartItem>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  // Crear una orden para el usuario, a partir de items explícitos del DTO o desde su carrito
  async createOrder(userId: number, dto: CreateOrderDto): Promise<Order> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let items: OrderItem[] = [];

    if (dto.items && dto.items.length > 0) {
      // Crear orden desde items específicos
      const productIds = dto.items.map((i) => i.productId);
      const products = await this.productRepo.find({ where: { id: In(productIds) } });
      const productById = new Map(products.map((p) => [p.id, p]));

      items = dto.items.map((i) => {
        const product = productById.get(i.productId);
        if (!product) throw new BadRequestException(`Product ${i.productId} not found`);
        return this.orderItemRepo.create({
          product,
          quantity: i.quantity,
          price: Number(product.price),
        });
      });
    } else {
      // Crear orden a partir del carrito del usuario
      const cart = await this.cartRepo.find({
        where: { user: { id: userId } },
        relations: ['product'],
      });
      if (cart.length === 0) throw new BadRequestException('Cart is empty');

      items = cart.map((item) =>
        this.orderItemRepo.create({
          product: item.product,
          quantity: item.quantity,
          price: Number(item.product.price),
        }),
      );
    }

    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const order = this.orderRepo.create({
      user,
      items,
      total,
      status: OrderStatus.PENDING,
      orderNumber: this.generateOrderNumber(),
    });

    const savedOrder = await this.orderRepo.save(order);

    // Si se creó desde carrito, limpiar
    if (!dto.items || dto.items.length === 0) {
      const cart = await this.cartRepo.find({ where: { user: { id: userId } } });
      if (cart.length > 0) await this.cartRepo.remove(cart);
    }

    return savedOrder;
  }

  // Listar órdenes del usuario autenticado
  async getOrdersForUser(userId: number): Promise<Order[]> {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  // Actualizar estado de la orden (opcional para backoffice)
  async updateStatus(orderId: number, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    order.status = status;
    return this.orderRepo.save(order);
  }

  private generateOrderNumber(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${y}${m}${d}-${rand}`;
  }
}
