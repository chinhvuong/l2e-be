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
import { CategoryFindAllDto } from './dto/category-find-all.dto';
import { Category, CategoryDocument } from './schema/category.schema';
export declare class CategoryService {
    private model;
    constructor(model: Model<CategoryDocument>);
    seedingCategory(data: Partial<CategoryDocument>[]): Promise<"Categories exist already!" | (Omit<import("mongoose").MergeType<CategoryDocument, Partial<CategoryDocument>>, keyof Category | keyof import("mongoose").Document<any, any, any>> & Category & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findAll(data: CategoryFindAllDto): Promise<{
        total: any;
        data: any;
    }>;
    ownCourses(data: CategoryFindAllDto, ownerAddress: string): Promise<{
        total: any;
        data: any;
    }>;
    findOne(...args: any[]): Promise<(Category & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
}
