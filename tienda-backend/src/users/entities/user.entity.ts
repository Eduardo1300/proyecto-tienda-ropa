import { Column, Entity, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CartItem } from '../../carrito/entities/cart-item.entity';
import { Order } from '../../ordenes/entities/order.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true, type: 'varchar' })
  refreshToken: string | null;

  @Column({ nullable: true, type: 'varchar' })
  passwordResetToken: string | null;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: 0 })
  loyaltyPoints: number;

  // Información Personal Adicional
  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  birthDate: string; // ISO Date string

  @Column({ nullable: true })
  gender: string; // male, female, other, prefer-not-to-say

  @Column({ nullable: true, type: 'text' })
  bio: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CartItem, (item) => item.user)
  cart: CartItem[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

  // Product-related relations (lazy-loaded to avoid circular imports)
  wishlist: any[];
  comparisons: any[];
  reviews: any[];
  recentlyViewed: any[];
}
