import { Quiz } from '@/question/schema/quiz.schema';
import mongoose, { Document } from 'mongoose';
import { lessonMode, mediaType } from '../enum';
import { Section } from './section.schema';
export declare type LessonDocument = Lesson & Document;
export declare class Lesson {
    sectionId: Section;
    name: string;
    description: string;
    media: string;
    mediaType: mediaType;
    quizzes: Quiz[];
    mode: lessonMode;
    order: number;
}
export declare const LessonSchema: mongoose.Schema<Lesson, mongoose.Model<Lesson, any, any, any, any>, {}, {}, {}, {}, "type", Lesson>;
