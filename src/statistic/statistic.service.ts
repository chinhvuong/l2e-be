import { CertificateDocument } from '@/certificate/entities/certificate.schema';
import { Course, CourseDocument } from '@/course/schema/course.schema';
import { Enroll, EnrollDocument } from '@/course/schema/enroll.schema.';
import { User, UserDocument } from '@/user/schema/user.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Certificate } from 'crypto';
import moment from 'moment';
import { Model } from 'mongoose';
import { Statistic, StatisticDocument } from './entities/statistic.schema';
import { ObjectId } from 'mongodb';

@Injectable()
export class StatisticService {
  constructor(
    @InjectModel(Enroll.name) private enrollModel: Model<EnrollDocument>,
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Certificate.name)
    private certificateModel: Model<CertificateDocument>,
    @InjectModel(Statistic.name)
    private statisticModel: Model<StatisticDocument>,
  ) {}

  async getBasicStatistic() {
    const startOfDay = moment().startOf('day').toDate();
    const startOfPreDay = moment().startOf('day').subtract(1, 'day').toDate();
    const now = new Date();
    const [
      currentRevenue,
      preRevenue,
      currentCourse,
      preCourse,
      currentUser,
      preUser,
      currentCertificate,
      preCertificate,
    ] = await Promise.all([
      this.getRevenue(startOfDay, now),
      this.getRevenue(startOfPreDay, startOfDay),
      this.countCourse(startOfDay, now),
      this.countCourse(startOfPreDay, startOfDay),
      this.countUser(startOfDay, now),
      this.countUser(startOfPreDay, startOfDay),
      this.countCertificate(startOfDay, now),
      this.countCertificate(startOfPreDay, startOfDay),
    ]);

    return {
      currentRevenue,
      preRevenue,
      currentCourse,
      preCourse,
      currentUser,
      preUser,
      currentCertificate,
      preCertificate,
    };
  }

  async getStatisticData() {
    const data = await this.statisticModel
      .find(
        {},
        {
          courseCount: true,
          revenue: true,
          certificateCount: true,
          userCount: true,
          time: true,
        },
      )
      .sort({ time: -1 })
      .limit(23);

    const startOfHour = moment().startOf('hour').toDate();
    const now = new Date();
    const [revenue, courseCount, userCount, certificateCount] =
      await Promise.all([
        this.getRevenue(startOfHour, now),
        this.countCourse(startOfHour, now),
        this.countUser(startOfHour, now),
        this.countCertificate(startOfHour, now),
      ]);
    const rs = [
      ...data,
      {
        revenue,
        courseCount,
        userCount,
        certificateCount,
        time: startOfHour,
      },
    ];

    return rs;
  }

  async getRevenue(start: Date, end: Date) {
    const aggregateResult = await this.enrollModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$price' },
        },
      },
    ]);
    console.log(
      '🚀 ~ file: statistic.service.ts:116 ~ StatisticService ~ getRevenue ~ aggregateResult:',
      aggregateResult,
    );

    const sumPriceInRange = aggregateResult[0]?.total || 0;
    return sumPriceInRange;
  }

  async countUser(start: Date, end: Date) {
    const count = await this.userModel.countDocuments({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });
    return count;
  }

  async countCourse(start: Date, end: Date) {
    const count = await this.courseModel.countDocuments({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });
    return count;
  }

  async countCertificate(start: Date, end: Date) {
    const count = await this.certificateModel.countDocuments({
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });
    return count;
  }

  async courseStatistic() {
    const [total, minted] = await Promise.all([
      this.courseModel.count(),
      this.courseModel.count({
        courseId: {
          $gt: 0,
        },
      }),
    ]);

    return {
      total,
      minted,
      unMint: total - minted,
    };
  }

  async userStatistic() {
    const [total, courseZero] = await Promise.all([
      this.userModel.count(),
      this.countUsersWithoutCourse(),
    ]);

    return {
      total,
      courseZero,
      courseCreator: total - courseZero,
    };
  }

  async countUsersWithoutCourse(): Promise<number> {
    const count = await this.userModel
      .aggregate([
        {
          $lookup: {
            from: 'courses',
            localField: 'walletAddress',
            foreignField: 'author',
            as: 'createdCourses',
          },
        },
        {
          $match: {
            createdCourses: { $size: 0 },
          },
        },
        {
          $count: 'count',
        },
      ])
      .exec();

    return count[0]?.count || 0;
  }

  async handleStatistic() {
    const stats = await this.statisticModel.find();
    return await Promise.all(
      stats.map(async (statistic) => {
        const time = moment(new Date(statistic['createdAt']))
          .startOf('hour')
          .subtract(1, 'hour')
          .toDate();
        statistic.time = time;
        statistic.save();
        return statistic;
      }),
    );
  }

  async calculate(step: number) {
    let end = moment().startOf('hour').toDate();
    let i = 0;
    while (i < step) {
      const start = moment(end).subtract(1, 'hour').toDate();
      const [revenue, courseCount, userCount, certificateCount] =
        await Promise.all([
          this.getRevenue(start, end),
          this.countCourse(start, end),
          this.countUser(start, end),
          this.countCertificate(start, end),
        ]);
      console.log({
        revenue,
        courseCount,
        userCount,
        certificateCount,
        time: start,
      });

      await this.statisticModel.findOneAndUpdate(
        {
          time: start,
        },
        {
          revenue,
          courseCount,
          userCount,
          certificateCount,
        },
        {
          upsert: true,
          new: true,
        },
      );
      end = start;
      i++;
    }
  }
}
