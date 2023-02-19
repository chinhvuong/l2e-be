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
exports.AdminUserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schema/user.schema");
let AdminUserService = class AdminUserService {
    constructor(model) {
        this.model = model;
    }
    findAll(data) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const match = {};
            if (data.query) {
                match['$or'] = [
                    { walletAddress: new RegExp(data.query, 'i') },
                    { name: new RegExp(data.query, 'i') },
                ];
            }
            const pagination = [];
            if (data.page !== undefined && data.limit !== undefined) {
                pagination.push({
                    $skip: data.limit * data.page,
                });
            }
            if (data.limit !== undefined) {
                pagination.push({
                    $limit: data.limit,
                });
            }
            const sort = {};
            if ((_a = data === null || data === void 0 ? void 0 : data.sort) === null || _a === void 0 ? void 0 : _a.length) {
                for (let i = 0; i < ((_b = data === null || data === void 0 ? void 0 : data.sort) === null || _b === void 0 ? void 0 : _b.length); i++) {
                    const [attr, direction] = data.sort[i].split(':');
                    if (direction === '-1') {
                        sort[attr] = -1;
                    }
                    else {
                        sort[attr] = 1;
                    }
                }
            }
            else {
                sort.price = -1;
            }
            const rs = yield this.model.aggregate([
                { $match: match },
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'walletAddress',
                        foreignField: 'author',
                        as: 'courses',
                    },
                },
                {
                    $lookup: {
                        from: 'enrolls',
                        localField: '_id',
                        foreignField: 'userId',
                        as: 'enrolls',
                    },
                },
                {
                    $project: {
                        walletAddress: 1,
                        name: 1,
                        avatar: 1,
                        bio: 1,
                        title: 1,
                        rating: 1,
                        createdAt: 1,
                        courseCreated: { $size: '$courses' },
                        courseEnrolled: { $size: '$enrolls' },
                    },
                },
                { $sort: sort },
                {
                    $facet: {
                        metadata: [{ $count: 'total' }],
                        data: pagination,
                    },
                },
            ]);
            return {
                total: ((_c = rs[0]) === null || _c === void 0 ? void 0 : _c.metadata[0]) ? (_d = rs[0]) === null || _d === void 0 ? void 0 : _d.metadata[0].total : 0,
                data: rs[0] ? rs[0].data : [],
            };
        });
    }
    findOneBy(...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne(...args).exec();
        });
    }
};
AdminUserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdminUserService);
exports.AdminUserService = AdminUserService;
//# sourceMappingURL=admin-user.service.js.map