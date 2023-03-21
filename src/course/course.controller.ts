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
import { RequestApproveDto } from './dto/request-approve.dto';
import { ApproveFindAllDto } from './dto/approve-request-find-all.dto';

@ApiTags('course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async findAll(@Query() data: CourseFindAllDto) {
    return this.courseService.getCourseList(data);
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
  @Get('check-enroll/:id')
  async checkEnrollStatus(
    @CurrentUser() user: UserDocument,
    @Param() { id }: CourseIdDto,
  ) {
    return this.courseService.checkEnroll(user._id.toString(), id);
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get('preview/:id')
  async coursePreview(@Param() data: CourseIdDto) {
    return this.courseService.getCoursePreview(data);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my/enroll-courses')
  async myEnrollCourses(
    @Query() query: CourseFindAllDto,
    @CurrentUser() user: UserDocument,
  ) {
    return await this.courseService.myEnrollCourses(query, user._id);
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
    return await this.courseService.ownCourses(query, user.walletAddress);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('manage/my-approve-requests')
  async getMyPastApproveRequests(
    @Query() query: ApproveFindAllDto,
    @CurrentUser() user: UserDocument,
  ) {
    return await this.courseService.getMyPastRequest(user, query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('manage/own-courses/:id')
  async courseDetailToEdit(
    @Param() { id }: CourseIdDto,
    @CurrentUser() user: UserDocument,
  ) {
    return await this.courseService.getCourseDetailToEdit(
      id,
      user.walletAddress,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('manage/own-courses/send-approve-request')
  async requestApprove(
    @Body() data: RequestApproveDto,
    @CurrentUser() user: UserDocument,
  ) {
    return await this.courseService.requestApprove(data, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('request-mint-signature')
  async requestSignatureToMint(
    @Query() { id }: CourseIdDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.courseService.getSignatureToMintCourse(id, user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('learn')
  async learnCourse(
    @Query() { id }: CourseIdDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.courseService.learnCourse(user._id, id);
  }
}
