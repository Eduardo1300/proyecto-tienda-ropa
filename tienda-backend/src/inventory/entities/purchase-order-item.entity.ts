import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.items)
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;

  @Column({ default: 0 })
  receivedQuantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ nullable: true, length: 50 })
  supplierSku: string;

  @Column({ nullable: true, length: 100 })
  batch: string;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column({ nullable: true, length: 500 })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get remainingQuantity(): number {
    return this.quantity - this.receivedQuantity;
  }

  get isFullyReceived(): boolean {
    return this.receivedQuantity >= this.quantity;
  }
}
