import { Balance, BalanceSchema } from '@/balance/entities/balance.schema';
import {
  Certificate,
  CertificateSchema,
} from '@/certificate/entities/certificate.schema';
import { Course, CourseSchema } from '@/course/schema/course.schema';
import { Rating, RatingSchema } from '@/course/schema/rating.schema';
import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CalculateRating } from './calculate-rating.schedule';
import { UnlockBalanceSchedule } from './unlock-balance.schedule';
import { UnlockCertificateSchedule } from './unlock-certificate.schedule';
@Module({})
export class JobModule {
  static register(): DynamicModule {
    console.log(process.env.NODE_ENV === 'crawler');
    if (process.env.NODE_ENV === 'crawler') {
      return {
        module: JobModule,
      };
    }

    return {
      module: JobModule,
      providers: [
        CalculateRating,
        UnlockBalanceSchedule,
        UnlockCertificateSchedule,
      ],
      controllers: [],
      imports: [
        ScheduleModule.forRoot(),
        MongooseModule.forFeature([
          { name: Course.name, schema: CourseSchema },
          { name: Rating.name, schema: RatingSchema },
          { name: Balance.name, schema: BalanceSchema },
          { name: Certificate.name, schema: CertificateSchema },
        ]),
      ],
    };
  }
}
