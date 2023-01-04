import mongoose, { Document } from 'mongoose';
export declare type QuestionDocument = Question & Document;
export declare class Question {
    courseId: string;
    question: string;
    medias: string[];
    choices: {
        content: string;
        media: string;
    }[];
    correctAnswer: number;
}
export declare const QuestionSchema: mongoose.Schema<Question, mongoose.Model<Question, any, any, any, any>, {}, {}, {}, {}, "type", Question>;
