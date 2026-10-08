import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { ProductReview } from './product-review.entity';
import { RecentlyViewed } from './recently-viewed.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  costPrice: number;

  @Column('text')
  description: string;

  @Column({ nullable: true, length: 500 })
  image: string;

  @Column({ nullable: true, length: 500 })
  imageUrl: string;

  @Column({ length: 100, default: 'general' })
  category: string;

  @Column({ default: true })
  isActive: boolean;

  // Basic Inventory Fields
  @Column({ type: 'varchar', unique: true, length: 50, nullable: true })
  sku: string | null;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  barcode: string | null;

  @Column({ default: 0 })
  stock: number;

  // Advanced product features
  @Column({ nullable: true, length: 100 })
  brand: string;

  @Column({ nullable: true, length: 100 })
  model: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column('simple-array', { nullable: true })
  relatedProductIds: number[];

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isNew: boolean;

  @Column({ default: false })
  isBestseller: boolean;

  @Column({ nullable: true })
  launchDate: Date;

  @Column('text', { nullable: true })
  specifications: string;

  @Column('text', { nullable: true })
  careInstructions: string;

  @Column('text', { nullable: true })
  shippingInfo: string;

  @Column('text', { nullable: true })
  returnPolicy: string;

  // Relations
  @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductReview, (review) => review.product)
  reviews: ProductReview[];

  @OneToMany(() => RecentlyViewed, (recentlyViewed) => recentlyViewed.product)
  recentlyViewedBy: RecentlyViewed[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
