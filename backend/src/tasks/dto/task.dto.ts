import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement login page', description: 'Task title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Add form validation and error handling', description: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'project-uuid', description: 'Project ID' })
  @IsString()
  projectId: string;

  @ApiProperty({ example: 'workspace-uuid', description: 'Workspace ID' })
  @IsString()
  workspaceId: string;

  @ApiPropertyOptional({ example: 'column-uuid', description: 'Column ID (for Kanban board)' })
  @IsOptional()
  @IsString()
  columnId?: string;

  @ApiPropertyOptional({ enum: Priority, default: Priority.MEDIUM })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority = Priority.MEDIUM;
}

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Updated title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'done', description: 'Task status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'column-uuid', description: 'New column for Kanban' })
  @IsOptional()
  @IsString()
  columnId?: string;

  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}

export class TaskResponseDto {
  @ApiProperty({ example: 'task-uuid' })
  id: string;

  @ApiProperty({ example: 'Implement login' })
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ['backlog', 'todo', 'in_progress', 'done'] })
  status: string;

  @ApiProperty({ enum: Priority })
  priority: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
