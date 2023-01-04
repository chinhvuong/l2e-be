import { Course } from '@/course/schema/course.schema';
import { User } from '@/user/schema/user.schema';
import mongoose, { Document } from 'mongoose';
export declare type RatingDocument = Rating & Document;
export declare class Rating {
    user: User;
    courseId: Course;
    rating: number;
    comment: string;
}
export declare const RatingSchema: mongoose.Schema<Rating, mongoose.Model<Rating, any, any, any, any>, {}, {}, {}, {}, "type", Rating>;
