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
exports.CreateListSectionDto = exports.CreateSectionDto = exports.BaseCreateSectionDto = exports.ChoiceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ChoiceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1+1=?',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ChoiceDto.prototype, "content", void 0);
exports.ChoiceDto = ChoiceDto;
class BaseCreateSectionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({}),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseCreateSectionDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BaseCreateSectionDto.prototype, "description", void 0);
exports.BaseCreateSectionDto = BaseCreateSectionDto;
class CreateSectionDto extends BaseCreateSectionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateSectionDto.prototype, "courseId", void 0);
exports.CreateSectionDto = CreateSectionDto;
class CreateListSectionDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        type: BaseCreateSectionDto,
    }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateListSectionDto.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateListSectionDto.prototype, "courseId", void 0);
exports.CreateListSectionDto = CreateListSectionDto;
//# sourceMappingURL=create-section.dto.js.map