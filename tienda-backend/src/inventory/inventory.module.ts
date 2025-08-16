import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

// Entities
import { StockMovement } from './entities/stock-movement.entity';
import { InventoryAlert } from './entities/inventory-alert.entity';
import { Supplier } from './entities/supplier.entity';
import { SupplierProduct } from './entities/supplier-product.entity';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { PurchaseOrderItem } from './entities/purchase-order-item.entity';
import { Product } from '../products/entities/product.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { User } from '../users/entities/user.entity';

// Services
import { InventoryService } from './services/inventory.service';
import { PurchaseOrderService } from './services/purchase-order.service';
import { SupplierService } from './services/supplier.service';
import { EmailService } from '../common/email.service';

// Controllers
import { InventoryController } from './controllers/inventory.controller';
import { PurchaseOrderController } from './controllers/purchase-order.controller';
import { SupplierController } from './controllers/supplier.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Inventory entities
      StockMovement,
      InventoryAlert,
      Supplier,
      SupplierProduct,
      PurchaseOrder,
      PurchaseOrderItem,
      // Related entities
      Product,
      ProductVariant,
      User,
    ]),
    ScheduleModule.forRoot(), // For cron jobs
  ],
  controllers: [
    InventoryController,
    PurchaseOrderController,
    SupplierController,
  ],
  providers: [
    InventoryService,
    PurchaseOrderService,
    SupplierService,
    EmailService,
  ],
  exports: [
    InventoryService,
    PurchaseOrderService,
    SupplierService,
  ],
})
export class InventoryModule {}
