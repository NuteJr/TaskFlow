import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'Password (min 6 characters)', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  lastName: string;
}

export class LoginDto {
  @ApiProperty({ example: 'demo@taskflow.app', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'demo123', description: 'User password' })
  @IsString()
  password: string;
}

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  token: string;

  @ApiProperty({
    example: {
      id: 'uuid',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'member',
    },
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}
