import { BlockService } from '@/block/block.service';
import courseDexApi from '@/config/abi/course';
import { CourseService } from '@/course/course.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CourseCrawler from './course.crawler';

@Injectable()
export class CrawlerService {
  crawling = false;

  constructor(
    private blockService: BlockService,
    private configService: ConfigService,
    private courseService: CourseService,
  ) {
    this.crawling = false;
  }

  async courseCrawl() {
    if (!this.crawling) {
      const latestCrawlerBlock = await this.blockService.getLatestBlockNumber(
        Number(this.configService.get('CHAIN_ID')),
        String(this.configService.get('CONTRACT_ADDRESS')),
      );
      const startBlock = Math.max(
        latestCrawlerBlock,
        Number(this.configService.get('START_BLOCK')),
      );
      const crawler = new CourseCrawler(
        this.blockService,
        this.courseService,
        String(this.configService.get('RPC_PROVIDER')),
        String(this.configService.get('CONTRACT_ADDRESS')),
        courseDexApi,
        Number(this.configService.get('CHAIN_ID')),
        startBlock,
        'Course dex crawler',
      );
      this.crawling = true;
      crawler.scan();
      return 'Crawling';
    }
    return 'A crawl process is running';
  }
}
