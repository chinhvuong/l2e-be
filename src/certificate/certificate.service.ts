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
    const match: any = {};
    if (filter.userId) {
      match['user'] = new ObjectId(filter.userId);
    }

    if (filter.courseId) {
      match['courseId'] = filter.courseId;
    }

    if (filter.query) {
      match['course.name'] = {
        $regex: new RegExp(filter.query, 'i'),
      };
    }

    console.log(match);
    const query = this.model
      .find(match)
      .populate('user')
      .populate('course', '_id name courseId');

    if (filter.limit > 0) {
      query.limit(filter.limit);
    }

    console.log(query);

    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(match),
    ]);

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
