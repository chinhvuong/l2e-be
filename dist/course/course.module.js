"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseModule = void 0;
const question_module_1 = require("../question/question.module");
const user_module_1 = require("../user/user.module");
const web3_module_1 = require("../web3/web3.module");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_course_controller_1 = require("./admin-course.controller");
const admin_course_service_1 = require("./admin-course.service");
const category_controller_1 = require("./category.controller");
const category_service_1 = require("./category.service");
const course_controller_1 = require("./course.controller");
const course_service_1 = require("./course.service");
const lession_controller_1 = require("./lession.controller");
const lesson_service_1 = require("./lesson.service");
const category_schema_1 = require("./schema/category.schema");
const course_schema_1 = require("./schema/course.schema");
const enroll_schema_1 = require("./schema/enroll.schema.");
const lesson_schema_1 = require("./schema/lesson.schema");
const request_aprrove_schema_1 = require("./schema/request-aprrove.schema");
const section_schema_1 = require("./schema/section.schema");
const section_controller_1 = require("./section.controller");
const section_service_1 = require("./section.service");
let CourseModule = class CourseModule {
};
CourseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: course_schema_1.Course.name, schema: course_schema_1.CourseSchema },
                { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                { name: section_schema_1.Section.name, schema: section_schema_1.SectionSchema },
                { name: lesson_schema_1.Lesson.name, schema: lesson_schema_1.LessonSchema },
                { name: enroll_schema_1.Enroll.name, schema: enroll_schema_1.EnrollSchema },
                { name: request_aprrove_schema_1.RequestApprove.name, schema: request_aprrove_schema_1.RequestApproveSchema },
            ]),
            (0, common_1.forwardRef)(() => question_module_1.QuestionModule),
            user_module_1.UserModule,
            web3_module_1.Web3Module,
        ],
        controllers: [
            course_controller_1.CourseController,
            admin_course_controller_1.AdminCourseController,
            category_controller_1.CategoryController,
            section_controller_1.SectionController,
            lession_controller_1.LessonController,
        ],
        providers: [course_service_1.CourseService, category_service_1.CategoryService, section_service_1.SectionService, lesson_service_1.LessonService, admin_course_service_1.AdminCourseService],
        exports: [category_service_1.CategoryService, course_service_1.CourseService, section_service_1.SectionService, lesson_service_1.LessonService, admin_course_service_1.AdminCourseService],
    })
], CourseModule);
exports.CourseModule = CourseModule;
//# sourceMappingURL=course.module.js.map