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

@Controller('/multer')
export class MulterController {
    constructor(private multerService: MulterService) {}

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
        @Param('target') target: string,
        @Req() request: any,
    ) {
        if (!(await this.multerService.checkTargetId(target, request.user.login))) {
            throw new NotFoundException('Target not found')
        }
        const userDir = `./uploads/${target}`
        this.multerService.updateTargetImageFile(userDir, file)
        const filePath = `${userDir}/${file.originalname}`
        const currentUri = `${request.protocol}://${request.get(
            'host',
        )}/api/multer/download/${target}/files/${file.originalname}`
        fs.writeFileSync(filePath, file.buffer)
        return { URI: currentUri }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/download/:target/files/:filename')
    async getFile(
        @Param('target') target: string,
        @Param('filename') filename: string,
        @Res() res: any,
        @Req() request: any,
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
