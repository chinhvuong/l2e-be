import { UserDocument } from '@/user/schema/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3Service } from './s3.service';
import { MediaFile, MediaFileDocument } from './schema/file.schema';

// const dotenv = require('dotenv');
// dotenv.config()

@Injectable()
export class UploadService {
  constructor(
    private readonly s3Service: S3Service,
    @InjectModel(MediaFile.name) private model: Model<MediaFileDocument>,
  ) {}

  async uploadOneFile(file: File, user: UserDocument) {
    const rs = await this.s3Service.uploadFile(file);

    if (rs.Key && rs.Location) {
      await new this.model({
        key: rs.Key,
        url: rs.Location,
        user: user,
      }).save();
    }
    return rs;
  }

  async uploadMultiFile(files: File[], user: UserDocument) {
    const rs = await Promise.all(
      files.map((item) => {
        return this.uploadOneFile(item, user);
      }),
    );
    return rs.map((item) => ({
      url: item.Location,
    }));
  }
}
