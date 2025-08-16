import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { User } from '../../users/entities/user.entity';
import { ReturnItem } from './return-item.entity';

export enum ReturnStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RECEIVED = 'received',
  PROCESSED = 'processed',
  REFUNDED = 'refunded',
}

export enum ReturnReason {
  DEFECTIVE = 'defective',
  WRONG_SIZE = 'wrong_size',
  NOT_AS_DESCRIBED = 'not_as_described',
  CHANGED_MIND = 'changed_mind',
  DAMAGED_IN_SHIPPING = 'damaged_in_shipping',
  OTHER = 'other',
}

@Entity()
export class Return {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  returnNumber: string;

  @ManyToOne(() => Order)
  order: Order;

  @ManyToOne(() => User)
  user: User;

  @OneToMany(() => ReturnItem, (item) => item.return, { cascade: true })
  items: ReturnItem[];

  @Column({
    type: 'enum',
    enum: ReturnStatus,
    default: ReturnStatus.REQUESTED,
  })
  status: ReturnStatus;

  @Column({
    type: 'enum',
    enum: ReturnReason,
  })
  reason: ReturnReason;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  refundAmount: number;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  rejectedAt: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ nullable: true })
  receivedAt: Date;

  @Column({ nullable: true })
  processedAt: Date;

  @Column({ nullable: true })
  refundedAt: Date;

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @ManyToOne(() => User, { nullable: true })
  processedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
