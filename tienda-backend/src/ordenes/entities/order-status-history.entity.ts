import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { User } from '../../users/entities/user.entity';

@Entity()
export class OrderStatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.statusHistory)
  order: Order;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    nullable: true,
  })
  fromStatus: OrderStatus;

  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  toStatus: OrderStatus;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => User, { nullable: true })
  changedBy: User;

  @Column({ default: false })
  emailSent: boolean;

  @Column({ nullable: true })
  trackingCode: string;

  @CreateDateColumn()
  createdAt: Date;
}
