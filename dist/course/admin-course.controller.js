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
exports.AdminCourseController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_decorator_1 = require("../common/helpers/user.decorator");
const jwt_auth_guard_1 = require("../auth/strategies/jwt-auth.guard");
const course_find_all_dto_1 = require("./dto/course-find-all.dto");
const approve_request_find_all_dto_1 = require("./dto/approve-request-find-all.dto");
const supper_admin_guard_1 = require("../auth/strategies/supper-admin.guard");
const course_id_dto_1 = require("./dto/course-id.dto");
const admin_course_service_1 = require("./admin-course.service");
const mongo_id_dto_1 = require("../common/dto/mongo-id.dto");
const resolve_approve_request_dto_1 = require("./dto/resolve-approve-request.dto");
let AdminCourseController = class AdminCourseController {
    constructor(courseService) {
        this.courseService = courseService;
    }
    getList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('🚀 ~ file: admin-course.controller.ts:34 ~ AdminCourseController ~ getList ~ query', query);
            return yield this.courseService.findAll(query);
        });
    }
    getApproveRequests(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseService.getApproveRequests(query);
        });
    }
    resolveApproveRequest({ id }, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.courseService.resolveApproveRequest(id, data);
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
        return __awaiter(this, void 0, void 0, function* () {
            return this.courseService.toggleApproveCourse(id);
        });
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, supper_admin_guard_1.SupperAdmin),
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_find_all_dto_1.CourseFindAllDto]),
    __metadata("design:returntype", Promise)
], AdminCourseController.prototype, "getList", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, supper_admin_guard_1.SupperAdmin),
    (0, common_1.Get)('approve-requests'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [approve_request_find_all_dto_1.ApproveFindAllDto]),
    __metadata("design:returntype", Promise)
], AdminCourseController.prototype, "getApproveRequests", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, supper_admin_guard_1.SupperAdmin),
    (0, common_1.Put)('approve-requests/resolve/:id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongo_id_dto_1.MongoIdDto,
        resolve_approve_request_dto_1.ResolveApproveRequestDto]),
    __metadata("design:returntype", Promise)
], AdminCourseController.prototype, "resolveApproveRequest", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, supper_admin_guard_1.SupperAdmin),
    (0, common_1.Get)('unapproved-courses'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_find_all_dto_1.CourseFindAllDto, Object]),
    __metadata("design:returntype", Promise)
], AdminCourseController.prototype, "unApproveCourses", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, supper_admin_guard_1.SupperAdmin),
    (0, common_1.Put)('toggle-approve-course'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [course_id_dto_1.CourseIdDto, Object]),
    __metadata("design:returntype", Promise)
], AdminCourseController.prototype, "approveCourse", null);
AdminCourseController = __decorate([
    (0, swagger_1.ApiTags)('course-admin'),
    (0, common_1.Controller)('admin-course'),
    __metadata("design:paramtypes", [admin_course_service_1.AdminCourseService])
], AdminCourseController);
exports.AdminCourseController = AdminCourseController;
//# sourceMappingURL=admin-course.controller.js.map