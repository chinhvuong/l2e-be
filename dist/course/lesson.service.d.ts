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
import { UserDocument } from '@/user/schema/user.schema';
import { Model } from 'mongoose';
import { CourseService } from './course.service';
import { Lesson, LessonDocument } from './schema/lesson.schema';
import { LessonFindAllDto } from './dto/lesson-find-all.dto';
import { SectionService } from './section.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { QuizService } from '@/question/quiz.service';
export declare class LessonService {
    private model;
    private readonly courseService;
    private readonly sectionService;
    private quizService;
    constructor(model: Model<LessonDocument>, courseService: CourseService, sectionService: SectionService, quizService: QuizService);
    manageGetLessons(user: UserDocument, data: LessonFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    findOne(...args: any[]): Promise<(Lesson & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    private validateListQuestions;
    createLesson(user: UserDocument, data: CreateLessonDto): Promise<Lesson & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createListLessons(user: UserDocument, data: CreateLessonDto[]): Promise<(Omit<import("mongoose").MergeType<LessonDocument, CreateLessonDto>, keyof Lesson | keyof import("mongoose").Document<any, any, any>> & Lesson & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    updateLesson(user: UserDocument, data: UpdateLessonDto, id: string): Promise<(Lesson & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    upsertLessons(user: UserDocument, data: UpdateLessonDto[], sectionId: string): Promise<((Lesson & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null)[]>;
}
