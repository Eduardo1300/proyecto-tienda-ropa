import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Supplier } from './supplier.entity';

@Entity()
export class SupplierProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.suppliers)
  product: Product;

  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  supplier: Supplier;

  @Column({ nullable: true, length: 50 })
  supplierSku: string;

  @Column('decimal', { precision: 10, scale: 2 })
  supplierPrice: number;

  @Column({ default: 1 })
  minimumOrderQuantity: number;

  @Column({ default: 7 })
  leadTimeDays: number;

  @Column({ default: true })
  isPreferred: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastOrderDate: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  lastOrderPrice: number;

  @Column({ default: 0 })
  totalOrdered: number;

  @Column({ nullable: true, length: 500 })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
