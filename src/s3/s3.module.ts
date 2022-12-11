import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { S3Service } from './s3.service';
import { MediaFile, MediaFileSchema } from './schema/file.schema';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MediaFile.name, schema: MediaFileSchema },
    ]),
  ],
  providers: [S3Service, UploadService],
  exports: [S3Service, UploadService],
  controllers: [UploadController],
})
export class S3Module {}
