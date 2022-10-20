import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/helpers/user.decorator';
import { UserDocument } from '@/user/schema/user.schema';
import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { CategoryService } from './category.service';
import { CategoryFindAllDto } from './dto/category-find-all.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createCourse(@CurrentUser() user: UserDocument) {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('')
  async findAll(@Query() query: CategoryFindAllDto) {
    return this.categoryService.findAll(query);
  }
}
