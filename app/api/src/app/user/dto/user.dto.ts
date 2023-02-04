import { IsNotEmpty, IsString, IsEnum, IsOptional, IsArray, IsBoolean, ValidateNested } from 'class-validator';
import { UserStatus } from '@prisma/client';

export interface UserGetDto {
  id: number;
  login: string;
  email: string;
  status: UserStatus;
  first_name?: string;
  last_name?: string;
  created_at: Date;
  last_login: Date;
  image?: string;
  total_wins: number;
  total_loses: number;
  exp_level: number;
  points: number;
  two_fac_auth: boolean;
}

export class UserPatchDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
	
	@IsOptional()
	@IsBoolean()
  two_fac_auth?: boolean;
}
