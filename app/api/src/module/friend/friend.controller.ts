import { FriendService } from './friend.service'
import { Controller } from '@nestjs/common'

@Controller('/api/users')
export class FriendController {
    constructor(private readonly FriendService: FriendService) {}
}
