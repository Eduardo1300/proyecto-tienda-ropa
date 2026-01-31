import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyProgram, LoyaltyTier } from '../entities/loyalty-program.entity';
import { LoyaltyTransaction, TransactionType, TransactionReason } from '../entities/loyalty-transaction.entity';
import { User } from '../../users/entities/user.entity';

describe('LoyaltyService', () => {
  let service: LoyaltyService;
  let loyaltyRepo: jest.Mocked<Repository<LoyaltyProgram>>;
  let transactionRepo: jest.Mocked<Repository<LoyaltyTransaction>>;
  let userRepo: jest.Mocked<Repository<User>>;

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockLoyaltyProgram: Partial<LoyaltyProgram> = {
    id: 1,
    userId: 1,
    totalPoints: 500,
    availablePoints: 500,
    lifetimeSpent: 500,
    currentTier: LoyaltyTier.BRONZE,
    tierProgress: 50,
    isActive: true,
  };

  const mockTransaction: Partial<LoyaltyTransaction> = {
    id: 1,
    loyaltyProgramId: 1,
    type: TransactionType.EARNED,
    reason: TransactionReason.PURCHASE,
    points: 100,
    description: 'Test transaction',
  };

  beforeEach(async () => {
    const mockLoyaltyRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const mockTransactionRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findAndCount: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const mockUserRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
    };

    // Mock query builder for transactionRepo
    mockTransactionRepo.createQueryBuilder = jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getRawOne: jest.fn().mockResolvedValue({ count: '0' }),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
    }));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoyaltyService,
        {
          provide: getRepositoryToken(LoyaltyProgram),
          useValue: mockLoyaltyRepo,
        },
        {
          provide: getRepositoryToken(LoyaltyTransaction),
          useValue: mockTransactionRepo,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<LoyaltyService>(LoyaltyService);
    loyaltyRepo = module.get(getRepositoryToken(LoyaltyProgram));
    transactionRepo = module.get(getRepositoryToken(LoyaltyTransaction));
    userRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProgram', () => {
    it('should create a new loyalty program', async () => {
      loyaltyRepo.findOne.mockResolvedValue(null);
      loyaltyRepo.create.mockReturnValue(mockLoyaltyProgram as LoyaltyProgram);
      loyaltyRepo.save.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);
      transactionRepo.create.mockReturnValue(mockTransaction as LoyaltyTransaction);
      transactionRepo.save.mockResolvedValue(mockTransaction as LoyaltyTransaction);

      const result = await service.createProgram(1);

      expect(loyaltyRepo.create).toHaveBeenCalled();
      expect(loyaltyRepo.save).toHaveBeenCalled();
      expect(transactionRepo.create).toHaveBeenCalled();
      expect(transactionRepo.save).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.userId).toBe(1);
    });

    it('should return existing program if already exists', async () => {
      loyaltyRepo.findOne.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);

      const result = await service.createProgram(1);

      expect(loyaltyRepo.create).not.toHaveBeenCalled();
      expect(result).toEqual(mockLoyaltyProgram);
    });
  });

  describe('getProgram', () => {
    it('should return existing program', async () => {
      loyaltyRepo.findOne.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);

      const result = await service.getProgram(1);

      expect(loyaltyRepo.findOne).toHaveBeenCalledWith({
        where: { userId: 1 },
        relations: ['transactions'],
      });
      expect(result).toEqual(mockLoyaltyProgram);
    });

    it('should create program if not exists', async () => {
      loyaltyRepo.findOne.mockResolvedValue(null);
      loyaltyRepo.create.mockReturnValue(mockLoyaltyProgram as LoyaltyProgram);
      loyaltyRepo.save.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);
      transactionRepo.create.mockReturnValue(mockTransaction as LoyaltyTransaction);
      transactionRepo.save.mockResolvedValue(mockTransaction as LoyaltyTransaction);

      const result = await service.getProgram(1);

      expect(service.createProgram).toHaveBeenCalledWith(1);
      expect(result).toBeDefined();
    });
  });

  describe('addPoints', () => {
    it('should add points to program', async () => {
      loyaltyRepo.findOne.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);
      transactionRepo.create.mockReturnValue(mockTransaction as LoyaltyTransaction);
      transactionRepo.save.mockResolvedValue(mockTransaction as LoyaltyTransaction);
      loyaltyRepo.save.mockResolvedValue({
        ...mockLoyaltyProgram,
        totalPoints: 600,
        availablePoints: 600,
      } as LoyaltyProgram);

      const result = await service.addPoints(
        1,
        100,
        TransactionReason.PURCHASE,
        'Test points',
        1,
        100,
      );

      expect(transactionRepo.create).toHaveBeenCalled();
      expect(transactionRepo.save).toHaveBeenCalled();
      expect(loyaltyRepo.save).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException when program not found', async () => {
      loyaltyRepo.findOne.mockResolvedValue(null);

      await expect(
        service.addPoints(999, 100, TransactionReason.PURCHASE),
      ).rejects.toThrow(NotFoundException);
    });

    it('should upgrade tier when threshold reached', async () => {
      const silverProgram = {
        ...mockLoyaltyProgram,
        totalPoints: 950,
        availablePoints: 950,
        currentTier: LoyaltyTier.BRONZE,
      } as LoyaltyProgram;

      loyaltyRepo.findOne.mockResolvedValue(silverProgram);
      transactionRepo.create.mockReturnValue(mockTransaction as LoyaltyTransaction);
      transactionRepo.save.mockResolvedValue(mockTransaction as LoyaltyTransaction);
      loyaltyRepo.save.mockResolvedValue({
        ...silverProgram,
        currentTier: LoyaltyTier.SILVER,
        totalPoints: 1050,
      } as LoyaltyProgram);

      const result = await service.addPoints(
        1,
        100,
        TransactionReason.PURCHASE,
      );

      expect(result).toBeDefined();
    });
  });

  describe('redeemPoints', () => {
    it('should redeem points successfully', async () => {
      loyaltyRepo.findOne.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);
      transactionRepo.create.mockReturnValue(mockTransaction as LoyaltyTransaction);
      transactionRepo.save.mockResolvedValue(mockTransaction as LoyaltyTransaction);
      loyaltyRepo.save.mockResolvedValue({
        ...mockLoyaltyProgram,
        availablePoints: 400,
      } as LoyaltyProgram);

      const result = await service.redeemPoints(1, 100, 'Test redemption');

      expect(result.success).toBe(true);
      expect(result.discount).toBeGreaterThan(0);
      expect(transactionRepo.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException when insufficient points', async () => {
      const lowPointsProgram = {
        ...mockLoyaltyProgram,
        availablePoints: 50,
      } as LoyaltyProgram;
      loyaltyRepo.findOne.mockResolvedValue(lowPointsProgram);

      await expect(service.redeemPoints(1, 100)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getTransactionHistory', () => {
    it('should return transaction history', async () => {
      loyaltyRepo.findOne.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);
      transactionRepo.findAndCount.mockResolvedValue([[mockTransaction] as LoyaltyTransaction[], 1]);

      const result = await service.getTransactionHistory(1, 10, 0);

      expect(transactionRepo.findAndCount).toHaveBeenCalled();
      expect(result.transactions).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('processOrderPoints', () => {
    it('should process points for order', async () => {
      loyaltyRepo.findOne.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);
      transactionRepo.create.mockReturnValue(mockTransaction as LoyaltyTransaction);
      transactionRepo.save.mockResolvedValue(mockTransaction as LoyaltyTransaction);
      loyaltyRepo.save.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);

      const result = await service.processOrderPoints(1, 1, 100);

      expect(result).toBeDefined();
      expect(transactionRepo.create).toHaveBeenCalled();
    });
  });

  describe('giveReviewBonus', () => {
    it('should give review bonus', async () => {
      loyaltyRepo.findOne.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);
      transactionRepo.create.mockReturnValue(mockTransaction as LoyaltyTransaction);
      transactionRepo.save.mockResolvedValue(mockTransaction as LoyaltyTransaction);
      loyaltyRepo.save.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);

      const result = await service.giveReviewBonus(1, 1);

      expect(result).toBeDefined();
      expect(transactionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          points: 25,
          reason: TransactionReason.REVIEW_BONUS,
        }),
      );
    });
  });

  describe('giveBirthdayBonus', () => {
    it('should give birthday bonus', async () => {
      loyaltyRepo.findOne.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);
      transactionRepo.create.mockReturnValue(mockTransaction as LoyaltyTransaction);
      transactionRepo.save.mockResolvedValue(mockTransaction as LoyaltyTransaction);
      loyaltyRepo.save.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);

      const result = await service.giveBirthdayBonus(1);

      expect(result).toBeDefined();
      expect(transactionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          points: 200,
          reason: TransactionReason.BIRTHDAY_BONUS,
        }),
      );
    });
  });

  describe('giveReferralBonus', () => {
    it('should give referral bonus', async () => {
      loyaltyRepo.findOne.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);
      transactionRepo.create.mockReturnValue(mockTransaction as LoyaltyTransaction);
      transactionRepo.save.mockResolvedValue(mockTransaction as LoyaltyTransaction);
      loyaltyRepo.save.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);

      const result = await service.giveReferralBonus(1, 2);

      expect(result).toBeDefined();
      expect(transactionRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          points: 150,
          reason: TransactionReason.REFERRAL_BONUS,
        }),
      );
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard', async () => {
      loyaltyRepo.find.mockResolvedValue([
        { ...mockLoyaltyProgram, userId: 1, totalPoints: 1000 },
        { ...mockLoyaltyProgram, id: 2, userId: 2, totalPoints: 800 },
      ] as LoyaltyProgram[]);
      userRepo.findOne.mockResolvedValue(mockUser as User);

      const result = await service.getLeaderboard(10);

      expect(result).toHaveLength(2);
      expect(result[0].position).toBe(1);
      expect(result[0].currentPoints).toBe(1000);
    });
  });

  describe('adjustPoints', () => {
    it('should adjust points (positive)', async () => {
      loyaltyRepo.findOne.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);
      transactionRepo.create.mockReturnValue(mockTransaction as LoyaltyTransaction);
      transactionRepo.save.mockResolvedValue(mockTransaction as LoyaltyTransaction);
      loyaltyRepo.save.mockResolvedValue({
        ...mockLoyaltyProgram,
        totalPoints: 600,
        availablePoints: 600,
      } as LoyaltyProgram);

      const result = await service.adjustPoints(1, 100, 'Admin adjustment');

      expect(result).toBeDefined();
      expect(loyaltyRepo.save).toHaveBeenCalled();
    });

    it('should adjust points (negative)', async () => {
      loyaltyRepo.findOne.mockResolvedValue(mockLoyaltyProgram as LoyaltyProgram);
      transactionRepo.create.mockReturnValue(mockTransaction as LoyaltyTransaction);
      transactionRepo.save.mockResolvedValue(mockTransaction as LoyaltyTransaction);
      loyaltyRepo.save.mockResolvedValue({
        ...mockLoyaltyProgram,
        totalPoints: 400,
        availablePoints: 400,
      } as LoyaltyProgram);

      const result = await service.adjustPoints(1, -100, 'Admin adjustment');

      expect(result).toBeDefined();
    });
  });

  describe('getTierUpgradeBonus', () => {
    it('should return correct bonus for each tier', () => {
      expect(service['getTierUpgradeBonus'](LoyaltyTier.BRONZE)).toBe(0);
      expect(service['getTierUpgradeBonus'](LoyaltyTier.SILVER)).toBe(100);
      expect(service['getTierUpgradeBonus'](LoyaltyTier.GOLD)).toBe(250);
      expect(service['getTierUpgradeBonus'](LoyaltyTier.PLATINUM)).toBe(500);
    });
  });

  describe('calculateExpirationDate', () => {
    it('should return date 2 years in future', () => {
      const result = service['calculateExpirationDate']();
      const expectedDate = new Date();
      expectedDate.setFullYear(expectedDate.getFullYear() + 2);

      expect(result.getFullYear()).toBe(expectedDate.getFullYear());
    });
  });
});
