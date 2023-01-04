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
exports.AuthService = void 0;
const user_service_1 = require("../user/user.service");
const web3_service_1 = require("../web3/web3.service");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(jwtService, configService, userService, web3Service) {
        this.jwtService = jwtService;
        this.configService = configService;
        this.userService = userService;
        this.web3Service = web3Service;
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let recoveredAddress = '';
            try {
                recoveredAddress = this.web3Service.recoverPersonalSignature(this.configService.get('LOGIN_MESSAGE').toString(), data.signature);
            }
            catch (err) {
                throw new common_1.HttpException('Problem with signature verification.', common_1.HttpStatus.FORBIDDEN);
            }
            if (recoveredAddress.toLowerCase() !== data.walletAddress.toLowerCase()) {
                throw new common_1.HttpException('Invalid signature', common_1.HttpStatus.FORBIDDEN);
            }
            const user = yield this.userService.findOneOrCreate(data.walletAddress);
            console.log('🚀 ~ file: auth.service.ts ~ line 41 ~ AuthService ~ login ~ user', user);
            return this.getAuthToken(user._id.toString(), user.walletAddress);
        });
    }
    refreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getAuthToken(user._id.toString(), user.walletAddress);
        });
    }
    getAuthToken(userId, address) {
        const payload = {
            userId,
            address,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('ACCESS_TOKEN_SECRET'),
            expiresIn: Number(this.configService.get('ACCESS_TOKEN_EXPIRE_TIME')),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('REFRESH_TOKEN_SECRET'),
            expiresIn: Number(this.configService.get('REFRESH_TOKEN_EXPIRE_TIME')),
        });
        return {
            accessToken,
            refreshToken,
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        config_1.ConfigService,
        user_service_1.UserService,
        web3_service_1.Web3Service])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map