import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ReturnService } from './return.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('returns')
@UseGuards(JwtAuthGuard)
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  @Get()
  async findUserReturns(@Request() req) {
    return this.returnService.findReturnsByUser(req.user.id);
  }

  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAllReturns() {
    return this.returnService.findAllReturns();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const returnEntity = await this.returnService.findReturnById(id);
    
    // Users can only see their own returns, admins can see all
    if (returnEntity.user.id !== req.user.id && req.user.role !== 'admin') {
      throw new BadRequestException('You can only view your own returns');
    }
    
    return returnEntity;
  }

  @Put(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async approveReturn(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.returnService.approveReturn(id, req.user);
  }

  @Put(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async rejectReturn(
    @Param('id', ParseIntPipe) id: number,
    @Body('reason') reason: string,
    @Request() req,
  ) {
    return this.returnService.rejectReturn(id, reason, req.user);
  }

  @Put(':id/received')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async markReceived(
    @Param('id', ParseIntPipe) id: number,
    @Body('adminNotes') adminNotes: string,
    @Request() req,
  ) {
    return this.returnService.markReturnReceived(id, req.user, adminNotes);
  }

  @Put(':id/process')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async processReturn(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.returnService.processReturn(id, req.user);
  }

  @Put(':id/refund')
  @UseGuards(RolesGuard)
  @Roles('admin')
  async refundReturn(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.returnService.refundReturn(id, req.user);
  }
}
