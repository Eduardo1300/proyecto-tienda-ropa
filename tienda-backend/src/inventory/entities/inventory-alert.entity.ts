import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

export enum AlertType {
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  EXPIRING_SOON = 'expiring_soon',
  EXPIRED = 'expired',
  REORDER_POINT = 'reorder_point',
  OVERSTOCK = 'overstock',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

export enum AlertPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity()
export class InventoryAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product)
  product: Product;

  @Column({
    type: 'enum',
    enum: AlertType,
  })
  type: AlertType;

  @Column({
    type: 'enum',
    enum: AlertStatus,
    default: AlertStatus.ACTIVE,
  })
  status: AlertStatus;

  @Column({
    type: 'enum',
    enum: AlertPriority,
    default: AlertPriority.MEDIUM,
  })
  priority: AlertPriority;

  @Column({ length: 500 })
  message: string;

  @Column({ nullable: true })
  threshold: number;

  @Column({ nullable: true })
  currentValue: number;

  @Column({ nullable: true })
  expirationDate: Date;

  @Column({ default: false })
  emailSent: boolean;

  @Column({ nullable: true })
  emailSentAt: Date;

  @ManyToOne(() => User, { nullable: true })
  acknowledgedBy: User;

  @Column({ nullable: true })
  acknowledgedAt: Date;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  acknowledgedNotes: string | null;

  @ManyToOne(() => User, { nullable: true })
  resolvedBy: User;

  @Column({ nullable: true })
  resolvedAt: Date;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  resolutionNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  get isActive(): boolean {
    return this.status === AlertStatus.ACTIVE;
  }

  get daysSinceCreated(): number {
    return Math.floor((new Date().getTime() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  }
}
