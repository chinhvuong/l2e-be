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
exports.CourseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_service_1 = require("./category.service");
const course_schema_1 = require("./schema/course.schema");
const mongodb_1 = require("mongodb");
const enroll_schema_1 = require("./schema/enroll.schema.");
const user_service_1 = require("../user/user.service");
const web3_service_1 = require("../web3/web3.service");
const config_1 = require("@nestjs/config");
const request_aprrove_schema_1 = require("./schema/request-aprrove.schema");
const section_schema_1 = require("./schema/section.schema");
const enum_1 = require("./enum");
let CourseService = class CourseService {
    constructor(model, sectionModel, enrollModel, requestApproveModel, categoryService, userService, web3Service, configService) {
        this.model = model;
        this.sectionModel = sectionModel;
        this.enrollModel = enrollModel;
        this.requestApproveModel = requestApproveModel;
        this.categoryService = categoryService;
        this.userService = userService;
        this.web3Service = web3Service;
        this.configService = configService;
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
    createNewCourse(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.categoryService.findOne({
                    _id: new mongodb_1.ObjectId(data.category),
                });
                if (!category) {
                    throw new common_1.HttpException('Category does not exist', common_1.HttpStatus.BAD_REQUEST);
                }
                return yield new this.model(Object.assign(Object.assign({ owner: user.walletAddress, author: user.walletAddress }, data), { category: category._id })).save();
            }
            catch (error) {
                throw new common_1.HttpException(error === null || error === void 0 ? void 0 : error.message, common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    updateCourse(user, data, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield this.model.findOne({ _id: new mongodb_1.ObjectId(courseId) });
                if (!course) {
                    throw new common_1.HttpException('Course does not exist', common_1.HttpStatus.BAD_REQUEST);
                }
                if (course.owner.toLowerCase() !== user.walletAddress.toLowerCase()) {
                    throw new common_1.HttpException('Permission denied', common_1.HttpStatus.FORBIDDEN);
                }
                const rs = yield this.model.findOneAndUpdate({ _id: new mongodb_1.ObjectId(courseId) }, data, { new: true });
                return rs;
            }
            catch (error) {
                throw new common_1.HttpException(error === null || error === void 0 ? void 0 : error.message, common_1.HttpStatus.BAD_REQUEST);
            }
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
    validateOwner(courseId, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.model.findOne({
                _id: new mongodb_1.ObjectId(courseId),
            });
            if (!course) {
                throw new common_1.HttpException('Course does not exist', common_1.HttpStatus.BAD_REQUEST);
            }
            if (course.owner.toLowerCase() !== owner.toLowerCase()) {
                throw new common_1.HttpException('Permission denied', common_1.HttpStatus.FORBIDDEN);
            }
            return course;
        });
    }
    ownCourses(data, ownerAddress) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const match = {
                owner: { $regex: new RegExp(ownerAddress, 'i') },
            };
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
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: 'walletAddress',
                        as: 'authors',
                    },
                },
                {
                    $lookup: {
                        from: 'ratings',
                        localField: '_id',
                        foreignField: 'courseId',
                        as: 'ratings',
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: '_category',
                    },
                },
                {
                    $project: {
                        name: 1,
                        courseId: 1,
                        rating: 1,
                        author: { $arrayElemAt: ['$authors', 0] },
                        category: { $arrayElemAt: ['$_category', 0] },
                        students: 1,
                        price: 1,
                        ratingCount: { $size: '$ratings' },
                        approved: 1,
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
    myEnrollCourses(data, userId) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            console.log('🚀 ~ file: course.service.ts:225 ~ CourseService ~ myEnrollCourses ~ userId', userId);
            const myEnrolls = yield this.enrollModel.find({
                userId: new mongodb_1.ObjectId(userId),
            });
            console.log('🚀 ~ file: course.service.ts:228 ~ CourseService ~ myEnrollCourses ~ myEnrolls', myEnrolls);
            if (myEnrolls.length === 0) {
                return {
                    total: 0,
                    data: [],
                };
            }
            const match = {
                _id: {
                    $in: myEnrolls.map((e) => e.courseId),
                },
            };
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
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: 'walletAddress',
                        as: 'authors',
                    },
                },
                {
                    $lookup: {
                        from: 'ratings',
                        localField: '_id',
                        foreignField: 'courseId',
                        as: 'ratings',
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: '_category',
                    },
                },
                {
                    $project: {
                        name: 1,
                        courseId: 1,
                        rating: 1,
                        author: { $arrayElemAt: ['$authors', 0] },
                        category: { $arrayElemAt: ['$_category', 0] },
                        students: 1,
                        price: 1,
                        ratingCount: { $size: '$ratings' },
                        approved: 1,
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
    requestApprove(data, user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.validateOwner(data.id, user.walletAddress);
            const existRequest = yield this.requestApproveModel.findOne({
                courseId: course._id,
                lastRequestAt: {
                    $gte: new Date(Date.now() -
                        Number(this.configService.get('REQUEST_APPROVE_GAP_TIME'))),
                },
            });
            if (existRequest) {
                throw new common_1.HttpException({
                    message: 'You have send a request before',
                    timeCanSendNewRequest: ((_a = existRequest['createdAt']) === null || _a === void 0 ? void 0 : _a.getTime()) +
                        Number(this.configService.get('REQUEST_APPROVE_GAP_TIME')),
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            return yield this.requestApproveModel.findOneAndUpdate({
                courseId: course._id,
            }, Object.assign(Object.assign({}, data), { courseId: course._id, lastRequestAt: new Date(), status: enum_1.ApproveRequestStatus.PENDING }), {
                upsert: true,
                new: true,
            });
        });
    }
    getMyPastRequest(user, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const match = {};
            if (filter.courseId) {
                match.courseId = new mongodb_1.ObjectId(filter.courseId);
            }
            else {
                const courses = yield this.model.find({ owner: { $regex: new RegExp(`${user.walletAddress}`, 'i') } }, { _id: 1 });
                match.courseId = { $in: courses.map((c) => c._id) };
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
        });
    }
    enrollCourse(student, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [course, user] = yield Promise.all([
                yield this.model.findOne({
                    courseId: courseId,
                }),
                yield this.userService.findOneOrCreate(student),
            ]);
            if (user && course) {
                course.students = course.students + 1;
                yield course.save();
                return yield new this.enrollModel({
                    courseId: course._id,
                    userId: user._id,
                }).save();
            }
        });
    }
    getSignatureToMintCourse(courseId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.validateOwner(courseId, user.walletAddress);
            if (course.courseId || isNaN(course.price) || course.approved === false) {
                throw new common_1.HttpException('No', common_1.HttpStatus.BAD_REQUEST);
            }
            console.log(Number(this.configService.get('USDT_DECIMAL')));
            const price = course.price * Math.pow(10, Number(this.configService.get('USDT_DECIMAL')));
            const signature = yield this.web3Service.signToCreateCourse(`${price}`, user.nonce, user.walletAddress);
            user.nonce = user.nonce + 1;
            yield user.save();
            return {
                price: `${price}`,
                v: signature.v,
                r: signature.r,
                s: signature.s,
                nonce: user.nonce - 1,
            };
        });
    }
    getCourseDetailToEdit(courseId, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            const course = yield this.validateOwner(courseId, owner);
            const sections = yield this.sectionModel.aggregate([
                {
                    $match: {
                        courseId: new mongodb_1.ObjectId(courseId),
                    },
                },
                {
                    $lookup: {
                        from: 'lessons',
                        localField: '_id',
                        foreignField: 'sectionId',
                        as: 'lessons',
                    },
                },
                {
                    $sort: {
                        order: 1,
                    },
                },
            ]);
            const requestApprove = yield this.requestApproveModel.findOne({
                courseId: course._id,
            });
            return Object.assign(Object.assign({}, course['_doc']), { lastApproveRequestAt: (requestApprove === null || requestApprove === void 0 ? void 0 : requestApprove.lastRequestAt) || null, sections });
        });
    }
    getCourseList(data) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const match = {
                approved: true,
                courseId: { $gte: 1 },
            };
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
            const sort = {};
            if ((_a = data === null || data === void 0 ? void 0 : data.sort) === null || _a === void 0 ? void 0 : _a.length) {
                for (let i = 0; i < ((_b = data === null || data === void 0 ? void 0 : data.sort) === null || _b === void 0 ? void 0 : _b.length); i++) {
                    const [attr, direction] = data.sort[i].split(':');
                    if (direction === '-1') {
                        sort[attr] = -1;
                    }
                    else {
                        sort[attr] = 1;
                    }
                }
            }
            else {
                sort.price = -1;
            }
            const rs = yield this.model.aggregate([
                { $match: match },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: 'walletAddress',
                        as: 'authors',
                    },
                },
                {
                    $lookup: {
                        from: 'ratings',
                        localField: '_id',
                        foreignField: 'courseId',
                        as: 'ratings',
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: '_category',
                    },
                },
                {
                    $project: {
                        name: 1,
                        courseId: 1,
                        rating: 1,
                        author: { $arrayElemAt: ['$authors', 0] },
                        category: { $arrayElemAt: ['$_category', 0] },
                        students: 1,
                        price: 1,
                        ratingCount: { $size: '$ratings' },
                    },
                },
                {
                    $sort: sort,
                },
                {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        data: pagination,
                    },
                },
            ]);
            return {
                total: ((_c = rs[0]) === null || _c === void 0 ? void 0 : _c.metadata[0]) ? (_d = rs[0]) === null || _d === void 0 ? void 0 : _d.metadata[0].total : 0,
                data: rs[0] ? rs[0].data : [],
            };
        });
    }
    getCoursePreview({ id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const match = {
                approved: true,
                courseId: { $gte: 1 },
                _id: new mongodb_1.ObjectId(id),
            };
            const [course] = yield this.model.aggregate([
                {
                    $match: match,
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: 'walletAddress',
                        as: 'authors',
                    },
                },
                {
                    $lookup: {
                        from: 'ratings',
                        localField: '_id',
                        foreignField: 'courseId',
                        as: 'ratings',
                    },
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'category',
                        foreignField: '_id',
                        as: '_category',
                    },
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        overview: 1,
                        courseId: 1,
                        rating: 1,
                        includes: 1,
                        goals: 1,
                        thumbnail: 1,
                        requirements: 1,
                        approved: 1,
                        reviews: 1,
                        include: 1,
                        author: { $arrayElemAt: ['$authors', 0] },
                        category: { $arrayElemAt: ['$_category', 0] },
                        students: 1,
                        price: 1,
                        ratingCount: { $size: '$ratings' },
                        sections: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    },
                },
            ]);
            const sections = yield this.sectionModel.aggregate([
                {
                    $match: {
                        courseId: new mongodb_1.ObjectId(id),
                    },
                },
                {
                    $lookup: {
                        from: 'lessons',
                        localField: '_id',
                        foreignField: 'sectionId',
                        as: 'lessons',
                    },
                },
                {
                    $project: {
                        name: 1,
                        description: 1,
                        order: 1,
                        lessons: {
                            name: 1,
                            description: 1,
                            mediaType: 1,
                        },
                    },
                },
                {
                    $sort: {
                        order: 1,
                    },
                },
            ]);
            course['sections'] = sections;
            return course;
        });
    }
    checkEnroll(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enroll = yield this.enrollModel.count({
                userId: new mongodb_1.ObjectId(userId),
                courseId: new mongodb_1.ObjectId(courseId),
            });
            return {
                enroll: enroll > 0,
            };
        });
    }
};
CourseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(course_schema_1.Course.name)),
    __param(1, (0, mongoose_1.InjectModel)(section_schema_1.Section.name)),
    __param(2, (0, mongoose_1.InjectModel)(enroll_schema_1.Enroll.name)),
    __param(3, (0, mongoose_1.InjectModel)(request_aprrove_schema_1.RequestApprove.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        category_service_1.CategoryService,
        user_service_1.UserService,
        web3_service_1.Web3Service,
        config_1.ConfigService])
], CourseService);
exports.CourseService = CourseService;
//# sourceMappingURL=course.service.js.map