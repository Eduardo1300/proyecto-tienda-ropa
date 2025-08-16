import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductComparison } from '../entities/product-comparison.entity';
import { Product } from '../entities/product.entity';
import { User } from '../../users/entities/user.entity';

export interface CreateComparisonDto {
  name: string;
  productIds: number[];
}

export interface UpdateComparisonDto {
  name?: string;
  productIds?: number[];
}

@Injectable()
export class ProductComparisonService {
  constructor(
    @InjectRepository(ProductComparison)
    private comparisonRepository: Repository<ProductComparison>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createComparison(userId: number, createComparisonDto: CreateComparisonDto): Promise<ProductComparison> {
    const { name, productIds } = createComparisonDto;

    // Validate product count (max 4 products for comparison)
    if (productIds.length > 4) {
      throw new BadRequestException('No puedes comparar más de 4 productos a la vez');
    }

    if (productIds.length < 2) {
      throw new BadRequestException('Debes seleccionar al menos 2 productos para comparar');
    }

    // Verify all products exist and are active
    const products = await this.productRepository.find({
      where: productIds.map(id => ({ id, isActive: true }))
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Uno o más productos no fueron encontrados');
    }

    // Create comparison
    const comparison = this.comparisonRepository.create({
      user: { id: userId } as User,
      name,
      productIds,
      isActive: true
    });

    return await this.comparisonRepository.save(comparison);
  }

  async getUserComparisons(userId: number): Promise<ProductComparison[]> {
    return await this.comparisonRepository.find({
      where: {
        user: { id: userId },
        isActive: true
      },
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async getComparison(userId: number, comparisonId: number): Promise<ProductComparison> {
    const comparison = await this.comparisonRepository.findOne({
      where: {
        id: comparisonId,
        user: { id: userId },
        isActive: true
      }
    });

    if (!comparison) {
      throw new NotFoundException('Comparación no encontrada');
    }

    return comparison;
  }

  async getComparisonWithProducts(userId: number, comparisonId: number): Promise<{
    comparison: ProductComparison;
    products: Product[];
  }> {
    const comparison = await this.getComparison(userId, comparisonId);

    const products = await this.productRepository.find({
      where: comparison.productIds.map(id => ({ id, isActive: true })),
      relations: [
        'images',
        'variants',
        'reviews',
        'category'
      ]
    });

    // Sort products in the same order as productIds
    const sortedProducts = comparison.productIds.map(id => 
      products.find(product => product.id === id)
    ).filter(Boolean) as Product[];

    return {
      comparison,
      products: sortedProducts
    };
  }

  async updateComparison(
    userId: number, 
    comparisonId: number, 
    updateComparisonDto: UpdateComparisonDto
  ): Promise<ProductComparison> {
    const comparison = await this.getComparison(userId, comparisonId);

    if (updateComparisonDto.name) {
      comparison.name = updateComparisonDto.name;
    }

    if (updateComparisonDto.productIds) {
      // Validate product count
      if (updateComparisonDto.productIds.length > 4) {
        throw new BadRequestException('No puedes comparar más de 4 productos a la vez');
      }

      if (updateComparisonDto.productIds.length < 2) {
        throw new BadRequestException('Debes seleccionar al menos 2 productos para comparar');
      }

      // Verify all products exist and are active
      const products = await this.productRepository.find({
        where: updateComparisonDto.productIds.map(id => ({ id, isActive: true }))
      });

      if (products.length !== updateComparisonDto.productIds.length) {
        throw new NotFoundException('Uno o más productos no fueron encontrados');
      }

      comparison.productIds = updateComparisonDto.productIds;
    }

    comparison.updatedAt = new Date();

    return await this.comparisonRepository.save(comparison);
  }

  async deleteComparison(userId: number, comparisonId: number): Promise<void> {
    const comparison = await this.getComparison(userId, comparisonId);
    
    comparison.isActive = false;
    await this.comparisonRepository.save(comparison);
  }

  async addProductToComparison(userId: number, comparisonId: number, productId: number): Promise<ProductComparison> {
    const comparison = await this.getComparison(userId, comparisonId);

    // Check if product already exists in comparison
    if (comparison.productIds.includes(productId)) {
      throw new BadRequestException('El producto ya está en la comparación');
    }

    // Check max products limit
    if (comparison.productIds.length >= 4) {
      throw new BadRequestException('No puedes comparar más de 4 productos a la vez');
    }

    // Verify product exists and is active
    const product = await this.productRepository.findOne({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    comparison.productIds.push(productId);
    comparison.updatedAt = new Date();

    return await this.comparisonRepository.save(comparison);
  }

  async removeProductFromComparison(userId: number, comparisonId: number, productId: number): Promise<ProductComparison> {
    const comparison = await this.getComparison(userId, comparisonId);

    // Check if product exists in comparison
    if (!comparison.productIds.includes(productId)) {
      throw new BadRequestException('El producto no está en la comparación');
    }

    // Check minimum products limit
    if (comparison.productIds.length <= 2) {
      throw new BadRequestException('Debes mantener al menos 2 productos para comparar');
    }

    comparison.productIds = comparison.productIds.filter(id => id !== productId);
    comparison.updatedAt = new Date();

    return await this.comparisonRepository.save(comparison);
  }

  async clearAllComparisons(userId: number): Promise<void> {
    await this.comparisonRepository.update(
      {
        user: { id: userId },
        isActive: true
      },
      {
        isActive: false
      }
    );
  }

  async getComparisonStats(userId: number): Promise<{
    totalComparisons: number;
    totalProductsCompared: number;
    averageProductsPerComparison: number;
    mostComparedCategory: string | null;
  }> {
    const comparisons = await this.comparisonRepository.find({
      where: {
        user: { id: userId },
        isActive: true
      }
    });

    const stats = {
      totalComparisons: comparisons.length,
      totalProductsCompared: 0,
      averageProductsPerComparison: 0,
      mostComparedCategory: null as string | null
    };

    if (comparisons.length === 0) {
      return stats;
    }

    // Calculate total products compared
    const allProductIds = comparisons.flatMap(c => c.productIds);
    const uniqueProductIds = [...new Set(allProductIds)];
    stats.totalProductsCompared = uniqueProductIds.length;

    // Calculate average products per comparison
    const totalProductsInComparisons = comparisons.reduce((sum, c) => sum + c.productIds.length, 0);
    stats.averageProductsPerComparison = Math.round((totalProductsInComparisons / comparisons.length) * 10) / 10;

    // Find most compared category
    if (uniqueProductIds.length > 0) {
      const products = await this.productRepository.find({
        where: uniqueProductIds.map(id => ({ id })),
        relations: ['category']
      });

      const categoryCount: { [key: string]: number } = {};
      products.forEach(product => {
        const categoryName = typeof product.category === 'string' ? product.category : 'Sin categoría';
        categoryCount[categoryName] = (categoryCount[categoryName] || 0) + 1;
      });

      const mostComparedCategoryEntry = Object.entries(categoryCount)
        .sort(([,a], [,b]) => b - a)[0];
      
      stats.mostComparedCategory = mostComparedCategoryEntry ? mostComparedCategoryEntry[0] : null;
    }

    return stats;
  }

  async getQuickComparison(productIds: number[]): Promise<Product[]> {
    // For quick comparison without saving to database
    if (productIds.length > 4) {
      throw new BadRequestException('No puedes comparar más de 4 productos a la vez');
    }

    if (productIds.length < 2) {
      throw new BadRequestException('Debes seleccionar al menos 2 productos para comparar');
    }

    const products = await this.productRepository.find({
      where: productIds.map(id => ({ id, isActive: true })),
      relations: [
        'images',
        'variants',
        'reviews',
        'category'
      ]
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Uno o más productos no fueron encontrados');
    }

    // Sort products in the same order as productIds
    return productIds.map(id => 
      products.find(product => product.id === id)
    ).filter(Boolean) as Product[];
  }
}
