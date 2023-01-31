import { UserStatus } from '@prisma/client';

export interface Friend {
	id: number;
	friend_id: number;
	friend: UserDto;
}
export interface UserDto{
	id: number;
	login: string;
	first_name: string;
	last_name: string;
	image: string;
	email: string;
}

export interface UserPatchDto{
	id?: number;
	login?: string;
	first_name?: string;
	last_name?: string;
	image?: string;
	email?: string;
	created_at?: Date;
	last_login?: Date;
	status?: UserStatus;
	total_wins?: number;
	total_loses?: number;
	exp_level?: number;
	points?: number;
	two_fac_auth?: boolean;
	friends?: Friend[];
}