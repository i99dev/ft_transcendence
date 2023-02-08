import { IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UserGetDto {
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
  friend_to?: UserGetDto[];
  friends?: UserGetDto[];
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

  @IsOptional()
  @IsBoolean()
  total_loses?: boolean;

  @IsOptional()
  @IsBoolean()
  total_wins?: boolean;

  @IsOptional()
  @IsBoolean()
  friends?: string;
}
