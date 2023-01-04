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
import { CreateSectionDto } from './dto/create-section.dto';
import { SectionFindAllDto } from './dto/section-find-all.dto';
import { Section, SectionDocument } from './schema/section.schema';
import { UpdateSectionDto } from './dto/update-section.dto';
export declare class SectionService {
    private model;
    private readonly courseService;
    constructor(model: Model<SectionDocument>, courseService: CourseService);
    manageGetSections(user: UserDocument, data: SectionFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    findOne(...args: any[]): Promise<(Section & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    createSection(user: UserDocument, data: CreateSectionDto): Promise<Section & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createListSections(user: UserDocument, data: CreateSectionDto[]): Promise<(Omit<import("mongoose").MergeType<SectionDocument, CreateSectionDto>, keyof Section | keyof import("mongoose").Document<any, any, any>> & Section & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    updateSection(user: UserDocument, data: UpdateSectionDto, id: string): Promise<(Section & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    upsertListSections(user: UserDocument, data: UpdateSectionDto[], courseId: string): Promise<((Section & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null)[]>;
    getSectionOrThrowError(sectionId: string): Promise<Section & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
}
