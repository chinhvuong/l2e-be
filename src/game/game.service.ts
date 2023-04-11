import { CourseService } from '@/course/course.service';
import { UserDocument } from '@/user/schema/user.schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  GameHistory,
  GameHistoryDocument,
} from './entities/game-history.schema';
import { QuizService } from '@/question/quiz.service';
import { GAME_STATUS } from './enum';
import { ConfigService } from '@nestjs/config';
import { AnswerQuizDto, SubmitQuizDto } from './dtos/submit-quiz.dto';
import { Question, QuestionSchema } from '@/question/schema/question.schema';
import { retry } from 'rxjs';
import { BalanceService } from '@/balance/balance.service';

@Injectable()
export class GameService {
  constructor(
    @InjectModel(GameHistory.name) private model: Model<GameHistoryDocument>,
    private readonly courseService: CourseService,
    private readonly quizService: QuizService,
    private readonly configService: ConfigService,
    private readonly balanceService: BalanceService,
  ) {}

  async playQuiz(user: UserDocument, quizId: string) {
    const quiz = await this.quizService.findOneBy({
      _id: new ObjectId(quizId),
    });
    console.log(
      '🚀 ~ file: game.service.ts:24 ~ GameService ~ playQuiz ~ quiz:',
      quiz,
    );
    if (!quiz?._id) {
      throw new NotFoundException();
    }

    await this.courseService.checkEnroll(user._id, quiz.courseId);

    const game = await new this.model({
      questions: quiz.questions.map((question) => {
        return {
          _id: question['_id'],
          question: question.question,
          choices: question.choices,
          correctAnswer: question.correctAnswer,
        };
      }),
      quizId: quiz._id,
      status: GAME_STATUS.INPROGRESS,
      userId: user._id,
      isPass: false,
      expiredAt: new Date(
        new Date().getTime() +
          Number(this.configService.get('DEFAULT_QUIZ_TIME')),
      ),
    }).save();

    return {
      gameId: game._id,
      expiredAt: game.expiredAt,
      questions: game.questions.map((question) => {
        return {
          _id: question['_id'],
          ...question,
          correctAnswer: undefined,
        };
      }),
    };
  }

  async submitQuiz(user: UserDocument, data: SubmitQuizDto) {
    const game = await this.model.findOne({
      userId: user._id,
      _id: data.gameId,
      status: GAME_STATUS.INPROGRESS,
    });
    if (!game) {
      throw new NotFoundException();
    }
    const correct = this.checkAnswer(data.answers, game.questions);
    if (correct === game.questions.length) {
      // pass
      game.isPass = true;
      game.earn = 1;
      await this.balanceService.upsertBalance(user._id.toString(), 1);
    }

    game.status = GAME_STATUS.COMPLETED;
    game.completeAt = new Date();
    game.win_rate = correct / game.questions.length;
    game.answers = data.answers;

    await game.save();

    return {
      ...game.toObject(),
    };
  }
  checkAnswer(answers: AnswerQuizDto[], questions: Question[]) {
    let correct = 0;
    const set: { [key: string]: boolean } = {};
    for (let i = 0; i < answers.length; i++) {
      const isCorrect =
        answers[i].answer ===
        this.findCorrectAnswerQuestionById(answers[i].questionId, questions);

      if (isCorrect) {
        if (set[answers[i].questionId] == undefined) {
          correct += 1;
        }
      }
      set[answers[i].questionId] = isCorrect;
    }
    console.log(set);

    return correct;
  }

  findCorrectAnswerQuestionById(id: string, questions: Question[]) {
    for (let i = 0; i < questions.length; i++) {
      if (questions[i]['_id']?.toString() === id) {
        return questions[i].correctAnswer;
      }
    }
    return -1;
  }
}
