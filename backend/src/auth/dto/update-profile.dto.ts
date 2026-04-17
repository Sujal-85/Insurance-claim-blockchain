import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John Doe', description: 'The display name of the user', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '0x123...', description: 'The wallet address of the user', required: false })
  @IsString()
  @IsOptional()
  walletAddress?: string;

  @ApiProperty({ example: '+1234567890', description: 'The phone number of the user', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ example: '123 Main St', description: 'The address of the user', required: false })
  @IsString()
  @IsOptional()
  address?: string;
}
