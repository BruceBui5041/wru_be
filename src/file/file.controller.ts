import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
  @Post('upload_image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@UploadedFile() file) {
    console.log(file);
  }
}
