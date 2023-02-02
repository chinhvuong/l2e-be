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
