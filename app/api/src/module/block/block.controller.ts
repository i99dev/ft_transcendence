import { Controller, Delete, Get, Param, Post, Req, UseGuards, HttpStatus } from '@nestjs/common'
import { BlockService } from './block.service'
import { JwtAuthGuard } from '@common/guards/jwt.guard'
import { ParseStringPipe } from '@common/pipes/string.pipe'

@Controller('/block')
export class BlockController {
    constructor(private blockService: BlockService) {}

    @UseGuards(JwtAuthGuard)
    @Get('/list/me')
    async getBlockList(@Req() req) {
        return await this.blockService.getBlockList(req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Post('/:login')
    async checkBlock(@Req() req, @Param('login', ParseStringPipe) login: string) {
        const blocked = await this.blockService.autoBlock(req.user.login, login)
        if (blocked) return { statusCode: HttpStatus.CREATED, data: blocked }
        return { statusCode: HttpStatus.OK, message: 'Blocking Failed' }
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:login')
    async deleteBlock(@Req() req, @Param('login', ParseStringPipe) login: string) {
        const unblocked = await this.blockService.autoUnblock(req.user.login, login)
        if (unblocked) return { statusCode: HttpStatus.CREATED, data: unblocked }
        return { statusCode: HttpStatus.OK, message: 'Unblocking Failed' }
    }
}
