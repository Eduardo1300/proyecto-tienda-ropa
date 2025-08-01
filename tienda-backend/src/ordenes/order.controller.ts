import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('ordenes')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async crearOrden(@Body() dto: CreateOrderDto) {
    return this.orderService.crearOrden(dto);
  }
}
