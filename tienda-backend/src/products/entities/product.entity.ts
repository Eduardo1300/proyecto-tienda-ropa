import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

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

  @Column({ default: 0 })
  stock: number;

  // Filtros avanzados
  @Column({ nullable: true })
  size?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  brand?: string;

  // Rating promedio y número de reseñas
  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  reviewsCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
