import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'member',
      });

      const result = await service.register(dto);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(dto.email);
    });

    it('should throw ConflictException if email exists', async () => {
      const dto = {
        email: 'existing@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
      };

      mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: dto.email });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'Test123!',
      };

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: '1',
        email: dto.email,
        passwordHash: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        role: 'member',
      });

      const result = await service.login(dto);

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(dto.email);
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
