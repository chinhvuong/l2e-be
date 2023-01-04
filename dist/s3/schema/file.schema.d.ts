import { User } from '@/user/schema/user.schema';
import mongoose, { Document } from 'mongoose';
export declare type MediaFileDocument = MediaFile & Document;
export declare class MediaFile {
    url: string;
    user: User;
    key: string;
}
export declare const MediaFileSchema: mongoose.Schema<MediaFile, mongoose.Model<MediaFile, any, any, any, any>, {}, {}, {}, {}, "type", MediaFile>;
