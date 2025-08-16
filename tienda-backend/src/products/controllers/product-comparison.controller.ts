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
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { 
  ProductComparisonService, 
  CreateComparisonDto, 
  UpdateComparisonDto 
} from '../services/product-comparison.service';

@Controller('product-comparison')
@UseGuards(JwtAuthGuard)
export class ProductComparisonController {
  constructor(private readonly comparisonService: ProductComparisonService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComparison(@Request() req, @Body() createComparisonDto: CreateComparisonDto) {
    return await this.comparisonService.createComparison(req.user.id, createComparisonDto);
  }

  @Get()
  async getUserComparisons(@Request() req) {
    return await this.comparisonService.getUserComparisons(req.user.id);
  }

  @Get('stats')
  async getComparisonStats(@Request() req) {
    return await this.comparisonService.getComparisonStats(req.user.id);
  }

  @Get('quick')
  async getQuickComparison(@Query('productIds') productIds: string) {
    const ids = productIds.split(',').map(id => parseInt(id, 10));
    return await this.comparisonService.getQuickComparison(ids);
  }

  @Get(':id')
  async getComparison(
    @Request() req,
    @Param('id', ParseIntPipe) comparisonId: number
  ) {
    return await this.comparisonService.getComparison(req.user.id, comparisonId);
  }

  @Get(':id/with-products')
  async getComparisonWithProducts(
    @Request() req,
    @Param('id', ParseIntPipe) comparisonId: number
  ) {
    return await this.comparisonService.getComparisonWithProducts(req.user.id, comparisonId);
  }

  @Put(':id')
  async updateComparison(
    @Request() req,
    @Param('id', ParseIntPipe) comparisonId: number,
    @Body() updateComparisonDto: UpdateComparisonDto
  ) {
    return await this.comparisonService.updateComparison(req.user.id, comparisonId, updateComparisonDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteComparison(
    @Request() req,
    @Param('id', ParseIntPipe) comparisonId: number
  ) {
    await this.comparisonService.deleteComparison(req.user.id, comparisonId);
  }

  @Post(':id/products/:productId')
  @HttpCode(HttpStatus.OK)
  async addProductToComparison(
    @Request() req,
    @Param('id', ParseIntPipe) comparisonId: number,
    @Param('productId', ParseIntPipe) productId: number
  ) {
    return await this.comparisonService.addProductToComparison(req.user.id, comparisonId, productId);
  }

  @Delete(':id/products/:productId')
  @HttpCode(HttpStatus.OK)
  async removeProductFromComparison(
    @Request() req,
    @Param('id', ParseIntPipe) comparisonId: number,
    @Param('productId', ParseIntPipe) productId: number
  ) {
    return await this.comparisonService.removeProductFromComparison(req.user.id, comparisonId, productId);
  }

  @Delete('clear-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async clearAllComparisons(@Request() req) {
    await this.comparisonService.clearAllComparisons(req.user.id);
  }
}
