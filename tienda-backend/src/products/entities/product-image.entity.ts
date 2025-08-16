import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;

  @ManyToOne(() => ProductVariant, (variant) => variant.images, { nullable: true })
  variant: ProductVariant;

  @Column({ length: 500 })
  url: string;

  @Column({ nullable: true, length: 200 })
  altText: string;

  @Column({ default: 0 })
  position: number;

  @Column({ default: false })
  isMain: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, length: 50 })
  type: string; // 'main', 'gallery', 'variant', 'zoom'

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  fileSize: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
