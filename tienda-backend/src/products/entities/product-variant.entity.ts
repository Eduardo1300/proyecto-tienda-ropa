import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductImage } from './product-image.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 50 })
  sku: string;

  @Column({ nullable: true, length: 100 })
  barcode: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  compareAtPrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costPrice: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  reservedStock: number;

  @Column({ nullable: true, length: 50 })
  color: string;

  @Column({ nullable: true, length: 50 })
  size: string;

  @Column({ nullable: true, length: 50 })
  material: string;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  weight: number;

  @Column({ nullable: true, length: 50 })
  dimensions: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: 0 })
  position: number;

  @OneToMany(() => ProductImage, (image) => image.variant)
  images: ProductImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Computed properties
  get availableStock(): number {
    return this.stock - this.reservedStock;
  }

  get isInStock(): boolean {
    return this.availableStock > 0;
  }

  get discountPercentage(): number {
    if (!this.compareAtPrice || this.compareAtPrice <= this.price) return 0;
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
}
