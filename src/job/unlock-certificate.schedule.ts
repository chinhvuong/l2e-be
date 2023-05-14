import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import {
  Certificate,
  CertificateDocument,
} from '@/certificate/entities/certificate.schema';
import { CERTIFICATE_STATUS } from '@/certificate/enum';

@Injectable()
export class UnlockCertificateSchedule {
  private readonly logger = new Logger(UnlockCertificateSchedule.name);
  constructor(
    @InjectModel(Certificate.name)
    private modelCertificate: Model<CertificateDocument>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, {
    timeZone: 'utc',
  })
  async handleCron() {
    // const yesterday = moment().subtract(1, 'hour').toDate();
    const certificates = await this.modelCertificate.find({
      status: CERTIFICATE_STATUS.MINTING,
      lastLock: {
        $lte: new Date(Date.now() - 300000),
      },
    });
    console.log(
      '🚀 ~ file: unlock-certificate.schedule.ts:28 ~ UnlockCertificateSchedule ~ handleCron ~ certificates:',
      certificates,
    );
    await Promise.all(
      certificates.map(async (b) => {
        return this.modelCertificate.findOneAndUpdate(
          {
            _id: b._id,
          },
          {
            status: CERTIFICATE_STATUS.OFF_CHAIN,
          },
        );
      }),
    );
  }
}
