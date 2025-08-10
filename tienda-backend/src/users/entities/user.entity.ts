import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CartItem } from '../../carrito/entities/cart-item.entity';
import { Order } from '../../ordenes/entities/order.entity';
import { Address } from './address.entity';

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

  // Roles extendidos: admin, moderador, vendedor, user
  @Column({ default: 'user' })
  role: string;

  // Puntos de fidelidad del usuario
  @Column({ type: 'int', default: 0 })
  loyaltyPoints: number;

  @Column({ nullable: true, type: 'varchar' })
  refreshToken: string | null;

  @Column({ nullable: true, type: 'varchar' })
  passwordResetToken: string | null;

  @OneToMany(() => CartItem, (item) => item.user)
  cart: CartItem[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  // Direcciones del usuario
  @OneToMany(() => Address, (address) => address.user, { cascade: true })
  addresses: Address[];
}
