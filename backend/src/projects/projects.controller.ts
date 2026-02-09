import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(AuthGuard('jwt'))
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get()
  findAll(@Query('workspaceId') workspaceId: string, @Request() req) {
    return this.projectsService.findAll(workspaceId, req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.projectsService.findOne(id, req.user.userId);
  }

  @Post()
  create(@Body() dto: any, @Request() req) {
    return this.projectsService.create(dto, req.user.userId);
  }
}
