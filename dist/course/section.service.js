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
exports.SectionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_service_1 = require("./course.service");
const section_schema_1 = require("./schema/section.schema");
const mongodb_1 = require("mongodb");
let SectionService = class SectionService {
    constructor(model, courseService) {
        this.model = model;
        this.courseService = courseService;
    }
    manageGetSections(user, data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.courseService.validateOwner(data.courseId, user.walletAddress);
            const match = {
                courseId: new mongodb_1.ObjectId(data.courseId),
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
                { $sort: { order: 1 } },
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
    findOne(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne(...args);
        });
    }
    createSection(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseService.validateOwner(data.courseId, user.walletAddress);
            return yield new this.model(Object.assign(Object.assign({}, data), { courseId: course._id })).save();
        });
    }
    createListSections(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.length) {
                throw new common_1.HttpException('Data is empty', common_1.HttpStatus.BAD_REQUEST);
            }
            const course = yield this.courseService.validateOwner(data[0].courseId, user.walletAddress);
            data = data.map((item) => {
                item.courseId = course._id;
                return item;
            });
            return yield this.model.insertMany(data);
        });
    }
    updateSection(user, data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const section = yield this.model.findOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (!section) {
                throw new common_1.HttpException('Section does not exist', common_1.HttpStatus.BAD_REQUEST);
            }
            yield this.courseService.validateOwner(id, user.walletAddress);
            return yield this.model.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(id),
            }, data, { new: true });
        });
    }
    upsertListSections(user, data, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseService.validateOwner(courseId, user.walletAddress);
            const rs = yield Promise.all(data.map((section, index) => {
                if (section._id) {
                    const filter = {
                        _id: new mongodb_1.ObjectId(section._id),
                        courseId: course._id,
                    };
                    return this.model.findOneAndUpdate(filter, {
                        name: section.name,
                        description: section.description,
                        order: index,
                    }, {
                        new: true,
                    });
                }
                else {
                    return new this.model(Object.assign(Object.assign({}, section), { order: index, courseId: course._id })).save();
                }
            }));
            yield this.model.deleteMany({
                courseId: course._id,
                _id: { $nin: rs.map((item) => item === null || item === void 0 ? void 0 : item._id) },
            });
            return rs;
        });
    }
    getSectionOrThrowError(sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const section = yield this.model.findOne({
                _id: new mongodb_1.ObjectId(sectionId),
            });
            if (!section) {
                throw new common_1.HttpException('Course does not exist', common_1.HttpStatus.BAD_REQUEST);
            }
            return section;
        });
    }
};
SectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(section_schema_1.Section.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        course_service_1.CourseService])
], SectionService);
exports.SectionService = SectionService;
//# sourceMappingURL=section.service.js.map