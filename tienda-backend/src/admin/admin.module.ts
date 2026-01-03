import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminGuard } from './guards/admin.guard';
import { OrderModule } from '../ordenes/order.module';
import { EmailService } from '../common/email.service';
import { PdfService } from '../common/pdf.service';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../ordenes/entities/order.entity';
import { OrderItem } from '../ordenes/entities/order-item.entity';
import { OrderStatusHistory } from '../ordenes/entities/order-status-history.entity';
import { Return } from '../ordenes/entities/return.entity';
import { ReturnItem } from '../ordenes/entities/return-item.entity';
import { CartItem } from '../carrito/entities/cart-item.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { Review } from '../reviews/entities/review.entity';
import { StockMovement } from '../inventory/entities/stock-movement.entity';
import { InventoryAlert } from '../inventory/entities/inventory-alert.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Product,
      ProductVariant,
      Order,
      OrderItem,
      OrderStatusHistory,
      Return,
      ReturnItem,
      CartItem,
      Review,
      StockMovement,
      InventoryAlert,
    ]),
    OrderModule,
  ],
  controllers: [AdminController, AdminDashboardController],
  providers: [AdminDashboardService, AdminGuard, EmailService, PdfService],
  exports: [AdminDashboardService, AdminGuard],
})
export class AdminModule {}
