import { CourseService } from '@/course/course.service';
import { UserDocument } from '@/user/schema/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { QuestionService } from './question.service';
import { Quiz, QuizDocument } from './schema/quiz.schema';
import { QuizFindAll } from './dto/quiz-find-all.dto';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel(Quiz.name) private model: Model<QuizDocument>,
    private readonly courseService: CourseService,
    private readonly questionService: QuestionService,
  ) {}

  async findOneOrCreate(walletAddress: string) {
    return await this.model.findOneAndUpdate(
      { walletAddress: walletAddress },
      {},
      { upsert: true, new: true },
    );
  }

  async findOneBy(...args) {
    return await this.model
      .findOne(...args)
      .populate('questions')
      .exec();
  }

  private async validateListQuestions(questions: string[], courseId: string) {
    const quests = await this.questionService.find({
      courseId: new ObjectId(courseId),
      _id: { $in: questions.map((item) => new ObjectId(item)) },
    });
    if (quests.length < questions.length) {
      throw new HttpException('Invalid questions', HttpStatus.FORBIDDEN);
    }
    return quests.map((item) => item._id);
  }

  async createQuiz(user: UserDocument, data: CreateQuizDto) {
    await this.courseService.validateOwner(data.courseId, user.walletAddress);

    const questionIds = await this.validateListQuestions(
      data.questions,
      data.courseId,
    );

    return await new this.model({
      ...data,
      questions: questionIds,
      courseId: new ObjectId(data.courseId),
    }).save();
  }

  async updateQuiz(user: UserDocument, data: CreateQuizDto, id: string) {
    const quiz = await this.model.findOne({
      _id: new ObjectId(id),
    });
    if (!quiz) {
      throw new HttpException('Quiz does not exist', HttpStatus.BAD_REQUEST);
    }
    const course = await this.courseService.validateOwner(
      quiz.courseId?.toString(),
      user.walletAddress,
    );
    const questionIds = await this.validateListQuestions(
      data.questions,
      course._id?.toString(),
    );

    return await this.model.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      { ...data, questions: questionIds, courseId: course._id },
      { new: true },
    );
  }

  async deleteQuiz(user: UserDocument, id: string) {
    const quiz = await this.model.findOne({
      _id: new ObjectId(id),
    });
    if (!quiz) {
      throw new HttpException('Quiz does not exist', HttpStatus.BAD_REQUEST);
    }
    await this.courseService.validateOwner(
      quiz.courseId?.toString(),
      user.walletAddress,
    );

    return await this.model.findOneAndDelete({
      _id: new ObjectId(id),
    });
  }

  async manageGetQuizzes(user: UserDocument, data: QuizFindAll) {
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
        $lookup: {
          from: 'questions',
          localField: 'questions',
          foreignField: '_id',
          as: 'questions',
        },
      },
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

  async find(...args) {
    return await this.model.find(...args);
  }
}
