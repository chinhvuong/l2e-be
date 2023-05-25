import { CertificateDocument } from '@/certificate/entities/certificate.schema';
import { Course, CourseDocument } from '@/course/schema/course.schema';
import { Enroll, EnrollDocument } from '@/course/schema/enroll.schema.';
import { User, UserDocument } from '@/user/schema/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Certificate } from 'crypto';
import moment from 'moment';
import { Model } from 'mongoose';
import { Statistic, StatisticDocument } from './entities/statistic.schema';

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
      .sort({ date: -1 })
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
    return [
      ...data,
      {
        revenue,
        courseCount,
        userCount,
        certificateCount,
        time: startOfHour,
      },
    ];
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
}
