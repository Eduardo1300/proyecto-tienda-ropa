import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Order } from '../../ordenes/entities/order.entity';

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping'
}

export enum CouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired'
}

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: CouponType,
    default: CouponType.PERCENTAGE
  })
  type: CouponType;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  minimumAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maximumDiscount: number;

  @Column({ default: 0 })
  usageLimit: number;

  @Column({ default: 0 })
  usageCount: number;

  @Column({ default: 1 })
  usagePerUser: number;

  @Column({ type: 'timestamp', nullable: true })
  validFrom: Date;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @Column({
    type: 'enum',
    enum: CouponStatus,
    default: CouponStatus.ACTIVE
  })
  status: CouponStatus;

  @Column('simple-array', { nullable: true })
  applicableCategories: string[];

  @Column('simple-array', { nullable: true })
  applicableProducts: string[];

  @Column({ default: false })
  isFirstTimeUser: boolean;

  @Column({ default: false })
  isPublic: boolean;

  @OneToMany(() => Order, order => order.coupon)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Métodos de utilidad
  isValid(): boolean {
    const now = new Date();
    
    if (this.status !== CouponStatus.ACTIVE) {
      return false;
    }

    if (this.validFrom && now < this.validFrom) {
      return false;
    }

    if (this.validUntil && now > this.validUntil) {
      return false;
    }

    if (this.usageLimit > 0 && this.usageCount >= this.usageLimit) {
      return false;
    }

    return true;
  }

  canBeUsedBy(userId: number, userOrderCount: number): boolean {
    if (!this.isValid()) {
      return false;
    }

    if (this.isFirstTimeUser && userOrderCount > 0) {
      return false;
    }

    return true;
  }

  calculateDiscount(subtotal: number): number {
    if (!this.isValid()) {
      return 0;
    }

    if (this.minimumAmount && subtotal < this.minimumAmount) {
      return 0;
    }

    let discount = 0;

    switch (this.type) {
      case CouponType.PERCENTAGE:
        discount = subtotal * (this.value / 100);
        break;
      case CouponType.FIXED_AMOUNT:
        discount = this.value;
        break;
      case CouponType.FREE_SHIPPING:
        // El descuento de envío se maneja en el servicio de órdenes
        discount = 0;
        break;
    }

    if (this.maximumDiscount && discount > this.maximumDiscount) {
      discount = this.maximumDiscount;
    }

    return Math.min(discount, subtotal);
  }
}
