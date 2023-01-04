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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const s3_service_1 = require("./s3.service");
const file_schema_1 = require("./schema/file.schema");
let UploadService = class UploadService {
    constructor(s3Service, model) {
        this.s3Service = s3Service;
        this.model = model;
    }
    uploadOneFile(file, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.s3Service.uploadFile(file);
            if (rs.Key && rs.Location) {
                yield new this.model({
                    key: rs.Key,
                    url: rs.Location,
                    user: user,
                }).save();
            }
            return rs;
        });
    }
    uploadMultiFile(files, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield Promise.all(files.map((item) => {
                return this.uploadOneFile(item, user);
            }));
            return rs.map((item) => ({
                url: item.Location,
            }));
        });
    }
};
UploadService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(file_schema_1.MediaFile.name)),
    __metadata("design:paramtypes", [s3_service_1.S3Service,
        mongoose_2.Model])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map