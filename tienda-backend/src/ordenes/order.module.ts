// src/ordenes/order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ReturnService } from './return.service';
import { ReturnController } from './return.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { Return } from './entities/return.entity';
import { ReturnItem } from './entities/return-item.entity';
import { User } from '../users/entities/user.entity';
import { CartItem } from '../carrito/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { EmailService } from '../common/email.service';
import { PdfService } from '../common/pdf.service';
import { AnalyticsModule } from '../analytics/analytics.module';
import { LoyaltyModule } from '../loyalty/loyalty.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order, 
      OrderItem, 
      OrderStatusHistory, 
      Return, 
      ReturnItem, 
      User, 
      CartItem, 
      Product,
      ProductVariant
    ]),
    AnalyticsModule,
    LoyaltyModule,
  ],
  controllers: [OrderController, ReturnController],
  providers: [OrderService, ReturnService, EmailService, PdfService],
  exports: [OrderService],
})
export class OrderModule {}
