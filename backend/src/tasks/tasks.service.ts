import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { order: 'asc' },
      include: {
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async search(query: string, workspaceId: string) {
    return this.prisma.task.findMany({
      where: {
        workspaceId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: any, userId: string) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        workspaceId: dto.workspaceId,
        columnId: dto.columnId,
        priority: dto.priority || 'medium',
        status: dto.status || 'todo',
        createdById: userId,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      },
    });
  }

  async update(id: string, dto: any) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
