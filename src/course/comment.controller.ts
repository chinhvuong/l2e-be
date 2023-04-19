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
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentService } from './comment.service';
import { CommentListDto } from './dto/comment-list.dto';
import { CourseIdDto } from './dto/course-id.dto';
import { MongoIdDto } from '@/common/dto/mongo-id.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @Get('')
  @UseGuards(JwtAuthGuard)
  async getComment(
    @CurrentUser() user: UserDocument,
    @Query() data: CommentListDto,
  ) {
    return this.commentService.list(data, user);
  }

  @ApiBearerAuth()
  @Post('')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @CurrentUser() user: UserDocument,
    @Body() data: CreateCommentDto,
  ) {
    return this.commentService.create(data, user);
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param() { id }: MongoIdDto,
    @CurrentUser() user: UserDocument,
    @Body() data: UpdateCommentDto,
  ) {
    return this.commentService.update(id, user, data);
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param() { id }: MongoIdDto,
    @CurrentUser() user: UserDocument,
  ) {
    return this.commentService.deleteComment(id, user);
  }
}
