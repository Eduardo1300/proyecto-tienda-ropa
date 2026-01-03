import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { RequestUser } from '../../common/types/user.types';
import { LoyaltyService } from '../services/loyalty.service';
import { TransactionType, TransactionReason } from '../entities/loyalty-transaction.entity';

// DTOs
export class RedeemPointsDto {
  points: number;
  description?: string;
}

export class TransactionQueryDto {
  limit?: number = 50;
  offset?: number = 0;
}

@Controller('loyalty')
@UseGuards(JwtAuthGuard)
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  // Endpoint de prueba sin autenticación (temporal para debugging)
  @Public()
  @Get('test')
  async testEndpoint() {
    return {
      success: true,
      message: 'Loyalty API is working',
      timestamp: new Date().toISOString()
    };
  }

  // Endpoint para obtener usuarios disponibles (temporal para debugging)
  @Public()
  @Get('test/users')
  async getAvailableUsers() {
    try {
      // Obtener todos los usuarios para pruebas
      const users = await this.loyaltyService.getAllUsers();
      return {
        success: true,
        message: 'Available users for loyalty testing',
        totalUsers: users.length,
        data: users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }))
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error getting users',
        error: error.message
      };
    }
  }

  // Endpoint para crear usuario de prueba si no existe (temporal para debugging)
  @Public()
  @Post('test/create-test-user')
  async createTestUser() {
    try {
      const testUser = await this.loyaltyService.createTestUser();
      return {
        success: true,
        message: 'Test user created successfully',
        data: {
          id: testUser.id,
          email: testUser.email,
          firstName: testUser.firstName,
          lastName: testUser.lastName
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error creating test user',
        error: error.message
      };
    }
  }

  // Endpoint para generar token de prueba (temporal para debugging)
  @Public()
  @Get('test/generate-token')
  async generateTestToken() {
    try {
      let targetUserId;
      
      // Usar el primer usuario disponible o crear uno
      const users = await this.loyaltyService.getAllUsers();
      if (users.length > 0) {
        targetUserId = users[0].id;
      } else {
        const testUser = await this.loyaltyService.createTestUser();
        targetUserId = testUser.id;
      }

      // Generar token usando los métodos del servicio
      const user = await this.loyaltyService.getUserById(targetUserId);
      if (!user) {
        throw new Error('User not found');
      }

      const token = await this.loyaltyService.generateTokenForUser(user);

      return {
        success: true,
        message: `Token generated for user ${user.email}`,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          token,
          instructions: {
            step1: 'Copia este token',
            step2: 'Ve a DevTools > Application > Local Storage en el frontend',
            step3: 'Busca la key "token" y actualiza con este valor',
            step4: 'Recarga la página del frontend',
            step5: 'Ahora debería funcionar el acceso a Loyalty'
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error generating token',
        error: error.message
      };
    }
  }

  // Endpoint completo de prueba que crea usuario, datos de loyalty y devuelve todo (temporal)
  @Public()
  @Post('test/setup')
  async setupCompleteTest(@Body('userId') userId?: number) {
    try {
      let targetUserId = userId;

      // Si no se especifica userId, usar el primer usuario disponible o crear uno de prueba
      if (!targetUserId) {
        const users = await this.loyaltyService.getAllUsers();
        if (users.length > 0) {
          targetUserId = users[0].id;
        } else {
          const testUser = await this.loyaltyService.createTestUser();
          targetUserId = testUser.id;
        }
      }

      console.log(`🚀 Setting up complete test for user ${targetUserId}`);

      // Crear programa de loyalty
      const program = await this.loyaltyService.getProgram(targetUserId);

      // Crear transacciones de prueba
      const transactions: any[] = [];
      
      // Simular compras
      transactions.push(await this.loyaltyService.processOrderPoints(targetUserId, 1001, 100.00));
      transactions.push(await this.loyaltyService.processOrderPoints(targetUserId, 1002, 75.50));
      
      // Dar bonos
      transactions.push(await this.loyaltyService.giveReviewBonus(targetUserId, 1));
      transactions.push(await this.loyaltyService.giveBirthdayBonus(targetUserId));
      
      // Obtener historial actualizado
      const history = await this.loyaltyService.getTransactionHistory(targetUserId, 10, 0);
      
      // Obtener programa actualizado
      const updatedProgram = await this.loyaltyService.getProgram(targetUserId);

      return {
        success: true,
        message: `Complete loyalty setup created for user ${targetUserId}`,
        data: {
          userId: targetUserId,
          program: updatedProgram,
          transactions: history,
          newTransactions: transactions.length
        }
      };

    } catch (error) {
      console.error('❌ Error in setup test:', error);
      return {
        success: false,
        message: 'Error setting up complete test',
        error: error.message
      };
    }
  }

  // Endpoint para crear datos de prueba (temporal para debugging - sin autenticación)
  @Public()
  @Post('test/create-data/:userId')
  async createTestData(@Param('userId') userId: number) {
    try {
      console.log(`Creating test data for user ${userId}`);
      
      // Crear programa si no existe
      const program = await this.loyaltyService.getProgram(userId);
      
      // Crear algunas transacciones de prueba
      await this.loyaltyService.processOrderPoints(userId, 1001, 100.00);
      await this.loyaltyService.giveReviewBonus(userId, 1);
      
      const transactions = await this.loyaltyService.getTransactionHistory(userId, 10, 0);
      
      return {
        success: true,
        message: `Test data created for user ${userId}`,
        data: {
          program,
          transactions
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error creating test data',
        error: error.message
      };
    }
  }

  @Get('program')
  async getProgram(@GetUser() user: RequestUser) {
    try {
      const program = await this.loyaltyService.getProgram(user.id);
      
      // Obtener estadísticas de transacciones
      const { transactions, total } = await this.loyaltyService.getTransactionHistory(user.id, 1000, 0);
      
      // Calcular puntos ganados y canjeados
      let totalPointsEarned = 0;
      let totalPointsRedeemed = 0;
      
      for (const transaction of transactions) {
        if (transaction.type === TransactionType.EARNED || transaction.type === TransactionType.BONUS) {
          totalPointsEarned += Math.abs(transaction.points);
        } else if (transaction.type === TransactionType.REDEEMED) {
          totalPointsRedeemed += Math.abs(transaction.points);
        }
      }
      
      // Transformar tier a objeto con nombre y multiplicador
      const tierRequirements = {
        bronze: { name: 'Bronze', multiplier: 1 },
        silver: { name: 'Silver', multiplier: 1.2 },
        gold: { name: 'Gold', multiplier: 1.5 },
        platinum: { name: 'Platinum', multiplier: 2 }
      };
      
      const tierInfo = tierRequirements[program.currentTier] || tierRequirements.bronze;
      
      // Transformar estructura para que coincida con lo que el frontend espera
      const transformedData = {
        id: program.id,
        currentPoints: program.availablePoints,
        totalPointsEarned,
        totalPointsRedeemed,
        currentTier: tierInfo,
        program: {
          pointsPerDollar: 1,
          reviewBonusPoints: 50,
          referralBonusPoints: 100,
          birthdayBonusPoints: 200
        },
        joinedAt: program.createdAt,
        lastActivityAt: program.lastActivityAt,
      };
      
      console.log(`✅ Loyalty program for user ${user.id}:`, transformedData);
      
      return {
        success: true,
        data: transformedData,
      };
    } catch (error) {
      console.error('❌ Error getting loyalty program:', error);
      return {
        success: false,
        message: 'Error al obtener programa de lealtad',
        error: error.message,
      };
    }
  }

  @Post('redeem')
  async redeemPoints(
    @GetUser() user: RequestUser,
    @Body() redeemData: RedeemPointsDto
  ) {
    try {
      const result = await this.loyaltyService.redeemPoints(
        user.id,
        redeemData.points,
        redeemData.description
      );

      return {
        success: result.success,
        data: {
          discount: result.discount,
          transaction: result.transaction,
        },
        message: `Has canjeado ${redeemData.points} puntos por $${result.discount} de descuento`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al canjear puntos',
      };
    }
  }

  @Get('transactions')
  async getTransactions(
    @GetUser() user: RequestUser,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    try {
      // Validar parámetros
      const validLimit = limit ? Math.max(1, Math.min(100, Number(limit))) : 50;
      const validOffset = offset ? Math.max(0, Number(offset)) : 0;

      console.log(`🔍 Getting transactions for user ${user.id}, limit: ${validLimit}, offset: ${validOffset}`);

      const result = await this.loyaltyService.getTransactionHistory(
        user.id,
        validLimit,
        validOffset
      );

      console.log(`✅ Found ${result.transactions.length} transactions for user ${user.id}`);

      // Transformar transacciones al formato esperado por el frontend
      const transformedTransactions = result.transactions.map(transaction => ({
        id: transaction.id,
        type: transaction.type.toUpperCase(),
        points: transaction.points,
        description: transaction.description || this.getTransactionDescription(transaction.type, transaction.reason),
        createdAt: transaction.createdAt
      }));

      return {
        success: true,
        data: {
          transactions: transformedTransactions,
          total: result.total
        },
      };
    } catch (error) {
      console.error('❌ Error in getTransactions:', error);
      
      return {
        success: false,
        message: 'Error al obtener historial de transacciones',
        error: error.message,
      };
    }
  }

  private getTransactionDescription(type: string, reason: string): string {
    const descriptions = {
      'earned|purchase': 'Puntos ganados por compra',
      'earned|review_bonus': 'Puntos ganados por reseña',
      'earned|referral_bonus': 'Puntos ganados por referido',
      'earned|birthday_bonus': 'Bonus de cumpleaños',
      'earned|signup_bonus': 'Puntos de bienvenida',
      'earned|tier_upgrade_bonus': 'Bonus por upgrade de nivel',
      'redeemed|redemption': 'Puntos canjeados',
      'expired|expiration': 'Puntos expirados',
      'bonus|birthday_bonus': 'Bonus de cumpleaños',
      'bonus|review_bonus': 'Puntos por reseña'
    };

    const key = `${type}|${reason}`;
    return descriptions[key] || `${type}: ${reason}`;
  }

  @Get('leaderboard')
  async getLeaderboard(@Query('limit') limit?: number) {
    try {
      const leaderboard = await this.loyaltyService.getLeaderboard(limit || 10);
      return {
        success: true,
        data: leaderboard,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al obtener ranking de lealtad',
        error: error.message,
      };
    }
  }

  @Post('review-bonus/:productId')
  async giveReviewBonus(
    @GetUser() user: RequestUser,
    @Param('productId', ParseIntPipe) productId: number
  ) {
    try {
      const transaction = await this.loyaltyService.giveReviewBonus(
        user.id,
        productId
      );

      return {
        success: true,
        data: transaction,
        message: 'Has ganado puntos por escribir una reseña',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al otorgar puntos por reseña',
      };
    }
  }

  @Post('birthday-bonus')
  async giveBirthdayBonus(@GetUser() user: RequestUser) {
    try {
      const transaction = await this.loyaltyService.giveBirthdayBonus(user.id);

      return {
        success: true,
        data: transaction,
        message: '¡Feliz cumpleaños! Has recibido puntos especiales',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al otorgar bonus de cumpleaños',
      };
    }
  }

  @Post('referral-bonus/:referredUserId')
  async giveReferralBonus(
    @GetUser() user: RequestUser,
    @Param('referredUserId', ParseIntPipe) referredUserId: number
  ) {
    try {
      const transaction = await this.loyaltyService.giveReferralBonus(
        user.id,
        referredUserId
      );

      return {
        success: true,
        data: transaction,
        message: 'Has ganado puntos por referir a un amigo',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Error al otorgar bonus de referencia',
      };
    }
  }
}
