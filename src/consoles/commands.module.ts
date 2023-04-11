import { Module } from '@nestjs/common';
import { CrawlerConsole } from './crawler.console';
import { CrawlerModule } from '@/crawler/crawler.module';
import { ConsoleModule } from 'nestjs-console';

@Module({
  imports: [ConsoleModule, CrawlerModule],
  providers: [CrawlerConsole],
})
export class CommandsModule {}
