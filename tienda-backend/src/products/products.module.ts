import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Review } from './entities/review.entity';
import { Wishlist } from './entities/wishlist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Review, Wishlist])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
