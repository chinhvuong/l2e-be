import {
  Body,
  Controller,
  Delete,
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
import { QuestionService } from './question.service';
import { JwtAuthGuard } from '@/auth/strategies/jwt-auth.guard';
import {
  CreateQuestionDto,
  CreateListQuestionDto,
} from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionIdDto } from '@/question/dto/question-id.dto';
import { QuestionFindAll } from './dto/question-find-all.dto';

@ApiTags('question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createQuestion(
    @CurrentUser() user: UserDocument,
    @Body() data: CreateQuestionDto,
  ) {
    return await this.questionService.createQuestion(user, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('create-batch')
  async createListQuestions(
    @CurrentUser() user: UserDocument,
    @Body(new ParseArrayPipe({ items: CreateQuestionDto }))
    data: CreateQuestionDto[],
  ) {
    return await this.questionService.createListQuestions(user, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateQuestion(
    @CurrentUser() user: UserDocument,
    @Body() data: UpdateQuestionDto,
    @Param() { id }: QuestionIdDto,
  ) {
    return await this.questionService.updateQuestion(user, data, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('manage/get-question')
  async manageGetQuestions(
    @CurrentUser() user: UserDocument,
    @Query() data: QuestionFindAll,
  ) {
    return await this.questionService.manageGetQuestions(user, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('manage/:id')
  async deleteQuestions(
    @CurrentUser() user: UserDocument,
    @Param() { id }: QuestionIdDto,
  ) {
    return await this.questionService.deleteQuestion(user, id);
  }
}
