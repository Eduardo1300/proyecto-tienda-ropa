import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { InventoryService } from '../services/inventory.service';
import { MovementType, MovementReason } from '../entities/stock-movement.entity';
import { AlertStatus } from '../entities/inventory-alert.entity';
import { UpdateStockDto } from '../dto/update-stock.dto';

export class ReserveStockDto {
  productId: number;
  quantity: number;
}

export class AcknowledgeAlertDto {
  notes?: string;
}

export class ResolveAlertDto {
  notes?: string;
}

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // 📦 Stock Management
  @Post('stock/update')
  @Roles('admin', 'manager')
  async updateStock(@Body() updateStockDto: UpdateStockDto, @Request() req) {
    return this.inventoryService.updateStock(
      updateStockDto.productId,
      updateStockDto.quantity,
      updateStockDto.type,
      updateStockDto.reason,
      req.user,
      {
        unitCost: updateStockDto.unitCost,
        batch: updateStockDto.batch,
        expirationDate: updateStockDto.expirationDate,
        location: updateStockDto.location,
        notes: updateStockDto.notes,
        referenceNumber: updateStockDto.referenceNumber,
      },
    );
  }

  @Post('stock/reserve')
  @Roles('admin', 'manager', 'user')
  async reserveStock(@Body() reserveStockDto: ReserveStockDto) {
    return this.inventoryService.reserveStock(
      reserveStockDto.productId,
      reserveStockDto.quantity,
    );
  }

  @Post('stock/release')
  @Roles('admin', 'manager', 'user')
  async releaseStock(@Body() reserveStockDto: ReserveStockDto) {
    return this.inventoryService.releaseReservedStock(
      reserveStockDto.productId,
      reserveStockDto.quantity,
    );
  }

  // 📊 Inventory Reports
  @Get('reports/low-stock')
  @Roles('admin', 'manager')
  async getLowStockProducts() {
    return this.inventoryService.getLowStockProducts();
  }

  @Get('reports/expiring')
  @Roles('admin', 'manager')
  async getExpiringProducts(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days) : 30;
    return this.inventoryService.getExpiringProducts(daysNumber);
  }

  @Get('reports/expired')
  @Roles('admin', 'manager')
  async getExpiredProducts() {
    return this.inventoryService.getExpiredProducts();
  }

  @Get('reports/value')
  @Roles('admin', 'manager')
  async getInventoryValue() {
    return this.inventoryService.getInventoryValue();
  }

  @Get('movements')
  @Roles('admin', 'manager')
  async getStockMovements(
    @Query('productId') productId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: MovementType,
  ) {
    return this.inventoryService.getStockMovements(
      productId ? parseInt(productId) : undefined,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      type,
    );
  }

  // ⚠️ Alert Management
  @Get('alerts')
  @Roles('admin', 'manager')
  async getActiveAlerts() {
    return this.inventoryService.getActiveAlerts();
  }

  @Put('alerts/:id/acknowledge')
  @Roles('admin', 'manager')
  async acknowledgeAlert(
    @Param('id', ParseIntPipe) id: number,
    @Body() acknowledgeDto: AcknowledgeAlertDto,
    @Request() req,
  ) {
    return this.inventoryService.acknowledgeAlert(id, req.user, acknowledgeDto.notes);
  }

  @Put('alerts/:id/resolve')
  @Roles('admin', 'manager')
  async resolveAlert(
    @Param('id', ParseIntPipe) id: number,
    @Body() resolveDto: ResolveAlertDto,
    @Request() req,
  ) {
    return this.inventoryService.resolveAlert(id, req.user, resolveDto.notes);
  }

  // 🔄 Manual Tasks
  @Post('alerts/check')
  @Roles('admin')
  async checkInventoryAlerts() {
    await this.inventoryService.checkInventoryAlerts();
    return { message: 'Inventory alerts check completed' };
  }

  @Post('restock/process')
  @Roles('admin')
  async processAutoRestock() {
    await this.inventoryService.processAutoRestock();
    return { message: 'Auto-restock process completed' };
  }
}
