import mongoose, { Document } from 'mongoose';
import { ApproveRequestStatus } from '../enum';
import { Course } from './course.schema';
export declare type RequestApproveDocument = RequestApprove & Document;
export declare class RequestApprove {
    courseId: Course;
    notes: string[];
    status: ApproveRequestStatus;
    lastRequestAt: Date;
}
export declare const RequestApproveSchema: mongoose.Schema<RequestApprove, mongoose.Model<RequestApprove, any, any, any, any>, {}, {}, {}, {}, "type", RequestApprove>;
