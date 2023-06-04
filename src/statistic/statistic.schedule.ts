import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import moment from 'moment';
import { Model } from 'mongoose';
import { Statistic, StatisticDocument } from './entities/statistic.schema';
import { StatisticService } from './statistic.service';

@Injectable()
export class AggregateStatistic {
  private readonly logger = new Logger(AggregateStatistic.name);
  constructor(
    private readonly statisticService: StatisticService,
    @InjectModel(Statistic.name)
    private statisticModel: Model<StatisticDocument>,
  ) {}

  @Cron('1 * * * *', {
    // timeZone: 'utc',
  })
  async handleCron() {
    const { start, end } = this.getStartAndEndTime();
    const [revenue, courseCount, userCount, certificateCount] =
      await Promise.all([
        this.statisticService.getRevenue(start, end),
        this.statisticService.countCourse(start, end),
        this.statisticService.countUser(start, end),
        this.statisticService.countCertificate(start, end),
      ]);

    await new this.statisticModel({
      revenue,
      courseCount,
      userCount,
      certificateCount,
      time: start,
    }).save();
  }

  getStartAndEndTime() {
    return {
      start: moment().startOf('hour').subtract(1, 'hour').toDate(),
      end: moment().startOf('hour').toDate(),
    };
  }
}
