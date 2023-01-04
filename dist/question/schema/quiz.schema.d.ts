import { Course } from '@/course/schema/course.schema';
import mongoose, { Document } from 'mongoose';
import { Question } from './question.schema';
export declare type QuizDocument = Quiz & Document;
export declare class Quiz {
    questions: Question[];
    courseId: Course;
    name: string;
}
export declare const QuizSchema: mongoose.Schema<Quiz, mongoose.Model<Quiz, any, any, any, any>, {}, {}, {}, {}, "type", Quiz>;
