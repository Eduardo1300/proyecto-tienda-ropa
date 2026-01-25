import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreferences {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  // Notificaciones
  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: true })
  orderNotifications: boolean;

  @Column({ default: true })
  promotionNotifications: boolean;

  @Column({ default: false })
  weeklyNewsletter: boolean;

  // Privacidad
  @Column({ default: false })
  profilePublic: boolean;

  @Column({ default: false })
  showPurchaseHistory: boolean;

  @Column({ default: true })
  allowDataCollection: boolean;

  // Seguridad
  @Column({ default: false })
  twoFactorEnabled: boolean;

  @Column({ default: 'email' })
  twoFactorMethod: string; // email, sms, app

  @Column({ nullable: true })
  lastLoginAt: Date;

  @Column({ nullable: true })
  lastPasswordChangeAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
