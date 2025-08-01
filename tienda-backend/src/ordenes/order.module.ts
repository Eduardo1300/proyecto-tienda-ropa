// src/ordenes/order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CarritoItem } from 'src/carrito/entities/carrito-item.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, CarritoItem, User])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
