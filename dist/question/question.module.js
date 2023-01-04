"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionModule = void 0;
const course_module_1 = require("../course/course.module");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const question_controller_1 = require("./question.controller");
const question_service_1 = require("./question.service");
const quiz_controller_1 = require("./quiz.controller");
const quiz_service_1 = require("./quiz.service");
const question_schema_1 = require("./schema/question.schema");
const quiz_schema_1 = require("./schema/quiz.schema");
let QuestionModule = class QuestionModule {
};
QuestionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: question_schema_1.Question.name, schema: question_schema_1.QuestionSchema },
                { name: quiz_schema_1.Quiz.name, schema: quiz_schema_1.QuizSchema },
            ]),
            (0, common_1.forwardRef)(() => course_module_1.CourseModule),
        ],
        providers: [question_service_1.QuestionService, quiz_service_1.QuizService],
        controllers: [question_controller_1.QuestionController, quiz_controller_1.QuizController],
        exports: [question_service_1.QuestionService, quiz_service_1.QuizService],
    })
], QuestionModule);
exports.QuestionModule = QuestionModule;
//# sourceMappingURL=question.module.js.map