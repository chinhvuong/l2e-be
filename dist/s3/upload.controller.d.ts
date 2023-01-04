import { UserDocument } from '@/user/schema/user.schema';
import { UploadService } from './upload.service';
export declare const uploadFile: (fileName?: string) => MethodDecorator;
export declare const uploadMulti: (fileName?: string) => MethodDecorator;
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadOneFile(user: UserDocument, file: any): Promise<{
        url: string;
    }>;
    uploadMultiFile(user: UserDocument, files: File[]): Promise<{
        url: string;
    }[]>;
}
