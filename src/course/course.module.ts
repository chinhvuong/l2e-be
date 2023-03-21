import { QuestionModule } from '@/question/question.module';
import { Quiz, QuizSchema } from '@/question/schema/quiz.schema';
import { UserModule } from '@/user/user.module';
import { Web3Module } from '@/web3/web3.module';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminCourseController } from './admin-course.controller';
import { AdminCourseService } from './admin-course.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { LessonController } from './lession.controller';
import { LessonService } from './lesson.service';
import { Category, CategorySchema } from './schema/category.schema';
import { Course, CourseSchema } from './schema/course.schema';
import { Enroll, EnrollSchema } from './schema/enroll.schema.';
import { Lesson, LessonSchema } from './schema/lesson.schema';
import {
  RequestApprove,
  RequestApproveSchema,
} from './schema/request-aprrove.schema';
import { Section, SectionSchema } from './schema/section.schema';
import { SectionController } from './section.controller';
import { SectionService } from './section.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Section.name, schema: SectionSchema },
      { name: Lesson.name, schema: LessonSchema },
      { name: Enroll.name, schema: EnrollSchema },
      { name: RequestApprove.name, schema: RequestApproveSchema },
      { name: Quiz.name, schema: QuizSchema },
    ]),
    forwardRef(() => QuestionModule),
    UserModule,
    Web3Module,
  ],
  controllers: [
    CourseController,
    AdminCourseController,
    CategoryController,
    SectionController,
    LessonController,
  ],
  providers: [
    CourseService,
    CategoryService,
    SectionService,
    LessonService,
    AdminCourseService,
  ],
  exports: [
    CategoryService,
    CourseService,
    SectionService,
    LessonService,
    AdminCourseService,
  ],
})
export class CourseModule {}
