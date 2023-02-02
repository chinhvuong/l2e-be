import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/helpers/user.decorator';
import { UserDocument } from '@/user/schema/user.schema';
import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { CourseService } from './course.service';
import { CourseFindAllDto } from './dto/course-find-all.dto';
import { ApproveFindAllDto } from './dto/approve-request-find-all.dto';
import { SupperAdmin } from '@/auth/strategies/supper-admin.guard';
import { CourseIdDto } from './dto/course-id.dto';
import { AdminCourseService } from './admin-course.service';
import { MongoIdDto } from '@/common/dto/mongo-id.dto';
import { ResolveApproveRequestDto } from './dto/resolve-approve-request.dto';

@ApiTags('course-admin')
@Controller('admin-course')
export class AdminCourseController {
  constructor(private readonly courseService: AdminCourseService) {}


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SupperAdmin)
  @Get('approve-requests')
  async getApproveRequests(@Query() query: ApproveFindAllDto) {
    return await this.courseService.getApproveRequests(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SupperAdmin)
  @Put('approve-requests/resolve/:id')
  async resolveApproveRequest(@Param() { id }: MongoIdDto, @Body() data: ResolveApproveRequestDto) {
    return await this.courseService.resolveApproveRequest(id, data);
  }

  // admin
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, SupperAdmin)
  @Get('unapproved-courses')
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
  @UseGuards(JwtAuthGuard, SupperAdmin)
  @Put('toggle-approve-course')
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
