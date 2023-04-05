import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import {
  DailyReward,
  DailyRewardDocument,
} from './entities/daily-reward.schema';
import { BalanceService } from '@/balance/balance.service';
import moment from 'moment';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(DailyReward.name) private model: Model<DailyRewardDocument>,
    private readonly configService: ConfigService,
    private readonly balanceService: BalanceService,
  ) {}

  async getTodayReward(userId: string) {
    const received = await this.model.findOne({
      userId: userId,
      date: moment.utc().startOf('day').toDate(),
    });
    if (received?._id) {
      return {
        reward: Number(this.configService.get('DAILY_REWARD')),
        message: 'You have received today reward!',
        success: false,
      };
    }
    const rs = await this.model.findOneAndUpdate(
      {
        userId: userId,
        date: moment.utc().startOf('day').toDate(),
      },
      {
        reward: Number(this.configService.get('DAILY_REWARD')),
      },
      {
        new: true,
        upsert: true,
      },
    );
    await this.balanceService.upsertBalance(
      userId,
      Number(this.configService.get('DAILY_REWARD')),
    );
    return {
      reward: rs.reward,
      success: false,
      message: 'Welcome back!',
    };
  }
}
