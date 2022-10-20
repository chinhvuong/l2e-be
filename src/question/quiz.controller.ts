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
import { QuizService } from './quiz.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuizIdDto } from './dto/quiz-id.dto';
import { QuizFindAll } from './dto/quiz-find-all.dto';

@ApiTags('quiz')
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createQuiz(
    @CurrentUser() user: UserDocument,
    @Body() data: CreateQuizDto,
  ) {
    return await this.quizService.createQuiz(user, data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateQuestion(
    @CurrentUser() user: UserDocument,
    @Body() data: CreateQuizDto,
    @Param() { id }: QuizIdDto,
  ) {
    return await this.quizService.updateQuiz(user, data, id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('manage/get-quizzes')
  async manageGetQuestions(
    @CurrentUser() user: UserDocument,
    @Query() data: QuizFindAll,
  ) {
    return await this.quizService.manageGetQuizzes(user, data);
  }
}
