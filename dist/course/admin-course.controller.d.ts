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
import { CourseFindAllDto } from './dto/course-find-all.dto';
import { ApproveFindAllDto } from './dto/approve-request-find-all.dto';
import { CourseIdDto } from './dto/course-id.dto';
import { AdminCourseService } from './admin-course.service';
import { MongoIdDto } from '@/common/dto/mongo-id.dto';
import { ResolveApproveRequestDto } from './dto/resolve-approve-request.dto';
export declare class AdminCourseController {
    private readonly courseService;
    constructor(courseService: AdminCourseService);
    getList(query: CourseFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    getApproveRequests(query: ApproveFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    resolveApproveRequest({ id }: MongoIdDto, data: ResolveApproveRequestDto): Promise<(import("./schema/request-aprrove.schema").RequestApprove & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    unApproveCourses(query: CourseFindAllDto, user: UserDocument): Promise<{
        total: any;
        data: any;
    }>;
    approveCourse({ id }: CourseIdDto, user: UserDocument): Promise<import("./schema/course.schema").Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
