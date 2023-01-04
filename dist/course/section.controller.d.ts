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
import { SectionService } from './section.service';
import { SectionFindAllDto } from './dto/section-find-all.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionIdDto } from './dto/section-id.dto';
import { CourseIdDto } from './dto/course-id.dto';
export declare class SectionController {
    private readonly sectionService;
    constructor(sectionService: SectionService);
    upsertSections(user: UserDocument, data: UpdateSectionDto[], { id }: CourseIdDto): Promise<((import("./schema/section.schema").Section & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null)[]>;
    createSection(user: UserDocument, data: CreateSectionDto): Promise<import("./schema/section.schema").Section & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    createListSections(user: UserDocument, data: CreateSectionDto[]): Promise<(Omit<import("mongoose").MergeType<import("./schema/section.schema").SectionDocument, CreateSectionDto>, keyof import("./schema/section.schema").Section | keyof import("mongoose").Document<any, any, any>> & import("./schema/section.schema").Section & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    manageGetSections(user: UserDocument, query: SectionFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    updateSection(user: UserDocument, data: UpdateSectionDto, { id }: SectionIdDto): Promise<(import("./schema/section.schema").Section & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
}
