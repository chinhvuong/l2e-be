import { UserDocument } from '@/user/schema/user.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseService } from './course.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { SectionFindAllDto } from './dto/section-find-all.dto';
import { Section, SectionDocument } from './schema/section.schema';
import { ObjectId } from 'mongodb';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionService {
  constructor(
    @InjectModel(Section.name) private model: Model<SectionDocument>,
    private readonly courseService: CourseService,
  ) {}

  async manageGetSections(user: UserDocument, data: SectionFindAllDto) {
    await this.courseService.validateOwner(data.courseId, user.walletAddress);
    const match: { [key: string]: any } = {
      courseId: new ObjectId(data.courseId),
    };

    if (data.query) {
      match.name = new RegExp(data.query, 'i');
    }

    const pagination: any[] = [];
    if (data.page !== undefined && data.limit !== undefined) {
      pagination.push({
        $skip: data.limit * data.page,
      });
    }
    if (data.limit !== undefined) {
      pagination.push({
        $limit: data.limit,
      });
    }

    const rs = await this.model.aggregate([
      { $match: match },
      { $sort: { order: 1 } },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: pagination,
        },
      },
    ]);
    return {
      total: rs[0]?.metadata[0] ? rs[0]?.metadata[0].total : 0,
      data: rs[0] ? rs[0].data : [],
    };
  }

  async findOne(...args) {
    return await this.model.findOne(...args);
  }

  async createSection(user: UserDocument, data: CreateSectionDto) {
    const course = await this.courseService.validateOwner(
      data.courseId,
      user.walletAddress,
    );

    return await new this.model({
      ...data,
      courseId: course._id,
    }).save();
  }

  async createListSections(user: UserDocument, data: CreateSectionDto[]) {
    if (!data.length) {
      throw new HttpException('Data is empty', HttpStatus.BAD_REQUEST);
    }
    const course = await this.courseService.validateOwner(
      data[0].courseId,
      user.walletAddress,
    );

    data = data.map((item) => {
      item.courseId = course._id;
      return item;
    });
    return await this.model.insertMany(data);
  }

  async updateSection(user: UserDocument, data: UpdateSectionDto, id: string) {
    const section = await this.model.findOne({
      _id: new ObjectId(id),
    });
    if (!section) {
      throw new HttpException('Section does not exist', HttpStatus.BAD_REQUEST);
    }
    await this.courseService.validateOwner(id, user.walletAddress);

    return await this.model.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      data,
      { new: true },
    );
  }

  async upsertListSections(
    user: UserDocument,
    data: UpdateSectionDto[],
    courseId: string,
  ) {
    const course = await this.courseService.validateOwner(
      courseId,
      user.walletAddress,
    );
    const rs = await Promise.all(
      data.map((section, index) => {
        if (section._id) {
          const filter = {
            _id: new ObjectId(section._id),
            courseId: course._id,
          };
          return this.model.findOneAndUpdate(
            filter,
            {
              name: section.name,
              description: section.description,
              order: index,
            },
            {
              new: true,
            },
          );
        } else {
          return new this.model({
            ...section,
            order: index,
            courseId: course._id,
          }).save();
        }
      }),
    );

    await this.model.deleteMany({
      courseId: course._id,
      _id: { $nin: rs.map((item) => item?._id) },
    });
    return rs;
  }

  async getSectionOrThrowError(sectionId: string) {
    const section = await this.model.findOne({
      _id: new ObjectId(sectionId),
    });
    if (!section) {
      throw new HttpException('Course does not exist', HttpStatus.BAD_REQUEST);
    }

    return section;
  }
}
