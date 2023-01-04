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
Object.defineProperty(exports, "__esModule", { value: true });
const base_crawler_1 = require("./base.crawler");
class CourseCrawler extends base_crawler_1.BaseCrawler {
    constructor(_blockService, _courseService, provider, contractAddress, abi, chainId, startBlock, name, gapTime = 60000, maxBlockRange = 500) {
        super(provider, contractAddress, abi, chainId, startBlock, name, gapTime, maxBlockRange);
        this.decimal = Math.pow(10, 18);
        this.blockService = _blockService;
        this.courseService = _courseService;
    }
    getNewestBlock() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.eth.getBlockNumber();
        });
    }
    handleEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(event.event, event.returnValues);
            switch (event.event) {
                case 'CourseCreated': {
                    this.handleCreateCourseEvent(event);
                    break;
                }
                case 'CoursePriceEdited': {
                    this.handleCoursePriceEditedEvent(event);
                    break;
                }
                case 'CourseTransferOwner': {
                    this.handleCourseTransferOwnerEvent(event);
                    break;
                }
                case 'CourseEnroll': {
                    this.handleCourseEnrollEvent(event);
                    break;
                }
                case 'ClaimCertificate': {
                    this.handleClaimCertificateEvent(event);
                    break;
                }
                case 'ClaimReward': {
                    this.handleClaimRewardEvent(event);
                    break;
                }
            }
        });
    }
    handleCreateCourseEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = event.returnValues;
            console.log({
                owner: data.owner,
                courseId: undefined,
                price: data.price / this.decimal,
                approved: false,
            });
            yield this.courseService.findOneAndUpdate({
                owner: data.owner,
                courseId: { $exists: false },
                price: data.price / this.decimal,
                approved: true,
            }, {
                courseId: data.courseId,
            });
        });
    }
    handleCourseEnrollEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = event.returnValues;
            yield this.courseService.enrollCourse(data.student, Number(data.courseId));
        });
    }
    handleCourseTransferOwnerEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = event.returnValues;
            yield this.courseService.findOneAndUpdate({
                courseId: data.courseId,
            }, {
                owner: data.newOwner,
            });
        });
    }
    handleClaimCertificateEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = event.returnValues;
        });
    }
    handleClaimRewardEvent(event) {
        const data = event.returnValues;
    }
    handleCoursePriceEditedEvent(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = event.returnValues;
            yield this.courseService.findOneAndUpdate({
                courseId: data.courseId,
            }, {
                price: data.newPrice / this.decimal,
            });
        });
    }
    saveBlock(chainId, contract, blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.blockService.createBlock({
                chainId,
                contract,
                blockNumber,
            });
        });
    }
}
exports.default = CourseCrawler;
//# sourceMappingURL=course.crawler.js.map