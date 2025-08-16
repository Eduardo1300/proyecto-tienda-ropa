import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StockMovement } from '../../inventory/entities/stock-movement.entity';
import { SupplierProduct } from '../../inventory/entities/supplier-product.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { ProductReview } from './product-review.entity';
import { Wishlist } from './wishlist.entity';
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

  // Advanced Inventory Fields
  @Column({ type: 'varchar', unique: true, length: 50, nullable: true })
  sku: string | null;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  barcode: string | null;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 0 })
  reservedStock: number;

  @Column({ default: 5 })
  minStockLevel: number;

  @Column({ default: 100 })
  maxStockLevel: number;

  @Column({ default: 20 })
  reorderPoint: number;

  @Column({ default: 50 })
  reorderQuantity: number;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column({ default: false })
  trackExpiration: boolean;

  @Column({ default: false })
  autoRestock: boolean;

  @Column({ default: false })
  lowStockAlert: boolean;

  @Column({ nullable: true })
  lastRestockDate: Date;

  @Column({ nullable: true })
  lastSoldDate: Date;

  @Column({ default: 0 })
  totalSold: number;

  @Column({ nullable: true, length: 100 })
  supplier: string;

  @Column({ nullable: true, length: 50 })
  supplierSku: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  supplierPrice: number;

  @Column({ default: 0 })
  leadTimeDays: number;

  @Column({ nullable: true, length: 200 })
  location: string;

  @Column({ nullable: true, length: 100 })
  batch: string;

  @Column({ default: 'kg' })
  unit: string;

  @Column('decimal', { precision: 10, scale: 3, default: 1 })
  weight: number;

  @Column({ nullable: true, length: 50 })
  size: string;

  @Column({ nullable: true, length: 50 })
  color: string;

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

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlistItems: Wishlist[];

  @OneToMany(() => RecentlyViewed, (recentlyViewed) => recentlyViewed.product)
  recentlyViewedBy: RecentlyViewed[];

  @OneToMany(() => StockMovement, (movement) => movement.product)
  stockMovements: StockMovement[];

  @OneToMany(() => SupplierProduct, (supplierProduct) => supplierProduct.product)
  suppliers: SupplierProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Computed properties
  get availableStock(): number {
    return this.stock - this.reservedStock;
  }

  get isLowStock(): boolean {
    return this.availableStock <= this.minStockLevel;
  }

  get needsRestock(): boolean {
    return this.availableStock <= this.reorderPoint;
  }

  get isExpired(): boolean {
    if (!this.trackExpiration || !this.expirationDate) return false;
    return new Date() > this.expirationDate;
  }

  get isExpiringSoon(): boolean {
    if (!this.trackExpiration || !this.expirationDate) return false;
    const daysUntilExpiration = Math.ceil(
      (this.expirationDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiration <= 30 && daysUntilExpiration > 0;
  }
}
