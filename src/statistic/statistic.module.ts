import {
  Certificate,
  CertificateSchema,
} from '@/certificate/entities/certificate.schema';
import { Course, CourseSchema } from '@/course/schema/course.schema';
import { Enroll, EnrollSchema } from '@/course/schema/enroll.schema.';
import { User, UserSchema } from '@/user/schema/user.schema';
import { DynamicModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Statistic, StatisticSchema } from './entities/statistic.schema';
import { StatisticController } from './statistic.controller';
import { AggregateStatistic } from './statistic.schedule';
import { StatisticService } from './statistic.service';

@Module({})
export class StatisticModule {
  static register(): DynamicModule {
    console.log(process.env.NODE_ENV === 'crawler');
    if (process.env.NODE_ENV === 'crawler') {
      return {
        module: StatisticModule,
      };
    }

    return {
      module: StatisticModule,
      imports: [
        MongooseModule.forFeature([
          { name: Course.name, schema: CourseSchema },
          { name: Enroll.name, schema: EnrollSchema },
          { name: User.name, schema: UserSchema },
          { name: Certificate.name, schema: CertificateSchema },
          { name: Statistic.name, schema: StatisticSchema },
        ]),
      ],
      controllers: [StatisticController],
      providers: [StatisticService, AggregateStatistic],
    };
  }
}
