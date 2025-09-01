import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { Return, ReturnStatus } from './entities/return.entity';
import { ReturnItem } from './entities/return-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateReturnDto } from './dto/create-return.dto';
import { User } from '../users/entities/user.entity';
import { CartItem } from '../carrito/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { EmailService } from '../common/email.service';
import { PdfService } from '../common/pdf.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory) private statusHistoryRepo: Repository<OrderStatusHistory>,
    @InjectRepository(Return) private returnRepo: Repository<Return>,
    @InjectRepository(ReturnItem) private returnItemRepo: Repository<ReturnItem>,
    @InjectRepository(CartItem) private cartRepo: Repository<CartItem>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private emailService: EmailService,
    private pdfService: PdfService,
  ) {}

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate unique order number
    const orderNumber = await this.generateOrderNumber();

    // Create order items
    const items: OrderItem[] = [];
    let subtotal = 0;

    for (const itemDto of dto.items) {
      const product = await this.productRepo.findOne({ where: { id: itemDto.productId } });
      if (!product) {
        throw new NotFoundException(`Product with ID ${itemDto.productId} not found`);
      }

      const orderItem = this.orderItemRepo.create({
        product,
        quantity: itemDto.quantity,
        price: itemDto.price,
      });
      items.push(orderItem);
      subtotal += itemDto.price * itemDto.quantity;
    }

    const shippingCost = typeof dto.shippingCost === 'number' ? dto.shippingCost : 0;
    const tax = dto.tax || 0;
    const total = subtotal + shippingCost + tax;

    const order = this.orderRepo.create({
      orderNumber,
      user,
      items,
      total,
      shippingCost,
      tax,
      shippingAddress: dto.shippingAddress,
      billingAddress: dto.billingAddress,
      notes: dto.notes,
      status: OrderStatus.PENDING,
      canBeCancelled: true,
      canBeReturned: false, // Will be enabled after delivery
    });

    const savedOrder = await this.orderRepo.save(order);

    // Create initial status history
    await this.createStatusHistory(savedOrder, null, OrderStatus.PENDING, 'Order created', user);

    // Send confirmation email
    await this.emailService.sendOrderConfirmation(user.email, savedOrder);

    // Clear cart if items came from cart
    if (dto.items.length > 0) {
      await this.cartRepo.delete({ user: { id: dto.userId } });
    }

    return this.findOrderById(savedOrder.id);
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product', 'statusHistory', 'statusHistory.changedBy'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findOrdersByUser(userId: number): Promise<Order[]> {
    const orders = await this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'items', 'items.product'],
      order: { createdAt: 'DESC' },
    });

    // Ensure user information is properly included
    return orders.map(order => ({
      ...order,
      userId: order.user?.id,
    })) as Order[];
  }

  async findAllOrders(): Promise<Order[]> {
    const orders = await this.orderRepo.find({
      relations: ['user', 'items', 'items.product', 'statusHistory'],
      order: { createdAt: 'DESC' },
    });

    // Ensure user information is properly included
    return orders.map(order => ({
      ...order,
      userId: order.user?.id,
    })) as Order[];
  }

  async updateOrderStatus(orderId: number, dto: UpdateOrderStatusDto, changedBy: User): Promise<Order> {
    const order = await this.findOrderById(orderId);
    const previousStatus = order.status;

    // Validate status transition
    this.validateStatusTransition(previousStatus, dto.status);

    // Update order fields
    order.status = dto.status;
    if (dto.trackingCode) order.trackingCode = dto.trackingCode;
    if (dto.shippingCarrier) order.shippingCarrier = dto.shippingCarrier;
    if (dto.estimatedDeliveryDate) order.estimatedDeliveryDate = new Date(dto.estimatedDeliveryDate);

    // Handle status-specific logic
    await this.handleStatusChange(order, dto.status);

    const savedOrder = await this.orderRepo.save(order);

    // Create status history
    await this.createStatusHistory(savedOrder, previousStatus, dto.status, dto.reason, changedBy, dto.notes, dto.trackingCode);

    // Send email notification
    await this.emailService.sendOrderStatusUpdate(order.user.email, savedOrder, previousStatus, dto.status);

    return this.findOrderById(savedOrder.id);
  }

  async cancelOrder(orderId: number, dto: CancelOrderDto, cancelledBy: User): Promise<Order> {
    const order = await this.findOrderById(orderId);

    if (!order.canBeCancelled || order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order cannot be cancelled');
    }

    order.status = OrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    order.cancellationReason = dto.reason;
    order.canBeCancelled = false;

    const savedOrder = await this.orderRepo.save(order);

    // Create status history
    await this.createStatusHistory(savedOrder, OrderStatus.PENDING, OrderStatus.CANCELLED, dto.reason, cancelledBy, dto.notes);

    // Send cancellation email
    await this.emailService.sendOrderCancellation(order.user.email, savedOrder, dto.reason);

    return this.findOrderById(savedOrder.id);
  }

  async createReturn(dto: CreateReturnDto, userId: number): Promise<Return> {
    const order = await this.findOrderById(dto.orderId);

    if (order.user.id !== userId) {
      throw new BadRequestException('You can only return your own orders');
    }

    if (!order.canBeReturned || order.status !== OrderStatus.DELIVERED) {
      throw new BadRequestException('Order cannot be returned');
    }

    const returnNumber = await this.generateReturnNumber();

    // Create return items
    const returnItems: ReturnItem[] = [];
    let totalRefundAmount = 0;

    for (const itemDto of dto.items) {
      const orderItem = await this.orderItemRepo.findOne({
        where: { id: itemDto.orderItemId },
        relations: ['product'],
      });

      if (!orderItem) {
        throw new NotFoundException(`Order item with ID ${itemDto.orderItemId} not found`);
      }

      const refundAmount = (orderItem.price * itemDto.quantity);
      const returnItem = this.returnItemRepo.create({
        orderItem,
        quantity: itemDto.quantity,
        refundAmount,
        condition: itemDto.condition,
        notes: itemDto.notes,
      });

      returnItems.push(returnItem);
      totalRefundAmount += refundAmount;
    }

    const returnEntity = this.returnRepo.create({
      returnNumber,
      order,
      user: order.user,
      items: returnItems,
      reason: dto.reason,
      description: dto.description,
      refundAmount: totalRefundAmount,
      status: ReturnStatus.REQUESTED,
    });

    const savedReturn = await this.returnRepo.save(returnEntity);

    // Send return request email
    await this.emailService.sendReturnRequest(order.user.email, savedReturn);

    return this.findReturnById(savedReturn.id);
  }

  async findReturnById(id: number): Promise<Return> {
    const returnEntity = await this.returnRepo.findOne({
      where: { id },
      relations: ['order', 'user', 'items', 'items.orderItem', 'items.orderItem.product', 'processedBy'],
    });

    if (!returnEntity) {
      throw new NotFoundException('Return not found');
    }

    return returnEntity;
  }

  async generateInvoicePdf(orderId: number): Promise<Buffer> {
    const order = await this.findOrderById(orderId);
    return this.pdfService.generateInvoice(order);
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const count = await this.orderRepo.count();
    const orderNum = String(count + 1).padStart(4, '0');
    
    return `ORD-${year}${month}${day}-${orderNum}`;
  }

  private async generateReturnNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const count = await this.returnRepo.count();
    const returnNum = String(count + 1).padStart(4, '0');
    
    return `RET-${year}${month}${day}-${returnNum}`;
  }

  private validateStatusTransition(from: OrderStatus, to: OrderStatus): void {
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [OrderStatus.RETURNED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.RETURNED]: [OrderStatus.REFUNDED],
      [OrderStatus.REFUNDED]: [],
    };

    if (!validTransitions[from].includes(to)) {
      throw new BadRequestException(`Invalid status transition from ${from} to ${to}`);
    }
  }

  private async handleStatusChange(order: Order, newStatus: OrderStatus): Promise<void> {
    switch (newStatus) {
      case OrderStatus.PROCESSING:
        order.canBeCancelled = true; // Still can be cancelled in processing
        break;
      case OrderStatus.SHIPPED:
        order.canBeCancelled = false;
        break;
      case OrderStatus.DELIVERED:
        order.actualDeliveryDate = new Date();
        order.canBeReturned = true;
        break;
      case OrderStatus.CANCELLED:
        order.cancelledAt = new Date();
        order.canBeCancelled = false;
        order.canBeReturned = false;
        break;
    }
  }

  private async createStatusHistory(
    order: Order,
    fromStatus: OrderStatus | null,
    toStatus: OrderStatus,
    reason?: string,
    changedBy?: User,
    notes?: string,
    trackingCode?: string,
  ): Promise<OrderStatusHistory> {
    const history = this.statusHistoryRepo.create({
      order,
      fromStatus: fromStatus || toStatus,
      toStatus,
      reason,
      notes,
      changedBy,
      trackingCode,
      emailSent: false, // Will be updated after email is sent
    });

    return this.statusHistoryRepo.save(history);
  }
}
