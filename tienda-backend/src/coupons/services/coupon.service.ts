import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon, CouponType, CouponStatus } from '../entities/coupon.entity';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from '../dto/coupon.dto';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private couponRepository: Repository<Coupon>,
  ) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    // Verificar que el código no exista
    const existingCoupon = await this.couponRepository.findOne({
      where: { code: createCouponDto.code }
    });

    if (existingCoupon) {
      throw new BadRequestException('El código de cupón ya existe');
    }

    const coupon = this.couponRepository.create(createCouponDto);
    return await this.couponRepository.save(coupon);
  }

  async findAll(): Promise<Coupon[]> {
    return await this.couponRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findActive(): Promise<Coupon[]> {
    const now = new Date();
    return await this.couponRepository
      .createQueryBuilder('coupon')
      .where('coupon.status = :status', { status: CouponStatus.ACTIVE })
      .andWhere('(coupon.validFrom IS NULL OR coupon.validFrom <= :now)', { now })
      .andWhere('(coupon.validUntil IS NULL OR coupon.validUntil >= :now)', { now })
      .andWhere('(coupon.usageLimit = 0 OR coupon.usageCount < coupon.usageLimit)')
      .getMany();
  }

  async findOne(id: number): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { id }
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    return coupon;
  }

  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    return coupon;
  }

  async validateCoupon(validateDto: ValidateCouponDto): Promise<{
    valid: boolean;
    coupon?: Coupon;
    discount: number;
    message: string;
  }> {
    try {
      const coupon = await this.findByCode(validateDto.code);
      
      if (!coupon.isValid()) {
        return {
          valid: false,
          discount: 0,
          message: 'El cupón no es válido o ha expirado'
        };
      }

      // Verificar si puede ser usado por el usuario
      if (!coupon.canBeUsedBy(validateDto.userId, validateDto.userOrderCount || 0)) {
        return {
          valid: false,
          discount: 0,
          message: 'Este cupón no puede ser usado por tu cuenta'
        };
      }

      // Calcular descuento
      const discount = coupon.calculateDiscount(validateDto.subtotal);

      if (discount === 0 && coupon.type !== CouponType.FREE_SHIPPING) {
        return {
          valid: false,
          discount: 0,
          message: `Monto mínimo requerido: $${coupon.minimumAmount}`
        };
      }

      return {
        valid: true,
        coupon,
        discount,
        message: `Cupón aplicado: ${coupon.type === CouponType.PERCENTAGE ? 
          `${coupon.value}% de descuento` : 
          coupon.type === CouponType.FIXED_AMOUNT ? 
          `$${coupon.value} de descuento` : 
          'Envío gratis'}`
      };

    } catch (error) {
      return {
        valid: false,
        discount: 0,
        message: 'Cupón no válido'
      };
    }
  }

  async applyCoupon(couponId: number): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { id: couponId }
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    coupon.usageCount += 1;
    return await this.couponRepository.save(coupon);
  }

  async update(id: number, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.couponRepository.findOne({
      where: { id }
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    // Si se cambia el código, verificar que no exista
    if (updateCouponDto.code && updateCouponDto.code !== coupon.code) {
      const existingCoupon = await this.couponRepository.findOne({
        where: { code: updateCouponDto.code }
      });

      if (existingCoupon) {
        throw new BadRequestException('El código de cupón ya existe');
      }
    }

    Object.assign(coupon, updateCouponDto);
    return await this.couponRepository.save(coupon);
  }

  async remove(id: number): Promise<void> {
    const coupon = await this.couponRepository.findOne({
      where: { id }
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    await this.couponRepository.remove(coupon);
  }

  async getUsageStats(id: number): Promise<{
    coupon: Coupon;
    totalUsage: number;
    remainingUses: number;
    conversionRate: number;
  }> {
    const coupon = await this.couponRepository.findOne({
      where: { id },
      relations: ['orders']
    });

    if (!coupon) {
      throw new NotFoundException('Cupón no encontrado');
    }

    const totalUsage = coupon.usageCount;
    const remainingUses = coupon.usageLimit > 0 ? 
      Math.max(0, coupon.usageLimit - totalUsage) : -1;
    
    // Calcular tasa de conversión (simplificado)
    const conversionRate = totalUsage > 0 ? (coupon.orders.length / totalUsage) * 100 : 0;

    return {
      coupon,
      totalUsage,
      remainingUses,
      conversionRate
    };
  }

  // Métodos para generar cupones automáticos
  async generateWelcomeCoupon(userId: number): Promise<Coupon> {
    const code = `WELCOME${userId}${Date.now()}`.slice(0, 20);
    
    const coupon = this.couponRepository.create({
      code,
      name: 'Cupón de Bienvenida',
      description: 'Descuento especial para nuevos usuarios',
      type: CouponType.PERCENTAGE,
      value: 10,
      minimumAmount: 50,
      usageLimit: 1,
      usagePerUser: 1,
      isFirstTimeUser: true,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
      status: CouponStatus.ACTIVE
    });

    return await this.couponRepository.save(coupon);
  }

  async generateBirthdayCoupon(userId: number): Promise<Coupon> {
    const code = `BIRTHDAY${userId}${Date.now()}`.slice(0, 20);
    
    const coupon = this.couponRepository.create({
      code,
      name: 'Cupón de Cumpleaños',
      description: '¡Feliz cumpleaños! Disfruta tu descuento especial',
      type: CouponType.PERCENTAGE,
      value: 15,
      minimumAmount: 30,
      usageLimit: 1,
      usagePerUser: 1,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      status: CouponStatus.ACTIVE
    });

    return await this.couponRepository.save(coupon);
  }
}
