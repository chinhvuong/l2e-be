import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule } from './course/course.module';
import { SeedModule } from './seed/seed.module';
import { QuestionModule } from './question/question.module';
import { CrawlerModule } from './crawler/crawler.module';
import { BlockModule } from './block/block.module';
import { S3Module } from './s3/s3.module';
import { GameModule } from './game/game.module';
import { BalanceModule } from './balance/balance.module';
import { RewardModule } from './reward/reward.module';
import { CommandsModule } from './consoles/commands.module';
// import { ConsoleModule } from 'nestjs-console';
import { CertificateModule } from './certificate/certificate.module';
import { JobModule } from './job/job.module';
import { StatisticModule } from './statistic/statistic.module';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    MongooseModule.forRoot(String(process.env.DB_URL)),
    CourseModule,
    SeedModule,
    QuestionModule,
    CrawlerModule,
    BlockModule,
    CrawlerModule,
    BlockModule,
    S3Module,
    GameModule,
    BalanceModule,
    RewardModule,
    CommandsModule,
    CertificateModule,
    JobModule.register(),
    StatisticModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
