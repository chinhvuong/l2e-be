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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { UserDocument } from '@/user/schema/user.schema';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionIdDto } from '@/question/dto/question-id.dto';
import { QuestionFindAll } from './dto/question-find-all.dto';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    createQuestion(user: UserDocument, data: CreateQuestionDto): Promise<import("./schema/question.schema").Question & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createListQuestions(user: UserDocument, data: CreateQuestionDto[]): Promise<(Omit<import("mongoose").MergeType<import("./schema/question.schema").QuestionDocument, CreateQuestionDto>, keyof import("./schema/question.schema").Question | keyof import("mongoose").Document<any, any, any>> & import("./schema/question.schema").Question & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    updateQuestion(user: UserDocument, data: UpdateQuestionDto, { id }: QuestionIdDto): Promise<(import("./schema/question.schema").Question & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    manageGetQuestions(user: UserDocument, data: QuestionFindAll): Promise<{
        total: any;
        data: any;
    }>;
}
