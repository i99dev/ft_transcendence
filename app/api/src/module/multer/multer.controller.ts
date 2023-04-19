import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { MulterService } from "./multer.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('/multer')
export class MulterController {
    constructor(private multerService: MulterService) {}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
      console.log(file);
    }
}