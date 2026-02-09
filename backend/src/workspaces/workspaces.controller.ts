import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
@UseGuards(AuthGuard('jwt'))
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @Get()
  findAll(@Request() req) {
    return this.workspacesService.findAll(req.user.userId);
  }

  @Post()
  create(@Body() dto: any, @Request() req) {
    return this.workspacesService.create(dto, req.user.userId);
  }
}
