import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(workspaceId: string, userId: string) {
    return this.prisma.project.findMany({
      where: {
        workspaceId,
        OR: [
          { visibility: { in: ['public', 'workspace'] } },
          {
            members: {
              some: { userId },
            },
          },
        ],
      },
      include: {
        columns: { orderBy: { order: 'asc' } },
        _count: { select: { tasks: true, members: true } },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        OR: [
          { visibility: 'public' },
          {
            workspace: {
              members: { some: { userId } },
            },
          },
        ],
      },
      include: {
        columns: { orderBy: { order: 'asc' } },
      },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async create(dto: any, userId: string) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        workspaceId: dto.workspaceId,
        ownerId: userId,
        members: {
          create: { userId, role: 'manager' },
        },
        columns: {
          create: [
            { name: 'Backlog', color: 'gray', order: 0 },
            { name: 'To Do', color: 'blue', order: 1 },
            { name: 'In Progress', color: 'yellow', order: 2 },
            { name: 'Done', color: 'green', order: 3 },
          ],
        },
      },
      include: {
        columns: true,
      },
    });
  }
}
