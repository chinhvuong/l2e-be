/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { CourseService } from '@/course/course.service';
import { UserDocument } from '@/user/schema/user.schema';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question, QuestionDocument } from './schema/question.schema';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionFindAll } from './dto/question-find-all.dto';
export declare class QuestionService {
    private model;
    private readonly courseService;
    constructor(model: Model<QuestionDocument>, courseService: CourseService);
    findOneBy(...args: any[]): Promise<(Question & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    createQuestion(user: UserDocument, data: CreateQuestionDto): Promise<Question & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createListQuestions(user: UserDocument, data: CreateQuestionDto[]): Promise<(Omit<import("mongoose").MergeType<QuestionDocument, CreateQuestionDto>, keyof Question | keyof import("mongoose").Document<any, any, any>> & Question & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    updateQuestion(user: UserDocument, data: UpdateQuestionDto, id: string): Promise<(Question & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    find(...args: any[]): Promise<(Question & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    manageGetQuestions(user: UserDocument, data: QuestionFindAll): Promise<{
        total: any;
        data: any;
    }>;
}
