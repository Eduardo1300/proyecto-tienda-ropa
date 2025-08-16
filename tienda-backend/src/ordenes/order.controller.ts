import { 
  Controller, 
  Post, 
  Get, 
  Put, 
  Param, 
  Body, 
  UseGuards, 
  Request, 
  ParseIntPipe,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateReturnDto } from './dto/create-return.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    createOrderDto.userId = req.user.id;
    return this.orderService.createOrder(createOrderDto);
  }

  @Get()
  async findUserOrders(@Request() req) {
    return this.orderService.findOrdersByUser(req.user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const order = await this.orderService.findOrderById(id);
    
    // Users can only see their own orders, admins can see all
    if (order.user.id !== req.user.id && req.user.role !== 'admin') {
      throw new BadRequestException('You can only view your own orders');
    }
    
    return order;
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateOrderStatusDto,
    @Request() req,
  ) {
    return this.orderService.updateOrderStatus(id, updateStatusDto, req.user);
  }

  @Put(':id/cancel')
  async cancelOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() cancelOrderDto: CancelOrderDto,
    @Request() req,
  ) {
    const order = await this.orderService.findOrderById(id);
    
    // Users can only cancel their own orders
    if (order.user.id !== req.user.id) {
      throw new BadRequestException('You can only cancel your own orders');
    }
    
    return this.orderService.cancelOrder(id, cancelOrderDto, req.user);
  }

  @Post(':id/returns')
  async createReturn(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() createReturnDto: CreateReturnDto,
    @Request() req,
  ) {
    createReturnDto.orderId = orderId;
    return this.orderService.createReturn(createReturnDto, req.user.id);
  }

  @Get(':id/invoice')
  async generateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Res() res: Response,
  ) {
    const order = await this.orderService.findOrderById(id);
    
    // Users can only get invoices for their own orders
    if (order.user.id !== req.user.id && req.user.role !== 'admin') {
      throw new BadRequestException('You can only get invoices for your own orders');
    }
    
    try {
      const pdfBuffer = await this.orderService.generateInvoicePdf(id);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error generating PDF invoice',
        error: error.message,
      });
    }
  }

  @Get(':id/tracking')
  async getTrackingInfo(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const order = await this.orderService.findOrderById(id);
    
    // Users can only track their own orders
    if (order.user.id !== req.user.id && req.user.role !== 'admin') {
      throw new BadRequestException('You can only track your own orders');
    }
    
    return {
      orderNumber: order.orderNumber,
      status: order.status,
      trackingCode: order.trackingCode,
      shippingCarrier: order.shippingCarrier,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      actualDeliveryDate: order.actualDeliveryDate,
      statusHistory: order.statusHistory,
    };
  }
}
