import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('manage/own-courses')
  async ownCourses(
    @Query() query: CourseFindAllDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.courseService.ownCourses(query, user.walletAddress);
  }

  // admin
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('admin/unapproved-courses')
  async unApproveCourses(
    @Query() query: CourseFindAllDto,
    @CurrentUser() user: UserDocument,
  ) {
    if (
      user.walletAddress.toLowerCase() ===
      process.env.ADMIN_ADDRESS?.toLowerCase()
    ) {
      return this.courseService.unApprovedCourses(query);
    } else {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
    }
  }

  // admin
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('admin/toggle-approve-course')
  async approveCourse(
    @Body() { id }: CourseIdDto,
    @CurrentUser() user: UserDocument,
  ) {
    if (
      user.walletAddress.toLowerCase() ===
      process.env.ADMIN_ADDRESS?.toLowerCase()
    ) {
      return this.courseService.toggleApproveCourse(id);
    } else {
      throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
    }
  }
}
