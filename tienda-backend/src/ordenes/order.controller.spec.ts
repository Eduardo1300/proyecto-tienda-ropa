import { Test } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockOrderService = {
  createOrder: jest.fn().mockResolvedValue({ id: 1 }),
  getOrdersForUser: jest.fn().mockResolvedValue([{ id: 1 }]),
};

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = moduleRef.get(OrderController);
  });

  it('should create an order', async () => {
    const res = await controller.createOrder({ id: 1 } as any, {} as any);
    expect(res).toEqual({ id: 1 });
  });

  it('should list user orders', async () => {
    const res = await controller.getMyOrders({ id: 1 } as any);
    expect(Array.isArray(res)).toBe(true);
  });
});