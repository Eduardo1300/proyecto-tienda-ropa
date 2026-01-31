import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: jest.Mocked<Repository<User>>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser: Partial<User> & { password?: string } = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockCompare = jest.fn().mockResolvedValue(true);
      (bcrypt.compare as jest.Mock).mockImplementation(mockCompare);
      userRepo.findOne.mockResolvedValue(mockUser as User);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(userRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockCompare).toHaveBeenCalledWith('password123', 'hashedPassword');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password');

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const mockCompare = jest.fn().mockResolvedValue(false);
      (bcrypt.compare as jest.Mock).mockImplementation(mockCompare);
      userRepo.findOne.mockResolvedValue(mockUser as User);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token when login is successful', async () => {
      const mockCompare = jest.fn().mockResolvedValue(true);
      (bcrypt.compare as jest.Mock).mockImplementation(mockCompare);
      userRepo.findOne.mockResolvedValue(mockUser as User);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      } as any);

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe('jwt-token');
      expect(jwtService.sign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: mockUser.id,
          email: mockUser.email,
        }),
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nonexistent@example.com', password: 'password' } as any),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create and return new user', async () => {
      userRepo.findOne.mockResolvedValue(null);
      const mockHash = jest.fn().mockResolvedValue('hashedPassword');
      (bcrypt.hash as jest.Mock).mockImplementation(mockHash);
      userRepo.create.mockReturnValue(mockUser as User);
      userRepo.save.mockResolvedValue(mockUser as User);
      jwtService.sign.mockReturnValue('jwt-token');

      const registerDto = {
        email: 'newuser@example.com',
        password: 'password123',
        username: 'newuser',
        firstName: 'New',
        lastName: 'User',
      };

      const result = await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(userRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'newuser@example.com',
          username: 'newuser',
        }),
      );
      expect(result).toHaveProperty('access_token');
    });

    it('should throw ConflictException when email already exists', async () => {
      userRepo.findOne.mockResolvedValue(mockUser as User);

      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
      };

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });
});
