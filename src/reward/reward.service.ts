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
import { Web3Service } from '@/web3/web3.service';
import { UserDocument } from '@/user/schema/user.schema';
import { convertPriceToBigNumber } from '@/common/helpers/convertPriceToBigNumber';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(DailyReward.name) private model: Model<DailyRewardDocument>,
    private readonly configService: ConfigService,
    private readonly balanceService: BalanceService,
    private web3Service: Web3Service,
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
      success: true,
      message: 'Welcome back!',
    };
  }

  async claimRewardToken(user: UserDocument, amount: number) {
    const rs = await this.balanceService.lockBalance(
      user._id.toString(),
      amount,
    );
    console.log(
      '🚀 ~ file: reward.service.ts:63 ~ RewardService ~ claimRewardToken ~ rs:',
      rs,
    );
    const amountWei = convertPriceToBigNumber(amount, 18).toString();
    const signature = await this.web3Service.signToClaimRewardToken(
      amountWei,
      user.nonce,
      user.walletAddress,
    );
    user.nonce = user.nonce + 1;
    await user.save();
    return {
      price: amountWei,
      v: signature.v,
      r: signature.r,
      s: signature.s,
      nonce: user.nonce - 1,
    };
  }
}
