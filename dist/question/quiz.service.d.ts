import { CourseService } from '@/course/course.service';
import { UserDocument } from '@/user/schema/user.schema';
import { Model } from 'mongoose';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuestionService } from './question.service';
import { Quiz, QuizDocument } from './schema/quiz.schema';
import { QuizFindAll } from './dto/quiz-find-all.dto';
export declare class QuizService {
    private model;
    private readonly courseService;
    private readonly questionService;
    constructor(model: Model<QuizDocument>, courseService: CourseService, questionService: QuestionService);
    findOneOrCreate(walletAddress: string): Promise<Quiz & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    findOneBy(...args: any[]): Promise<(Quiz & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    private validateListQuestions;
    createQuiz(user: UserDocument, data: CreateQuizDto): Promise<Quiz & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateQuiz(user: UserDocument, data: CreateQuizDto, id: string): Promise<(Quiz & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    manageGetQuizzes(user: UserDocument, data: QuizFindAll): Promise<{
        total: any;
        data: any;
    }>;
    find(...args: any[]): Promise<(Quiz & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
}
