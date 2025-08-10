import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

// Estados posibles de una orden
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  // Usuario dueño de la orden
  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  // Ítems pertenecientes a la orden
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Monto total calculado al crear la orden
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // Estado del ciclo de vida de la orden
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  // Identificador legible para el usuario
  @Column({ nullable: true, unique: true })
  orderNumber?: string;

  // Tracking proporcionado por el carrier (si aplica)
  @Column({ nullable: true })
  trackingNumber?: string;
}
