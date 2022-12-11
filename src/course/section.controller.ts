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
import { SectionService } from './section.service';
import { SectionFindAllDto } from './dto/section-find-all.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { SectionIdDto } from './dto/section-id.dto';
import { CourseIdDto } from './dto/course-id.dto';

@ApiTags('section')
@Controller('section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upsert-sections/:id')
  async upsertSections(
    @CurrentUser() user: UserDocument,
    @Body() data: UpdateSectionDto[],
    @Param() { id }: CourseIdDto,
  ) {
    return await this.sectionService.upsertListSections(user, data, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createSection(
    @CurrentUser() user: UserDocument,
    @Body() data: CreateSectionDto,
  ) {
    return await this.sectionService.createSection(user, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create-batch')
  async createListSections(
    @CurrentUser() user: UserDocument,
    @Body(new ParseArrayPipe({ items: CreateSectionDto }))
    data: CreateSectionDto[],
  ) {
    return await this.sectionService.createListSections(user, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('manage/get-sections')
  async manageGetSections(
    @CurrentUser() user: UserDocument,
    @Query() query: SectionFindAllDto,
  ) {
    return this.sectionService.manageGetSections(user, query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateSection(
    @CurrentUser() user: UserDocument,
    @Body() data: UpdateSectionDto,
    @Param() { id }: SectionIdDto,
  ) {
    return await this.sectionService.updateSection(user, data, id);
  }
}
