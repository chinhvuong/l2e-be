"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCourseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_service_1 = require("./category.service");
const course_schema_1 = require("./schema/course.schema");
const mongodb_1 = require("mongodb");
const request_aprrove_schema_1 = require("./schema/request-aprrove.schema");
let AdminCourseService = class AdminCourseService {
    constructor(model, requestApproveModel, categoryService) {
        this.model = model;
        this.requestApproveModel = requestApproveModel;
        this.categoryService = categoryService;
    }
    findAll(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const match = {};
            if (data.query) {
                match.name = new RegExp(data.query, 'i');
            }
            if (data.category) {
                match.category = new mongodb_1.ObjectId(data.category);
            }
            const pagination = [];
            if (data.page !== undefined && data.limit !== undefined) {
                pagination.push({
                    $skip: data.limit * data.page,
                });
            }
            if (data.limit !== undefined) {
                pagination.push({
                    $limit: data.limit,
                });
            }
            const rs = yield this.model.aggregate([
                { $match: match },
                {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        data: pagination,
                    },
                },
            ]);
            return {
                total: ((_a = rs[0]) === null || _a === void 0 ? void 0 : _a.metadata[0]) ? (_b = rs[0]) === null || _b === void 0 ? void 0 : _b.metadata[0].total : 0,
                data: rs[0] ? rs[0].data : [],
            };
        });
    }
    findOneAndUpdate(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate(...args);
        });
    }
    findOne(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne(...args);
        });
    }
    resolveApproveRequest(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.requestApproveModel.findByIdAndUpdate({
                _id: new mongodb_1.ObjectId(id)
            }, data, {
                new: true
            });
            return rs;
        });
    }
    getApproveRequests(filter) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const match = {};
            if (filter.courseId) {
                match.courseId = new mongodb_1.ObjectId(filter.courseId);
            }
            if (filter.status) {
                match.status = filter.status;
            }
            const pagination = [];
            if (filter.page !== undefined && filter.limit !== undefined) {
                pagination.push({
                    $skip: filter.limit * filter.page,
                });
            }
            if (filter.limit !== undefined) {
                pagination.push({
                    $limit: filter.limit,
                });
            }
            const rs = yield this.requestApproveModel.aggregate([
                { $match: match },
                {
                    $lookup: {
                        from: "courses",
                        localField: "courseId",
                        foreignField: "_id",
                        as: "course"
                    }
                },
                {
                    $project: {
                        courseId: 1,
                        createdAt: 1,
                        status: 1,
                        course: { $arrayElemAt: ["$course", 0] }
                    }
                },
                {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        data: pagination,
                    },
                },
            ]);
            return {
                total: ((_a = rs[0]) === null || _a === void 0 ? void 0 : _a.metadata[0]) ? (_b = rs[0]) === null || _b === void 0 ? void 0 : _b.metadata[0].total : 0,
                data: rs[0] ? rs[0].data : [],
            };
        });
    }
    unApprovedCourses(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const match = {
                approved: false,
            };
            if (data.query) {
                match.name = new RegExp(data.query, 'i');
            }
            const pagination = [];
            if (data.page !== undefined && data.limit !== undefined) {
                pagination.push({
                    $skip: data.limit * data.page,
                });
            }
            if (data.limit !== undefined) {
                pagination.push({
                    $limit: data.limit,
                });
            }
            const rs = yield this.model.aggregate([
                { $match: match },
                {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        data: pagination,
                    },
                },
            ]);
            return {
                total: ((_a = rs[0]) === null || _a === void 0 ? void 0 : _a.metadata[0]) ? (_b = rs[0]) === null || _b === void 0 ? void 0 : _b.metadata[0].total : 0,
                data: rs[0] ? rs[0].data : [],
            };
        });
    }
    toggleApproveCourse(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.model.findOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (!course) {
                throw new common_1.NotFoundException();
            }
            course.approved = !course.approved;
            return yield course.save();
        });
    }
};
AdminCourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __param(1, (0, mongoose_1.InjectModel)(request_aprrove_schema_1.RequestApprove.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        category_service_1.CategoryService])
], AdminCourseService);
exports.AdminCourseService = AdminCourseService;
//# sourceMappingURL=admin-course.service.js.map