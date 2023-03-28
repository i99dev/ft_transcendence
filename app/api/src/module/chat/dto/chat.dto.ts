import { chatType } from '@prisma/client';
export class ChatRoomDto {
    id?: number;
    name?: string;
    image?: string;
    type?: chatType;
    password?: string;
    chatRoomUser: string[];
}