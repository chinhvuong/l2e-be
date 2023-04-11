import { BalanceModule } from '@/balance/balance.module';
import { BlockModule } from '@/block/block.module';
import { CourseModule } from '@/course/course.module';
import { UserModule } from '@/user/user.module';
import { Module } from '@nestjs/common';
import CourseCrawler from './course.crawler';
import { CrawlController } from './crawler.controller';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [BlockModule, CourseModule, BalanceModule, UserModule],
  providers: [CrawlerService, CourseCrawler],
  controllers: [CrawlController],
  exports: [CourseCrawler],
})
export class CrawlerModule {}
