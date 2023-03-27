import { chatRoomType } from '@prisma/client';
export class ChatRoomDto {
    name?: string;
    image?: string;
    type?: chatRoomType;
    password?: string;
    chatRoomUser: string[];
}