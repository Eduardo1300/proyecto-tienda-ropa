import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LoyaltyProgram } from './loyalty-program.entity';

export enum TransactionType {
  EARNED = 'earned',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  BONUS = 'bonus',
  ADJUSTMENT = 'adjustment'
}

export enum TransactionReason {
  PURCHASE = 'purchase',
  REDEMPTION = 'redemption',
  BIRTHDAY_BONUS = 'birthday_bonus',
  REFERRAL_BONUS = 'referral_bonus',
  REVIEW_BONUS = 'review_bonus',
  SIGNUP_BONUS = 'signup_bonus',
  TIER_UPGRADE_BONUS = 'tier_upgrade_bonus',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
  EXPIRATION = 'expiration'
}

@Entity('loyalty_transactions')
export class LoyaltyTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  loyaltyProgramId: number;

  @Column({
    type: 'enum',
    enum: TransactionType
  })
  type: TransactionType;

  @Column({
    type: 'enum',
    enum: TransactionReason
  })
  reason: TransactionReason;

  @Column()
  points: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  orderAmount: number;

  @Column({ nullable: true })
  orderId: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  referenceId: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @ManyToOne(() => LoyaltyProgram, program => program.transactions)
  @JoinColumn({ name: 'loyaltyProgramId' })
  loyaltyProgram: LoyaltyProgram;

  @CreateDateColumn()
  createdAt: Date;

  // Métodos de utilidad
  isExpired(): boolean {
    return this.expiresAt && new Date() > this.expiresAt;
  }

  getDisplayMessage(): string {
    switch (this.reason) {
      case TransactionReason.PURCHASE:
        return `Ganaste ${this.points} puntos por tu compra de $${this.orderAmount}`;
      case TransactionReason.REDEMPTION:
        return `Canjeaste ${Math.abs(this.points)} puntos por $${Math.abs(this.points) / 100} de descuento`;
      case TransactionReason.BIRTHDAY_BONUS:
        return `¡Feliz cumpleaños! Recibiste ${this.points} puntos de regalo`;
      case TransactionReason.REFERRAL_BONUS:
        return `Ganaste ${this.points} puntos por referir a un amigo`;
      case TransactionReason.REVIEW_BONUS:
        return `Ganaste ${this.points} puntos por escribir una reseña`;
      case TransactionReason.SIGNUP_BONUS:
        return `¡Bienvenido! Recibiste ${this.points} puntos de regalo`;
      case TransactionReason.TIER_UPGRADE_BONUS:
        return `¡Felicidades por tu nuevo nivel! Recibiste ${this.points} puntos bonus`;
      case TransactionReason.EXPIRATION:
        return `${Math.abs(this.points)} puntos expiraron`;
      case TransactionReason.ADMIN_ADJUSTMENT:
        return this.description || `Ajuste de ${this.points} puntos`;
      default:
        return `${this.type === TransactionType.EARNED ? 'Ganaste' : 'Usaste'} ${Math.abs(this.points)} puntos`;
    }
  }
}
