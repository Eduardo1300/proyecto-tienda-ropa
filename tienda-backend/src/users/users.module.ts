import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersAddressController } from './controllers/users-address.controller';
import { User } from './entities/user.entity';
import { UserAddress } from './entities/user-address.entity';
import { UserPreferences } from './entities/user-preferences.entity';
import { Order } from '../ordenes/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CartItem } from '../carrito/entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAddress, UserPreferences, Order, Product, CartItem])],
  controllers: [UsersController, UsersAddressController],
  providers: [UsersService],
  exports: [UsersService], // Exportamos para que AuthService lo pueda usar
})
export class UsersModule {}
