import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminGuard } from './guards/admin.guard';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../ordenes/entities/order.entity';
import { OrderItem } from '../ordenes/entities/order-item.entity';
import { Review } from '../reviews/entities/review.entity';
import { StockMovement } from '../inventory/entities/stock-movement.entity';
import { InventoryAlert } from '../inventory/entities/inventory-alert.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Product,
      Order,
      OrderItem,
      Review,
      StockMovement,
      InventoryAlert,
    ]),
  ],
  controllers: [AdminController, AdminDashboardController],
  providers: [AdminDashboardService, AdminGuard],
  exports: [AdminDashboardService, AdminGuard],
})
export class AdminModule {}
