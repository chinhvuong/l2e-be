"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupperAdmin = void 0;
const common_1 = require("@nestjs/common");
let SupperAdmin = class SupperAdmin {
    canActivate(context) {
        var _a;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return ((user === null || user === void 0 ? void 0 : user.walletAddress.toLowerCase()) ===
            ((_a = process.env.ADMIN_ADDRESS) === null || _a === void 0 ? void 0 : _a.toLowerCase()));
    }
};
SupperAdmin = __decorate([
    (0, common_1.Injectable)()
], SupperAdmin);
exports.SupperAdmin = SupperAdmin;
//# sourceMappingURL=supper-admin.guard.js.map