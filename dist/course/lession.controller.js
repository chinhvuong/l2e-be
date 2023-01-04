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
exports.LessonController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_decorator_1 = require("../common/helpers/user.decorator");
const jwt_auth_guard_1 = require("../auth/strategies/jwt-auth.guard");
const lesson_service_1 = require("./lesson.service");
const lesson_find_all_dto_1 = require("./dto/lesson-find-all.dto");
const update_lesson_dto_1 = require("./dto/update-lesson.dto");
const create_lesson_dto_1 = require("./dto/create-lesson.dto");
const lesson_id_dto_1 = require("./dto/lesson-id.dto");
let LessonController = class LessonController {
    constructor(lessonService) {
        this.lessonService = lessonService;
    }
    upsertSections(user, data, { id }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lessonService.upsertLessons(user, data, id);
        });
    }
    createSection(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lessonService.createLesson(user, data);
        });
    }
    createListLessons(user, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lessonService.createListLessons(user, data);
        });
    }
    manageGetLessons(user, query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.lessonService.manageGetLessons(user, query);
        });
    }
    updateLesson(user, data, { id }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lessonService.updateLesson(user, data, id);
        });
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('upsert-lesions/:id'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array, lesson_id_dto_1.LessonIdDto]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "upsertSections", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_lesson_dto_1.CreateLessonDto]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "createSection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create-batch'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(new common_1.ParseArrayPipe({ items: create_lesson_dto_1.CreateLessonDto }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "createListLessons", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('manage/get-lessons'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lesson_find_all_dto_1.LessonFindAllDto]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "manageGetLessons", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)(':id'),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_lesson_dto_1.UpdateLessonDto,
        lesson_id_dto_1.LessonIdDto]),
    __metadata("design:returntype", Promise)
], LessonController.prototype, "updateLesson", null);
LessonController = __decorate([
    (0, swagger_1.ApiTags)('lesson'),
    (0, common_1.Controller)('lesson'),
    __metadata("design:paramtypes", [lesson_service_1.LessonService])
], LessonController);
exports.LessonController = LessonController;
//# sourceMappingURL=lession.controller.js.map