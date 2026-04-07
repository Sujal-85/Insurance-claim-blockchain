import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClaimDto {
  @IsString()
  @IsNotEmpty()
  policyId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  incidentType: string;

  @IsString()
  @IsNotEmpty()
  incidentDate: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  blockchainTxHash?: string;
}
