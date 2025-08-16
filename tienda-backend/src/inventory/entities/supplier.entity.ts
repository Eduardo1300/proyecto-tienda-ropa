import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupplierProduct } from './supplier-product.entity';
import { PurchaseOrder } from './purchase-order.entity';

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ nullable: true, length: 100 })
  contactPerson: string;

  @Column({ nullable: true, length: 100 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phone: string;

  @Column({ nullable: true, length: 500 })
  address: string;

  @Column({ nullable: true, length: 100 })
  city: string;

  @Column({ nullable: true, length: 100 })
  country: string;

  @Column({ nullable: true, length: 20 })
  postalCode: string;

  @Column({ nullable: true, length: 50 })
  taxId: string;

  @Column({ nullable: true, length: 100 })
  website: string;

  @Column({ default: 'net30' })
  paymentTerms: string;

  @Column({ default: 0 })
  creditLimit: number;

  @Column({ default: 5 })
  rating: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastOrderDate: Date;

  @Column({ default: 0 })
  totalOrders: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalSpent: number;

  @Column({ nullable: true, length: 500 })
  notes: string;

  @OneToMany(() => SupplierProduct, (supplierProduct) => supplierProduct.supplier)
  products: SupplierProduct[];

  @OneToMany(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.supplier)
  purchaseOrders: PurchaseOrder[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
