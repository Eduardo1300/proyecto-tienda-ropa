import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyProgram, LoyaltyTier } from '../entities/loyalty-program.entity';
import { LoyaltyTransaction, TransactionType, TransactionReason } from '../entities/loyalty-transaction.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class LoyaltyService {
  constructor(
    @InjectRepository(LoyaltyProgram)
    private loyaltyRepository: Repository<LoyaltyProgram>,
    @InjectRepository(LoyaltyTransaction)
    private transactionRepository: Repository<LoyaltyTransaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createProgram(userId: number): Promise<LoyaltyProgram> {
    // Verificar si ya existe un programa para este usuario
    const existingProgram = await this.loyaltyRepository.findOne({
      where: { userId }
    });

    if (existingProgram) {
      return existingProgram;
    }

    const program = this.loyaltyRepository.create({
      userId,
      totalPoints: 0,
      availablePoints: 0,
      lifetimeSpent: 0,
      currentTier: LoyaltyTier.BRONZE,
      isActive: true,
      lastActivityAt: new Date()
    });

    const savedProgram = await this.loyaltyRepository.save(program);

    // Dar puntos de bienvenida
    await this.addPoints(
      savedProgram.id,
      100,
      TransactionReason.SIGNUP_BONUS,
      'Puntos de bienvenida por registrarte'
    );

    return savedProgram;
  }

  async getProgram(userId: number): Promise<LoyaltyProgram> {
    let program = await this.loyaltyRepository.findOne({
      where: { userId },
      relations: ['transactions']
    });

    if (!program) {
      program = await this.createProgram(userId);
    }

    return program;
  }

  async addPoints(
    programId: number,
    points: number,
    reason: TransactionReason,
    description?: string,
    orderId?: number,
    orderAmount?: number
  ): Promise<LoyaltyTransaction> {
    const program = await this.loyaltyRepository.findOne({
      where: { id: programId }
    });

    if (!program) {
      throw new NotFoundException('Programa de lealtad no encontrado');
    }

    // Crear transacción
    const transaction = this.transactionRepository.create({
      loyaltyProgramId: programId,
      type: TransactionType.EARNED,
      reason,
      points,
      orderId,
      orderAmount,
      description,
      expiresAt: this.calculateExpirationDate()
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Actualizar programa
    program.totalPoints += points;
    program.availablePoints += points;
    program.lastActivityAt = new Date();

    if (orderAmount) {
      program.lifetimeSpent += orderAmount;
    }

    // Verificar cambio de tier
    const newTier = program.calculateTier();
    if (newTier !== program.currentTier) {
      const oldTier = program.currentTier;
      program.currentTier = newTier;
      program.tierAchievedAt = new Date();

      // Dar bonus por subir de tier
      const tierBonus = this.getTierUpgradeBonus(newTier);
      if (tierBonus > 0) {
        await this.addPoints(
          programId,
          tierBonus,
          TransactionReason.TIER_UPGRADE_BONUS,
          `Bonus por alcanzar nivel ${newTier.toUpperCase()}`
        );
      }
    }

    await this.loyaltyRepository.save(program);

    return savedTransaction;
  }

  async redeemPoints(
    userId: number,
    points: number,
    description?: string
  ): Promise<{ success: boolean; discount: number; transaction?: LoyaltyTransaction }> {
    const program = await this.getProgram(userId);

    if (!program.canRedeemPoints(points)) {
      throw new BadRequestException('Puntos insuficientes para canjear');
    }

    const discount = program.getRedemptionValue(points);

    // Crear transacción de canje
    const transaction = this.transactionRepository.create({
      loyaltyProgramId: program.id,
      type: TransactionType.REDEEMED,
      reason: TransactionReason.REDEMPTION,
      points: -points, // Negativo porque se restan
      description: description || `Canje de ${points} puntos por $${discount} de descuento`
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Actualizar programa
    program.availablePoints -= points;
    program.lastActivityAt = new Date();
    await this.loyaltyRepository.save(program);

    return {
      success: true,
      discount,
      transaction: savedTransaction
    };
  }

  async getTransactionHistory(
    userId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<{ transactions: LoyaltyTransaction[]; total: number }> {
    console.log(`📋 Getting transaction history for user ${userId}`);
    
    const program = await this.getProgram(userId);
    console.log(`📋 Found loyalty program ${program.id} for user ${userId}`);

    const [transactions, total] = await this.transactionRepository.findAndCount({
      where: { loyaltyProgramId: program.id },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset
    });

    console.log(`📋 Found ${transactions.length} transactions (total: ${total}) for program ${program.id}`);

    return { transactions, total };
  }

  async processOrderPoints(
    userId: number,
    orderId: number,
    orderAmount: number
  ): Promise<LoyaltyTransaction> {
    const program = await this.getProgram(userId);
    const points = program.calculatePointsForPurchase(orderAmount);

    return await this.addPoints(
      program.id,
      points,
      TransactionReason.PURCHASE,
      `Puntos ganados por compra #${orderId}`,
      orderId,
      orderAmount
    );
  }

  async giveReviewBonus(userId: number, productId: number): Promise<LoyaltyTransaction> {
    const program = await this.getProgram(userId);
    const bonusPoints = 25; // 25 puntos por escribir una reseña

    return await this.addPoints(
      program.id,
      bonusPoints,
      TransactionReason.REVIEW_BONUS,
      `Bonus por escribir reseña del producto #${productId}`
    );
  }

  async giveBirthdayBonus(userId: number): Promise<LoyaltyTransaction> {
    const program = await this.getProgram(userId);
    const bonusPoints = 200; // 200 puntos de cumpleaños

    return await this.addPoints(
      program.id,
      bonusPoints,
      TransactionReason.BIRTHDAY_BONUS,
      '¡Feliz cumpleaños! Disfruta tus puntos de regalo'
    );
  }

  async giveReferralBonus(userId: number, referredUserId: number): Promise<LoyaltyTransaction> {
    const program = await this.getProgram(userId);
    const bonusPoints = 150; // 150 puntos por referir

    return await this.addPoints(
      program.id,
      bonusPoints,
      TransactionReason.REFERRAL_BONUS,
      `Bonus por referir al usuario #${referredUserId}`
    );
  }

  async expirePoints(): Promise<void> {
    // Encontrar puntos que expiran hoy
    const expiringTransactions = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.expiresAt <= :today', { today: new Date() })
      .andWhere('transaction.type = :type', { type: TransactionType.EARNED })
      .getMany();

    for (const transaction of expiringTransactions) {
      // Crear transacción de expiración
      await this.transactionRepository.save({
        loyaltyProgramId: transaction.loyaltyProgramId,
        type: TransactionType.EXPIRED,
        reason: TransactionReason.EXPIRATION,
        points: -transaction.points,
        description: `Expiración de puntos de transacción #${transaction.id}`
      });

      // Actualizar programa
      const program = await this.loyaltyRepository.findOne({
        where: { id: transaction.loyaltyProgramId }
      });

      if (program) {
        program.availablePoints -= transaction.points;
        await this.loyaltyRepository.save(program);
      }
    }
  }

  async getLeaderboard(limit: number = 10): Promise<any[]> {
    const programs = await this.loyaltyRepository.find({
      order: { totalPoints: 'DESC' },
      take: limit,
      where: { isActive: true }
    });

    // Formatear para el leaderboard
    return programs.map((program, index) => ({
      position: index + 1,
      userId: program.userId,
      userName: `Usuario ${program.userId}`,
      currentPoints: program.totalPoints,
      currentTier: program.currentTier,
      totalPointsEarned: program.totalPoints
    }));
  }

  private calculateExpirationDate(): Date {
    // Los puntos expiran después de 2 años
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 2);
    return expirationDate;
  }

  private getTierUpgradeBonus(tier: LoyaltyTier): number {
    const bonuses = {
      [LoyaltyTier.BRONZE]: 0,
      [LoyaltyTier.SILVER]: 100,
      [LoyaltyTier.GOLD]: 250,
      [LoyaltyTier.PLATINUM]: 500
    };

    return bonuses[tier] || 0;
  }

  async adjustPoints(
    userId: number,
    points: number,
    description: string
  ): Promise<LoyaltyTransaction> {
    const program = await this.getProgram(userId);

    const transaction = this.transactionRepository.create({
      loyaltyProgramId: program.id,
      type: points > 0 ? TransactionType.EARNED : TransactionType.REDEEMED,
      reason: TransactionReason.ADMIN_ADJUSTMENT,
      points,
      description
    });

    const savedTransaction = await this.transactionRepository.save(transaction);

    // Actualizar programa
    program.totalPoints += points;
    program.availablePoints += points;
    program.lastActivityAt = new Date();
    await this.loyaltyRepository.save(program);

    return savedTransaction;
  }

  // Método temporal para obtener usuarios (para debugging)
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName']
    });
  }

  // Método temporal para crear usuario de prueba (para debugging)
  async createTestUser(): Promise<User> {
    // Verificar si ya existe un usuario de prueba
    let testUser = await this.userRepository.findOne({
      where: { email: 'test@loyalty.com' }
    });

    if (testUser) {
      return testUser;
    }

    // Crear usuario de prueba
    testUser = this.userRepository.create({
      email: 'test@loyalty.com',
      password: '$2b$10$hashedpassword', // password hasheado
      firstName: 'Usuario',
      lastName: 'Prueba',
      role: 'user'
    });

    return await this.userRepository.save(testUser);
  }

  // Método temporal para obtener usuario por ID (para debugging)
  async getUserById(userId: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: userId }
    });
  }

  // Método temporal para generar token (para debugging)
  async generateTokenForUser(user: User): Promise<string> {
    const jwt = require('jsonwebtoken');
    
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    const secret = process.env.JWT_SECRET || 'tu-clave-secreta-muy-segura';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    return jwt.sign(payload, secret, { expiresIn });
  }
}
