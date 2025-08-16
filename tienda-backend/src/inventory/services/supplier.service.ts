import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity';
import { SupplierProduct } from '../entities/supplier-product.entity';
import { Product } from '../../products/entities/product.entity';
import { PurchaseOrder } from '../entities/purchase-order.entity';

export interface CreateSupplierDto {
  name: string;
  code: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  website?: string;
  paymentTerms?: string;
  creditLimit?: number;
  rating?: number;
  notes?: string;
}

export interface UpdateSupplierDto {
  name?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  taxId?: string;
  website?: string;
  paymentTerms?: string;
  creditLimit?: number;
  rating?: number;
  isActive?: boolean;
  notes?: string;
}

export interface CreateSupplierProductDto {
  productId: number;
  supplierSku?: string;
  supplierPrice: number;
  minimumOrderQuantity?: number;
  leadTimeDays?: number;
  isPreferred?: boolean;
  notes?: string;
}

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(SupplierProduct)
    private supplierProductRepository: Repository<SupplierProduct>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(PurchaseOrder)
    private purchaseOrderRepository: Repository<PurchaseOrder>,
  ) {}

  async createSupplier(createDto: CreateSupplierDto): Promise<Supplier> {
    // Check if supplier code already exists
    const existingSupplier = await this.supplierRepository.findOne({
      where: { code: createDto.code },
    });

    if (existingSupplier) {
      throw new ConflictException('Supplier code already exists');
    }

    const supplier = this.supplierRepository.create(createDto);
    return this.supplierRepository.save(supplier);
  }

  async getSuppliers(isActive?: boolean): Promise<Supplier[]> {
    const query = this.supplierRepository.createQueryBuilder('supplier');

    if (isActive !== undefined) {
      query.where('supplier.isActive = :isActive', { isActive });
    }

    return query.orderBy('supplier.name', 'ASC').getMany();
  }

  async getSupplier(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: ['products', 'products.product', 'purchaseOrders'],
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  async updateSupplier(id: number, updateDto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    Object.assign(supplier, updateDto);
    return this.supplierRepository.save(supplier);
  }

  async deleteSupplier(id: number): Promise<void> {
    const supplier = await this.supplierRepository.findOne({
      where: { id },
      relations: ['purchaseOrders'],
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    // Check if supplier has active purchase orders
    const activePurchaseOrders = supplier.purchaseOrders.filter(
      po => !['cancelled', 'received'].includes(po.status)
    );

    if (activePurchaseOrders.length > 0) {
      throw new ConflictException('Cannot delete supplier with active purchase orders');
    }

    // Soft delete by setting isActive to false
    supplier.isActive = false;
    await this.supplierRepository.save(supplier);
  }

  // Supplier Products Management
  async addSupplierProduct(
    supplierId: number,
    createDto: CreateSupplierProductDto,
  ): Promise<SupplierProduct> {
    const supplier = await this.supplierRepository.findOne({
      where: { id: supplierId },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const product = await this.productRepository.findOne({
      where: { id: createDto.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if supplier-product relationship already exists
    const existingRelation = await this.supplierProductRepository.findOne({
      where: {
        supplier: { id: supplierId },
        product: { id: createDto.productId },
      },
    });

    if (existingRelation) {
      throw new ConflictException('Supplier-product relationship already exists');
    }

    const supplierProduct = this.supplierProductRepository.create({
      supplier,
      product,
      supplierSku: createDto.supplierSku,
      supplierPrice: createDto.supplierPrice,
      minimumOrderQuantity: createDto.minimumOrderQuantity || 1,
      leadTimeDays: createDto.leadTimeDays || 7,
      isPreferred: createDto.isPreferred || false,
      notes: createDto.notes,
    });

    return this.supplierProductRepository.save(supplierProduct);
  }

  async getSupplierProducts(supplierId: number): Promise<SupplierProduct[]> {
    return this.supplierProductRepository.find({
      where: { supplier: { id: supplierId } },
      relations: ['product'],
      order: { product: { name: 'ASC' } },
    });
  }

  async updateSupplierProduct(
    supplierId: number,
    productId: number,
    updateDto: Partial<CreateSupplierProductDto>,
  ): Promise<SupplierProduct> {
    const supplierProduct = await this.supplierProductRepository.findOne({
      where: {
        supplier: { id: supplierId },
        product: { id: productId },
      },
    });

    if (!supplierProduct) {
      throw new NotFoundException('Supplier-product relationship not found');
    }

    Object.assign(supplierProduct, updateDto);
    return this.supplierProductRepository.save(supplierProduct);
  }

  async removeSupplierProduct(supplierId: number, productId: number): Promise<void> {
    const supplierProduct = await this.supplierProductRepository.findOne({
      where: {
        supplier: { id: supplierId },
        product: { id: productId },
      },
    });

    if (!supplierProduct) {
      throw new NotFoundException('Supplier-product relationship not found');
    }

    await this.supplierProductRepository.remove(supplierProduct);
  }

  // Supplier Performance and Analytics
  async getSupplierPerformance(supplierId: number): Promise<{
    supplier: Supplier;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    onTimeDeliveryRate: number;
    activeProducts: number;
    lastOrderDate: Date;
    performance: {
      rating: number;
      totalDeliveries: number;
      onTimeDeliveries: number;
      lateDeliveries: number;
      averageLeadTime: number;
    };
  }> {
    const supplier = await this.getSupplier(supplierId);

    // Get purchase order statistics
    const purchaseOrders = await this.purchaseOrderRepository.find({
      where: { supplier: { id: supplierId } },
      relations: ['items'],
    });

    const completedOrders = purchaseOrders.filter(po => po.status === 'received');
    const totalOrders = purchaseOrders.length;
    const totalSpent = purchaseOrders.reduce((sum, po) => sum + po.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Calculate on-time delivery rate
    let onTimeDeliveries = 0;
    let totalDeliveries = 0;
    let totalLeadTime = 0;

    completedOrders.forEach(order => {
      if (order.expectedDeliveryDate && order.actualDeliveryDate) {
        totalDeliveries++;
        if (order.actualDeliveryDate <= order.expectedDeliveryDate) {
          onTimeDeliveries++;
        }
        
        const leadTime = Math.ceil(
          (order.actualDeliveryDate.getTime() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        totalLeadTime += leadTime;
      }
    });

    const onTimeDeliveryRate = totalDeliveries > 0 ? (onTimeDeliveries / totalDeliveries) * 100 : 0;
    const averageLeadTime = totalDeliveries > 0 ? totalLeadTime / totalDeliveries : 0;
    const lateDeliveries = totalDeliveries - onTimeDeliveries;

    return {
      supplier,
      totalOrders,
      totalSpent,
      averageOrderValue,
      onTimeDeliveryRate,
      activeProducts: supplier.products.filter(sp => sp.isActive).length,
      lastOrderDate: supplier.lastOrderDate,
      performance: {
        rating: supplier.rating,
        totalDeliveries,
        onTimeDeliveries,
        lateDeliveries,
        averageLeadTime,
      },
    };
  }

  async getTopSuppliers(limit: number = 10): Promise<Supplier[]> {
    return this.supplierRepository
      .createQueryBuilder('supplier')
      .where('supplier.isActive = :isActive', { isActive: true })
      .orderBy('supplier.totalSpent', 'DESC')
      .limit(limit)
      .getMany();
  }

  async searchSuppliers(query: string): Promise<Supplier[]> {
    return this.supplierRepository
      .createQueryBuilder('supplier')
      .where('supplier.isActive = :isActive', { isActive: true })
      .andWhere(
        '(supplier.name ILIKE :query OR supplier.code ILIKE :query OR supplier.contactPerson ILIKE :query)',
        { query: `%${query}%` }
      )
      .orderBy('supplier.name', 'ASC')
      .getMany();
  }
}
