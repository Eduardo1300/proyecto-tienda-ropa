import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyProgram } from './entities/loyalty-program.entity';
import { LoyaltyTransaction } from './entities/loyalty-transaction.entity';
import { LoyaltyService } from './services/loyalty.service';

@Module({
  imports: [TypeOrmModule.forFeature([LoyaltyProgram, LoyaltyTransaction])],
  providers: [LoyaltyService],
  exports: [LoyaltyService],
})
export class LoyaltyModule {}
