"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const user_module_1 = require("../user/user.module");
const web3_module_1 = require("../web3/web3.module");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_auth_guard_1 = require("./strategies/jwt-auth.guard");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const refresh_guard_1 = require("./strategies/refresh.guard");
const refresh_strategy_1 = require("./strategies/refresh.strategy");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule, user_module_1.UserModule, web3_module_1.Web3Module],
        controllers: [auth_controller_1.AuthController],
        providers: [
            auth_service_1.AuthService,
            refresh_strategy_1.RefreshStrategy,
            jwt_strategy_1.JwtStrategy,
            refresh_guard_1.RefreshAuthGuard,
            jwt_auth_guard_1.JwtAuthGuard,
        ],
    })
], AuthModule);
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map