import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { BlockService } from "./block.service";
import { JwtAuthGuard } from "@common/guards/jwt.guard";


@Controller("/block")
export class BlockController {

    constructor(private blockService: BlockService) {}

    // @UseGuards(JwtAuthGuard)
    @Get("/list/me")
    async getBlockList(@Req() req) {
        return await this.blockService.getBlockList('isaad')
        return await this.blockService.getBlockList(req.user.login)
    }

}