import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { LoyaltyTransaction } from './loyalty-transaction.entity';

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum'
}

@Entity('loyalty_programs')
export class LoyaltyProgram {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userId: number;

  @Column({ default: 0 })
  totalPoints: number;

  @Column({ default: 0 })
  availablePoints: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  lifetimeSpent: number;

  @Column({
    type: 'enum',
    enum: LoyaltyTier,
    default: LoyaltyTier.BRONZE
  })
  currentTier: LoyaltyTier;

  @Column({ default: 0 })
  tierProgress: number;

  @Column({ type: 'timestamp', nullable: true })
  tierAchievedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastActivityAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => LoyaltyTransaction, transaction => transaction.loyaltyProgram)
  transactions: LoyaltyTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Configuración de tiers
  static getTierRequirements() {
    return {
      [LoyaltyTier.BRONZE]: { minSpent: 0, pointsMultiplier: 1, benefits: ['Puntos básicos'] },
      [LoyaltyTier.SILVER]: { minSpent: 500, pointsMultiplier: 1.2, benefits: ['20% más puntos', 'Envío gratis en pedidos >$50'] },
      [LoyaltyTier.GOLD]: { minSpent: 1500, pointsMultiplier: 1.5, benefits: ['50% más puntos', 'Envío gratis siempre', 'Acceso anticipado a ofertas'] },
      [LoyaltyTier.PLATINUM]: { minSpent: 3000, pointsMultiplier: 2, benefits: ['Doble puntos', 'Envío gratis express', 'Soporte prioritario', 'Regalos exclusivos'] }
    };
  }

  // Métodos de utilidad
  calculateTier(): LoyaltyTier {
    const requirements = LoyaltyProgram.getTierRequirements();
    
    if (this.lifetimeSpent >= requirements[LoyaltyTier.PLATINUM].minSpent) {
      return LoyaltyTier.PLATINUM;
    } else if (this.lifetimeSpent >= requirements[LoyaltyTier.GOLD].minSpent) {
      return LoyaltyTier.GOLD;
    } else if (this.lifetimeSpent >= requirements[LoyaltyTier.SILVER].minSpent) {
      return LoyaltyTier.SILVER;
    }
    
    return LoyaltyTier.BRONZE;
  }

  getPointsMultiplier(): number {
    const requirements = LoyaltyProgram.getTierRequirements();
    return requirements[this.currentTier].pointsMultiplier;
  }

  calculatePointsForPurchase(amount: number): number {
    // 1 punto por cada $1 gastado, multiplicado por el tier
    const basePoints = Math.floor(amount);
    return Math.floor(basePoints * this.getPointsMultiplier());
  }

  getNextTier(): { tier: LoyaltyTier | null; requiredSpent: number; progress: number } {
    const requirements = LoyaltyProgram.getTierRequirements();
    const tiers = Object.keys(requirements) as LoyaltyTier[];
    const currentIndex = tiers.indexOf(this.currentTier);
    
    if (currentIndex === tiers.length - 1) {
      return { tier: null, requiredSpent: 0, progress: 100 };
    }
    
    const nextTier = tiers[currentIndex + 1];
    const requiredSpent = requirements[nextTier].minSpent;
    const progress = Math.min(100, (this.lifetimeSpent / requiredSpent) * 100);
    
    return { tier: nextTier, requiredSpent, progress };
  }

  canRedeemPoints(points: number): boolean {
    return this.availablePoints >= points && points > 0;
  }

  getRedemptionValue(points: number): number {
    // 100 puntos = $1 de descuento
    return points / 100;
  }
}
