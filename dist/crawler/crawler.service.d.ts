import { BlockService } from '@/block/block.service';
import { CourseService } from '@/course/course.service';
import { ConfigService } from '@nestjs/config';
export declare class CrawlerService {
    private blockService;
    private configService;
    private courseService;
    crawling: boolean;
    constructor(blockService: BlockService, configService: ConfigService, courseService: CourseService);
    courseCrawl(): Promise<"Crawling" | "A crawl process is running">;
}
