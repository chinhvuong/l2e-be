import { CrawlerService } from './crawler.service';
export declare class CrawlController {
    private readonly crawlerService;
    constructor(crawlerService: CrawlerService);
    createQuiz(): Promise<"Crawling" | "A crawl process is running">;
}
