import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  user: User;

  @Column('int')
  rating: number; // 1..5

  @Column('text', { nullable: true })
  comment?: string;

  @CreateDateColumn()
  createdAt: Date;
}