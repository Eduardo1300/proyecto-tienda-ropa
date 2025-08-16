import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseOrder, PurchaseOrderStatus } from '../entities/purchase-order.entity';
import { PurchaseOrderItem } from '../entities/purchase-order-item.entity';
import { Supplier } from '../entities/supplier.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import { InventoryService } from './inventory.service';
import { MovementType, MovementReason } from '../entities/stock-movement.entity';
import { EmailService } from '../../common/email.service';

export interface CreatePurchaseOrderDto {
  supplierId: number;
  expectedDeliveryDate?: Date;
  notes?: string;
  shippingAddress?: string;
  paymentTerms?: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
    supplierSku?: string;
    batch?: string;
    expirationDate?: Date;
    notes?: string;
  }[];
}

export interface ReceivePurchaseOrderDto {
  items: {
    purchaseOrderItemId: number;
    receivedQuantity: number;
    batch?: string;
    expirationDate?: Date;
    notes?: string;
  }[];
}

@Injectable()
export class PurchaseOrderService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private purchaseOrderItemRepository: Repository<PurchaseOrderItem>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private inventoryService: InventoryService,
    private emailService: EmailService,
  ) {}

  async createPurchaseOrder(
    createDto: CreatePurchaseOrderDto,
    user: User,
  ): Promise<PurchaseOrder> {
    const supplier = await this.supplierRepository.findOne({
      where: { id: createDto.supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Calculate totals
    let totalAmount = 0;
    const items: PurchaseOrderItem[] = [];

    for (const itemDto of createDto.items) {
      const product = await this.productRepository.findOne({
        where: { id: itemDto.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${itemDto.productId} not found`);
      }

      const totalPrice = itemDto.quantity * itemDto.unitPrice;
      totalAmount += totalPrice;

      const item = this.purchaseOrderItemRepository.create({
        product,
        quantity: itemDto.quantity,
        unitPrice: itemDto.unitPrice,
        totalPrice,
        supplierSku: itemDto.supplierSku,
        batch: itemDto.batch,
        expirationDate: itemDto.expirationDate,
        notes: itemDto.notes,
      });

      items.push(item);
    }

    // Create purchase order
    const purchaseOrder = this.purchaseOrderRepository.create({
      orderNumber,
      supplier,
      totalAmount,
      expectedDeliveryDate: createDto.expectedDeliveryDate,
      notes: createDto.notes,
      shippingAddress: createDto.shippingAddress,
      paymentTerms: createDto.paymentTerms || supplier.paymentTerms,
      createdBy: user,
      items,
    });

    const savedOrder = await this.purchaseOrderRepository.save(purchaseOrder);

    // Update supplier stats
    supplier.totalOrders += 1;
    supplier.totalSpent += totalAmount;
    supplier.lastOrderDate = new Date();
    await this.supplierRepository.save(supplier);

    return savedOrder;
  }

  async approvePurchaseOrder(orderId: number, user: User): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findOne({
      where: { id: orderId },
      relations: ['supplier', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    if (order.status !== PurchaseOrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be approved');
    }

    order.status = PurchaseOrderStatus.APPROVED;
    order.approvedBy = user;
    order.approvedAt = new Date();

    const savedOrder = await this.purchaseOrderRepository.save(order);

    // Send email to supplier
    // await this.emailService.sendPurchaseOrderToSupplier(savedOrder); // TODO: Implement sendPurchaseOrderToSupplier method

    return savedOrder;
  }

  async sendPurchaseOrder(orderId: number): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findOne({
      where: { id: orderId },
      relations: ['supplier', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    if (order.status !== PurchaseOrderStatus.APPROVED) {
      throw new BadRequestException('Only approved orders can be sent');
    }

    order.status = PurchaseOrderStatus.SENT;
    return this.purchaseOrderRepository.save(order);
  }

  async receivePurchaseOrder(
    orderId: number,
    receiveDto: ReceivePurchaseOrderDto,
    user: User,
  ): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findOne({
      where: { id: orderId },
      relations: ['supplier', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    if (![PurchaseOrderStatus.SENT, PurchaseOrderStatus.PARTIALLY_RECEIVED].includes(order.status)) {
      throw new BadRequestException('Order cannot be received in current status');
    }

    let allItemsReceived = true;

    for (const receiveItem of receiveDto.items) {
      const orderItem = order.items.find(item => item.id === receiveItem.purchaseOrderItemId);
      
      if (!orderItem) {
        throw new NotFoundException(`Purchase order item ${receiveItem.purchaseOrderItemId} not found`);
      }

      if (receiveItem.receivedQuantity > orderItem.remainingQuantity) {
        throw new BadRequestException(
          `Cannot receive ${receiveItem.receivedQuantity} items. Only ${orderItem.remainingQuantity} remaining.`
        );
      }

      // Update received quantity
      orderItem.receivedQuantity += receiveItem.receivedQuantity;
      orderItem.batch = receiveItem.batch || orderItem.batch;
      orderItem.expirationDate = receiveItem.expirationDate || orderItem.expirationDate;
      orderItem.notes = receiveItem.notes || orderItem.notes;

      await this.purchaseOrderItemRepository.save(orderItem);

      // Update product stock
      await this.inventoryService.updateStock(
        orderItem.product.id,
        receiveItem.receivedQuantity,
        MovementType.PURCHASE,
        MovementReason.SUPPLIER_DELIVERY,
        user,
        {
          unitCost: orderItem.unitPrice,
          batch: receiveItem.batch,
          expirationDate: receiveItem.expirationDate,
          notes: `PO: ${order.orderNumber}`,
          referenceNumber: order.orderNumber,
        }
      );

      if (!orderItem.isFullyReceived) {
        allItemsReceived = false;
      }
    }

    // Update order status
    if (allItemsReceived) {
      order.status = PurchaseOrderStatus.RECEIVED;
      order.actualDeliveryDate = new Date();
    } else {
      order.status = PurchaseOrderStatus.PARTIALLY_RECEIVED;
    }

    return this.purchaseOrderRepository.save(order);
  }

  async cancelPurchaseOrder(orderId: number, reason: string): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    if ([PurchaseOrderStatus.RECEIVED, PurchaseOrderStatus.CANCELLED].includes(order.status)) {
      throw new BadRequestException('Cannot cancel order in current status');
    }

    order.status = PurchaseOrderStatus.CANCELLED;
    order.notes = `${order.notes || ''}\nCancelled: ${reason}`;

    return this.purchaseOrderRepository.save(order);
  }

  async getPurchaseOrders(
    status?: PurchaseOrderStatus,
    supplierId?: number,
    startDate?: Date,
    endDate?: Date,
  ): Promise<PurchaseOrder[]> {
    const query = this.purchaseOrderRepository
      .createQueryBuilder('po')
      .leftJoinAndSelect('po.supplier', 'supplier')
      .leftJoinAndSelect('po.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('po.createdBy', 'createdBy')
      .leftJoinAndSelect('po.approvedBy', 'approvedBy');

    if (status) {
      query.andWhere('po.status = :status', { status });
    }

    if (supplierId) {
      query.andWhere('po.supplier.id = :supplierId', { supplierId });
    }

    if (startDate) {
      query.andWhere('po.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('po.createdAt <= :endDate', { endDate });
    }

    return query.orderBy('po.createdAt', 'DESC').getMany();
  }

  async getPurchaseOrder(id: number): Promise<PurchaseOrder> {
    const order = await this.purchaseOrderRepository.findOne({
      where: { id },
      relations: [
        'supplier',
        'items',
        'items.product',
        'createdBy',
        'approvedBy',
      ],
    });

    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    return order;
  }

  private async generateOrderNumber(): Promise<string> {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const datePrefix = `PO-${year}${month}${day}`;
    
    const lastOrder = await this.purchaseOrderRepository
      .createQueryBuilder('po')
      .where('po.orderNumber LIKE :prefix', { prefix: `${datePrefix}%` })
      .orderBy('po.orderNumber', 'DESC')
      .getOne();

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `${datePrefix}-${String(sequence).padStart(4, '0')}`;
  }

  // Auto-restock functionality
  async createAutoRestockOrders(): Promise<PurchaseOrder[]> {
    const productsNeedingRestock = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.suppliers', 'suppliers')
      .leftJoinAndSelect('suppliers.supplier', 'supplier')
      .where('product.autoRestock = :autoRestock', { autoRestock: true })
      .andWhere('product.stock - product.reservedStock <= product.reorderPoint')
      .andWhere('product.isActive = :isActive', { isActive: true })
      .andWhere('suppliers.isActive = :supplierActive', { supplierActive: true })
      .andWhere('suppliers.isPreferred = :isPreferred', { isPreferred: true })
      .getMany();

    const orders: PurchaseOrder[] = [];

    // Group products by supplier
    const supplierProducts = new Map<number, { supplier: any; products: Product[] }>();

    for (const product of productsNeedingRestock) {
      const preferredSupplier = product.suppliers.find(sp => sp.isPreferred && sp.isActive);
      
      if (preferredSupplier) {
        const supplierId = preferredSupplier.supplier.id;
        
        if (!supplierProducts.has(supplierId)) {
          supplierProducts.set(supplierId, {
            supplier: preferredSupplier.supplier,
            products: [],
          });
        }
        
        const supplierData = supplierProducts.get(supplierId);
        if (supplierData) {
          supplierData.products.push(product);
        }
      }
    }

    // Create purchase orders for each supplier
    for (const [supplierId, { supplier, products }] of supplierProducts) {
      const items = products.map(product => {
        const supplierProduct = product.suppliers.find(sp => sp.supplier.id === supplierId);
        
        return {
          productId: product.id,
          quantity: product.reorderQuantity,
          unitPrice: supplierProduct?.supplierPrice || 0,
          supplierSku: supplierProduct?.supplierSku || '',
        };
      });

      const createDto: CreatePurchaseOrderDto = {
        supplierId,
        notes: 'Auto-generated restock order',
        items,
      };

      // Create system user for auto orders (you might want to create a dedicated system user)
      const systemUser = { id: 1 } as User; // Replace with actual system user
      
      const order = await this.createPurchaseOrder(createDto, systemUser);
      orders.push(order);
    }

    return orders;
  }
}
