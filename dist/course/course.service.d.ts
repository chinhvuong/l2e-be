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
import { User, UserDocument } from '@/user/schema/user.schema';
import { Model } from 'mongoose';
import { CategoryService } from './category.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course, CourseDocument } from './schema/course.schema';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseFindAllDto } from './dto/course-find-all.dto';
import { Enroll, EnrollDocument } from './schema/enroll.schema.';
import { UserService } from '@/user/user.service';
import { CourseIdDto } from './dto/course-id.dto';
import { Web3Service } from '@/web3/web3.service';
import { ConfigService } from '@nestjs/config';
import { RequestApprove, RequestApproveDocument } from './schema/request-aprrove.schema';
import { RequestApproveDto } from './dto/request-approve.dto';
import { ApproveFindAllDto } from './dto/approve-request-find-all.dto';
import { SectionDocument } from './schema/section.schema';
export declare class CourseService {
    private model;
    private sectionModel;
    private enrollModel;
    private requestApproveModel;
    private readonly categoryService;
    private readonly userService;
    private readonly web3Service;
    private readonly configService;
    constructor(model: Model<CourseDocument>, sectionModel: Model<SectionDocument>, enrollModel: Model<EnrollDocument>, requestApproveModel: Model<RequestApproveDocument>, categoryService: CategoryService, userService: UserService, web3Service: Web3Service, configService: ConfigService);
    findAll(data: CourseFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    createNewCourse(user: UserDocument, data: CreateCourseDto): Promise<Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateCourse(user: UserDocument, data: UpdateCourseDto, courseId: string): Promise<any>;
    findOneAndUpdate(...args: any[]): Promise<(Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    findOne(...args: any[]): Promise<(Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    validateOwner(courseId: string, owner: string): Promise<Course & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    ownCourses(data: CourseFindAllDto, ownerAddress: string): Promise<{
        total: any;
        data: any;
    }>;
    myEnrollCourses(data: CourseFindAllDto, userId: string): Promise<{
        total: any;
        data: any;
    }>;
    requestApprove(data: RequestApproveDto, user: User): Promise<RequestApprove & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMyPastRequest(user: User, filter: ApproveFindAllDto): Promise<void>;
    enrollCourse(student: string, courseId: number): Promise<(Enroll & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | undefined>;
    getSignatureToMintCourse(courseId: string, user: UserDocument): Promise<{
        price: string;
        v: number;
        r: string;
        s: string;
        nonce: number;
    }>;
    getCourseDetailToEdit(courseId: string, owner: string): Promise<any>;
    getCourseList(data: CourseFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    getCoursePreview({ id }: CourseIdDto): Promise<any>;
    checkEnroll(userId: string, courseId: string): Promise<{
        enroll: boolean;
    }>;
}
