import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { RecentlyViewed } from '../entities/recently-viewed.entity';
import { Product } from '../entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class RecentlyViewedService {
  constructor(
    @InjectRepository(RecentlyViewed)
    private recentlyViewedRepository: Repository<RecentlyViewed>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async trackView(userId: number, productId: number): Promise<void> {
    // Check if product exists and is active
    const product = await this.productRepository.findOne({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      return; // Silently fail if product doesn't exist
    }

    // Check if user has already viewed this product
    const existingView = await this.recentlyViewedRepository.findOne({
      where: {
        user: { id: userId },
        product: { id: productId }
      }
    });

    if (existingView) {
      // Update existing view
      existingView.viewCount += 1;
      existingView.lastViewedAt = new Date();
      await this.recentlyViewedRepository.save(existingView);
    } else {
      // Create new view record
      const newView = this.recentlyViewedRepository.create({
        user: { id: userId } as User,
        product,
        viewCount: 1,
        lastViewedAt: new Date()
      });

      await this.recentlyViewedRepository.save(newView);
    }

    // Clean up old views (keep only last 50 products per user)
    await this.cleanupOldViews(userId);
  }

  async getRecentlyViewed(userId: number, limit: number = 20): Promise<RecentlyViewed[]> {
    return await this.recentlyViewedRepository.find({
      where: {
        user: { id: userId }
      },
      relations: [
        'product',
        'product.images',
        'product.variants',
        'product.category'
      ],
      order: {
        lastViewedAt: 'DESC'
      },
      take: limit
    });
  }

  async getRecentlyViewedProducts(userId: number, limit: number = 20): Promise<Product[]> {
    const recentlyViewed = await this.getRecentlyViewed(userId, limit);
    return recentlyViewed.map(rv => rv.product);
  }

  async getMostViewedProducts(userId: number, limit: number = 10): Promise<RecentlyViewed[]> {
    return await this.recentlyViewedRepository.find({
      where: {
        user: { id: userId }
      },
      relations: [
        'product',
        'product.images',
        'product.variants',
        'product.category'
      ],
      order: {
        viewCount: 'DESC',
        lastViewedAt: 'DESC'
      },
      take: limit
    });
  }

  async getViewingStats(userId: number): Promise<{
    totalProductsViewed: number;
    totalViews: number;
    averageViewsPerProduct: number;
    mostViewedProduct: Product | null;
    viewsThisWeek: number;
    viewsThisMonth: number;
  }> {
    const allViews = await this.recentlyViewedRepository.find({
      where: {
        user: { id: userId }
      },
      relations: ['product']
    });

    const stats = {
      totalProductsViewed: allViews.length,
      totalViews: allViews.reduce((sum, view) => sum + view.viewCount, 0),
      averageViewsPerProduct: 0,
      mostViewedProduct: null as Product | null,
      viewsThisWeek: 0,
      viewsThisMonth: 0
    };

    if (allViews.length > 0) {
      stats.averageViewsPerProduct = Math.round((stats.totalViews / allViews.length) * 10) / 10;

      // Find most viewed product
      const mostViewed = allViews.reduce((max, current) => 
        current.viewCount > max.viewCount ? current : max
      );
      stats.mostViewedProduct = mostViewed.product;

      // Calculate views this week and month
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      stats.viewsThisWeek = allViews.filter(view => 
        view.lastViewedAt >= oneWeekAgo
      ).reduce((sum, view) => sum + view.viewCount, 0);

      stats.viewsThisMonth = allViews.filter(view => 
        view.lastViewedAt >= oneMonthAgo
      ).reduce((sum, view) => sum + view.viewCount, 0);
    }

    return stats;
  }

  async getRecentlyViewedByCategory(userId: number, categoryId: number, limit: number = 10): Promise<Product[]> {
    const recentlyViewed = await this.recentlyViewedRepository.find({
      where: {
        user: { id: userId }
      },
      relations: [
        'product',
        'product.images',
        'product.variants',
        'product.category'
      ],
      order: {
        lastViewedAt: 'DESC'
      },
      take: limit
    });

    return recentlyViewed.map(rv => rv.product);
  }

  async clearRecentlyViewed(userId: number): Promise<void> {
    await this.recentlyViewedRepository.delete({
      user: { id: userId }
    });
  }

  async removeFromRecentlyViewed(userId: number, productId: number): Promise<void> {
    await this.recentlyViewedRepository.delete({
      user: { id: userId },
      product: { id: productId }
    });
  }

  private async cleanupOldViews(userId: number): Promise<void> {
    const maxViews = 50;
    
    // Get all views for user, ordered by last viewed date
    const allViews = await this.recentlyViewedRepository.find({
      where: {
        user: { id: userId }
      },
      order: {
        lastViewedAt: 'DESC'
      }
    });

    // If we have more than maxViews, delete the oldest ones
    if (allViews.length > maxViews) {
      const viewsToDelete = allViews.slice(maxViews);
      const idsToDelete = viewsToDelete.map(view => view.id);
      
      await this.recentlyViewedRepository.delete(idsToDelete);
    }
  }

  async getRecommendationsBasedOnViews(userId: number, limit: number = 10): Promise<Product[]> {
    // Get user's recently viewed products
    const recentlyViewed = await this.getRecentlyViewed(userId, 20);
    
    if (recentlyViewed.length === 0) {
      return [];
    }

    // Extract categories and tags from viewed products
    const viewedCategories = [...new Set(recentlyViewed.map(rv => typeof rv.product.category === 'string' ? rv.product.category : null).filter(Boolean))];
    const viewedTags = [...new Set(recentlyViewed.flatMap(rv => rv.product.tags || []))];
    const viewedProductIds = recentlyViewed.map(rv => rv.product.id);

    // Find similar products based on categories and tags
    const queryBuilder = this.productRepository.createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.isActive = :isActive', { isActive: true })
      .andWhere('product.id NOT IN (:...viewedIds)', { viewedIds: viewedProductIds });

    // Add category filter if we have viewed categories
    if (viewedCategories.length > 0) {
      queryBuilder.andWhere('product.categoryId IN (:...categoryIds)', { categoryIds: viewedCategories });
    }

    // Add tag filter if we have viewed tags
    if (viewedTags.length > 0) {
      queryBuilder.andWhere('product.tags && :tags', { tags: viewedTags });
    }

    const recommendations = await queryBuilder
      .orderBy('product.averageRating', 'DESC')
      .addOrderBy('product.reviewCount', 'DESC')
      .addOrderBy('product.createdAt', 'DESC')
      .take(limit)
      .getMany();

    return recommendations;
  }

  async getViewingTrends(userId: number, days: number = 30): Promise<{
    date: string;
    views: number;
    uniqueProducts: number;
  }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const views = await this.recentlyViewedRepository.find({
      where: {
        user: { id: userId },
        lastViewedAt: MoreThan(startDate)
      },
      relations: ['product']
    });

    // Group views by date
    const trendData: { [key: string]: { views: number; products: Set<number> } } = {};

    views.forEach(view => {
      const date = view.lastViewedAt.toISOString().split('T')[0];
      
      if (!trendData[date]) {
        trendData[date] = { views: 0, products: new Set() };
      }
      
      trendData[date].views += view.viewCount;
      trendData[date].products.add(view.product.id);
    });

    // Convert to array format
    return Object.entries(trendData).map(([date, data]) => ({
      date,
      views: data.views,
      uniqueProducts: data.products.size
    })).sort((a, b) => a.date.localeCompare(b.date));
  }
}
