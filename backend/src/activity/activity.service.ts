import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  private activities: any[] = [];

  constructor(private prisma: PrismaService) {}

  async logActivity(data: {
    type: string;
    userId: string;
    workspaceId: string;
    message: string;
    metadata?: any;
  }) {
    const activity = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    this.activities.unshift(activity);
    
    // Keep only last 100 activities
    if (this.activities.length > 100) {
      this.activities = this.activities.slice(0, 100);
    }

    return activity;
  }

  async getRecentActivities(workspaceId: string, limit: number = 20) {
    return this.activities
      .filter(a => a.workspaceId === workspaceId)
      .slice(0, limit);
  }

  async getWorkspaceStats(workspaceId: string) {
    const [
      totalTasks,
      completedTasks,
      totalProjects,
      totalMembers,
    ] = await Promise.all([
      this.prisma.task.count({
        where: { workspaceId },
      }),
      this.prisma.task.count({
        where: { workspaceId, status: 'done' },
      }),
      this.prisma.project.count({
        where: { workspaceId },
      }),
      this.prisma.workspaceMember.count({
        where: { workspaceId },
      }),
    ]);

    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    // Get tasks by priority
    const tasksByPriority = await this.prisma.task.groupBy({
      by: ['priority'],
      where: { workspaceId },
      _count: { id: true },
    });

    // Get tasks created per day (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const tasksPerDay = last7Days.map(date => ({
      date,
      count: this.activities.filter(
        a => a.type === 'task_created' && a.createdAt.startsWith(date)
      ).length,
    }));

    return {
      totalTasks,
      completedTasks,
      completionRate,
      totalProjects,
      totalMembers,
      tasksByPriority: tasksByPriority.map(t => ({
        priority: t.priority,
        count: t._count.id,
      })),
      tasksPerDay,
    };
  }
}
