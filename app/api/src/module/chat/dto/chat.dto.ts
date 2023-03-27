import { chatRoomType } from '@prisma/client';
export class ChatRoomDto {
    id?: number;
    name?: string;
    image?: string;
    type?: chatRoomType;
    password?: string;
    chatRoomUser: string[];
}