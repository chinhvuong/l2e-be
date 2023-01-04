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
import { LessonService } from './lesson.service';
import { LessonFindAllDto } from './dto/lesson-find-all.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonIdDto } from './dto/lesson-id.dto';
export declare class LessonController {
    private readonly lessonService;
    constructor(lessonService: LessonService);
    upsertSections(user: UserDocument, data: UpdateLessonDto[], { id }: LessonIdDto): Promise<((import("./schema/lesson.schema").Lesson & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null)[]>;
    createSection(user: UserDocument, data: CreateLessonDto): Promise<import("./schema/lesson.schema").Lesson & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createListLessons(user: UserDocument, data: CreateLessonDto[]): Promise<(Omit<import("mongoose").MergeType<import("./schema/lesson.schema").LessonDocument, CreateLessonDto>, keyof import("./schema/lesson.schema").Lesson | keyof import("mongoose").Document<any, any, any>> & import("./schema/lesson.schema").Lesson & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    manageGetLessons(user: UserDocument, query: LessonFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    updateLesson(user: UserDocument, data: UpdateLessonDto, { id }: LessonIdDto): Promise<(import("./schema/lesson.schema").Lesson & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
}
