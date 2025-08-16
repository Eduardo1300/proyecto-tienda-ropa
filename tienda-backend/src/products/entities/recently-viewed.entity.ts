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
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['user', 'product'])
export class RecentlyViewed {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.recentlyViewed)
  user: User;

  @ManyToOne(() => Product, (product) => product.recentlyViewedBy)
  product: Product;

  @Column({ default: 1 })
  viewCount: number;

  @Column({ nullable: true })
  lastViewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
