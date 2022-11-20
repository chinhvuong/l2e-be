import { BlockModule } from '@/block/block.module';
import { CourseModule } from '@/course/course.module';
import { Module } from '@nestjs/common';
import { CrawlController } from './crawler.controller';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [BlockModule, CourseModule],
  providers: [CrawlerService],
  controllers: [CrawlController],
})
export class CrawlerModule {}
