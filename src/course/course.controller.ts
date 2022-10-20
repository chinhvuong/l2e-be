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
import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseIdDto } from './dto/course-id.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseFindAllDto } from './dto/course-find-all.dto';

@ApiTags('course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async findAll(@Query() data: CourseFindAllDto) {
    return this.courseService.findAll(data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createCourse(
    @CurrentUser() user: UserDocument,
    @Body() data: CreateCourseDto,
  ) {
    return this.courseService.createNewCourse(user, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateCourse(
    @CurrentUser() user: UserDocument,
    @Body() data: UpdateCourseDto,
    @Param() { id }: CourseIdDto,
  ) {
    return this.courseService.updateCourse(user, data, id);
  }
}
