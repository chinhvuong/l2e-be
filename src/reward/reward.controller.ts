import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { CurrentUser } from '@/common/helpers/user.decorator';
import { UserDocument } from '@/user/schema/user.schema';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClaimRewardTokenDto } from './dtos/claim-reward-token.dto';
import { RewardService } from './reward.service';

@ApiTags('reward')
@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @ApiBearerAuth()
  @Post('claim-today-reward')
  @UseGuards(JwtAuthGuard)
  async getMyBalance(@CurrentUser() user: UserDocument) {
    return this.rewardService.getTodayReward(user._id);
  }

  @ApiBearerAuth()
  @Post('claim-reward-token-signature')
  @UseGuards(JwtAuthGuard)
  async getSignatureToMintRewardToken(
    @CurrentUser() user: UserDocument,
    @Body() { amount }: ClaimRewardTokenDto,
  ) {
    return this.rewardService.claimRewardToken(user, amount);
  }
}
