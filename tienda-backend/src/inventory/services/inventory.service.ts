import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import { StockMovement, MovementType, MovementReason } from '../entities/stock-movement.entity';
import { InventoryAlert, AlertType, AlertStatus, AlertPriority } from '../entities/inventory-alert.entity';
import { EmailService } from '../../common/email.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(StockMovement)
    private stockMovementRepository: Repository<StockMovement>,
    @InjectRepository(InventoryAlert)
    private alertRepository: Repository<InventoryAlert>,
    private emailService: EmailService,
  ) {}

  // 📦 Stock Management
  async updateStock(
    productId: number,
    quantity: number,
    type: MovementType,
    reason: MovementReason,
    user?: User,
    options?: {
      unitCost?: number;
      batch?: string;
      expirationDate?: Date;
      location?: string;
      notes?: string;
      referenceNumber?: string;
    },
  ): Promise<StockMovement> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const previousStock = product.stock;
    let newStock: number;

    // Calculate new stock based on movement type
    switch (type) {
      case MovementType.PURCHASE:
      case MovementType.RETURN:
      case MovementType.RESTOCK:
      case MovementType.ADJUSTMENT:
        newStock = previousStock + Math.abs(quantity);
        break;
      case MovementType.SALE:
      case MovementType.EXPIRED:
      case MovementType.DAMAGED:
        newStock = previousStock - Math.abs(quantity);
        break;
      default:
        newStock = previousStock + quantity;
    }

    if (newStock < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    // Update product stock
    product.stock = newStock;
    if (type === MovementType.SALE) {
      product.lastSoldDate = new Date();
      product.totalSold += Math.abs(quantity);
    } else if (type === MovementType.RESTOCK) {
      product.lastRestockDate = new Date();
    }

    await this.productRepository.save(product);

    // Create stock movement record
    const movement = new StockMovement();
    movement.product = product;
    movement.type = type;
    movement.reason = reason;
    movement.quantity = Math.abs(quantity);
    movement.previousStock = previousStock;
    movement.newStock = newStock;
    movement.unitCost = options?.unitCost || null;
    movement.totalCost = options?.unitCost ? options.unitCost * Math.abs(quantity) : null;
    movement.batch = options?.batch || null;
    movement.expirationDate = options?.expirationDate || null;
    movement.location = options?.location || '';
    movement.notes = options?.notes || '';
    movement.referenceNumber = options?.referenceNumber || '';
    movement.createdBy = user!;

    // Check for alerts after stock change
    await this.checkAndCreateAlerts(product);

    return await this.stockMovementRepository.save(movement);
  }

  async reserveStock(productId: number, quantity: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.availableStock < quantity) {
      throw new BadRequestException('Insufficient available stock');
    }

    product.reservedStock += quantity;
    await this.productRepository.save(product);
  }

  async releaseReservedStock(productId: number, quantity: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.reservedStock = Math.max(0, product.reservedStock - quantity);
    await this.productRepository.save(product);
  }

  // ⚠️ Alert Management
  async checkAndCreateAlerts(product: Product): Promise<void> {
    // Low stock alert
    if (product.isLowStock && product.lowStockAlert) {
      await this.createAlert(
        product,
        AlertType.LOW_STOCK,
        `Product ${product.name} is running low on stock`,
        AlertPriority.HIGH,
        product.minStockLevel,
        product.availableStock,
      );
    }

    // Out of stock alert
    if (product.availableStock <= 0) {
      await this.createAlert(
        product,
        AlertType.OUT_OF_STOCK,
        `Product ${product.name} is out of stock`,
        AlertPriority.CRITICAL,
        0,
        product.availableStock,
      );
    }

    // Reorder point alert
    if (product.needsRestock && product.autoRestock) {
      await this.createAlert(
        product,
        AlertType.REORDER_POINT,
        `Product ${product.name} has reached reorder point`,
        AlertPriority.HIGH,
        product.reorderPoint,
        product.availableStock,
      );
    }

    // Expiration alerts
    if (product.trackExpiration && product.expirationDate) {
      if (product.isExpired) {
        await this.createAlert(
          product,
          AlertType.EXPIRED,
          `Product ${product.name} has expired`,
          AlertPriority.CRITICAL,
          undefined,
          undefined,
          product.expirationDate,
        );
      } else if (product.isExpiringSoon) {
        await this.createAlert(
          product,
          AlertType.EXPIRING_SOON,
          `Product ${product.name} is expiring soon`,
          AlertPriority.MEDIUM,
          undefined,
          undefined,
          product.expirationDate,
        );
      }
    }

    // Overstock alert
    if (product.availableStock > product.maxStockLevel) {
      await this.createAlert(
        product,
        AlertType.OVERSTOCK,
        `Product ${product.name} is overstocked`,
        AlertPriority.LOW,
        product.maxStockLevel,
        product.availableStock,
      );
    }
  }

  private async createAlert(
    product: Product,
    type: AlertType,
    message: string,
    priority: AlertPriority,
    threshold?: number,
    currentValue?: number,
    expirationDate?: Date,
  ): Promise<void> {
    // Check if similar alert already exists
    const existingAlert = await this.alertRepository.findOne({
      where: {
        product: { id: product.id },
        type,
        status: AlertStatus.ACTIVE,
      },
    });

    if (existingAlert) {
      // Update existing alert
      existingAlert.currentValue = currentValue || 0;
      existingAlert.priority = priority;
      await this.alertRepository.save(existingAlert);
      return;
    }

    // Create new alert
    const alert = this.alertRepository.create({
      product,
      type,
      message,
      priority,
      threshold,
      currentValue,
      expirationDate,
    });

    await this.alertRepository.save(alert);

    // Send email notification for critical alerts
    if (priority === AlertPriority.CRITICAL) {
      await this.sendAlertEmail(alert);
    }
  }

  private async sendAlertEmail(alert: InventoryAlert): Promise<void> {
    try {
      // await this.emailService.sendInventoryAlert(alert); // TODO: Implement sendInventoryAlert method
      alert.emailSent = true;
      alert.emailSentAt = new Date();
      await this.alertRepository.save(alert);
    } catch (error) {
      console.error('Failed to send alert email:', error);
    }
  }

  // 📊 Inventory Reports
  async getLowStockProducts(): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.stock - product.reservedStock <= product.minStockLevel')
      .andWhere('product.isActive = :isActive', { isActive: true })
      .getMany();
  }

  async getExpiringProducts(days: number = 30): Promise<Product[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.productRepository.find({
      where: {
        trackExpiration: true,
        expirationDate: LessThan(futureDate),
        isActive: true,
      },
    });
  }

  async getExpiredProducts(): Promise<Product[]> {
    return this.productRepository.find({
      where: {
        trackExpiration: true,
        expirationDate: LessThan(new Date()),
        isActive: true,
      },
    });
  }

  async getInventoryValue(): Promise<{ totalValue: number; totalCost: number; products: number }> {
    const products = await this.productRepository.find({
      where: { isActive: true },
    });

    let totalValue = 0;
    let totalCost = 0;

    products.forEach((product) => {
      totalValue += product.availableStock * product.price;
      if (product.costPrice) {
        totalCost += product.availableStock * product.costPrice;
      }
    });

    return {
      totalValue,
      totalCost,
      products: products.length,
    };
  }

  async getStockMovements(
    productId?: number,
    startDate?: Date,
    endDate?: Date,
    type?: MovementType,
  ): Promise<StockMovement[]> {
    const query = this.stockMovementRepository
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.product', 'product')
      .leftJoinAndSelect('movement.createdBy', 'user');

    if (productId) {
      query.andWhere('movement.product.id = :productId', { productId });
    }

    if (startDate) {
      query.andWhere('movement.createdAt >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('movement.createdAt <= :endDate', { endDate });
    }

    if (type) {
      query.andWhere('movement.type = :type', { type });
    }

    return query.orderBy('movement.createdAt', 'DESC').getMany();
  }

  // 🔄 Automated Tasks
  @Cron(CronExpression.EVERY_HOUR)
  async checkInventoryAlerts(): Promise<void> {
    console.log('Running inventory alerts check...');
    
    const products = await this.productRepository.find({
      where: { isActive: true },
    });

    for (const product of products) {
      await this.checkAndCreateAlerts(product);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async processAutoRestock(): Promise<void> {
    console.log('Processing auto-restock...');
    
    const productsNeedingRestock = await this.productRepository.find({
      where: {
        autoRestock: true,
        isActive: true,
      },
    });

    for (const product of productsNeedingRestock) {
      if (product.needsRestock) {
        // Create purchase order or restock request
        await this.createRestockRequest(product);
      }
    }
  }

  private async createRestockRequest(product: Product): Promise<void> {
    // This would integrate with purchase order system
    console.log(`Creating restock request for product: ${product.name}`);
    
    // For now, just create an alert
    await this.createAlert(
      product,
      AlertType.REORDER_POINT,
      `Auto-restock triggered for ${product.name}`,
      AlertPriority.HIGH,
      product.reorderPoint,
      product.availableStock,
    );
  }

  // Alert Management
  async getActiveAlerts(): Promise<InventoryAlert[]> {
    return this.alertRepository.find({
      where: { status: AlertStatus.ACTIVE },
      relations: ['product'],
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }

  async acknowledgeAlert(alertId: number, user: User, notes?: string): Promise<InventoryAlert> {
    const alert = await this.alertRepository.findOne({
      where: { id: alertId },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    alert.status = AlertStatus.ACKNOWLEDGED;
    alert.acknowledgedBy = user;
    alert.acknowledgedAt = new Date();
    alert.acknowledgedNotes = notes || null;

    return this.alertRepository.save(alert);
  }

  async resolveAlert(alertId: number, user: User, notes?: string): Promise<InventoryAlert> {
    const alert = await this.alertRepository.findOne({
      where: { id: alertId },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedBy = user;
    alert.resolvedAt = new Date();
    alert.resolutionNotes = notes || null;

    return this.alertRepository.save(alert);
  }
}
