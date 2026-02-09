import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  findAll(@Query('projectId') projectId: string) {
    return this.tasksService.findAll(projectId);
  }

  @Get('search')
  search(
    @Query('q') query: string,
    @Query('workspaceId') workspaceId: string,
  ) {
    return this.tasksService.search(query, workspaceId);
  }

  @Post()
  create(@Body() dto: any, @Request() req) {
    return this.tasksService.create(dto, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.tasksService.delete(id);
  }
}
