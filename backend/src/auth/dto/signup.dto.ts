import { IsEmail, IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class SignupDto {
  @ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'The display name of the user', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: Role, default: Role.USER, required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ example: '0x123...', description: 'The wallet address of the user', required: false })
  @IsString()
  @IsOptional()
  walletAddress?: string;

  @ApiProperty({ example: '+1234567890', description: 'The phone number of the user', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
