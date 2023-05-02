import { UserDocument } from '@/user/schema/user.schema';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Enroll, EnrollDocument } from './schema/enroll.schema.';
import { Quiz, QuizDocument } from '@/question/schema/quiz.schema';
import { Rating, RatingDocument } from './schema/rating.schema';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RatingListDto } from './dto/rating-list.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private modelRating: Model<RatingDocument>,
    @InjectModel(Enroll.name) private enrollModel: Model<EnrollDocument>, // @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>, // private readonly configService: ConfigService,
  ) {}

  async list(filter: RatingListDto) {
    const match = {
      course: new ObjectId(filter.course),
    };
    if (filter.rating) {
      match['rating'] = filter.rating;
    }
    const query = this.modelRating.find(match).populate('user').sort({
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
      this.modelRating.countDocuments(match),
    ]);

    return { total, data };
  }

  async create(data: CreateRatingDto, user: UserDocument) {
    const enrolled = await this.checkEnroll(user._id, data.course);
    if (!enrolled) {
      throw new ForbiddenException();
    }
    const existed = await this.modelRating.findOne({
      user: user._id,
      course: new ObjectId(data.course),
    });

    if (existed) {
      throw new ForbiddenException();
    }

    return await new this.modelRating({
      ...data,
      course: new ObjectId(data.course),
      user: user._id,
    }).save();
  }

  async update(id: string, data: UpdateRatingDto, user: UserDocument) {
    const rs = await this.modelRating.findOneAndUpdate(
      {
        user: user._id,
        _id: new ObjectId(id),
      },
      {
        data,
      },
      {
        new: true,
        lean: true,
      },
    );
    if (!rs) {
      throw new ForbiddenException();
    }
    return rs;
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

  async deleteRating(id: string, user: UserDocument) {
    const rs = await this.modelRating.findOneAndDelete({
      _id: new ObjectId(id),
      user: user._id,
    });

    return {
      success: Boolean(rs),
    };
  }

  async ratingOverview(id: string) {
    const _id = new ObjectId(id);
    const [one, two, three, four, five] = await Promise.all([
      this.modelRating.count({
        course: _id,
        rating: 1,
      }),
      this.modelRating.count({
        course: _id,
        rating: 2,
      }),
      this.modelRating.count({
        course: _id,
        rating: 3,
      }),
      this.modelRating.count({
        course: _id,
        rating: 4,
      }),
      this.modelRating.count({
        course: _id,
        rating: 5,
      }),
    ]);

    return {
      one,
      two,
      three,
      four,
      five,
      overview:
        (one + two * 2 + three * 3 + four * 4 + five * 5) /
        (one + two + three + four + five),
    };
  }
}
