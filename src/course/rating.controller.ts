import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import { UserDocument } from '@/user/schema/user.schema';
import { CurrentUser } from '@/common/helpers/user.decorator';

import { CourseIdDto } from './dto/course-id.dto';
import { MongoIdDto } from '@/common/dto/mongo-id.dto';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingListDto } from './dto/rating-list.dto';

@ApiTags('Rating')
@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // @ApiBearerAuth()
  @Get('')
  // @UseGuards(JwtAuthGuard)
  async getRating(
    // @CurrentUser() user: UserDocument,
    @Query() data: RatingListDto,
  ) {
    return this.ratingService.list(data);
  }

  // @ApiBearerAuth()
  @Get('rating-overview')
  // @UseGuards(JwtAuthGuard)
  async getRatingOverview(
    // @CurrentUser() user: UserDocument,
    @Query() { id }: MongoIdDto,
  ) {
    return this.ratingService.ratingOverview(id);
  }

  @ApiBearerAuth()
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createRating(
    @CurrentUser() user: UserDocument,
    @Body() data: CreateRatingDto,
  ) {
    return this.ratingService.create(data, user);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateRating(
    @Param() { id }: MongoIdDto,
    @CurrentUser() user: UserDocument,
    @Body() data: UpdateRatingDto,
  ) {
    return this.ratingService.update(id, data, user);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRating(
    @Param() { id }: MongoIdDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.ratingService.deleteRating(id, user);
  }
}
