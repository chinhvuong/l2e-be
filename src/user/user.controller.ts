import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/helpers/user.decorator';
import { UserDocument } from '@/user/schema/user.schema';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MongoIdDto } from '@/common/dto/mongo-id.dto';
import { AdminFindAllUserDto } from './dto/admin-find-all.dto';

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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateMe(
    @CurrentUser() user: UserDocument,
    @Body() data: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user, data);
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  async profile(@Param() { id }: MongoIdDto) {
    return this.userService.getUserProfile(id);
    // return {
    //   ...user['_doc'],
    //   isAdmin: Boolean(
    //     process.env.ADMIN_ADDRESS?.split(' ')
    //       .map((address) => address.toLowerCase())
    //       .includes(user.walletAddress.toLowerCase()),
    //   ),
    // };
  }

  @Get('')
  async list(@Query() data: AdminFindAllUserDto) {
    return this.userService.list(data);
    // return {
    //   ...user['_doc'],
    //   isAdmin: Boolean(
    //     process.env.ADMIN_ADDRESS?.split(' ')
    //       .map((address) => address.toLowerCase())
    //       .includes(user.walletAddress.toLowerCase()),
    //   ),
    // };
  }
}
