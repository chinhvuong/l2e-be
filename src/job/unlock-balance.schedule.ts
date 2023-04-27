import { Balance, BalanceDocument } from '@/balance/entities/balance.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import moment from 'moment';

@Injectable()
export class UnlockBalanceSchedule {
  private readonly logger = new Logger(UnlockBalanceSchedule.name);
  constructor(
    @InjectModel(Balance.name) private modelBalance: Model<BalanceDocument>,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, {
    timeZone: 'utc',
  })
  async handleCron() {
    const yesterday = moment().subtract(1, 'hour').toDate();
    const balances = await this.modelBalance.find({
      lockBalance: {
        $gt: 0,
      },
      lastLock: {
        $lte: yesterday,
      },
    });
    await Promise.all(
      balances.map(async (b) => {
        return this.modelBalance.findOneAndUpdate(
          {
            _id: b._id,
          },
          {
            lockBalance: 0,
            balance: b.balance + b.lockBalance,
          },
        );
      }),
    );
  }
}
