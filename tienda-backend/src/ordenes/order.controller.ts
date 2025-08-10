import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { RequestUser } from '../common/types/user.types';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // Crea una orden para el usuario autenticado.
  // Si el DTO incluye items, se usa esa lista; de lo contrario, se toma del carrito.
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@GetUser() user: RequestUser, @Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(user.id, dto);
  }

  // Lista el historial de órdenes del usuario autenticado
  @UseGuards(JwtAuthGuard)
  @Get()
  async getMyOrders(@GetUser() user: RequestUser) {
    return this.orderService.getOrdersForUser(user.id);
  }
}
