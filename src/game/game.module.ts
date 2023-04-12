import { BalanceModule } from '@/balance/balance.module';
import { CertificateModule } from '@/certificate/certificate.module';
import { CourseModule } from '@/course/course.module';
import { QuestionModule } from '@/question/question.module';
import { QuestionService } from '@/question/question.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GameHistory, GameHistorySchema } from './entities/game-history.schema';
import { GameController } from './game.controller';
import { GameService } from './game.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GameHistory.name, schema: GameHistorySchema },
    ]),
    QuestionModule,
    CourseModule,
    BalanceModule,
    CertificateModule,
  ],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
