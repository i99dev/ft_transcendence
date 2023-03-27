import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { ChatRoomDto } from '../dto/chat.dto';
import { validate } from 'class-validator'
import { object } from '@hapi/joi';

@Injectable()
export class ChatPostValidation implements PipeTransform<any> {
    createAssignValue(): ChatRoomDto {
        const vari: ChatRoomDto = {
            name: 'string',
            image: 'string',
            type: 'PUBLIC',
            password: 'string',
            chatRoomUser: ['string'],
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
            if (key === 'type' && value[key] !== 'PUBLIC' && value[key] !== 'PRIVATE') {
                throw new BadRequestException(`Invalid type value`);
            }
        }
    }
}