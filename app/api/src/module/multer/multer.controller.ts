import {
    Controller,
    HttpStatus,
    ParseFilePipeBuilder,
    Post,
    UploadedFile,
    UseInterceptors,
    Param,
    Res,
    NotFoundException,
    Get,
    Req,
    UseGuards,
} from '@nestjs/common'
import { MulterService } from './multer.service'
import { FileInterceptor } from '@nestjs/platform-express'
import * as fs from 'fs'
import { JwtAuthGuard } from '@common/guards/jwt.guard'
import { ConfigService } from '@nestjs/config'
import { ParseStringPipe } from '@common/pipes/string.pipe'

@Controller('/multer')
export class MulterController {
    constructor(private multerService: MulterService, private configService: ConfigService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/upload/:target')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({ fileType: 'jpeg|jpg|png' })
                .addMaxSizeValidator({ maxSize: 2000000 })
                .build({ errorHttpStatusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE }),
        )
        file: Express.Multer.File,
        @Param('target', ParseStringPipe) target: string,
        @Req() request: any,
    ) {
        if (!(await this.multerService.checkTargetId(target, request.user.login))) {
            throw new NotFoundException('Target not found')
        }
        const userDir = `./uploads/${target}`
        this.multerService.createAndDeleteExtraFiles(userDir)
        const filePath = `${userDir}/${file.originalname}`
        const currentUri = `${this.configService.get<string>(
            'server.protocol',
        )}://${this.configService.get<string>('server.ip')}/api/multer/download/${target}/files/${
            file.originalname
        }`
        if (!(await this.multerService.updateTargetAvatar(target, currentUri)))
            throw new NotFoundException('updating failed')
        fs.writeFileSync(filePath, file.buffer)
        return { file_url: currentUri }
    }

    @Get('/download/:target/files/:filename')
    async getFile(
        @Param('target', ParseStringPipe) target: string,
        @Param('filename', ParseStringPipe) filename: string,
        @Res() res: any,
    ) {
        const userDir = `./uploads/${target}`
        const filePath = `${userDir}/${filename}`
        if (fs.existsSync(filePath)) {
            res.sendFile(filename, { root: userDir })
        } else {
            throw new NotFoundException('File not found')
        }
    }
}
