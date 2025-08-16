import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from '../entities/wishlist.entity';
import { Product } from '../entities/product.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { User } from '../../users/entities/user.entity';

export interface CreateWishlistItemDto {
  productId: number;
  variantId?: number;
}

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private variantRepository: Repository<ProductVariant>,
  ) {}

  async addToWishlist(userId: number, createWishlistItemDto: CreateWishlistItemDto): Promise<Wishlist> {
    const { productId, variantId } = createWishlistItemDto;

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Check if variant exists (if provided)
    let variant: any = null;
    if (variantId) {
      variant = await this.variantRepository.findOne({
        where: { id: variantId }
      }) || null;

      if (!variant) {
        throw new NotFoundException('Variante de producto no encontrada');
      }
    }

    // Check if item already exists in wishlist
    const whereCondition: any = {
      user: { id: userId },
      product: { id: productId },
      isActive: true
    };
    
    if (variant) {
      whereCondition.variant = { id: (variant as any).id };
    }
    
    const existingItem = await this.wishlistRepository.findOne({
      where: whereCondition
    });

    if (existingItem) {
      throw new ConflictException('El producto ya está en tu lista de deseos');
    }

    // Create wishlist item
    const wishlistData: any = {
      user: { id: userId },
      product: { id: productId },
      isActive: true
    };
    
    if (variant) {
      wishlistData.variant = { id: (variant as any).id };
    }
    
    const wishlistItem = this.wishlistRepository.create(wishlistData);
    const savedItem = await this.wishlistRepository.save(wishlistItem);
    return Array.isArray(savedItem) ? savedItem[0] : savedItem;
  }

  async getUserWishlist(userId: number): Promise<Wishlist[]> {
    return await this.wishlistRepository.find({
      where: {
        user: { id: userId },
        isActive: true
      },
      relations: [
        'product',
        'product.images',
        'variant',
        'variant.images'
      ],
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async removeFromWishlist(userId: number, productId: number, variantId?: number): Promise<void> {
    const whereCondition: any = {
      user: { id: userId },
      product: { id: productId },
      isActive: true
    };

    if (variantId) {
      whereCondition.variant = { id: variantId };
    } else {
      whereCondition.variant = null;
    }

    const wishlistItem = await this.wishlistRepository.findOne({
      where: whereCondition
    });

    if (!wishlistItem) {
      throw new NotFoundException('Producto no encontrado en la lista de deseos');
    }

    // Soft delete by setting isActive to false
    wishlistItem.isActive = false;
    await this.wishlistRepository.save(wishlistItem);
  }

  async clearWishlist(userId: number): Promise<void> {
    await this.wishlistRepository.update(
      {
        user: { id: userId },
        isActive: true
      },
      {
        isActive: false
      }
    );
  }

  async getWishlistCount(userId: number): Promise<number> {
    return await this.wishlistRepository.count({
      where: {
        user: { id: userId },
        isActive: true
      }
    });
  }

  async isInWishlist(userId: number, productId: number, variantId?: number): Promise<boolean> {
    const whereCondition: any = {
      user: { id: userId },
      product: { id: productId },
      isActive: true
    };

    if (variantId) {
      whereCondition.variant = { id: variantId };
    } else {
      whereCondition.variant = null;
    }

    const count = await this.wishlistRepository.count({
      where: whereCondition
    });

    return count > 0;
  }

  async moveToCart(userId: number, productId: number, variantId?: number): Promise<void> {
    // This would integrate with the cart service
    // For now, we'll just remove from wishlist
    await this.removeFromWishlist(userId, productId, variantId);
  }

  async getWishlistStats(userId: number): Promise<{
    totalItems: number;
    totalValue: number;
    inStockItems: number;
    onSaleItems: number;
  }> {
    const wishlistItems = await this.wishlistRepository.find({
      where: {
        user: { id: userId },
        isActive: true
      },
      relations: ['product', 'variant']
    });

    const stats = {
      totalItems: wishlistItems.length,
      totalValue: 0,
      inStockItems: 0,
      onSaleItems: 0
    };

    wishlistItems.forEach(item => {
      const price = item.variant?.price || item.product.price;
      const stock = item.variant?.stock || item.product.stock;
      const compareAtPrice = (item.product as any).compareAtPrice || null;

      stats.totalValue += price;
      
      if (stock > 0) {
        stats.inStockItems++;
      }

      if (compareAtPrice && compareAtPrice > price) {
        stats.onSaleItems++;
      }
    });

    return stats;
  }
}
