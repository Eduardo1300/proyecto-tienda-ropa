import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariant } from './product-variant.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['user', 'product', 'variant'])
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Product, (product) => product.wishlistItems)
  product: Product;

  @ManyToOne(() => ProductVariant, { nullable: true })
  variant: ProductVariant;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true, length: 500 })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
