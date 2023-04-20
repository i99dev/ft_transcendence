import { Injectable } from '@nestjs/common'
import { gameLogic } from '../logic/gameLogic'

@Injectable()
export class DefaultService {
    constructor(private socketService: SocketService) {}
}
