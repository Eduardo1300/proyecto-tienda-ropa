import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { User } from '../../users/entities/user.entity';

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class ProductReview {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @Column({ type: 'int', width: 1 })
  rating: number; // 1-5 stars

  @Column({ length: 200 })
  title: string;

  @Column('text')
  comment: string;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.PENDING,
  })
  status: ReviewStatus;

  @Column({ default: false })
  isVerifiedPurchase: boolean;

  @Column({ default: 0 })
  helpfulCount: number;

  @Column({ default: 0 })
  notHelpfulCount: number;

  @Column({ nullable: true, length: 500 })
  moderatorNotes: string;

  @Column({ nullable: true })
  moderatedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  moderatedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get helpfulnessRatio(): number {
    const total = this.helpfulCount + this.notHelpfulCount;
    return total > 0 ? (this.helpfulCount / total) * 100 : 0;
  }
}
