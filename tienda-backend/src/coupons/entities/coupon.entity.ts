import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  // porcentaje [0-100] o monto fijo
  @Column({ type: 'enum', enum: ['percent', 'fixed'] })
  type: 'percent' | 'fixed';

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date | null;

  @Column({ type: 'int', default: 0 })
  maxRedemptions: number;

  @Column({ type: 'int', default: 0 })
  redemptions: number;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;
}