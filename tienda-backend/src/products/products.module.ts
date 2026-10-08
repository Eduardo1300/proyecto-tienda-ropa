import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductReview } from './entities/product-review.entity';
import { ProductComparison } from './entities/product-comparison.entity';
import { RecentlyViewed } from './entities/recently-viewed.entity';

// Services
import { ProductsService } from './products.service';
import { ProductComparisonService } from './services/product-comparison.service';
import { RecentlyViewedService } from './services/recently-viewed.service';
import { ProductReviewService } from './services/product-review.service';

// Controllers
import { ProductsController } from './products.controller';
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
      ProductComparison,
      RecentlyViewed,
    ])
  ],
  controllers: [
    ProductsController,
    ProductComparisonController,
    RecentlyViewedController,
    ProductReviewController,
    ReviewController,
  ],
  providers: [
    ProductsService,
    ProductComparisonService,
    RecentlyViewedService,
    ProductReviewService,
  ],
  exports: [
    ProductsService,
    ProductComparisonService,
    RecentlyViewedService,
    ProductReviewService,
  ],
})
export class ProductsModule {}
