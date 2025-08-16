import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { Return } from './return.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class ReturnItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Return, (returnEntity) => returnEntity.items)
  return: Return;

  @ManyToOne(() => OrderItem)
  orderItem: OrderItem;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  refundAmount: number;

  @Column({ type: 'text', nullable: true })
  condition: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
