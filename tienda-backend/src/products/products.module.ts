import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductReview } from './entities/product-review.entity';
import { Wishlist } from './entities/wishlist.entity';
import { ProductComparison } from './entities/product-comparison.entity';
import { RecentlyViewed } from './entities/recently-viewed.entity';

// Services
import { ProductsService } from './products.service';
import { WishlistService } from './services/wishlist.service';
import { ProductComparisonService } from './services/product-comparison.service';
import { RecentlyViewedService } from './services/recently-viewed.service';
import { ProductReviewService } from './services/product-review.service';

// Controllers
import { ProductsController } from './products.controller';
import { WishlistController } from './controllers/wishlist.controller';
import { ProductComparisonController } from './controllers/product-comparison.controller';
import { RecentlyViewedController } from './controllers/recently-viewed.controller';
import { ProductReviewController, ReviewController } from './controllers/product-review.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductVariant,
      ProductImage,
      ProductReview,
      Wishlist,
      ProductComparison,
      RecentlyViewed,
    ])
  ],
  controllers: [
    ProductsController,
    WishlistController,
    ProductComparisonController,
    RecentlyViewedController,
    ProductReviewController,
    ReviewController,
  ],
  providers: [
    ProductsService,
    WishlistService,
    ProductComparisonService,
    RecentlyViewedService,
    ProductReviewService,
  ],
  exports: [
    ProductsService,
    WishlistService,
    ProductComparisonService,
    RecentlyViewedService,
    ProductReviewService,
  ],
})
export class ProductsModule {}
