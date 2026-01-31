import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Product } from '../../products/entities/product.entity';
import { StockMovement, MovementType, MovementReason } from '../entities/stock-movement.entity';
import { InventoryAlert, AlertType, AlertStatus, AlertPriority } from '../entities/inventory-alert.entity';
import { User } from '../../users/entities/user.entity';
import { EmailService } from '../../common/email.service';

describe('InventoryService', () => {
  let service: InventoryService;
  let productRepo: jest.Mocked<Repository<Product>>;
  let stockMovementRepo: jest.Mocked<Repository<StockMovement>>;
  let alertRepo: jest.Mocked<Repository<InventoryAlert>>;
  let emailService: jest.Mocked<EmailService>;

  const mockProduct: Partial<Product> = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    stock: 100,
    reservedStock: 0,
    availableStock: 100,
    minStockLevel: 10,
    maxStockLevel: 500,
    reorderPoint: 20,
    isActive: true,
    lowStockAlert: true,
    trackExpiration: false,
  };

  const mockUser: Partial<User> = {
    id: 1,
    email: 'admin@test.com',
    firstName: 'Admin',
    lastName: 'User',
  };

  const mockStockMovement: Partial<StockMovement> = {
    id: 1,
    product: mockProduct as Product,
    type: MovementType.RESTOCK,
    reason: MovementReason.SUPPLIER_DELIVERY,
    quantity: 50,
    previousStock: 100,
    newStock: 150,
  };

  const mockAlert: Partial<InventoryAlert> = {
    id: 1,
    product: mockProduct as Product,
    type: AlertType.LOW_STOCK,
    status: AlertStatus.ACTIVE,
    priority: AlertPriority.HIGH,
    message: 'Low stock alert',
  };

  beforeEach(async () => {
    const mockProductRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockStockMovementRepo = {
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockAlertRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const mockEmailService = {
      sendInventoryAlert: jest.fn(),
    };

    mockProductRepo.createQueryBuilder = jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    }));

    mockStockMovementRepo.createQueryBuilder = jest.fn(() => ({
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
        {
          provide: getRepositoryToken(StockMovement),
          useValue: mockStockMovementRepo,
        },
        {
          provide: getRepositoryToken(InventoryAlert),
          useValue: mockAlertRepo,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    productRepo = module.get(getRepositoryToken(Product));
    stockMovementRepo = module.get(getRepositoryToken(StockMovement));
    alertRepo = module.get(getRepositoryToken(InventoryAlert));
    emailService = module.get(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateStock', () => {
    it('should restock product successfully', async () => {
      productRepo.findOne.mockResolvedValue(mockProduct as Product);
      productRepo.save.mockResolvedValue({
        ...mockProduct,
        stock: 150,
      } as Product);
      stockMovementRepo.create.mockReturnValue(mockStockMovement as StockMovement);
      stockMovementRepo.save.mockResolvedValue(mockStockMovement as StockMovement);
      alertRepo.findOne.mockResolvedValue(null);
      alertRepo.create.mockReturnValue(mockAlert as InventoryAlert);
      alertRepo.save.mockResolvedValue(mockAlert as InventoryAlert);

      const result = await service.updateStock(
        1,
        50,
        MovementType.RESTOCK,
        MovementReason.SUPPLIER_DELIVERY,
        mockUser as User,
      );

      expect(productRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(productRepo.save).toHaveBeenCalled();
      expect(stockMovementRepo.create).toHaveBeenCalled();
      expect(stockMovementRepo.save).toHaveBeenCalled();
      expect(result.quantity).toBe(50);
      expect(result.newStock).toBe(150);
    });

    it('should decrease stock for sale', async () => {
      const saleProduct = { ...mockProduct, stock: 100 };
      productRepo.findOne.mockResolvedValue(saleProduct as Product);
      productRepo.save.mockResolvedValue({
        ...saleProduct,
        stock: 90,
        lastSoldDate: expect.any(Date),
        totalSold: 10,
      } as Product);
      stockMovementRepo.create.mockReturnValue({
        ...mockStockMovement,
        type: MovementType.SALE,
        previousStock: 100,
        newStock: 90,
      } as StockMovement);
      stockMovementRepo.save.mockResolvedValue({} as StockMovement);
      alertRepo.findOne.mockResolvedValue(null);
      alertRepo.create.mockReturnValue(mockAlert as InventoryAlert);
      alertRepo.save.mockResolvedValue(mockAlert as InventoryAlert);

      const result = await service.updateStock(
        1,
        10,
        MovementType.SALE,
        MovementReason.CUSTOMER_ORDER,
        mockUser as User,
      );

      expect(result.newStock).toBe(90);
    });

    it('should throw NotFoundException when product not found', async () => {
      productRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateStock(999, 50, MovementType.RESTOCK, MovementReason.SUPPLIER_DELIVERY),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when insufficient stock', async () => {
      const lowStockProduct = { ...mockProduct, stock: 5 };
      productRepo.findOne.mockResolvedValue(lowStockProduct as Product);

      await expect(
        service.updateStock(1, 10, MovementType.SALE, MovementReason.CUSTOMER_ORDER),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('reserveStock', () => {
    it('should reserve stock successfully', async () => {
      const reservableProduct = { ...mockProduct, reservedStock: 0 };
      productRepo.findOne.mockResolvedValue(reservableProduct as Product);
      productRepo.save.mockResolvedValue({
        ...reservableProduct,
        reservedStock: 10,
      } as Product);

      await service.reserveStock(1, 10);

      expect(productRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ reservedStock: 10 }),
      );
    });

    it('should throw BadRequestException when insufficient available stock', async () => {
      const productWithReservation = { ...mockProduct, reservedStock: 95 };
      productRepo.findOne.mockResolvedValue(productWithReservation as Product);

      await expect(service.reserveStock(1, 10)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('releaseReservedStock', () => {
    it('should release reserved stock', async () => {
      const productWithReservation = { ...mockProduct, reservedStock: 20 };
      productRepo.findOne.mockResolvedValue(productWithReservation as Product);
      productRepo.save.mockResolvedValue({
        ...productWithReservation,
        reservedStock: 10,
      } as Product);

      await service.releaseReservedStock(1, 10);

      expect(productRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ reservedStock: 10 }),
      );
    });
  });

  describe('getLowStockProducts', () => {
    it('should return low stock products', async () => {
      const queryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockProduct]),
      };
      productRepo.createQueryBuilder.mockReturnValue(queryBuilder as any);

      const result = await service.getLowStockProducts();

      expect(queryBuilder.getMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('getExpiringProducts', () => {
    it('should return expiring products', async () => {
      productRepo.find.mockResolvedValue([mockProduct] as Product[]);

      const result = await service.getExpiringProducts(30);

      expect(productRepo.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('getInventoryValue', () => {
    it('should calculate inventory value', async () => {
      const products = [
        { ...mockProduct, stock: 100, price: 100, costPrice: 50 },
        { ...mockProduct, id: 2, stock: 50, price: 200, costPrice: 100 },
      ] as Product[];
      productRepo.find.mockResolvedValue(products);

      const result = await service.getInventoryValue();

      expect(result.totalValue).toBe(20000);
      expect(result.totalCost).toBe(10000);
      expect(result.products).toBe(2);
    });
  });

  describe('getActiveAlerts', () => {
    it('should return active alerts', async () => {
      alertRepo.find.mockResolvedValue([mockAlert] as InventoryAlert[]);

      const result = await service.getActiveAlerts();

      expect(alertRepo.find).toHaveBeenCalledWith({
        where: { status: AlertStatus.ACTIVE },
        relations: ['product'],
        order: { priority: 'DESC', createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('acknowledgeAlert', () => {
    it('should acknowledge an alert', async () => {
      alertRepo.findOne.mockResolvedValue(mockAlert as InventoryAlert);
      alertRepo.save.mockResolvedValue({
        ...mockAlert,
        status: AlertStatus.ACKNOWLEDGED,
        acknowledgedBy: mockUser,
        acknowledgedAt: expect.any(Date),
      } as InventoryAlert);

      const result = await service.acknowledgeAlert(1, mockUser as User, 'Acknowledged');

      expect(alertRepo.save).toHaveBeenCalled();
      expect(result.status).toBe(AlertStatus.ACKNOWLEDGED);
    });
  });

  describe('resolveAlert', () => {
    it('should resolve an alert', async () => {
      alertRepo.findOne.mockResolvedValue(mockAlert as InventoryAlert);
      alertRepo.save.mockResolvedValue({
        ...mockAlert,
        status: AlertStatus.RESOLVED,
        resolvedBy: mockUser,
        resolvedAt: expect.any(Date),
      } as InventoryAlert);

      const result = await service.resolveAlert(1, mockUser as User, 'Resolved');

      expect(alertRepo.save).toHaveBeenCalled();
      expect(result.status).toBe(AlertStatus.RESOLVED);
    });
  });
});
