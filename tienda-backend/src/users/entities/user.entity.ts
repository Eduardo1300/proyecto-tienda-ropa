import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CartItem } from '../../carrito/entities/cart-item.entity';
import { Order } from '../../ordenes/entities/order.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column({ nullable: true })
  country?: string;

  @Column()
  userId: number;
}

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

  @Column({ nullable: true, type: 'varchar' })
  refreshToken: string | null;

  @Column({ nullable: true, type: 'varchar' })
  passwordResetToken: string | null;

  @OneToMany(() => CartItem, (item) => item.user)
  cart: CartItem[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  // Direcciones del usuario
  @OneToMany(() => Address, (address) => address.userId, { cascade: true })
  addresses: Address[];
}
