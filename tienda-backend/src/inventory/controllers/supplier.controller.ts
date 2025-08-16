import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { SupplierService } from '../services/supplier.service';
import type { CreateSupplierDto, UpdateSupplierDto, CreateSupplierProductDto } from '../services/supplier.service';

@Controller('suppliers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @Roles('admin', 'manager')
  async createSupplier(@Body() createDto: CreateSupplierDto) {
    return this.supplierService.createSupplier(createDto);
  }

  @Get()
  @Roles('admin', 'manager')
  async getSuppliers(@Query('active') active?: string) {
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    return this.supplierService.getSuppliers(isActive);
  }

  @Get(':id')
  @Roles('admin', 'manager')
  async getSupplier(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.getSupplier(id);
  }

  @Put(':id')
  @Roles('admin', 'manager')
  async updateSupplier(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSupplierDto,
  ) {
    return this.supplierService.updateSupplier(id, updateDto);
  }

  @Delete(':id')
  @Roles('admin')
  async deleteSupplier(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.deleteSupplier(id);
  }

  // Supplier Products Management
  @Post(':id/products')
  @Roles('admin', 'manager')
  async addSupplierProduct(
    @Param('id', ParseIntPipe) supplierId: number,
    @Body() createDto: CreateSupplierProductDto,
  ) {
    return this.supplierService.addSupplierProduct(supplierId, createDto);
  }

  @Get(':id/products')
  @Roles('admin', 'manager')
  async getSupplierProducts(@Param('id', ParseIntPipe) supplierId: number) {
    return this.supplierService.getSupplierProducts(supplierId);
  }

  @Put(':supplierId/products/:productId')
  @Roles('admin', 'manager')
  async updateSupplierProduct(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() updateDto: Partial<CreateSupplierProductDto>,
  ) {
    return this.supplierService.updateSupplierProduct(supplierId, productId, updateDto);
  }

  @Delete(':supplierId/products/:productId')
  @Roles('admin', 'manager')
  async removeSupplierProduct(
    @Param('supplierId', ParseIntPipe) supplierId: number,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return this.supplierService.removeSupplierProduct(supplierId, productId);
  }

  // Supplier Reports
  @Get(':id/performance')
  @Roles('admin', 'manager')
  async getSupplierPerformance(@Param('id', ParseIntPipe) id: number) {
    return this.supplierService.getSupplierPerformance(id);
  }
}
