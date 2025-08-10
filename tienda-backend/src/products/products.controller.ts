import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { RequestUser } from '../common/types/user.types';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(
    @Query('q') q?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('size') size?: string,
    @Query('color') color?: string,
    @Query('brand') brand?: string,
    @Query('category') category?: string,
  ) {
    return this.productsService.findAll({ q, minPrice, maxPrice, size, color, brand, category });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Get(':id/related')
  related(@Param('id') id: string) {
    return this.productsService.related(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  // Wishlist
  @UseGuards(JwtAuthGuard)
  @Post(':id/wishlist')
  addToWishlist(@GetUser() user: RequestUser, @Param('id') id: string) {
    return this.productsService.addToWishlist(user.id, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/wishlist')
  removeFromWishlist(@GetUser() user: RequestUser, @Param('id') id: string) {
    return this.productsService.removeFromWishlist(user.id, +id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/wishlist')
  getWishlist(@GetUser() user: RequestUser) {
    return this.productsService.getWishlist(user.id);
  }

  // Reviews
  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews')
  addReview(
    @GetUser() user: RequestUser,
    @Param('id') id: string,
    @Body() body: { rating: number; comment?: string },
  ) {
    return this.productsService.addReview(user.id, +id, body.rating, body.comment);
  }

  @Get(':id/reviews')
  listReviews(@Param('id') id: string) {
    return this.productsService.listReviews(+id);
  }
}
