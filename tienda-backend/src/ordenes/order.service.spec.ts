import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderService } from './order.service';
import { CartItem } from '../carrito/entities/cart-item.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

function createRepoMock() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn((v) => v),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as Repository<any>;
}

describe('OrderService', () => {
  let service: OrderService;
  let orderRepo: jest.Mocked<Repository<Order>>;
  let orderItemRepo: jest.Mocked<Repository<OrderItem>>;
  let cartRepo: jest.Mocked<Repository<CartItem>>;
  let userRepo: jest.Mocked<Repository<User>>;
  let productRepo: jest.Mocked<Repository<Product>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: getRepositoryToken(Order), useValue: createRepoMock() },
        { provide: getRepositoryToken(OrderItem), useValue: createRepoMock() },
        { provide: getRepositoryToken(CartItem), useValue: createRepoMock() },
        { provide: getRepositoryToken(User), useValue: createRepoMock() },
        { provide: getRepositoryToken(Product), useValue: createRepoMock() },
      ],
    }).compile();

    service = moduleRef.get(OrderService);
    orderRepo = moduleRef.get(getRepositoryToken(Order));
    orderItemRepo = moduleRef.get(getRepositoryToken(OrderItem));
    cartRepo = moduleRef.get(getRepositoryToken(CartItem));
    userRepo = moduleRef.get(getRepositoryToken(User));
    productRepo = moduleRef.get(getRepositoryToken(Product));
  });

  it('should create order from explicit items', async () => {
    (userRepo.findOne as any).mockResolvedValue({ id: 1 } as User);
    const productA = { id: 10, price: 100.5 } as Product;
    const productB = { id: 11, price: 50 } as Product;
    (productRepo.find as any).mockResolvedValue([productA, productB]);

    (orderItemRepo.create as any).mockImplementation((v) => v as any);
    (orderRepo.save as any).mockResolvedValue({ id: 99, total: 251, status: OrderStatus.PENDING } as Order);

    const order = await service.createOrder(1, {
      items: [
        { productId: 10, quantity: 2 },
        { productId: 11, quantity: 1 },
      ],
    });

    expect(orderRepo.save).toHaveBeenCalled();
    const created = (orderRepo.create as any).mock.calls[0][0] as Order;
    expect(created.total).toBeCloseTo(100.5 * 2 + 50 * 1);
    expect(created.status).toBe(OrderStatus.PENDING);
  });

  it('should create order from cart and clear it', async () => {
    (userRepo.findOne as any).mockResolvedValue({ id: 1 } as User);
    (cartRepo.find as any).mockResolvedValue([
      { quantity: 1, product: { id: 20, price: 10 } as Product } as CartItem,
      { quantity: 3, product: { id: 21, price: 5 } as Product } as CartItem,
    ]);

    (orderItemRepo.create as any).mockImplementation((v) => v as any);
    (orderRepo.save as any).mockResolvedValue({ id: 100, total: 25 } as Order);

    const order = await service.createOrder(1, {});
    expect(order.total).toBe(25);
    expect(cartRepo.remove).toHaveBeenCalled();
  });

  it('should list orders for user', async () => {
    (orderRepo.find as any).mockResolvedValue([{ id: 1 } as Order]);
    const list = await service.getOrdersForUser(1);
    expect(list).toHaveLength(1);
    expect(orderRepo.find).toHaveBeenCalledWith(
      expect.objectContaining({ where: { user: { id: 1 } } }),
    );
  });
});