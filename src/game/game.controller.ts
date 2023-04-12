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
import { GameService } from './game.service';
import { MongoIdDto } from '@/common/dto/mongo-id.dto';
import { SubmitQuizDto } from './dtos/submit-quiz.dto';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiBearerAuth()
  @Post('play-quiz')
  @UseGuards(JwtAuthGuard)
  async playQuiz(
    @CurrentUser() user: UserDocument,
    @Body() { id }: MongoIdDto,
  ) {
    return this.gameService.playQuiz(user, id);
  }

  @ApiBearerAuth()
  @Put('submit-quiz')
  @UseGuards(JwtAuthGuard)
  async submitQuiz(
    @CurrentUser() user: UserDocument,
    @Body() data: SubmitQuizDto,
  ) {
    return this.gameService.submitQuiz(user, data);
  }

  @ApiBearerAuth()
  @Post('play-final-test')
  @UseGuards(JwtAuthGuard)
  async playFinalTest(
    @CurrentUser() user: UserDocument,
    @Body() { id }: MongoIdDto,
  ) {
    return this.gameService.playFinalTest(user, id);
  }

  @ApiBearerAuth()
  @Put('submit-final-test')
  @UseGuards(JwtAuthGuard)
  async submitFinalTest(
    @CurrentUser() user: UserDocument,
    @Body() data: SubmitQuizDto,
  ) {
    return this.gameService.submitFinalTest(user, data);
  }
}
