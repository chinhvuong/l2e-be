import { Command, Console } from 'nestjs-console';
import CourseCrawler from '@/crawler/course.crawler';

@Console()
export class CrawlerConsole {
  constructor(private courseCrawler: CourseCrawler) {}

  @Command({
    command: 'crawler',
    description: 'transaction crawler',
  })
  async run() {
    console.log('Alo');

    await this.courseCrawler.scan();
  }
}
