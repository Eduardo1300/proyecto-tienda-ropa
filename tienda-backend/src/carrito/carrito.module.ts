import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './carrito.controller';
import { CartService } from './carrito.service';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { User } from '../users/entities/user.entity';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem, Product, ProductVariant, User]),
    AnalyticsModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
