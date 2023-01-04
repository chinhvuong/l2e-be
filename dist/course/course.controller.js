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
exports.CourseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_decorator_1 = require("../common/helpers/user.decorator");
const jwt_auth_guard_1 = require("../auth/strategies/jwt-auth.guard");
const course_service_1 = require("./course.service");
const create_course_dto_1 = require("./dto/create-course.dto");
const course_id_dto_1 = require("./dto/course-id.dto");
const update_course_dto_1 = require("./dto/update-course.dto");
const course_find_all_dto_1 = require("./dto/course-find-all.dto");
const request_approve_dto_1 = require("./dto/request-approve.dto");
const approve_request_find_all_dto_1 = require("./dto/approve-request-find-all.dto");
const supper_admin_guard_1 = require("../auth/strategies/supper-admin.guard");
let CourseController = class CourseController {
    constructor(courseService) {
        this.courseService = courseService;
    }
    findAll(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseService.getCourseList(data);
        });
    }
    createCourse(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseService.createNewCourse(user, data);
        });
    }
    checkEnrollStatus(user, { id }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseService.checkEnroll(user._id.toString(), id);
        });
    }
    coursePreview(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseService.getCoursePreview(data);
        });
    }
    myEnrollCourses(query, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseService.myEnrollCourses(query, user._id);
        });
    }
    updateCourse(user, data, { id }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseService.updateCourse(user, data, id);
        });
    }
    ownCourses(query, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseService.ownCourses(query, user.walletAddress);
        });
    }
    getMyPastApproveRequests(query, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseService.getMyPastRequest(user, query);
        });
    }
    getApproveRequests(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseService.getApproveRequests(query);
        });
    }
    courseDetailToEdit({ id }, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseService.getCourseDetailToEdit(id, user.walletAddress);
        });
    }
    requestApprove(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseService.requestApprove(data, user);
        });
    }
    unApproveCourses(query, user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (user.walletAddress.toLowerCase() ===
                ((_a = process.env.ADMIN_ADDRESS) === null || _a === void 0 ? void 0 : _a.toLowerCase())) {
                return this.courseService.unApprovedCourses(query);
            }
            else {
                throw new common_1.HttpException('Permission denied', common_1.HttpStatus.FORBIDDEN);
            }
        });
    }
    approveCourse({ id }, user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (user.walletAddress.toLowerCase() ===
                ((_a = process.env.ADMIN_ADDRESS) === null || _a === void 0 ? void 0 : _a.toLowerCase())) {
                return this.courseService.toggleApproveCourse(id);
            }
            else {
                throw new common_1.HttpException('Permission denied', common_1.HttpStatus.FORBIDDEN);
            }
        });
    }
    requestSignatureToMint({ id }, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseService.getSignatureToMintCourse(id, user);
        });
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_find_all_dto_1.CourseFindAllDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(''),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_course_dto_1.CreateCourseDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "createCourse", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('check-enroll/:id'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, course_id_dto_1.CourseIdDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "checkEnrollStatus", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('preview/:id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_id_dto_1.CourseIdDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "coursePreview", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('my/enroll-courses'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_find_all_dto_1.CourseFindAllDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "myEnrollCourses", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_course_dto_1.UpdateCourseDto,
        course_id_dto_1.CourseIdDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "updateCourse", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('manage/own-courses'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_find_all_dto_1.CourseFindAllDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "ownCourses", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, supper_admin_guard_1.SupperAdmin),
    (0, common_1.Get)('manage/my-approve-requests'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [approve_request_find_all_dto_1.ApproveFindAllDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getMyPastApproveRequests", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/approve-requests'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [approve_request_find_all_dto_1.ApproveFindAllDto]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "getApproveRequests", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('manage/own-courses/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_id_dto_1.CourseIdDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "courseDetailToEdit", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('manage/own-courses/send-approve-request'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_approve_dto_1.RequestApproveDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "requestApprove", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('admin/unapproved-courses'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_find_all_dto_1.CourseFindAllDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "unApproveCourses", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('admin/toggle-approve-course'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_id_dto_1.CourseIdDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "approveCourse", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('request-mint-signature'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_id_dto_1.CourseIdDto, Object]),
    __metadata("design:returntype", Promise)
], CourseController.prototype, "requestSignatureToMint", null);
CourseController = __decorate([
    (0, swagger_1.ApiTags)('course'),
    (0, common_1.Controller)('course'),
    __metadata("design:paramtypes", [course_service_1.CourseService])
], CourseController);
exports.CourseController = CourseController;
//# sourceMappingURL=course.controller.js.map