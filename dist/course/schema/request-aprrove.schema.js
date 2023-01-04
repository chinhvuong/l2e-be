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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApproveSchema = exports.RequestApprove = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const enum_1 = require("../enum");
const course_schema_1 = require("./course.schema");
let RequestApprove = class RequestApprove {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Category' }),
    __metadata("design:type", course_schema_1.Course)
], RequestApprove.prototype, "courseId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: [] }),
    __metadata("design:type", Array)
], RequestApprove.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: enum_1.ApproveRequestStatus.PENDING }),
    __metadata("design:type", String)
], RequestApprove.prototype, "status", void 0);
RequestApprove = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
    })
], RequestApprove);
exports.RequestApprove = RequestApprove;
exports.RequestApproveSchema = mongoose_1.SchemaFactory.createForClass(RequestApprove);
//# sourceMappingURL=request-aprrove.schema.js.map