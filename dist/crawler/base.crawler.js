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
exports.BaseCrawler = void 0;
const web3_1 = __importDefault(require("web3"));
class BaseCrawler {
    constructor(provider, contractAddress, abi, chainId, startBlock, name, gapTime = 60000, maxBlockRange = 30) {
        this.provider = provider;
        this.contractAddress = contractAddress;
        this.abi = abi;
        this.chainId = chainId;
        this.web3 = new web3_1.default(provider);
        this.web3Contract = new this.web3.eth.Contract(abi, contractAddress);
        this.startBlock = startBlock;
        this.name = name;
        this.maxBlockRange = maxBlockRange;
        this.gapTime = gapTime;
    }
    crawlBlock(fromBlock, toBlock) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('====================================');
                console.log('from', fromBlock);
                console.log('to', toBlock);
                console.log(this.name, ' ==> chain ID: ', this.chainId);
                console.log('====================================');
                const events = yield this.web3Contract.getPastEvents('AllEvents', {
                    fromBlock,
                    toBlock,
                });
                for (const event of events) {
                    yield this.handleEvent(event);
                }
                yield this.saveBlock(this.chainId, this.contractAddress, toBlock);
            }
            catch (error) {
                console.log('🚀 ~ file: base.crawler.ts ~ line 43 ~ BaseCralwer ~ crawlBlock ~ error', error);
                return;
            }
        });
    }
    sleep(milliseconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                setTimeout(resolve, milliseconds);
            });
        });
    }
    timeout(fn) {
        return __awaiter(this, void 0, void 0, function* () {
            yield fn();
            yield this.sleep(this.gapTime);
            yield this.timeout(fn);
        });
    }
    scan() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.timeout(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const newestBlock = yield this.getNewestBlock();
                    console.log(this.startBlock, this.maxBlockRange);
                    console.log('🚀 ~ file: base.crawler.ts ~ line 75 ~ BaseCrawler ~ awaitthis.timeout ~ newestBlock', newestBlock);
                    const toBlock = Math.min(newestBlock, this.startBlock + this.maxBlockRange);
                    if (toBlock > this.startBlock) {
                        yield this.crawlBlock(this.startBlock, toBlock);
                        this.startBlock = toBlock + 1;
                    }
                    else {
                        console.log(this.startBlock, toBlock);
                    }
                }
                catch (error) { }
            }));
        });
    }
}
exports.BaseCrawler = BaseCrawler;
//# sourceMappingURL=base.crawler.js.map