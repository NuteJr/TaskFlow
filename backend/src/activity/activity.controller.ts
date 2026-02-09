import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ActivityService } from './activity.service';

@Controller('activity')
@UseGuards(AuthGuard('jwt'))
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get()
  async getActivities(
    @Query('workspaceId') workspaceId: string,
    @Query('limit') limit: string,
  ) {
    return this.activityService.getRecentActivities(
      workspaceId,
      parseInt(limit) || 20,
    );
  }

  @Get('stats')
  async getStats(@Query('workspaceId') workspaceId: string) {
    return this.activityService.getWorkspaceStats(workspaceId);
  }
}
