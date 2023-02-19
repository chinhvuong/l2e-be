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
import { Model } from 'mongoose';
import { CategoryService } from './category.service';
import { Course, CourseDocument } from './schema/course.schema';
import { CourseFindAllDto } from './dto/course-find-all.dto';
import { RequestApprove, RequestApproveDocument } from './schema/request-aprrove.schema';
import { ApproveFindAllDto } from './dto/approve-request-find-all.dto';
import { ResolveApproveRequestDto } from './dto/resolve-approve-request.dto';
export declare class AdminCourseService {
    private model;
    private requestApproveModel;
    private readonly categoryService;
    constructor(model: Model<CourseDocument>, requestApproveModel: Model<RequestApproveDocument>, categoryService: CategoryService);
    findAll(data: CourseFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    findOneAndUpdate(...args: any[]): Promise<(Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    findOne(...args: any[]): Promise<(Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    resolveApproveRequest(id: string, data: ResolveApproveRequestDto): Promise<(RequestApprove & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    getApproveRequests(filter: ApproveFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    unApprovedCourses(data: CourseFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    toggleApproveCourse(id: string): Promise<Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
