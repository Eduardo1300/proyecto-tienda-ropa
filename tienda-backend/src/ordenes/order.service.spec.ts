import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { Return } from './entities/return.entity';
import { ReturnItem } from './entities/return-item.entity';
import { OrderStatus } from './enums/order-status.enum';
import { User } from '../users/entities/user.entity';
import { CartItem } from '../carrito/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { EmailService } from '../common/email.service';
import { PdfService } from '../common/pdf.service';
import { AnalyticsService } from '../analytics/services/analytics.service';
import { LoyaltyService } from '../loyalty/services/loyalty.service';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepo: jest.Mocked<Repository<Order>>;
  let orderItemRepo: jest.Mocked<Repository<OrderItem>>;
  let statusHistoryRepo: jest.Mocked<Repository<OrderStatusHistory>>;
  let returnRepo: jest.Mocked<Repository<Return>>;
  let returnItemRepo: jest.Mocked<Repository<ReturnItem>>;
  let cartRepo: jest.Mocked<Repository<CartItem>>;
  let userRepo: jest.Mocked<Repository<User>>;
  let productRepo: jest.Mocked<Repository<Product>>;
  let emailService: jest.Mocked<EmailService>;
  let pdfService: jest.Mocked<PdfService>;
  let analyticsService: jest.Mocked<AnalyticsService>;
  let loyaltyService: jest.Mocked<LoyaltyService>;

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockProduct: Partial<Product> = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    stock: 10,
  };

  const mockOrder: Partial<Order> = {
    id: 1,
    orderNumber: 'ORD-20250101-0001',
    user: mockUser as User,
    status: OrderStatus.PENDING,
    total: 99.99,
    shippingCost: 0,
    tax: 0,
    canBeCancelled: true,
    canBeReturned: false,
    items: [],
  };

  beforeEach(async () => {
    const mockOrderRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      count: jest.fn(),
    };

    const mockOrderItemRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const mockStatusHistoryRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockReturnRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
    };

    const mockReturnItemRepo = {
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockCartRepo = {
      delete: jest.fn(),
    };

    const mockUserRepo = {
      findOne: jest.fn(),
    };

    const mockProductRepo = {
      findOne: jest.fn(),
    };

    const mockEmailService = {
      sendOrderConfirmation: jest.fn(),
      sendOrderStatusUpdate: jest.fn(),
      sendOrderCancellation: jest.fn(),
      sendReturnRequest: jest.fn(),
    };

    const mockPdfService = {
      generateInvoice: jest.fn(),
    };

    const mockAnalyticsService = {
      trackEvent: jest.fn(),
    };

    const mockLoyaltyService = {
      processOrderPoints: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepo,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepo,
        },
        {
          provide: getRepositoryToken(OrderStatusHistory),
          useValue: mockStatusHistoryRepo,
        },
        {
          provide: getRepositoryToken(Return),
          useValue: mockReturnRepo,
        },
        {
          provide: getRepositoryToken(ReturnItem),
          useValue: mockReturnItemRepo,
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: mockCartRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
        {
          provide: PdfService,
          useValue: mockPdfService,
        },
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
        {
          provide: LoyaltyService,
          useValue: mockLoyaltyService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepo = module.get(getRepositoryToken(Order));
    orderItemRepo = module.get(getRepositoryToken(OrderItem));
    statusHistoryRepo = module.get(getRepositoryToken(OrderStatusHistory));
    returnRepo = module.get(getRepositoryToken(Return));
    returnItemRepo = module.get(getRepositoryToken(ReturnItem));
    cartRepo = module.get(getRepositoryToken(CartItem));
    userRepo = module.get(getRepositoryToken(User));
    productRepo = module.get(getRepositoryToken(Product));
    emailService = module.get(EmailService);
    pdfService = module.get(PdfService);
    analyticsService = module.get(AnalyticsService);
    loyaltyService = module.get(LoyaltyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      userRepo.findOne.mockResolvedValue(mockUser as User);
      productRepo.findOne.mockResolvedValue(mockProduct as Product);
      orderRepo.count.mockResolvedValue(0);
      orderRepo.create.mockReturnValue(mockOrder as Order);
      orderRepo.save.mockResolvedValue(mockOrder as Order);
      statusHistoryRepo.create.mockReturnValue({} as OrderStatusHistory);
      statusHistoryRepo.save.mockResolvedValue({} as OrderStatusHistory);
      analyticsService.trackEvent.mockResolvedValue({} as any);
      loyaltyService.processOrderPoints.mockResolvedValue({} as any);
      emailService.sendOrderConfirmation.mockResolvedValue(undefined);
      cartRepo.delete.mockResolvedValue({ affected: 1 } as any);
      orderRepo.findOne.mockResolvedValue(mockOrder as Order);

      const createOrderDto = {
        userId: 1,
        items: [{ productId: 1, quantity: 1, price: 99.99 }],
        shippingAddress: 'Test Address',
        billingAddress: 'Test Address',
      };

      const result = await service.createOrder(createOrderDto);

      expect(userRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(productRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(orderRepo.create).toHaveBeenCalled();
      expect(orderRepo.save).toHaveBeenCalled();
      expect(emailService.sendOrderConfirmation).toHaveBeenCalled();
      expect(cartRepo.delete).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const createOrderDto = {
        userId: 999,
        items: [{ productId: 1, quantity: 1, price: 99.99 }],
        shippingAddress: 'Test Address',
        billingAddress: 'Test Address',
      };

      await expect(service.createOrder(createOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when product not found', async () => {
      userRepo.findOne.mockResolvedValue(mockUser as User);
      productRepo.findOne.mockResolvedValue(null);

      const createOrderDto = {
        userId: 1,
        items: [{ productId: 999, quantity: 1, price: 99.99 }],
        shippingAddress: 'Test Address',
        billingAddress: 'Test Address',
      };

      await expect(service.createOrder(createOrderDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOrderById', () => {
    it('should return an order when found', async () => {
      orderRepo.findOne.mockResolvedValue(mockOrder as Order);

      const result = await service.findOrderById(1);

      expect(orderRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user', 'items', 'items.product', 'statusHistory', 'statusHistory.changedBy'],
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException when order not found', async () => {
      orderRepo.findOne.mockResolvedValue(null);

      await expect(service.findOrderById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOrdersByUser', () => {
    it('should return orders for a user', async () => {
      orderRepo.find.mockResolvedValue([mockOrder] as Order[]);

      const result = await service.findOrdersByUser(1);

      expect(orderRepo.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ['user', 'items', 'items.product'],
        order: { createdAt: 'DESC' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order successfully', async () => {
      const cancellableOrder = {
        ...mockOrder,
        canBeCancelled: true,
        status: OrderStatus.PENDING,
        user: mockUser,
      } as Order;
      orderRepo.findOne.mockResolvedValue(cancellableOrder);
      orderRepo.save.mockResolvedValue({
        ...cancellableOrder,
        status: OrderStatus.CANCELLED,
      } as Order);
      statusHistoryRepo.create.mockReturnValue({} as OrderStatusHistory);
      statusHistoryRepo.save.mockResolvedValue({} as OrderStatusHistory);
      emailService.sendOrderCancellation.mockResolvedValue(undefined);
      orderRepo.findOne.mockResolvedValue({
        ...cancellableOrder,
        status: OrderStatus.CANCELLED,
      } as Order);

      const cancelOrderDto = { reason: 'Test cancellation', notes: 'Test notes' };
      const result = await service.cancelOrder(1, cancelOrderDto, mockUser as User);

      expect(orderRepo.save).toHaveBeenCalled();
      expect(emailService.sendOrderCancellation).toHaveBeenCalled();
      expect(result.status).toBe(OrderStatus.CANCELLED);
    });

    it('should throw BadRequestException when order cannot be cancelled', async () => {
      const uncancellableOrder = {
        ...mockOrder,
        canBeCancelled: false,
        status: OrderStatus.SHIPPED,
      } as Order;
      orderRepo.findOne.mockResolvedValue(uncancellableOrder);

      const cancelOrderDto = { reason: 'Test' };
      await expect(
        service.cancelOrder(1, cancelOrderDto, mockUser as User),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status from PENDING to PROCESSING', async () => {
      orderRepo.findOne.mockResolvedValue(mockOrder as Order);
      orderRepo.save.mockResolvedValue(mockOrder as Order);
      statusHistoryRepo.create.mockReturnValue({} as OrderStatusHistory);
      statusHistoryRepo.save.mockResolvedValue({} as OrderStatusHistory);
      emailService.sendOrderStatusUpdate.mockResolvedValue(undefined);
      orderRepo.findOne.mockResolvedValue(mockOrder as Order);

      const updateStatusDto = {
        status: OrderStatus.PROCESSING,
        reason: 'Order is being processed',
      };

      const result = await service.updateOrderStatus(
        1,
        updateStatusDto,
        mockUser as User,
      );

      expect(orderRepo.save).toHaveBeenCalled();
      expect(statusHistoryRepo.create).toHaveBeenCalled();
    });

    it('should reject invalid status transition', async () => {
      const shippedOrder = {
        ...mockOrder,
        status: OrderStatus.SHIPPED,
      } as Order;
      orderRepo.findOne.mockResolvedValue(shippedOrder);

      const updateStatusDto = {
        status: OrderStatus.PENDING,
      };

      await expect(
        service.updateOrderStatus(1, updateStatusDto, mockUser as User),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('validateStatusTransition', () => {
    it('should allow valid transitions', () => {
      expect(() =>
        service['validateStatusTransition'](
          OrderStatus.PENDING,
          OrderStatus.PROCESSING,
        ),
      ).not.toThrow();

      expect(() =>
        service['validateStatusTransition'](
          OrderStatus.PROCESSING,
          OrderStatus.SHIPPED,
        ),
      ).not.toThrow();

      expect(() =>
        service['validateStatusTransition'](
          OrderStatus.SHIPPED,
          OrderStatus.DELIVERED,
        ),
      ).not.toThrow();
    });

    it('should reject invalid transitions', () => {
      expect(() =>
        service['validateStatusTransition'](
          OrderStatus.CANCELLED,
          OrderStatus.PROCESSING,
        ),
      ).toThrow(BadRequestException);

      expect(() =>
        service['validateStatusTransition'](
          OrderStatus.DELIVERED,
          OrderStatus.PENDING,
        ),
      ).toThrow(BadRequestException);
    });
  });

  describe('generateInvoicePdf', () => {
    it('should generate invoice PDF', async () => {
      orderRepo.findOne.mockResolvedValue(mockOrder as Order);
      pdfService.generateInvoice.mockResolvedValue(Buffer.from('PDF content'));

      const result = await service.generateInvoicePdf(1);

      expect(orderRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(pdfService.generateInvoice).toHaveBeenCalledWith(mockOrder);
      expect(result).toBeInstanceOf(Buffer);
    });
  });
});
