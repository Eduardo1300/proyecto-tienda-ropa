import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

export enum MovementType {
  PURCHASE = 'purchase',
  SALE = 'sale',
  RETURN = 'return',
  ADJUSTMENT = 'adjustment',
  RESTOCK = 'restock',
  EXPIRED = 'expired',
  DAMAGED = 'damaged',
  TRANSFER = 'transfer',
}

export enum MovementReason {
  CUSTOMER_ORDER = 'customer_order',
  SUPPLIER_DELIVERY = 'supplier_delivery',
  INVENTORY_COUNT = 'inventory_count',
  PRODUCT_RETURN = 'product_return',
  EXPIRATION = 'expiration',
  DAMAGE = 'damage',
  THEFT = 'theft',
  MANUAL_ADJUSTMENT = 'manual_adjustment',
  AUTO_RESTOCK = 'auto_restock',
  TRANSFER_IN = 'transfer_in',
  TRANSFER_OUT = 'transfer_out',
}

@Entity()
export class StockMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.stockMovements)
  product: Product;

  @Column({
    type: 'enum',
    enum: MovementType,
  })
  type: MovementType;

  @Column({
    type: 'enum',
    enum: MovementReason,
  })
  reason: MovementReason;

  @Column()
  quantity: number;

  @Column()
  previousStock: number;

  @Column()
  newStock: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  unitCost: number | null;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  totalCost: number | null;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  batch: string | null;

  @Column({ type: 'timestamp', nullable: true })
  expirationDate: Date | null;

  @Column({ type: 'varchar', nullable: true, length: 200 })
  location: string | null;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  notes: string | null;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  referenceNumber: string | null;

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;
}
