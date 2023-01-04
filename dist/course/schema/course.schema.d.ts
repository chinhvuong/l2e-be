import { language } from '@/course/enum';
import { Document } from 'mongoose';
import { Category } from './category.schema';
import * as mongoose from 'mongoose';
export declare type CourseDocument = Course & Document;
export declare class Course {
    courseId: number;
    owner: string;
    author: string;
    name: string;
    overview: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    students: number;
    language: language;
    approved: boolean;
    requirements: string[];
    goals: string[];
    thumbnail: string;
    category: Category;
    include: Record<any, any>;
}
export declare const CourseSchema: mongoose.Schema<Course, mongoose.Model<Course, any, any, any, any>, {}, {}, {}, {}, "type", Course>;
