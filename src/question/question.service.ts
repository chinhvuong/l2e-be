import { CourseService } from '@/course/course.service';
import { UserDocument } from '@/user/schema/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateListQuestionDto,
  CreateQuestionDto,
} from './dto/create-question.dto';
import { Question, QuestionDocument } from './schema/question.schema';
import { ObjectId } from 'mongodb';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionFindAll } from './dto/question-find-all.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question.name) private model: Model<QuestionDocument>,
    private readonly courseService: CourseService,
  ) {}

  async findOneBy(...args) {
    return await this.model.findOne(...args).exec();
  }

  async createQuestion(user: UserDocument, data: CreateQuestionDto) {
    const course = await this.courseService.validateOwner(
      data.courseId,
      user.walletAddress,
    );
    return await new this.model({
      ...data,
      courseId: course._id,
    }).save();
  }

  async createListQuestions(user: UserDocument, data: CreateQuestionDto[]) {
    if (!data.length) {
      throw new HttpException('Data is empty', HttpStatus.BAD_REQUEST);
    }
    const course = await this.courseService.validateOwner(
      data[0].courseId,
      user.walletAddress,
    );

    data = data.map((item) => {
      item.courseId = course._id;
      return item;
    });
    return await this.model.insertMany(data);
  }

  async updateQuestion(
    user: UserDocument,
    data: UpdateQuestionDto,
    id: string,
  ) {
    const question = await this.model.findOne({
      _id: new ObjectId(id),
    });
    if (!question) {
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

  async find(...args) {
    return await this.model.find(...args);
  }

  async manageGetQuestions(user: UserDocument, data: QuestionFindAll) {
    await this.courseService.validateOwner(data.courseId, user.walletAddress);
    const match: { [key: string]: any } = {
      courseId: new ObjectId(data.courseId),
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
}
