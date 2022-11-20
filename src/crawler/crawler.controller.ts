import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CrawlerService } from './crawler.service';

@ApiTags('crawler')
@Controller('crawler')
export class CrawlController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Get('run')
  async createQuiz() {
    return await this.crawlerService.courseCrawl();
  }
}
