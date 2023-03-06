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
    updateCourse(user: UserDocument, data: UpdateCourseDto, { id }: CourseIdDto): Promise<{
        lastApproveRequestAt: Date;
        courseId?: number | undefined;
        owner?: string | undefined;
        author?: string | undefined;
        name?: string | undefined;
        overview?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        rating?: number | undefined;
        reviews?: number | undefined;
        students?: number | undefined;
        language?: import("./enum").language | undefined;
        approved?: boolean | undefined;
        requirements?: string[] | undefined;
        goals?: string[] | undefined;
        thumbnail?: string | undefined;
        promotionalVideo?: string | undefined;
        category?: import("./schema/category.schema").Category | undefined;
        include?: Record<any, any> | undefined;
        _id?: any;
        __v?: any;
        $locals?: Record<string, unknown> | undefined;
        $op?: "remove" | "validate" | "save" | null | undefined;
        $where?: Record<string, unknown> | undefined;
        baseModelName?: string | undefined;
        collection?: import("mongoose").Collection<import("bson").Document> | undefined;
        db?: import("mongoose").Connection | undefined;
        errors?: import("mongoose").Error.ValidationError | undefined;
        id?: any;
        isNew?: boolean | undefined;
        modelName?: string | undefined;
        schema?: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any>, {}, {}, {}, {}, "type", {
            [x: string]: any;
        }> | undefined;
    } | {
        lastApproveRequestAt: null;
        courseId?: number | undefined;
        owner?: string | undefined;
        author?: string | undefined;
        name?: string | undefined;
        overview?: string | undefined;
        description?: string | undefined;
        price?: number | undefined;
        rating?: number | undefined;
        reviews?: number | undefined;
        students?: number | undefined;
        language?: import("./enum").language | undefined;
        approved?: boolean | undefined;
        requirements?: string[] | undefined;
        goals?: string[] | undefined;
        thumbnail?: string | undefined;
        promotionalVideo?: string | undefined;
        category?: import("./schema/category.schema").Category | undefined;
        include?: Record<any, any> | undefined;
        _id?: any;
        __v?: any;
        $locals?: Record<string, unknown> | undefined;
        $op?: "remove" | "validate" | "save" | null | undefined;
        $where?: Record<string, unknown> | undefined;
        baseModelName?: string | undefined;
        collection?: import("mongoose").Collection<import("bson").Document> | undefined;
        db?: import("mongoose").Connection | undefined;
        errors?: import("mongoose").Error.ValidationError | undefined;
        id?: any;
        isNew?: boolean | undefined;
        modelName?: string | undefined;
        schema?: import("mongoose").Schema<any, import("mongoose").Model<any, any, any, any, any>, {}, {}, {}, {}, "type", {
            [x: string]: any;
        }> | undefined;
    }>;
    ownCourses(query: CourseFindAllDto, user: UserDocument): Promise<{
        total: any;
        data: any;
    }>;
    getMyPastApproveRequests(query: ApproveFindAllDto, user: UserDocument): Promise<void>;
    courseDetailToEdit({ id }: CourseIdDto, user: UserDocument): Promise<any>;
    requestApprove(data: RequestApproveDto, user: UserDocument): Promise<import("./schema/request-aprrove.schema").RequestApprove & import("mongoose").Document<any, any, any> & {
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
