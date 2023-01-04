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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LessonService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const course_service_1 = require("./course.service");
const mongodb_1 = require("mongodb");
const lesson_schema_1 = require("./schema/lesson.schema");
const section_service_1 = require("./section.service");
const quiz_service_1 = require("../question/quiz.service");
let LessonService = class LessonService {
    constructor(model, courseService, sectionService, quizService) {
        this.model = model;
        this.courseService = courseService;
        this.sectionService = sectionService;
        this.quizService = quizService;
    }
    manageGetLessons(user, data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const section = yield this.sectionService.getSectionOrThrowError(data.sectionId);
            yield this.courseService.validateOwner(section.courseId.toString(), user.walletAddress);
            const match = {
                sectionId: new mongodb_1.ObjectId(data.sectionId),
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
    validateListQuestions(questions, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const quests = yield this.quizService.find({
                courseId: new mongodb_1.ObjectId(courseId),
                _id: { $in: questions.map((item) => new mongodb_1.ObjectId(item)) },
            });
            if (quests.length < questions.length) {
                throw new common_1.HttpException('Invalid questions', common_1.HttpStatus.FORBIDDEN);
            }
            return quests.map((item) => item._id);
        });
    }
    createLesson(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const section = yield this.sectionService.getSectionOrThrowError(data.sectionId);
            yield this.courseService.validateOwner(section.courseId.toString(), user.walletAddress);
            return yield new this.model(Object.assign(Object.assign({}, data), { sectionId: section._id })).save();
        });
    }
    createListLessons(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.length) {
                throw new common_1.HttpException('Data is empty', common_1.HttpStatus.BAD_REQUEST);
            }
            const section = yield this.sectionService.getSectionOrThrowError(data[0].sectionId);
            yield this.courseService.validateOwner(section.courseId.toString(), user.walletAddress);
            data = data.map((item) => {
                item.sectionId = section._id;
                return item;
            });
            return yield this.model.insertMany(data);
        });
    }
    updateLesson(user, data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const section = yield this.model.findOne({
                _id: new mongodb_1.ObjectId(id),
            });
            if (!section) {
                throw new common_1.HttpException('Question does not exist', common_1.HttpStatus.BAD_REQUEST);
            }
            yield this.courseService.validateOwner(id, user.walletAddress);
            return yield this.model.findOneAndUpdate({
                _id: new mongodb_1.ObjectId(id),
            }, data, { new: true });
        });
    }
    upsertLessons(user, data, sectionId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.length) {
                throw new common_1.HttpException('Data is empty', common_1.HttpStatus.BAD_REQUEST);
            }
            const section = yield this.sectionService.getSectionOrThrowError(sectionId);
            yield this.courseService.validateOwner(section.courseId.toString(), user.walletAddress);
            const rs = yield Promise.all(data.map((lesson, index) => {
                if (lesson._id) {
                    const filter = {
                        _id: new mongodb_1.ObjectId(lesson._id),
                        sectionId: section._id,
                    };
                    const { _id } = lesson, data = __rest(lesson, ["_id"]);
                    return this.model.findOneAndUpdate(filter, Object.assign(Object.assign({}, data), { order: index }), {
                        new: true,
                    });
                }
                else {
                    return new this.model(Object.assign(Object.assign({}, lesson), { order: index, sectionId: section._id })).save();
                }
            }));
            yield this.model.deleteMany({
                sectionId: section._id,
                _id: { $nin: rs.map((item) => item === null || item === void 0 ? void 0 : item._id) },
            });
            return rs;
        });
    }
};
LessonService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(lesson_schema_1.Lesson.name)),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => quiz_service_1.QuizService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        course_service_1.CourseService,
        section_service_1.SectionService,
        quiz_service_1.QuizService])
], LessonService);
exports.LessonService = LessonService;
//# sourceMappingURL=lesson.service.js.map