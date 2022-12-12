import { UserDocument } from '@/user/schema/user.schema';
import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseService } from './course.service';
import { ObjectId } from 'mongodb';
import { Lesson, LessonDocument } from './schema/lesson.schema';
import { LessonFindAllDto } from './dto/lesson-find-all.dto';
import { SectionService } from './section.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { QuizService } from '@/question/quiz.service';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private model: Model<LessonDocument>,
    private readonly courseService: CourseService,
    private readonly sectionService: SectionService,
    @Inject(forwardRef(() => QuizService))
    private quizService: QuizService,
  ) {}

  async manageGetLessons(user: UserDocument, data: LessonFindAllDto) {
    const section = await this.sectionService.getSectionOrThrowError(
      data.sectionId,
    );
    await this.courseService.validateOwner(
      section.courseId.toString(),
      user.walletAddress,
    );
    const match: { [key: string]: any } = {
      sectionId: new ObjectId(data.sectionId),
    };

    if (data.query) {
      match.name = new RegExp(data.query, 'i');
    }
    const pagination: any[] = [];
    if (data.page !== undefined && data.limit !== undefined) {
      pagination.push({
        $skip: data.limit * data.page,
      });
    }
    if (data.limit !== undefined) {
      pagination.push({
        $limit: data.limit,
      });
    }

    const rs = await this.model.aggregate([
      { $match: match },
      { $sort: { order: 1 } },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: pagination,
        },
      },
    ]);
    return {
      total: rs[0]?.metadata[0] ? rs[0]?.metadata[0].total : 0,
      data: rs[0] ? rs[0].data : [],
    };
  }

  async findOne(...args) {
    return await this.model.findOne(...args);
  }

  private async validateListQuestions(questions: string[], courseId: string) {
    const quests = await this.quizService.find({
      courseId: new ObjectId(courseId),
      _id: { $in: questions.map((item) => new ObjectId(item)) },
    });
    if (quests.length < questions.length) {
      throw new HttpException('Invalid questions', HttpStatus.FORBIDDEN);
    }
    return quests.map((item) => item._id);
  }

  async createLesson(user: UserDocument, data: CreateLessonDto) {
    const section = await this.sectionService.getSectionOrThrowError(
      data.sectionId,
    );
    await this.courseService.validateOwner(
      section.courseId.toString(),
      user.walletAddress,
    );

    return await new this.model({
      ...data,
      sectionId: section._id,
    }).save();
  }

  async createListLessons(user: UserDocument, data: CreateLessonDto[]) {
    if (!data.length) {
      throw new HttpException('Data is empty', HttpStatus.BAD_REQUEST);
    }
    const section = await this.sectionService.getSectionOrThrowError(
      data[0].sectionId,
    );
    await this.courseService.validateOwner(
      section.courseId.toString(),
      user.walletAddress,
    );

    data = data.map((item) => {
      item.sectionId = section._id;
      return item;
    });
    return await this.model.insertMany(data);
  }

  async updateLesson(user: UserDocument, data: UpdateLessonDto, id: string) {
    const section = await this.model.findOne({
      _id: new ObjectId(id),
    });
    if (!section) {
      throw new HttpException(
        'Question does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.courseService.validateOwner(id, user.walletAddress);

    return await this.model.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      data,
      { new: true },
    );
  }

  async upsertLessons(
    user: UserDocument,
    data: UpdateLessonDto[],
    sectionId: string,
  ) {
    if (!data.length) {
      throw new HttpException('Data is empty', HttpStatus.BAD_REQUEST);
    }
    const section = await this.sectionService.getSectionOrThrowError(sectionId);
    await this.courseService.validateOwner(
      section.courseId.toString(),
      user.walletAddress,
    );

    const rs = await Promise.all(
      data.map((lesson, index) => {
        if (lesson._id) {
          const filter = {
            _id: new ObjectId(lesson._id),
            sectionId: section._id,
          };
          const { _id, ...data } = lesson;
          return this.model.findOneAndUpdate(
            filter,
            {
              ...data,
              order: index,
            },
            {
              new: true,
            },
          );
        } else {
          return new this.model({
            ...lesson,
            order: index,
            sectionId: section._id,
          }).save();
        }
      }),
    );

    await this.model.deleteMany({
      sectionId: section._id,
      _id: { $nin: rs.map((item) => item?._id) },
    });
    return rs;
  }
}
