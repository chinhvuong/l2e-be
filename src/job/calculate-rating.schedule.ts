import { Course, CourseDocument } from '@/course/schema/course.schema';
import { Rating, RatingDocument } from '@/course/schema/rating.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';

@Injectable()
export class CalculateRating {
  private readonly logger = new Logger(CalculateRating.name);
  constructor(
    @InjectModel(Rating.name) private modelRating: Model<RatingDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>, // @InjectModel(Quiz.name) private quizModel: Model<QuizDocument>, // private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES, {
    timeZone: 'utc',
  })
  async handleCron() {
    const courses = await this.courseModel.find({
      courseId: {
        $ne: null,
      },
    });

    await Promise.all(
      courses.map(async (course) => {
        const statistic = await this.modelRating.aggregate([
          {
            $match: {
              course: course._id,
            },
          },
          { $group: { _id: '$course', rate: { $avg: '$rating' } } },
        ]);
        console.log(
          '🚀 ~ file: calculate-rating.schedule.ts:41 ~ CalculateRating ~ handleCron ~ statistic:',
          statistic,
        );
        if (statistic.length) {
          course.rating = statistic[0].rate;
        } else {
          course.rating = 5;
        }
        return await course.save();
      }),
    );
  }
}
