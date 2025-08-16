import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { WishlistService, CreateWishlistItemDto } from '../services/wishlist.service';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addToWishlist(@Request() req, @Body() createWishlistItemDto: CreateWishlistItemDto) {
    return await this.wishlistService.addToWishlist(req.user.id, createWishlistItemDto);
  }

  @Get()
  async getUserWishlist(@Request() req) {
    return await this.wishlistService.getUserWishlist(req.user.id);
  }

  @Get('count')
  async getWishlistCount(@Request() req) {
    const count = await this.wishlistService.getWishlistCount(req.user.id);
    return { count };
  }

  @Get('stats')
  async getWishlistStats(@Request() req) {
    return await this.wishlistService.getWishlistStats(req.user.id);
  }

  @Get('check/:productId')
  async checkIfInWishlist(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number
  ) {
    const isInWishlist = await this.wishlistService.isInWishlist(req.user.id, productId);
    return { isInWishlist };
  }

  @Delete('product/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromWishlist(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number
  ) {
    await this.wishlistService.removeFromWishlist(req.user.id, productId);
  }

  @Delete('clear')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearWishlist(@Request() req) {
    await this.wishlistService.clearWishlist(req.user.id);
  }

  @Post('move-to-cart/:productId')
  @HttpCode(HttpStatus.OK)
  async moveToCart(
    @Request() req,
    @Param('productId', ParseIntPipe) productId: number
  ) {
    await this.wishlistService.moveToCart(req.user.id, productId);
    return { message: 'Producto movido al carrito exitosamente' };
  }
}
