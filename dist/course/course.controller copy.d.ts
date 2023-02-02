import { UserDocument } from '@/user/schema/user.schema';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseIdDto } from './dto/course-id.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseFindAllDto } from './dto/course-find-all.dto';
import { RequestApproveDto } from './dto/request-approve.dto';
import { ApproveFindAllDto } from './dto/approve-request-find-all.dto';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    findAll(data: CourseFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    createCourse(user: UserDocument, data: CreateCourseDto): Promise<import("./schema/course.schema").Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    checkEnrollStatus(user: UserDocument, { id }: CourseIdDto): Promise<{
        enroll: boolean;
    }>;
    coursePreview(data: CourseIdDto): Promise<any>;
    myEnrollCourses(query: CourseFindAllDto, user: UserDocument): Promise<{
        total: any;
        data: any;
    }>;
    updateCourse(user: UserDocument, data: UpdateCourseDto, { id }: CourseIdDto): Promise<(import("./schema/course.schema").Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    ownCourses(query: CourseFindAllDto, user: UserDocument): Promise<{
        total: any;
        data: any;
    }>;
    getMyPastApproveRequests(query: ApproveFindAllDto, user: UserDocument): Promise<void>;
    getApproveRequests(query: ApproveFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    courseDetailToEdit({ id }: CourseIdDto, user: UserDocument): Promise<any>;
    requestApprove(data: RequestApproveDto, user: UserDocument): Promise<import("./schema/request-aprrove.schema").RequestApprove & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    unApproveCourses(query: CourseFindAllDto, user: UserDocument): Promise<{
        total: any;
        data: any;
    }>;
    approveCourse({ id }: CourseIdDto, user: UserDocument): Promise<import("./schema/course.schema").Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    requestSignatureToMint({ id }: CourseIdDto, user: UserDocument): Promise<{
        price: string;
        v: number;
        r: string;
        s: string;
        nonce: number;
    }>;
}
