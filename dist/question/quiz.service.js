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
exports.QuizService = void 0;
const course_service_1 = require("../course/course.service");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongodb_1 = require("mongodb");
const question_service_1 = require("./question.service");
const quiz_schema_1 = require("./schema/quiz.schema");
let QuizService = class QuizService {
    constructor(model, courseService, questionService) {
        this.model = model;
        this.courseService = courseService;
        this.questionService = questionService;
    }
    findOneOrCreate(walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndUpdate({ walletAddress: walletAddress }, {}, { upsert: true, new: true });
        });
    }
    findOneBy(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne(...args).exec();
        });
    }
    validateListQuestions(questions, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const quests = yield this.questionService.find({
                courseId: new mongodb_1.ObjectId(courseId),
                _id: { $in: questions.map((item) => new mongodb_1.ObjectId(item)) },
            });
            if (quests.length < questions.length) {
                throw new common_1.HttpException('Invalid questions', common_1.HttpStatus.FORBIDDEN);
            }
            return quests.map((item) => item._id);
        });
    }
    createQuiz(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.courseService.validateOwner(data.courseId, user.walletAddress);
            const questionIds = yield this.validateListQuestions(data.questions, data.courseId);
            return yield new this.model({
                questions: questionIds,
                courseId: new mongodb_1.ObjectId(data.courseId),
            }).save();
        });
    }
    updateQuiz(user, data, id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const quiz = yield this.model.findOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (!quiz) {
                throw new common_1.HttpException('Quiz does not exist', common_1.HttpStatus.BAD_REQUEST);
            }
            const course = yield this.courseService.validateOwner((_a = quiz.courseId) === null || _a === void 0 ? void 0 : _a.toString(), user.walletAddress);
            const questionIds = yield this.validateListQuestions(data.questions, (_b = course._id) === null || _b === void 0 ? void 0 : _b.toString());
            return yield this.model.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(id),
            }, Object.assign(Object.assign({}, data), { questions: questionIds, courseId: course._id }), { new: true });
        });
    }
    manageGetQuizzes(user, data) {
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
                    $lookup: {
                        from: 'questions',
                        localField: 'questions',
                        foreignField: '_id',
                        as: 'questions',
                    },
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
    find(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find(...args);
        });
    }
};
QuizService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(quiz_schema_1.Quiz.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        course_service_1.CourseService,
        question_service_1.QuestionService])
], QuizService);
exports.QuizService = QuizService;
//# sourceMappingURL=quiz.service.js.map