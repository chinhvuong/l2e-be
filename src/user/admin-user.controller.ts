import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { SupperAdmin } from '@/auth/strategies/supper-admin.guard';
import { AdminFindAllUserDto } from './dto/admin-find-all.dto';
import { AdminUserService } from './admin-user.service';

@ApiTags('admin-user')
@Controller('admin-user')
export class AdminUserController {
  constructor(private readonly userService: AdminUserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SupperAdmin)
  @Get('')
  async list(@Query() filter: AdminFindAllUserDto) {
    return this.userService.findAll(filter);
  }
}
