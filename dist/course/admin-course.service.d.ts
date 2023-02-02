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
