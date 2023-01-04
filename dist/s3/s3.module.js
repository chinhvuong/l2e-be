"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Module = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const s3_service_1 = require("./s3.service");
const file_schema_1 = require("./schema/file.schema");
const upload_controller_1 = require("./upload.controller");
const upload_service_1 = require("./upload.service");
let S3Module = class S3Module {
};
S3Module = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: file_schema_1.MediaFile.name, schema: file_schema_1.MediaFileSchema },
            ]),
        ],
        providers: [s3_service_1.S3Service, upload_service_1.UploadService],
        exports: [s3_service_1.S3Service, upload_service_1.UploadService],
        controllers: [upload_controller_1.UploadController],
    })
], S3Module);
exports.S3Module = S3Module;
//# sourceMappingURL=s3.module.js.map