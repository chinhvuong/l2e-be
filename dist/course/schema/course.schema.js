"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseSchema = exports.Course = void 0;
const enum_1 = require("../enum");
const mongoose_1 = require("@nestjs/mongoose");
const category_schema_1 = require("./category.schema");
const mongoose = __importStar(require("mongoose"));
let Course = class Course {
};
__decorate([
    (0, mongoose_1.Prop)({ index: true, unique: true, sparse: true }),
    __metadata("design:type", Number)
], Course.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ nullable: false }),
    __metadata("design:type", String)
], Course.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ nullable: false }),
    __metadata("design:type", String)
], Course.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null, trim: true }),
    __metadata("design:type", String)
], Course.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], Course.prototype, "overview", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: '', trim: true }),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "reviews", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Course.prototype, "students", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: enum_1.language.EN }),
    __metadata("design:type", String)
], Course.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Course.prototype, "approved", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: [] }),
    __metadata("design:type", Array)
], Course.prototype, "requirements", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: [] }),
    __metadata("design:type", Array)
], Course.prototype, "goals", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Course.prototype, "thumbnail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Course.prototype, "promotionalVideo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }),
    __metadata("design:type", category_schema_1.Category)
], Course.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)((0, mongoose_1.raw)({
        duration: { type: String },
        resource: { type: String },
        assignments: { type: String },
        certificate: { type: String },
        lifetimeAccess: { type: String },
        device: { type: String },
        articles: { type: String },
        exercise: { type: String },
    })),
    __metadata("design:type", Object)
], Course.prototype, "include", void 0);
Course = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], Course);
exports.Course = Course;
exports.CourseSchema = mongoose_1.SchemaFactory.createForClass(Course);
//# sourceMappingURL=course.schema.js.map