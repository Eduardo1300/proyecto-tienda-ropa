import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CouponService } from '../services/coupon.service';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from '../dto/coupon.dto';

@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findAll() {
    return this.couponService.findAll();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  findActive() {
    return this.couponService.findActive();
  }

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validateCoupon(@Body() validateDto: ValidateCouponDto, @Request() req) {
    validateDto.userId = req.user.id;
    return this.couponService.validateCoupon(validateDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(+id);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getStats(@Param('id') id: string) {
    return this.couponService.getUsageStats(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateCouponDto: UpdateCouponDto) {
    return this.couponService.update(+id, updateCouponDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.couponService.remove(+id);
  }

  @Post('generate/welcome')
  @UseGuards(JwtAuthGuard)
  generateWelcomeCoupon(@Request() req) {
    return this.couponService.generateWelcomeCoupon(req.user.id);
  }

  @Post('generate/birthday')
  @UseGuards(JwtAuthGuard)
  generateBirthdayCoupon(@Request() req) {
    return this.couponService.generateBirthdayCoupon(req.user.id);
  }
}
