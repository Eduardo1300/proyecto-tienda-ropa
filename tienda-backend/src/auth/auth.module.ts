import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    UsersModule,
    LoyaltyModule,
    AnalyticsModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret_jwt',
      signOptions: { expiresIn: '24h' }, // Extender a 24 horas para evitar expiración rápida
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
