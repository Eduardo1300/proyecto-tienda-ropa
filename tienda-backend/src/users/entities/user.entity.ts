import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CarritoItem } from 'src/carrito/entities/carrito-item.entity';
import { Order } from 'src/ordenes/entities/order.entity'; // ⬅️ NUEVO

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ name: 'email' })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true, type: 'varchar' })
  refreshToken: string | null;

  @OneToMany(() => CarritoItem, (item) => item.usuario)
  carrito: CarritoItem[];

  @OneToMany(() => Order, (order) => order.usuario) // ⬅️ NUEVO
  orders: Order[]; // ⬅️ NUEVO
}
