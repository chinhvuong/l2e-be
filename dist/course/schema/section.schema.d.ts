import mongoose, { Document } from 'mongoose';
import { Course } from './course.schema';
export declare type SectionDocument = Section & Document;
export declare class Section {
    courseId: Course;
    name: string;
    description: string;
    order: number;
}
export declare const SectionSchema: mongoose.Schema<Section, mongoose.Model<Section, any, any, any, any>, {}, {}, {}, {}, "type", Section>;
