import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@/common/helpers/user.decorator';
import { UserDocument } from '@/user/schema/user.schema';
import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { LessonService } from './lesson.service';
import { LessonFindAllDto } from './dto/lesson-find-all.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { LessonIdDto } from './dto/lesson-id.dto';

@ApiTags('lesson')
@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upsert-lesions/:id')
  async upsertSections(
    @CurrentUser() user: UserDocument,
    @Body() data: UpdateLessonDto[],
    @Param() { id }: LessonIdDto,
  ) {
    return await this.lessonService.upsertLessons(user, data, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createSection(
    @CurrentUser() user: UserDocument,
    @Body() data: CreateLessonDto,
  ) {
    return await this.lessonService.createLesson(user, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create-batch')
  async createListLessons(
    @CurrentUser() user: UserDocument,
    @Body(new ParseArrayPipe({ items: CreateLessonDto }))
    data: CreateLessonDto[],
  ) {
    return await this.lessonService.createListLessons(user, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('manage/get-lessons')
  async manageGetLessons(
    @CurrentUser() user: UserDocument,
    @Query() query: LessonFindAllDto,
  ) {
    return this.lessonService.manageGetLessons(user, query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateLesson(
    @CurrentUser() user: UserDocument,
    @Body() data: UpdateLessonDto,
    @Param() { id }: LessonIdDto,
  ) {
    return await this.lessonService.updateLesson(user, data, id);
  }
}
