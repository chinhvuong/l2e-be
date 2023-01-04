"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const web3 = new web3_1.default();
    const signature = web3.eth.accounts.sign('Hello', 'ff859483adfec0273d73cb8d4e3094b5bc1bc4f8e6a0dad9ff854a5afd89ade7');
    console.log(signature);
    const recover = web3.eth.accounts.recover('Hello', signature.signature);
    console.log('🚀 ~ file: script.ts ~ line 9 ~ main ~ recover', recover);
});
main();
//# sourceMappingURL=script.js.map