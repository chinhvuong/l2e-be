import { BalanceModule } from '@/balance/balance.module';
import { Web3Module } from '@/web3/web3.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyReward, DailyRewardSchema } from './entities/daily-reward.schema';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyReward.name, schema: DailyRewardSchema },
    ]),
    BalanceModule,
    Web3Module,
  ],
  controllers: [RewardController],
  providers: [RewardService],
})
export class RewardModule {}
