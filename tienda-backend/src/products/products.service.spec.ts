import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepo: jest.Mocked<Repository<Product>>;

  const mockProduct: Partial<Product> = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    category: 'test-category',
    stock: 10,
    isActive: true,
    isFeatured: false,
    isNew: true,
    isBestseller: false,
    averageRating: 4.5,
    reviewCount: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockProductRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepo = module.get(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createDto = {
        name: 'New Product',
        description: 'New Description',
        price: 149.99,
      };

      productRepo.create.mockReturnValue(mockProduct as Product);
      productRepo.save.mockResolvedValue(mockProduct as Product);

      const result = await service.create(createDto);

      expect(productRepo.create).toHaveBeenCalledWith(createDto);
      expect(productRepo.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a product when found', async () => {
      productRepo.findOne.mockResolvedValue(mockProduct as Product);

      const result = await service.findOne(1);

      expect(productRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: expect.any(Array),
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException when product not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateDto = {
        name: 'Updated Product',
        price: 129.99,
      };

      const updatedProduct = { ...mockProduct, name: 'Updated Product', price: 129.99 };
      productRepo.findOne.mockResolvedValue(mockProduct as Product);
      productRepo.save.mockResolvedValue(updatedProduct as Product);

      const result = await service.update(1, updateDto);

      expect(productRepo.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Product');
      expect(result.price).toBe(129.99);
    });

    it('should throw NotFoundException when product not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' } as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      productRepo.findOne.mockResolvedValue(mockProduct as Product);
      productRepo.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);

      expect(productRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when product not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockProduct], 1]),
      };
      productRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await service.findAll();

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total', 1);
    });

    it('should apply filters correctly', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[mockProduct], 1]),
      };
      productRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      await service.findAll({
        category: 'test-category',
        minPrice: 50,
        maxPrice: 150,
      });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });
  });
});
