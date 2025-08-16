import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Return, ReturnStatus } from './entities/return.entity';
import { ReturnItem } from './entities/return-item.entity';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../common/email.service';

@Injectable()
export class ReturnService {
  constructor(
    @InjectRepository(Return) private returnRepo: Repository<Return>,
    @InjectRepository(ReturnItem) private returnItemRepo: Repository<ReturnItem>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private emailService: EmailService,
  ) {}

  async findReturnsByUser(userId: number): Promise<Return[]> {
    return this.returnRepo.find({
      where: { user: { id: userId } },
      relations: ['order', 'items', 'items.orderItem', 'items.orderItem.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllReturns(): Promise<Return[]> {
    return this.returnRepo.find({
      relations: ['order', 'user', 'items', 'items.orderItem', 'items.orderItem.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findReturnById(id: number): Promise<Return> {
    const returnEntity = await this.returnRepo.findOne({
      where: { id },
      relations: ['order', 'user', 'items', 'items.orderItem', 'items.orderItem.product', 'processedBy'],
    });

    if (!returnEntity) {
      throw new NotFoundException('Return not found');
    }

    return returnEntity;
  }

  async approveReturn(returnId: number, adminUser: User): Promise<Return> {
    const returnEntity = await this.findReturnById(returnId);

    if (returnEntity.status !== ReturnStatus.REQUESTED) {
      throw new BadRequestException('Return can only be approved if it is in requested status');
    }

    returnEntity.status = ReturnStatus.APPROVED;
    returnEntity.approvedAt = new Date();
    returnEntity.processedBy = adminUser;

    const savedReturn = await this.returnRepo.save(returnEntity);

    // Send approval email
    await this.emailService.sendReturnApproval(returnEntity.user.email, savedReturn);

    return savedReturn;
  }

  async rejectReturn(returnId: number, reason: string, adminUser: User): Promise<Return> {
    const returnEntity = await this.findReturnById(returnId);

    if (returnEntity.status !== ReturnStatus.REQUESTED) {
      throw new BadRequestException('Return can only be rejected if it is in requested status');
    }

    returnEntity.status = ReturnStatus.REJECTED;
    returnEntity.rejectedAt = new Date();
    returnEntity.rejectionReason = reason;
    returnEntity.processedBy = adminUser;

    const savedReturn = await this.returnRepo.save(returnEntity);

    // Send rejection email
    await this.emailService.sendReturnRejection(returnEntity.user.email, savedReturn, reason);

    return savedReturn;
  }

  async markReturnReceived(returnId: number, adminUser: User, adminNotes?: string): Promise<Return> {
    const returnEntity = await this.findReturnById(returnId);

    if (returnEntity.status !== ReturnStatus.APPROVED) {
      throw new BadRequestException('Return must be approved before marking as received');
    }

    returnEntity.status = ReturnStatus.RECEIVED;
    returnEntity.receivedAt = new Date();
    if (adminNotes) {
      returnEntity.adminNotes = adminNotes;
    }
    returnEntity.processedBy = adminUser;

    const savedReturn = await this.returnRepo.save(returnEntity);

    // Send received confirmation email
    await this.emailService.sendReturnReceived(returnEntity.user.email, savedReturn);

    return savedReturn;
  }

  async processReturn(returnId: number, adminUser: User): Promise<Return> {
    const returnEntity = await this.findReturnById(returnId);

    if (returnEntity.status !== ReturnStatus.RECEIVED) {
      throw new BadRequestException('Return must be received before processing');
    }

    returnEntity.status = ReturnStatus.PROCESSED;
    returnEntity.processedAt = new Date();
    returnEntity.processedBy = adminUser;

    const savedReturn = await this.returnRepo.save(returnEntity);

    // Send processing confirmation email
    await this.emailService.sendReturnProcessed(returnEntity.user.email, savedReturn);

    return savedReturn;
  }

  async refundReturn(returnId: number, adminUser: User): Promise<Return> {
    const returnEntity = await this.findReturnById(returnId);

    if (returnEntity.status !== ReturnStatus.PROCESSED) {
      throw new BadRequestException('Return must be processed before refunding');
    }

    returnEntity.status = ReturnStatus.REFUNDED;
    returnEntity.order.refundedAt = new Date();
    returnEntity.order.refundAmount = returnEntity.refundAmount;
    returnEntity.processedBy = adminUser;

    // Save both return and order
    await this.orderRepo.save(returnEntity.order);
    const savedReturn = await this.returnRepo.save(returnEntity);

    // Send refund confirmation email
    await this.emailService.sendReturnRefunded(returnEntity.user.email, savedReturn);

    return savedReturn;
  }
}
