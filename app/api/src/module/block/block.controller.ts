import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { BlockService } from "./block.service";
import { JwtAuthGuard } from "@common/guards/jwt.guard";


@Controller("/block")
export class BlockController {

    constructor(private blockService: BlockService) {}

    @UseGuards(JwtAuthGuard)
    @Get("/list/me")
    async getBlockList(@Req() req) {
        return await this.blockService.getBlockList(req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Post("/:login")
    async checkBlock(@Req() req, @Param('login') login: string) {
        const blocked = await this.blockService.autoBlock(req.user.login, login)
        if (blocked)
            return blocked
        return
    }

}