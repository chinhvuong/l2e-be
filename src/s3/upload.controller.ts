import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { CurrentUser } from '@/common/helpers/user.decorator';
import { User, UserDocument } from '@/user/schema/user.schema';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
export const uploadFile =
  (fileName = 'file'): MethodDecorator =>
  (target: any, propertyKey, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    })(target, propertyKey, descriptor);
  };

export const uploadMulti =
  (fileName = 'files'): MethodDecorator =>
  (target: any, propertyKey, descriptor: PropertyDescriptor) => {
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fileName]: {
            type: 'array',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    })(target, propertyKey, descriptor);
  };

@ApiTags('Upload File')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload-one')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        if (!file) {
          return cb(new Error('File is required'), false);
        }
        cb(null, true);
      },
    }),
  )
  @uploadFile('file')
  async uploadOneFile(
    @CurrentUser() user: UserDocument,
    @UploadedFile() file: any,
  ) {
    const uploadRs = await this.uploadService.uploadOneFile(file, user);
    return {
      url: uploadRs.Location,
    };
  }

  @Post('upload-multi')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @uploadMulti('files')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultiFile(
    @CurrentUser() user: UserDocument,
    @UploadedFiles() files: File[],
  ) {
    if (!files || files.length <= 0) {
      throw new HttpException('Files is require', HttpStatus.BAD_REQUEST);
    }
    return await this.uploadService.uploadMultiFile(files, user);
  }
}
