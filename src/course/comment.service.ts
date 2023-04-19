import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ConfigService } from '@nestjs/config';
import { ObjectId } from 'mongodb';

import { UserDocument } from '@/user/schema/user.schema';
import { Web3Service } from '@/web3/web3.service';
import { CommentDocument, Comment } from './schema/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentListDto } from './dto/comment-list.dto';
import { Lesson, LessonDocument } from '@/course/schema/lesson.schema';
import { Enroll, EnrollDocument } from './schema/enroll.schema.';
import { Section, SectionDocument } from './schema/section.schema';
import { Course, CourseDocument } from './schema/course.schema';
import {
  RequestApprove,
  RequestApproveDocument,
} from './schema/request-aprrove.schema';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private model: Model<CommentDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(Section.name) private sectionModel: Model<SectionDocument>,
    @InjectModel(Enroll.name) private enrollModel: Model<EnrollDocument>,
    @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>,
    @InjectModel(RequestApprove.name)
    private requestApproveModel: Model<RequestApproveDocument>,

    private readonly configService: ConfigService,
    private readonly web3Service: Web3Service,
  ) {}

  async create(data: CreateCommentDto, user: UserDocument) {
    const lesson = await this.lessonModel
      .findOne({
        _id: new ObjectId(data.lesson),
      })
      .populate('sectionId');

    console.log(lesson);

    if (!lesson?.sectionId?.courseId) {
      throw new BadRequestException('lesson to not found');
    }
    const enrolled = await this.checkEnroll(
      user._id,
      String(lesson?.sectionId?.courseId),
    );
    if (!enrolled) {
      throw new ForbiddenException();
    }

    if (data.replyTo) {
      const parent = await this.model.findOne({
        _id: new ObjectId(data.replyTo),
        level: 1,
      });
      if (!parent) {
        throw new BadRequestException('reply to not found');
      }
      const comment = await new this.model({
        ...data,
        level: 2,
        replyTo: parent._id,
        user: user._id,
      }).save();
      parent.replies = [...parent.replies, comment._id];
      await parent.save();
      return comment;
    }

    return await new this.model({
      ...data,
      user: user._id,
    }).save();
  }

  async list(filter: CommentListDto, user: UserDocument) {
    const lesson = await this.lessonModel
      .findOne({
        _id: new ObjectId(filter.lessonId),
      })
      .populate('sectionId');

    if (!lesson?.sectionId?.courseId) {
      throw new BadRequestException('lesson to not found');
    }

    const enrolled = await this.checkEnroll(
      user._id,
      String(lesson?.sectionId?.courseId),
    );
    if (!enrolled) {
      throw new ForbiddenException();
    }

    const match = {
      lesson: new ObjectId(filter.lessonId),
    };
    if (filter.replyTo) {
      match['replyTo'] = new ObjectId(filter.replyTo);
      match['level'] = 2;
    } else {
      match['level'] = 1;
    }
    const query = this.model
      .find(match)
      .populate('user')
      .populate('replies')
      .sort({
        _id: 1,
      });

    if (filter.page && filter.limit) {
      query.skip(filter.page * filter.limit);
    }
    if (filter.limit > 0) {
      query.limit(filter.limit);
    }

    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(match),
    ]);

    return { total, data };
  }

  async checkEnroll(userId: string, courseId: string) {
    const enroll = await this.enrollModel.count({
      userId: new ObjectId(userId),
      courseId: new ObjectId(courseId),
    });
    return {
      enroll: enroll > 0,
    };
  }
  async update(id: string, user: UserDocument, data: UpdateCommentDto) {
    const rs = this.model.findOneAndUpdate(
      {
        user: user._id,
        _id: new ObjectId(id),
      },
      data,
      { new: true, lean: true },
    );
    if (!rs) {
      throw new BadRequestException();
    }
    return rs;
  }

  async deleteComment(id: string, user: UserDocument) {
    const rs = await this.model.findOneAndDelete({
      _id: new ObjectId(id),
      user: user._id,
    });
    if (rs?.relyTo) {
      const parent = await this.model.findOne({
        _id: rs.relyTo,
      });
      if (parent?._id) {
        parent.replies = parent.replies.filter(
          (item) => item.toString() !== id,
        );
        await parent.save();
      }
    } else if (rs?._id && rs.level === 1 && rs.replies.length > 0) {
      await this.model.deleteMany({
        _id: {
          $in: rs.replies,
        },
      });
    }
    return {
      success: Boolean(rs),
    };
  }
}
