import { Controller, Post, Body } from '@nestjs/common';
import { CouponsService } from './coupons.service';

@Controller('coupons')
export class CouponsController {
  constructor(private service: CouponsService) {}

  @Post()
  create(@Body() body: { code: string; type: 'percent' | 'fixed'; value: number; expiresAt?: string; maxRedemptions?: number }) {
    return this.service.create({
      code: body.code,
      type: body.type,
      value: body.value,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      maxRedemptions: body.maxRedemptions || 0,
      active: true,
    });
  }

  @Post('validate')
  validate(@Body() body: { code: string; total: number }) {
    return this.service.validate(body.code).then((coupon) => ({
      coupon,
      discountedTotal: this.service.applyDiscount(Number(body.total), coupon),
    }));
  }
}