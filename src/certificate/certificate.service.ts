import { Injectable } from '@nestjs/common';
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

@Injectable()
export class CertificateService {
  constructor(
    @InjectModel(Certificate.name) private model: Model<CertificateDocument>,
    private readonly configService: ConfigService,
  ) {}

  async create(data: CreateCertificateDto) {
    return await new this.model(data).save();
  }

  async list(filter: CertificateListDto) {
    const match = {};
    if (filter.userId) {
      match['user'] = new ObjectId(filter.userId);
    }
    const query = this.model
      .find(match)
      .populate('user')
      .populate('course', '_id name courseId');

    if (filter.page && filter.limit) {
      query.skip(filter.page * filter.limit);
    }
    if (filter.limit > 0) {
      query.limit(filter.limit);
    }

    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter),
    ]);

    return { total, data };
  }
}
