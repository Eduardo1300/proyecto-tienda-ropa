import { Controller, Post, Body, Get, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CartService } from './carrito.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async add(@Body() dto: CreateCartItemDto) {
    return this.cartService.addToCart(dto);
  }

  @Get(':userId')
  async get(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.getCart(userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.cartService.removeFromCart(Number(id));
  }
}