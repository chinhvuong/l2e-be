import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Certificate,
  CertificateDocument,
} from './entities/certificate.schema';
import { ConfigService } from '@nestjs/config';
import { CreateCertificateDto } from './dtos/create-certificate.dto';
import { CertificateListDto } from './dtos/certificate-list.dto';
import { ObjectId } from 'mongodb';
import { CERTIFICATE_STATUS } from './enum';
import { UserDocument } from '@/user/schema/user.schema';
import { Web3Service } from '@/web3/web3.service';

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name) private model: Model<CertificateDocument>,
    private readonly configService: ConfigService,
    private readonly web3Service: Web3Service,
  ) {}

  async create(data: CreateCertificateDto) {
    return await new this.model(data).save();
  }

  async list(filter: CertificateListDto) {
    const pipeline: any[] = [];

    if (filter.userId) {
      pipeline.push({ $match: { user: new ObjectId(filter.userId) } });
    }

    if (filter.courseId) {
      pipeline.push({ $match: { courseId: filter.courseId } });
    }

    if (filter.query) {
      pipeline.push({
        $lookup: {
          from: 'courses',
          let: { courseId: '$course' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$courseId'] },
                    {
                      $regexMatch: {
                        input: '$name',
                        regex: filter.query,
                        options: 'i',
                      },
                    },
                  ],
                },
              },
            },
          ],
          as: 'course',
        },
      });

      pipeline.push({ $unwind: '$course' });
    } else {
      pipeline.push({
        $lookup: {
          from: 'courses',
          localField: 'course',
          foreignField: '_id',
          as: 'course',
        },
      });

      pipeline.push({ $unwind: '$course' });
    }

    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    });

    pipeline.push({ $unwind: '$user' });

    const countPipeline = [...pipeline, { $count: 'total' }];

    if (filter.page && filter.limit) {
      pipeline.push({ $skip: filter.page * filter.limit });
    }

    if (filter.limit > 0) {
      pipeline.push({ $limit: filter.limit });
    }
    const sort: { [key: string]: 1 | -1 } = {};
    // sort
    if (filter?.sort?.length) {
      for (let i = 0; i < filter?.sort?.length; i++) {
        const [attr, direction] = filter.sort[i].split(':');
        if (direction === '-1') {
          sort[attr] = -1;
        } else {
          sort[attr] = 1;
        }
      }
    } else {
      // price desc
      sort.createdAt = -1;
    }

    const [data, [result]] = await Promise.all([
      this.model.aggregate([...pipeline, { $sort: sort }]).exec(),
      this.model.aggregate(countPipeline).exec(),
    ]);

    const total = result ? result.total : 0;

    return { total, data };
  }

  async updateCertificate(
    userId: string,
    courseId: number,
    data: Partial<Certificate>,
  ) {
    console.log(
      '🚀 ~ file: certificate.service.ts:51 ~ CertificateService ~ updateCertificate ~ userId:',
      userId,
    );
    console.log(
      '🚀 ~ file: certificate.service.ts:51 ~ CertificateService ~ updateCertificate ~ courseId:',
      courseId,
    );
    return this.model.findOneAndUpdate(
      {
        user: new ObjectId(userId),
        courseId: courseId,
      },
      data,
      { new: true, lean: true },
    );
  }

  async claimCertificate(user: UserDocument, courseId: number) {
    const cert = await this.model.findOneAndUpdate(
      {
        user: user._id,
        courseId: courseId,
        status: CERTIFICATE_STATUS.OFF_CHAIN,
      },
      {
        status: CERTIFICATE_STATUS.MINTING,
      },
      {
        new: true,
        lean: true,
      },
    );
    if (!cert?._id) {
      throw new BadRequestException();
    }

    const signature = await this.web3Service.signToClaimCertificate(
      courseId,
      user.nonce,
      user.walletAddress,
    );
    user.nonce = user.nonce + 1;
    await user.save();
    return {
      courseId,
      v: signature.v,
      r: signature.r,
      s: signature.s,
      nonce: user.nonce - 1,
    };
  }
}
