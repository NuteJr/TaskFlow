import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.workspace.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        _count: {
          select: { members: true, projects: true },
        },
      },
    });
  }

  async create(dto: any, userId: string) {
    const slug = dto.name.toLowerCase().replace(/\s+/g, '-');
    
    return this.prisma.workspace.create({
      data: {
        name: dto.name,
        slug,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'owner',
          },
        },
      },
    });
  }
}
