import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(@InjectRepository(Coupon) private repo: Repository<Coupon>) {}

  async create(data: Partial<Coupon>): Promise<Coupon> {
    const exists = await this.repo.findOne({ where: { code: data.code } });
    if (exists) throw new BadRequestException('Coupon code already exists');
    return this.repo.save(this.repo.create(data));
  }

  async validate(code: string): Promise<Coupon> {
    const coupon = await this.repo.findOne({ where: { code } });
    if (!coupon || !coupon.active) throw new NotFoundException('Invalid coupon');
    if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) throw new BadRequestException('Coupon expired');
    if (coupon.maxRedemptions > 0 && coupon.redemptions >= coupon.maxRedemptions)
      throw new BadRequestException('Coupon max redemptions reached');
    return coupon;
  }

  applyDiscount(total: number, coupon: Coupon): number {
    if (coupon.type === 'percent') {
      const value = Math.max(0, Math.min(100, Number(coupon.value)));
      return Number((total * (1 - value / 100)).toFixed(2));
    }
    // fixed
    return Math.max(0, Number((total - Number(coupon.value)).toFixed(2)));
  }

  async redeem(code: string): Promise<void> {
    const coupon = await this.validate(code);
    coupon.redemptions += 1;
    await this.repo.save(coupon);
  }
}