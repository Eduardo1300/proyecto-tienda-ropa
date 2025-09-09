import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyProgram } from './entities/loyalty-program.entity';
import { LoyaltyTransaction } from './entities/loyalty-transaction.entity';
import { User } from '../users/entities/user.entity';
import { LoyaltyService } from './services/loyalty.service';
import { LoyaltyController } from './controllers/loyalty.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LoyaltyProgram, LoyaltyTransaction, User])],
  controllers: [LoyaltyController],
  providers: [LoyaltyService],
  exports: [LoyaltyService],
})
export class LoyaltyModule {}
