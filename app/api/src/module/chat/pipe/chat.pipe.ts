import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { ChatRoomDto } from '../dto/chat.dto';

@Injectable()
export class ChatPostValidation implements PipeTransform<any> {
    createAssignValue(): ChatRoomDto {
        const vari: ChatRoomDto = {
            room_id: 'string',
            name: 'string',
            image: 'string',
            type: 'PUBLIC',
            password: 'string',
        }
        return vari
    }

    async transform(value: ChatRoomDto) {
        const chatRoom = new ChatRoomDto();
        Object.assign(chatRoom, this.createAssignValue());
        const chatPatchKeys = Object.keys(chatRoom);
        const valueKeys = Object.keys(value);
        for (const key of valueKeys) {
            if (!chatPatchKeys.includes(key)) {
                throw new BadRequestException(`Invalid field: ${key}`);
            }
            if (key === 'type' && value[key] !== 'PUBLIC' && value[key] !== 'PRIVATE' && value[key] !== 'PROTECTED') {
                throw new BadRequestException(`Invalid type value`);
            }
        }
        return value
    }
}