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
import { PurchaseOrderService, CreatePurchaseOrderDto, ReceivePurchaseOrderDto } from '../services/purchase-order.service';
import { PurchaseOrderStatus } from '../entities/purchase-order.entity';

export class ApprovePurchaseOrderDto {
  notes?: string;
}

export class CancelPurchaseOrderDto {
  reason: string;
}

@Controller('purchase-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Post()
  @Roles('admin', 'manager')
  async createPurchaseOrder(
    @Body() createDto: CreatePurchaseOrderDto,
    @Request() req,
  ) {
    return this.purchaseOrderService.createPurchaseOrder(createDto, req.user);
  }

  @Get()
  @Roles('admin', 'manager')
  async getPurchaseOrders(
    @Query('status') status?: PurchaseOrderStatus,
    @Query('supplierId') supplierId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.purchaseOrderService.getPurchaseOrders(
      status,
      supplierId ? parseInt(supplierId) : undefined,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  @Roles('admin', 'manager')
  async getPurchaseOrder(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseOrderService.getPurchaseOrder(id);
  }

  @Put(':id/approve')
  @Roles('admin')
  async approvePurchaseOrder(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.purchaseOrderService.approvePurchaseOrder(id, req.user);
  }

  @Put(':id/send')
  @Roles('admin', 'manager')
  async sendPurchaseOrder(@Param('id', ParseIntPipe) id: number) {
    return this.purchaseOrderService.sendPurchaseOrder(id);
  }

  @Put(':id/receive')
  @Roles('admin', 'manager')
  async receivePurchaseOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() receiveDto: ReceivePurchaseOrderDto,
    @Request() req,
  ) {
    return this.purchaseOrderService.receivePurchaseOrder(id, receiveDto, req.user);
  }

  @Put(':id/cancel')
  @Roles('admin')
  async cancelPurchaseOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelDto: CancelPurchaseOrderDto,
  ) {
    return this.purchaseOrderService.cancelPurchaseOrder(id, cancelDto.reason);
  }

  @Post('auto-restock')
  @Roles('admin')
  async createAutoRestockOrders() {
    return this.purchaseOrderService.createAutoRestockOrders();
  }
}
