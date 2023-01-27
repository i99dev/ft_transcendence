import { UserStatus } from '@prisma/client';

export interface UserDto{
    id: number;
    username: string;
    fullname: string;
    avatar: string;
    email: string;
}

export interface UserPatchDto{
    id?: number;
    username?: string;
    fullname?: string;
    avatar?: string;
    email?: string;
    createdAt?: Date;
    lastLogin?: Date;
    status?: UserStatus;
}