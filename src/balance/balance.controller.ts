import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { CurrentUser } from '@/common/helpers/user.decorator';
import { UserDocument } from '@/user/schema/user.schema';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BalanceService } from './balance.service';

@ApiTags('balance')
@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @ApiBearerAuth()
  @Get('my-balance')
  @UseGuards(JwtAuthGuard)
  async getMyBalance(@CurrentUser() user: UserDocument) {
    return this.balanceService.getUserBalance(user._id);
  }
}
