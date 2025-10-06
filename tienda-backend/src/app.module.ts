import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './carrito/carrito.module';
import { OrderModule } from './ordenes/order.module';
import { InventoryModule } from './inventory/inventory.module';
import { CouponModule } from './coupons/coupon.module';
import { LoyaltyModule } from './loyalty/loyalty.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ReviewsModule } from './reviews/reviews.module';

// Entities
import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { ProductVariant } from './products/entities/product-variant.entity';
import { ProductImage } from './products/entities/product-image.entity';
import { ProductReview } from './products/entities/product-review.entity';
import { Wishlist } from './products/entities/wishlist.entity';
import { ProductComparison } from './products/entities/product-comparison.entity';
import { RecentlyViewed } from './products/entities/recently-viewed.entity';
import { CartItem } from './carrito/entities/cart-item.entity';
import { Order } from './ordenes/entities/order.entity';
import { OrderItem } from './ordenes/entities/order-item.entity';
import { OrderStatusHistory } from './ordenes/entities/order-status-history.entity';
import { Return } from './ordenes/entities/return.entity';
import { ReturnItem } from './ordenes/entities/return-item.entity';
import { Review } from './reviews/entities/review.entity';
import { StockMovement } from './inventory/entities/stock-movement.entity';
import { InventoryAlert } from './inventory/entities/inventory-alert.entity';
import { Supplier } from './inventory/entities/supplier.entity';
import { SupplierProduct } from './inventory/entities/supplier-product.entity';
import { PurchaseOrder } from './inventory/entities/purchase-order.entity';
import { PurchaseOrderItem } from './inventory/entities/purchase-order-item.entity';
import { Coupon } from './coupons/entities/coupon.entity';
import { LoyaltyProgram } from './loyalty/entities/loyalty-program.entity';
import { LoyaltyTransaction } from './loyalty/entities/loyalty-transaction.entity';
import { AnalyticsEvent } from './analytics/entities/analytics-event.entity';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Smart database configuration: works locally and on Render
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const databaseUrl = config.get<string>('DATABASE_URL');

        if (databaseUrl) {
          console.log('✅ Using DATABASE_URL from environment (Render or hosted DB)');
          return {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: true,
            ssl: {
              rejectUnauthorized: false, // Required for Render connections
            },
          };
        }

        console.log('💻 Using local database configuration');
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          entities: [
            User,
            Product,
            ProductVariant,
            ProductImage,
            ProductReview,
            Wishlist,
            ProductComparison,
            RecentlyViewed,
            CartItem,
            Order,
            OrderItem,
            OrderStatusHistory,
            Return,
            ReturnItem,
            Review,
            StockMovement,
            InventoryAlert,
            Supplier,
            SupplierProduct,
            PurchaseOrder,
            PurchaseOrderItem,
            Coupon,
            LoyaltyProgram,
            LoyaltyTransaction,
            AnalyticsEvent,
          ],
          synchronize: true,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),

    // App modules
    AuthModule,
    UsersModule,
    AdminModule,
    ProductsModule,
    CartModule,
    OrderModule,
    InventoryModule,
    CouponModule,
    LoyaltyModule,
    AnalyticsModule,
    ReviewsModule,
  ],
})
export class AppModule {}
