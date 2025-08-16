import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Order } from '../ordenes/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CartItem } from '../carrito/entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, Product, CartItem])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exportamos para que AuthService lo pueda usar
})
export class UsersModule {}
