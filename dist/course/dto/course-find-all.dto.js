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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseFindAllDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var Sort;
(function (Sort) {
    Sort["PRICE_ASC"] = "price:1";
    Sort["RATING_ASC"] = "ratingCount:1";
    Sort["STUDENT_ASC"] = "students:1";
    Sort["PRICE_DESC"] = "price:-1";
    Sort["RATING_DESC"] = "ratingCount:-1";
    Sort["STUDENT_DESC"] = "students:-1";
})(Sort || (Sort = {}));
class CourseFindAllDto {
}
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        return parseInt(value);
    }),
    __metadata("design:type", Number)
], CourseFindAllDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'start from 0',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        return parseInt(value);
    }),
    __metadata("design:type", Number)
], CourseFindAllDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search by name of category',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        return value.toString().trim().toLowerCase();
    }),
    __metadata("design:type", String)
], CourseFindAllDto.prototype, "query", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'approved filter',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        const t = {
            true: true,
            false: false
        };
        if (typeof value === 'string') {
            return [t[value]];
        }
        return value.map((i) => t[i]);
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CourseFindAllDto.prototype, "approved", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search by _id of category',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CourseFindAllDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        example: [Sort.PRICE_DESC],
        description: `
      enum Sort {
        PRICE_ASC = 'price:1',
        RATING_ASC = 'ratingCount:1',
        STUDENT_ASC = 'students:1',
        PRICE_DESC = 'price:-1',
        RATING_DESC = 'ratingCount:-1',
        STUDENT_DESC = 'students:-1'
      }
    `
    }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            return [value];
        }
        return value;
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(Sort, { each: true }),
    __metadata("design:type", Array)
], CourseFindAllDto.prototype, "sort", void 0);
exports.CourseFindAllDto = CourseFindAllDto;
//# sourceMappingURL=course-find-all.dto.js.map