import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto, SearchProductsResult, SortBy } from './dto/search-products.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('product.images', 'images') 
      .leftJoinAndSelect('product.reviews', 'reviews')
      .where('product.isActive = :isActive OR product.isActive IS NULL', { isActive: true })
      .getMany();
  }

  async searchProducts(searchDto: SearchProductsDto): Promise<SearchProductsResult> {
    // Set defaults
    const page = searchDto.page || 1;
    const limit = searchDto.limit || 20;
    const sortBy = searchDto.sortBy || SortBy.CREATED_DESC;
    
    const queryBuilder = this.createSearchQuery({ ...searchDto, page, limit, sortBy });
    
    // Get total count for pagination
    const total = await queryBuilder.getCount();
    
    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);
    
    // Execute query
    const products = await queryBuilder.getMany();
    
    // Get filters data
    const filters = await this.getAvailableFilters();
    
    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters,
    };
  }

  private createSearchQuery(searchDto: SearchProductsDto): SelectQueryBuilder<Product> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variants')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .where('product.isActive = :isActive OR product.isActive IS NULL', { isActive: true });

    // Text search
    if (searchDto.search) {
      queryBuilder.andWhere(
        '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search) OR LOWER(product.brand) LIKE LOWER(:search))',
        { search: `%${searchDto.search}%` }
      );
    }

    // Category filter
    if (searchDto.categories && searchDto.categories.length > 0) {
      queryBuilder.andWhere('LOWER(product.category) IN (:...categories)', {
        categories: searchDto.categories.map(c => c.toLowerCase())
      });
    }

    // Brand filter
    if (searchDto.brands && searchDto.brands.length > 0) {
      queryBuilder.andWhere('LOWER(product.brand) IN (:...brands)', {
        brands: searchDto.brands.map(b => b.toLowerCase())
      });
    }

    // Color filter
    if (searchDto.colors && searchDto.colors.length > 0) {
      queryBuilder.andWhere('LOWER(product.color) IN (:...colors)', {
        colors: searchDto.colors.map(c => c.toLowerCase())
      });
    }

    // Size filter
    if (searchDto.sizes && searchDto.sizes.length > 0) {
      queryBuilder.andWhere('LOWER(product.size) IN (:...sizes)', {
        sizes: searchDto.sizes.map(s => s.toLowerCase())
      });
    }

    // Price range
    if (searchDto.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: searchDto.minPrice });
    }
    if (searchDto.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: searchDto.maxPrice });
    }

    // Rating filter
    if (searchDto.minRating !== undefined) {
      queryBuilder.andWhere('product.averageRating >= :minRating', { minRating: searchDto.minRating });
    }

    // Stock filter
    if (searchDto.inStock) {
      queryBuilder.andWhere('(product.stock - product.reservedStock) > 0');
    }

    // Feature filters
    if (searchDto.isFeatured) {
      queryBuilder.andWhere('product.isFeatured = :isFeatured', { isFeatured: true });
    }
    if (searchDto.isNew) {
      queryBuilder.andWhere('product.isNew = :isNew', { isNew: true });
    }
    if (searchDto.isBestseller) {
      queryBuilder.andWhere('product.isBestseller = :isBestseller', { isBestseller: true });
    }

    // Sorting
    this.applySorting(queryBuilder, searchDto.sortBy || SortBy.CREATED_DESC);

    return queryBuilder;
  }

  private applySorting(queryBuilder: SelectQueryBuilder<Product>, sortBy: SortBy): void {
    switch (sortBy) {
      case SortBy.PRICE_ASC:
        queryBuilder.orderBy('product.price', 'ASC');
        break;
      case SortBy.PRICE_DESC:
        queryBuilder.orderBy('product.price', 'DESC');
        break;
      case SortBy.NAME_ASC:
        queryBuilder.orderBy('product.name', 'ASC');
        break;
      case SortBy.NAME_DESC:
        queryBuilder.orderBy('product.name', 'DESC');
        break;
      case SortBy.CREATED_ASC:
        queryBuilder.orderBy('product.createdAt', 'ASC');
        break;
      case SortBy.CREATED_DESC:
        queryBuilder.orderBy('product.createdAt', 'DESC');
        break;
      case SortBy.POPULARITY:
        queryBuilder.orderBy('product.viewCount', 'DESC');
        break;
      case SortBy.RATING:
        queryBuilder.orderBy('product.averageRating', 'DESC');
        break;
      default:
        queryBuilder.orderBy('product.createdAt', 'DESC');
    }
  }

  private async getAvailableFilters() {
    const categories = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('(product.isActive = :isActive OR product.isActive IS NULL) AND product.category IS NOT NULL', { isActive: true })
      .getRawMany();

    const brands = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.brand', 'brand')
      .where('(product.isActive = :isActive OR product.isActive IS NULL) AND product.brand IS NOT NULL', { isActive: true })
      .getRawMany();

    const colors = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.color', 'color')
      .where('(product.isActive = :isActive OR product.isActive IS NULL) AND product.color IS NOT NULL', { isActive: true })
      .getRawMany();

    const sizes = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.size', 'size')
      .where('(product.isActive = :isActive OR product.isActive IS NULL) AND product.size IS NOT NULL', { isActive: true })
      .getRawMany();

    const priceRange = await this.productRepository
      .createQueryBuilder('product')
      .select('MIN(product.price)', 'min')
      .addSelect('MAX(product.price)', 'max')
      .where('product.isActive = :isActive OR product.isActive IS NULL', { isActive: true })
      .getRawOne();

    return {
      categories: categories.map(c => c.category).filter(Boolean),
      brands: brands.map(b => b.brand).filter(Boolean),
      colors: colors.map(c => c.color).filter(Boolean),
      sizes: sizes.map(s => s.size).filter(Boolean),
      priceRange: {
        min: parseFloat(priceRange?.min) || 0,
        max: parseFloat(priceRange?.max) || 1000,
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<Product> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }
}
