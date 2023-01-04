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
exports.QuestionService = void 0;
const course_service_1 = require("../course/course.service");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const question_schema_1 = require("./schema/question.schema");
const mongodb_1 = require("mongodb");
let QuestionService = class QuestionService {
    constructor(model, courseService) {
        this.model = model;
        this.courseService = courseService;
    }
    findOneBy(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne(...args).exec();
        });
    }
    createQuestion(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.courseService.validateOwner(data.courseId, user.walletAddress);
            return yield new this.model(Object.assign(Object.assign({}, data), { courseId: course._id })).save();
        });
    }
    createListQuestions(user, data) {
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
    updateQuestion(user, data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield this.model.findOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (!question) {
                throw new common_1.HttpException('Question does not exist', common_1.HttpStatus.BAD_REQUEST);
            }
            yield this.courseService.validateOwner(id, user.walletAddress);
            return yield this.model.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(id),
            }, data, { new: true });
        });
    }
    find(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find(...args);
        });
    }
    manageGetQuestions(user, data) {
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
};
QuestionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(question_schema_1.Question.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        course_service_1.CourseService])
], QuestionService);
exports.QuestionService = QuestionService;
//# sourceMappingURL=question.service.js.map