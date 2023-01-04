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
exports.LoginDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class LoginDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(42, 42),
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Ethereum account address',
        example: '0x6AB0Cc7184F27b7ABbA97de7d23B26665a4f7d5C',
    }),
    __metadata("design:type", String)
], LoginDto.prototype, "walletAddress", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(132, 132),
    (0, swagger_1.ApiProperty)({
        required: true,
        description: 'Signature for message',
        example: '0x3282ea2682c68be7183248f61298b9993962ca41aadec42e0bb1944057ed66750a53aad0b8bf4923671d89a9d40b70e31244e448b35f1dd0c4d88106772275011b',
    }),
    __metadata("design:type", String)
], LoginDto.prototype, "signature", void 0);
exports.LoginDto = LoginDto;
//# sourceMappingURL=login.dto.js.map