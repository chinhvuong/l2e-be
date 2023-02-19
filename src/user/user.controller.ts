import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/helpers/user.decorator';
import { UserDocument } from '@/user/schema/user.schema';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: UserDocument) {
    return {
      ...user['_doc'],
      isAdmin: Boolean(
        process.env.ADMIN_ADDRESS?.split(' ')
          .map((address) => address.toLowerCase())
          .includes(user.walletAddress.toLowerCase()),
      ),
    };
  }
}
