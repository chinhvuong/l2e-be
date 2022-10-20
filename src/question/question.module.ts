import { CourseModule } from '@/course/course.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { Question, QuestionSchema } from './schema/question.schema';
import { Quiz, QuizSchema } from './schema/quiz.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Quiz.name, schema: QuizSchema },
    ]),
    forwardRef(() => CourseModule),
  ],
  providers: [QuestionService, QuizService],
  controllers: [QuestionController, QuizController],
  exports: [QuestionService, QuizService],
})
export class QuestionModule {}
