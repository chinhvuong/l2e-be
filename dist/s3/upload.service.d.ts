import { UserDocument } from '@/user/schema/user.schema';
import { Model } from 'mongoose';
import { S3Service } from './s3.service';
import { MediaFileDocument } from './schema/file.schema';
export declare class UploadService {
    private readonly s3Service;
    private model;
    constructor(s3Service: S3Service, model: Model<MediaFileDocument>);
    uploadOneFile(file: File, user: UserDocument): Promise<import("aws-sdk/clients/s3").ManagedUpload.SendData>;
    uploadMultiFile(files: File[], user: UserDocument): Promise<{
        url: string;
    }[]>;
}
