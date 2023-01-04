import { User } from '@/user/schema/user.schema';
import mongoose, { Document } from 'mongoose';
import { Course } from './course.schema';
export declare type EnrollDocument = Enroll & Document;
export declare class Enroll {
    courseId: Course;
    userId: User;
}
export declare const EnrollSchema: mongoose.Schema<Enroll, mongoose.Model<Enroll, any, any, any, any>, {}, {}, {}, {}, "type", Enroll>;
