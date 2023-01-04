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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrawlerService = void 0;
const block_service_1 = require("../block/block.service");
const course_1 = __importDefault(require("../config/abi/course"));
const course_service_1 = require("../course/course.service");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const course_crawler_1 = __importDefault(require("./course.crawler"));
let CrawlerService = class CrawlerService {
    constructor(blockService, configService, courseService) {
        this.blockService = blockService;
        this.configService = configService;
        this.courseService = courseService;
        this.crawling = false;
        this.crawling = false;
    }
    courseCrawl() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.crawling) {
                const latestCrawlerBlock = yield this.blockService.getLatestBlockNumber(Number(this.configService.get('CHAIN_ID')), String(this.configService.get('CONTRACT_ADDRESS')));
                const startBlock = Math.max(latestCrawlerBlock, Number(this.configService.get('START_BLOCK')));
                const crawler = new course_crawler_1.default(this.blockService, this.courseService, String(this.configService.get('RPC_PROVIDER')), String(this.configService.get('CONTRACT_ADDRESS')), course_1.default, Number(this.configService.get('CHAIN_ID')), startBlock, 'Course dex crawler');
                this.crawling = true;
                crawler.scan();
                return 'Crawling';
            }
            return 'A crawl process is running';
        });
    }
};
CrawlerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [block_service_1.BlockService,
        config_1.ConfigService,
        course_service_1.CourseService])
], CrawlerService);
exports.CrawlerService = CrawlerService;
//# sourceMappingURL=crawler.service.js.map