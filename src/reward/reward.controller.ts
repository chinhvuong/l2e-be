import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { CurrentUser } from '@/common/helpers/user.decorator';
import { UserDocument } from '@/user/schema/user.schema';
import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RewardService } from './reward.service';

@ApiTags('reward')
@Controller('reward')
export class RewardController {
  constructor(private readonly balanceService: RewardService) {}

  @ApiBearerAuth()
  @Post('claim-today-reward')
  @UseGuards(JwtAuthGuard)
  async getMyBalance(@CurrentUser() user: UserDocument) {
    return this.balanceService.getTodayReward(user._id);
  }
}
